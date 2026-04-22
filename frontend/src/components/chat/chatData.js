import ProductExampleImage from "@/assets/products/product-example.jpg";

export const CHAT_MODE = {
  IDLE: "idle",
  PREVIEW: "preview",
  INITIAL: "open-initial",
  CHATTING: "open-chatting",
};

export const CHAT_TEXT = {
  initial: "어떤 제품을 찾고 계신가요?",
  loading: "제가 생각중이에요",
};

export const CHAT_SUGGESTIONS = [
  { id: "video-laptop", emoji: "🎬", label: "유튜브용 편집용 노트북" },
  { id: "fps-monitor", emoji: "🎮", label: "FPS 게임에 맞는 모니터" },
  { id: "student-laptop", emoji: "📚", label: "대학생용 노트북 50만원 이하" },
  { id: "tablet-parent", emoji: "👨‍👩‍👦", label: "부모님 쉽게 쓸 태블릿" },
  { id: "home-printer", emoji: "🖨", label: "가정용 프린터 추천" },
];

const CHAT_PRODUCTS = [
  {
    id: "macbook-pro-14",
    image: ProductExampleImage,
    name: "MacBook Pro 14 M3",
    description: "영상 편집과 4K 작업에 안정적인 노트북",
    spec: "M3 / GPU / 18GB 메모리",
    tags: ["#영상편집", "#성능안정", "#프리미어"],
    price: "₩2,419,000",
    detailPath: "/product/1",
    ctaLabel: "자세히 보기",
  },
  {
    id: "lg-gram-pro",
    image: ProductExampleImage,
    name: "LG gram Pro 16",
    description: "휴대성과 배터리를 함께 챙기기 좋은 모델",
    spec: "Ultra 7 / RTX 3050 / 32GB 메모리",
    tags: ["#휴대성", "#영상편집", "#대학생"],
    price: "₩1,899,000",
    detailPath: "/product/2",
    ctaLabel: "자세히 보기",
  },
];

function createMessageId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createTimestamp() {
  return new Date().toISOString();
}

export function createTextMessage({ id, sender, text, isStreaming = false }) {
  return {
    id: id ?? createMessageId(`${sender}-text`),
    sender,
    type: "text",
    text,
    isStreaming,
    createdAt: createTimestamp(),
  };
}

export function createLoadingMessage({ id, sender = "bot", text = CHAT_TEXT.loading }) {
  return {
    id: id ?? createMessageId(`${sender}-loading`),
    sender,
    type: "loading",
    text,
    createdAt: createTimestamp(),
  };
}

export function createProductMessage({ id, sender = "bot", text, products }) {
  return {
    id: id ?? createMessageId(`${sender}-product`),
    sender,
    type: "product",
    text,
    products,
    createdAt: createTimestamp(),
  };
}

export function createInitialMessages() {
  return [
    createTextMessage({
      id: "bot-initial-message",
      sender: "bot",
      text: CHAT_TEXT.initial,
    }),
  ];
}

// Mock 응답 구조는 이후 API 응답 파서로 교체하기 쉽게 분리해 둔다.
export function getMockAssistantReply() {
  return {
    answerText: "영상 편집에 적합한 모델입니다.",
    productSummary: "예산과 사용 목적을 기준으로 추천 제품을 골라봤어요.",
    products: CHAT_PRODUCTS,
  };
}
