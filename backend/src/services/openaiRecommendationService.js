const OPENAI_RESPONSES_URL = "https://api.openai.com/v1/responses";

const DEFAULT_INTENT = {
  productTypes: [],
  brands: [],
  useCases: [],
  budgetMin: null,
  budgetMax: null,
  requiredSpecs: [],
  avoid: [],
  priority: [],
  clarifyingQuestion: null,
};

const intentSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    productTypes: { type: "array", items: { type: "string" } },
    brands: { type: "array", items: { type: "string" } },
    useCases: { type: "array", items: { type: "string" } },
    budgetMin: { type: ["number", "null"] },
    budgetMax: { type: ["number", "null"] },
    requiredSpecs: { type: "array", items: { type: "string" } },
    avoid: { type: "array", items: { type: "string" } },
    priority: { type: "array", items: { type: "string" } },
    clarifyingQuestion: { type: ["string", "null"] },
  },
  required: [
    "productTypes",
    "brands",
    "useCases",
    "budgetMin",
    "budgetMax",
    "requiredSpecs",
    "avoid",
    "priority",
    "clarifyingQuestion",
  ],
};

const rankingSchema = {
  type: "object",
  additionalProperties: false,
  properties: {
    message: { type: "string" },
    recommendations: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: {
          candidateId: { type: "string" },
          reason: { type: "string" },
          matchedCriteria: { type: "array", items: { type: "string" } },
          caveat: { type: ["string", "null"] },
        },
        required: ["candidateId", "reason", "matchedCriteria", "caveat"],
      },
    },
  },
  required: ["message", "recommendations"],
};

const hasOpenAiKey = () => Boolean(process.env.OPENAI_API_KEY?.trim());

const getModel = () =>
  process.env.OPENAI_RECOMMENDATION_MODEL?.trim() || "gpt-5.4-mini";

const getTimeoutMs = () =>
  Number(process.env.OPENAI_RECOMMENDATION_TIMEOUT_MS) || 12000;

const extractOutputText = (responseBody) => {
  if (typeof responseBody?.output_text === "string") {
    return responseBody.output_text;
  }

  const output = Array.isArray(responseBody?.output) ? responseBody.output : [];
  const contentTexts = output.flatMap((item) =>
    Array.isArray(item?.content)
      ? item.content
          .map((content) => content?.text ?? content?.content ?? "")
          .filter((text) => typeof text === "string" && text.trim())
      : [],
  );

  return contentTexts.join("\n").trim();
};

const parseJsonText = (text) => {
  const trimmed = String(text || "").trim();

  if (!trimmed) {
    throw new Error("OpenAI returned an empty response");
  }

  return JSON.parse(trimmed);
};

const callOpenAiJson = async ({ system, user, schemaName, schema }) => {
  if (!hasOpenAiKey()) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), getTimeoutMs());

  try {
    const response = await fetch(OPENAI_RESPONSES_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: getModel(),
        input: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        text: {
          format: {
            type: "json_schema",
            name: schemaName,
            schema,
            strict: true,
          },
        },
      }),
      signal: controller.signal,
    });

    const responseBody = await response.json().catch(() => ({}));

    if (!response.ok) {
      const message =
        responseBody?.error?.message ||
        `OpenAI request failed with ${response.status}`;
      throw new Error(message);
    }

    return parseJsonText(extractOutputText(responseBody));
  } finally {
    clearTimeout(timeout);
  }
};

const extractIntent = async (query) => {
  const intent = await callOpenAiJson({
    schemaName: "recommendation_intent",
    schema: intentSchema,
    system: [
      "너는 한국어 전자기기 쇼핑 검색어를 구조화하는 도우미다.",
      "MongoDB에 이미 있는 상품명, 가격, 기본 태그, 옵션명으로 후보를 찾을 수 있는 조건만 추출한다.",
      "상품 데이터에 없는 무게, 배터리, 성능 수치 등은 확정하지 말고 requiredSpecs 또는 priority에 사용자 선호로만 둔다.",
      "모르면 빈 배열 또는 null을 반환한다.",
    ].join("\n"),
    user: `사용자 요청: ${query}`,
  });

  return { ...DEFAULT_INTENT, ...intent };
};

const rankCandidates = async ({ query, intent, candidates, limit }) => {
  return callOpenAiJson({
    schemaName: "candidate_recommendations",
    schema: rankingSchema,
    system: [
      "너는 전자기기 추천 도우미다.",
      "반드시 제공된 candidates 배열 안의 candidateId만 추천한다.",
      "DB에 없는 스펙은 단정하지 않는다. 상품명, 가격, 평점, 기본 태그, 옵션명에서 확인되는 내용만 추천 이유로 쓴다.",
      "각 추천 이유는 한국어 1문장으로 간결하게 쓴다.",
      "사용자의 조건과 후보 데이터가 약하게만 맞으면 caveat에 한계를 짧게 적는다.",
    ].join("\n"),
    user: JSON.stringify({ query, intent, limit, candidates }),
  });
};

module.exports = {
  DEFAULT_INTENT,
  extractIntent,
  hasOpenAiKey,
  rankCandidates,
};
