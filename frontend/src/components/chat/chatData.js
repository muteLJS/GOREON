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
