const DEFAULT_PRODUCT_NAME = "추천 상품";
const DEFAULT_PRODUCT_SPEC = "상품 데이터 기준 추천";
const DEFAULT_PRODUCT_DESCRIPTION = "조건에 맞는 추천 상품입니다.";
const DEFAULT_CHAT_TAG = "#AI추천";

const createAiRecommendationId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

const normalizeMatchedCriteria = (matchedCriteria) =>
  Array.isArray(matchedCriteria) ? matchedCriteria.filter(Boolean) : [];

const normalizeTags = (value) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean);
  }

  if (typeof value === "string" && value.trim()) {
    return [value.trim()];
  }

  return [];
};

const formatChatTag = (value) => {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return "";
  }

  return normalized.startsWith("#") ? normalized : `#${normalized}`;
};

const formatChatPrice = (price) => {
  if (typeof price === "number" && Number.isFinite(price)) {
    return `₩${price.toLocaleString("ko-KR")}`;
  }

  const normalized = String(price ?? "0").trim();

  if (!normalized) {
    return "₩0";
  }

  if (normalized.includes("₩") || normalized.includes("￦")) {
    return normalized;
  }

  const numericText = normalized.replace(/[^0-9.-]/g, "");
  const numericPrice = Number(numericText);

  if (numericText && Number.isFinite(numericPrice)) {
    return `₩${numericPrice.toLocaleString("ko-KR")}`;
  }

  return `₩${normalized}`;
};

const getProductRouteId = (product) => getProductObjectId(product) ?? product?.name ?? "1";

export const normalizeAiRecommendationProduct = (item = {}) => {
  const tags = normalizeTags(item.tag ?? item.tags);
  const reason = item.reason;

  return {
    id: getProductObjectId(item) ?? item.id,
    _id: getProductObjectId(item),
    productId: getProductObjectId(item),
    name: item.name ?? item.title ?? DEFAULT_PRODUCT_NAME,
    price: item.price ?? "0",
    image: item.image ?? item.heroImage ?? item.thumbnailImage ?? item.thumbnail ?? "",
    rating: item.rating ?? 0,
    spec: reason || tags.join(" · ") || DEFAULT_PRODUCT_SPEC,
    reason,
    matchedCriteria: normalizeMatchedCriteria(item.matchedCriteria),
    caveat: item.caveat,
  };
};

export const createAiRecommendationHistoryEntry = ({ query, message, products }) => ({
  id: createAiRecommendationId(),
  query,
  message,
  createdAt: new Date().toISOString(),
  products,
});

export const toChatRecommendationProduct = (product = {}) => {
  const matchedTags = normalizeMatchedCriteria(product.matchedCriteria)
    .slice(0, 3)
    .map(formatChatTag)
    .filter(Boolean);
  const tags = matchedTags.length > 0 ? matchedTags : [DEFAULT_CHAT_TAG];
  const productId = getProductRouteId(product);

  return {
    ...product,
    id: productId,
    _id: productId,
    productId,
    image: product.image ?? "",
    name: product.name ?? DEFAULT_PRODUCT_NAME,
    description: product.reason ?? DEFAULT_PRODUCT_DESCRIPTION,
    spec: product.spec ?? DEFAULT_PRODUCT_SPEC,
    tags,
    price: formatChatPrice(product.price),
    detailPath: `/product/${productId}`,
    ctaLabel: "자세히 보기",
  };
};
import { getProductObjectId } from "@/utils/productIdentity";
