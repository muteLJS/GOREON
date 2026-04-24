const Product = require("../models/Product");
const {
  createKeywordConditions,
  createTagConditions,
  parsePriceNumber,
  tokenizeKeyword,
} = require("../utils/productSearch");
const openaiRecommendationService = require("./openaiRecommendationService");

const DEFAULT_LIMIT = 3;
const MAX_LIMIT = 5;
const DEFAULT_CANDIDATE_LIMIT = 30;
const DB_QUERY_LIMIT = 80;

const PRODUCT_TYPE_KEYWORDS = [
  { values: ["노트북", "notebook", "laptop"], tags: ["노트북"] },
  { values: ["데스크탑", "desktop", "pc"], tags: ["데스크탑"] },
  { values: ["모니터", "monitor"], tags: ["모니터"] },
  { values: ["키보드", "keyboard"], tags: ["키보드"] },
  { values: ["마우스", "mouse"], tags: ["마우스"] },
  { values: ["태블릿", "tablet", "패드", "pad"], tags: ["태블릿"] },
  {
    values: ["스마트폰", "핸드폰", "휴대폰", "폰", "smartphone"],
    tags: ["스마트폰"],
  },
  {
    values: ["이어폰", "earphone", "헤드셋", "headset"],
    tags: ["이어폰", "무선이어폰", "유선이어폰", "헤드셋"],
  },
  { values: ["프린터", "printer"], tags: ["프린터"] },
  { values: ["공유기", "router"], tags: ["공유기"] },
  { values: ["보조배터리", "power bank"], tags: ["보조배터리"] },
  { values: ["cpu"], tags: ["CPU"] },
  { values: ["ssd"], tags: ["SSD"] },
  { values: ["메모리", "ram", "memory"], tags: ["메모리"] },
  { values: ["그래픽카드", "vga", "gpu"], tags: ["그래픽카드"] },
];

const BRAND_KEYWORDS = [
  ["apple", "애플"],
  ["samsung", "삼성"],
  ["lg"],
  ["hp"],
  ["lenovo", "레노버"],
  ["dell", "델"],
  ["msi"],
  ["asus"],
  ["acer", "에이서"],
  ["로지텍", "logitech"],
];

const USE_CASE_KEYWORDS = [
  "대학생",
  "학생",
  "강의",
  "과제",
  "사무",
  "게임",
  "게이밍",
  "fps",
  "영상",
  "편집",
  "부모님",
  "가정용",
  "휴대",
  "가성비",
];

const clampLimit = (limit) => {
  const numericLimit = Number(limit) || DEFAULT_LIMIT;
  return Math.max(1, Math.min(numericLimit, MAX_LIMIT));
};

const getCandidateLimit = () =>
  Number(process.env.AI_RECOMMENDATION_CANDIDATE_LIMIT) ||
  DEFAULT_CANDIDATE_LIMIT;

const normalizeText = (value) =>
  String(value || "")
    .trim()
    .toLowerCase();

const uniqueStrings = (values) => [
  ...new Set(values.map((value) => String(value || "").trim()).filter(Boolean)),
];

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createExactTagRegex = (value) =>
  new RegExp(`^${escapeRegex(value)}$`, "i");

const parseBudget = (query) => {
  const normalized = String(query || "").replace(/\s+/g, "");
  const manWonMatch = normalized.match(
    /(\d+(?:\.\d+)?)만원(?:이하|미만|까지|대|정도)?/,
  );

  if (manWonMatch) {
    const base = Math.round(Number(manWonMatch[1]) * 10000);
    return { budgetMin: null, budgetMax: base };
  }

  const wonMatch = normalized.match(/(\d{5,})원?(?:이하|미만|까지)?/);

  if (wonMatch) {
    return { budgetMin: null, budgetMax: Number(wonMatch[1]) };
  }

  return { budgetMin: null, budgetMax: null };
};

const createLocalIntent = (query) => {
  const normalizedQuery = normalizeText(query);
  const productTypes = PRODUCT_TYPE_KEYWORDS.flatMap(({ values, tags }) =>
    values.some((value) => normalizedQuery.includes(normalizeText(value)))
      ? tags
      : [],
  );
  const brands = BRAND_KEYWORDS.flatMap((keywords) =>
    keywords.some((keyword) => normalizedQuery.includes(normalizeText(keyword)))
      ? [keywords[0].toUpperCase()]
      : [],
  );
  const useCases = USE_CASE_KEYWORDS.filter((keyword) =>
    normalizedQuery.includes(normalizeText(keyword)),
  );
  const budget = parseBudget(query);

  return {
    ...openaiRecommendationService.DEFAULT_INTENT,
    productTypes: uniqueStrings(productTypes),
    brands: uniqueStrings(brands),
    useCases,
    ...budget,
    priority: useCases,
  };
};

const resolveIntent = async (query) => {
  const localIntent = createLocalIntent(query);

  if (!openaiRecommendationService.hasOpenAiKey()) {
    return { intent: localIntent, usedOpenAi: false };
  }

  try {
    const aiIntent = await openaiRecommendationService.extractIntent(query);
    const mergedIntent = {
      ...localIntent,
      ...aiIntent,
      productTypes: uniqueStrings([
        ...localIntent.productTypes,
        ...(aiIntent.productTypes || []),
      ]),
      brands: uniqueStrings([
        ...localIntent.brands,
        ...(aiIntent.brands || []),
      ]),
      useCases: uniqueStrings([
        ...localIntent.useCases,
        ...(aiIntent.useCases || []),
      ]),
      requiredSpecs: uniqueStrings(aiIntent.requiredSpecs || []),
      avoid: uniqueStrings(aiIntent.avoid || []),
      priority: uniqueStrings([
        ...(localIntent.priority || []),
        ...(aiIntent.priority || []),
      ]),
      budgetMin: aiIntent.budgetMin ?? localIntent.budgetMin,
      budgetMax: aiIntent.budgetMax ?? localIntent.budgetMax,
    };

    return { intent: mergedIntent, usedOpenAi: true };
  } catch (error) {
    console.warn(
      "AI intent extraction failed; using local intent fallback:",
      error.message,
    );
    return { intent: localIntent, usedOpenAi: false };
  }
};

const getProductText = (product) =>
  [
    product.name,
    ...(Array.isArray(product.tag) ? product.tag : []),
    ...(Array.isArray(product.priceOptions)
      ? product.priceOptions.map((option) => option?.optionName).filter(Boolean)
      : []),
  ]
    .join(" ")
    .toLowerCase();

const getProductKey = (product) => String(product._id ?? product.id);

const normalizeProduct = (product) => ({
  ...product,
  productId: product._id,
  _id: product._id,
  id: product._id,
  priceNumber: parsePriceNumber(product.price),
});

const createQueryFromIntent = (intent, rawQuery) => {
  const andConditions = [];
  const productTypes = uniqueStrings(intent.productTypes || []);
  const brands = uniqueStrings(intent.brands || []);

  if (productTypes.length > 0) {
    andConditions.push({
      $or: productTypes.map((type) => ({ tag: createExactTagRegex(type) })),
    });
  }

  if (brands.length > 0) {
    andConditions.push({ $or: createTagConditions(brands) });
  }

  if (andConditions.length === 0) {
    andConditions.push({ $or: createKeywordConditions(rawQuery) });
  }

  return andConditions.length ? { $and: andConditions } : {};
};

const matchesBudget = (product, intent) => {
  const priceNumber = parsePriceNumber(product.price);

  if (!priceNumber) {
    return true;
  }

  if (intent.budgetMin && priceNumber < intent.budgetMin) {
    return false;
  }

  if (intent.budgetMax && priceNumber > intent.budgetMax) {
    return false;
  }

  return true;
};

const calculateScore = (product, intent, rawQuery) => {
  const text = getProductText(product);
  const priceNumber = parsePriceNumber(product.price);
  const queryTokens = tokenizeKeyword(rawQuery).slice(0, 8);
  const productTypes = intent.productTypes || [];
  const brands = intent.brands || [];
  const useCases = [...(intent.useCases || []), ...(intent.priority || [])];
  let score = 0;

  productTypes.forEach((type) => {
    if (text.includes(normalizeText(type))) score += 30;
  });

  brands.forEach((brand) => {
    if (text.includes(normalizeText(brand))) score += 15;
  });

  queryTokens.forEach((token) => {
    if (text.includes(normalizeText(token))) score += 8;
  });

  useCases.forEach((useCase) => {
    if (text.includes(normalizeText(useCase))) score += 5;
  });

  if (intent.budgetMax && priceNumber) {
    if (priceNumber <= intent.budgetMax) {
      score += 20;
      score += Math.max(
        0,
        8 -
          Math.round(((intent.budgetMax - priceNumber) / intent.budgetMax) * 8),
      );
    } else {
      score -= Math.min(
        30,
        Math.ceil((priceNumber - intent.budgetMax) / 100000),
      );
    }
  }

  score += (Number(product.rating) || 0) * 3;

  return score;
};

const sortByScore = (products, intent, rawQuery) =>
  [...products].sort((left, right) => {
    const scoreGap =
      calculateScore(right, intent, rawQuery) -
      calculateScore(left, intent, rawQuery);

    if (scoreGap !== 0) {
      return scoreGap;
    }

    return String(left._id ?? "").localeCompare(String(right._id ?? ""));
  });

const findCandidateProducts = async (intent, rawQuery) => {
  const query = createQueryFromIntent(intent, rawQuery);
  const projection = "id image url name price priceOptions rating tag";
  const products = await Product.find(query)
    .select(projection)
    .sort({ _id: 1 })
    .limit(DB_QUERY_LIMIT)
    .lean();
  const budgetFiltered = products.filter((product) =>
    matchesBudget(product, intent),
  );
  const usableProducts =
    intent.budgetMin || intent.budgetMax
      ? budgetFiltered.length > 0
        ? budgetFiltered
        : products
      : products;

  if (usableProducts.length > 0) {
    return sortByScore(usableProducts, intent, rawQuery).slice(
      0,
      getCandidateLimit(),
    );
  }

  const fallbackProducts = await Product.find({})
    .select(projection)
    .sort({ rating: -1, _id: 1 })
    .limit(getCandidateLimit())
    .lean();

  return sortByScore(fallbackProducts, intent, rawQuery);
};

const createFallbackReason = (product, intent) => {
  const typeLabel =
    intent.productTypes?.[0] ||
    product.tag?.[1] ||
    product.tag?.[0] ||
    "전자기기";
  const budgetText = intent.budgetMax ? " 예산 조건도 함께 고려했습니다." : "";

  return `${typeLabel} 후보 중 상품명, 가격, 평점, 기본 태그 기준으로 추천합니다.${budgetText}`;
};

const buildFallbackRanking = ({ candidates, intent, limit }) => ({
  message:
    candidates.length > 0
      ? "현재 상품 데이터 기준으로 조건에 가까운 제품을 골랐어요."
      : "조건에 맞는 상품을 찾지 못했어요. 조건을 조금 더 넓혀볼까요?",
  recommendations: candidates.slice(0, limit).map((product) => ({
    candidateId: getProductKey(product),
    reason: createFallbackReason(product, intent),
    matchedCriteria: uniqueStrings([
      ...(intent.productTypes || []),
      ...(intent.brands || []),
      "가격/평점",
    ]),
    caveat: "1차 버전은 상품명, 가격, 평점, 기본 태그만 기준으로 추천합니다.",
  })),
});

const createCandidatePayload = (candidate) => ({
  candidateId: getProductKey(candidate),
  id: String(candidate._id),
  name: candidate.name,
  price: candidate.price,
  priceNumber: parsePriceNumber(candidate.price),
  rating: candidate.rating ?? 0,
  tag: Array.isArray(candidate.tag) ? candidate.tag.slice(0, 6) : [],
  priceOptions: Array.isArray(candidate.priceOptions)
    ? candidate.priceOptions
        .slice(0, 3)
        .map((option) => option?.optionName)
        .filter(Boolean)
    : [],
});

const rankCandidates = async ({ query, intent, candidates, limit }) => {
  const fallbackRanking = buildFallbackRanking({ candidates, intent, limit });

  if (!openaiRecommendationService.hasOpenAiKey() || candidates.length === 0) {
    return { ranking: fallbackRanking, usedOpenAi: false };
  }

  try {
    const aiRanking = await openaiRecommendationService.rankCandidates({
      query,
      intent,
      candidates: candidates.map(createCandidatePayload),
      limit,
    });

    return { ranking: aiRanking, usedOpenAi: true };
  } catch (error) {
    console.warn(
      "AI candidate ranking failed; using deterministic fallback:",
      error.message,
    );
    return { ranking: fallbackRanking, usedOpenAi: false };
  }
};

const mergeRankingWithProducts = ({ ranking, candidates, intent, limit }) => {
  const candidateMap = new Map(
    candidates.map((candidate) => [getProductKey(candidate), candidate]),
  );
  const usedKeys = new Set();
  const rankedProducts = [];

  (ranking.recommendations || []).forEach((recommendation) => {
    const product = candidateMap.get(String(recommendation.candidateId));

    if (!product || usedKeys.has(getProductKey(product))) {
      return;
    }

    usedKeys.add(getProductKey(product));
    rankedProducts.push({
      ...normalizeProduct(product),
      reason: recommendation.reason,
      matchedCriteria: recommendation.matchedCriteria || [],
      caveat: recommendation.caveat || null,
    });
  });

  candidates.forEach((candidate) => {
    if (
      rankedProducts.length >= limit ||
      usedKeys.has(getProductKey(candidate))
    ) {
      return;
    }

    usedKeys.add(getProductKey(candidate));
    rankedProducts.push({
      ...normalizeProduct(candidate),
      reason: createFallbackReason(candidate, intent),
      matchedCriteria: uniqueStrings([
        ...(intent.productTypes || []),
        ...(intent.brands || []),
        "가격/평점",
      ]),
      caveat: "AI 순위 보강 결과입니다.",
    });
  });

  return rankedProducts.slice(0, limit);
};

const createAiRecommendation = async ({ query, limit }) => {
  const normalizedQuery = String(query || "").trim();

  if (normalizedQuery.length < 2) {
    const error = new Error(
      "추천받고 싶은 용도나 예산을 2자 이상 입력해주세요.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (normalizedQuery.length > 300) {
    const error = new Error("추천 요청은 300자 이하로 입력해주세요.");
    error.statusCode = 400;
    throw error;
  }

  const responseLimit = clampLimit(limit);
  const { intent, usedOpenAi: usedOpenAiForIntent } =
    await resolveIntent(normalizedQuery);
  const candidates = await findCandidateProducts(intent, normalizedQuery);
  const { ranking, usedOpenAi: usedOpenAiForRanking } = await rankCandidates({
    query: normalizedQuery,
    intent,
    candidates,
    limit: responseLimit,
  });
  const products = mergeRankingWithProducts({
    ranking,
    candidates,
    intent,
    limit: responseLimit,
  });

  return {
    message: ranking.message,
    intent,
    products,
    fallback: !usedOpenAiForIntent || !usedOpenAiForRanking,
  };
};

module.exports = {
  createAiRecommendation,
  createLocalIntent,
};
