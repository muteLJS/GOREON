const KO = {
  acer: "에이서",
  apple: "애플",
  cpuCooler: "CPU쿨러",
  copyPaper: "복사용지",
  desktop: "데스크탑",
  dell: "델",
  earphone: "이어폰",
  graphicsCard: "그래픽카드",
  headset: "헤드셋",
  keyboard: "키보드",
  keyboardCase: "키보드케이스",
  laptop: "노트북",
  laptopBag: "노트북가방",
  lenovo: "레노버",
  mainboard: "메인보드",
  memory: "메모리",
  monitor: "모니터",
  mouse: "마우스",
  pcAccessory: "PC주변기기",
  pcAccessorySpaced: "PC 주변기기",
  pcPart: "PC부품",
  pcPartSpaced: "PC 부품",
  pencil: "터치펜",
  powerBank: "보조배터리",
  powerSupply: "파워서플라이",
  printer: "프린터",
  router: "공유기",
  samsung: "삼성",
  server: "서버",
  smartphone: "스마트폰",
  smartwatch: "스마트워치",
  ssd: "SSD",
  tablet: "태블릿",
  tabletAccessory: "태블릿액세서리",
  tabletAccessorySpaced: "태블릿 액세서리",
  webcam: "웹캠",
  wiredEarphone: "유선이어폰",
  wirelessEarphone: "무선이어폰",
  workstation: "워크스테이션",
};

const TYPE_FILTER_MAP = {
  laptop: [KO.laptop],
  notebook: [KO.laptop],
  desktop: [KO.desktop],
  monitor: [KO.monitor],
  keyboard: [KO.keyboard],
  mouse: [KO.mouse],
  "pc-accessory": [KO.pcAccessory, KO.pcAccessorySpaced],
  "pc-part": [KO.pcPart, KO.pcPartSpaced],
  "pc-parts": [KO.pcPart, KO.pcPartSpaced],
  smartphone: [KO.smartphone],
  smartwatch: [KO.smartwatch],
  earphone: [KO.earphone, KO.wirelessEarphone, KO.wiredEarphone],
  tablet: [KO.tablet],
  "tablet-accessory": [KO.tabletAccessory, KO.tabletAccessorySpaced],
  pencil: [KO.pencil],
  "keyboard-case": [KO.keyboardCase],
  printer: [KO.printer],
  router: [KO.router],
  webcam: [KO.webcam],
  speaker: ["스피커"],
  "power-bank": [KO.powerBank],
  apple: ["Apple", "APPLE", KO.apple],
  samsung: ["Samsung", "SAMSUNG", KO.samsung],
  lg: ["LG"],
  hp: ["HP", "hp"],
  lenovo: ["Lenovo", "LENOVO", KO.lenovo],
  dell: ["Dell", "DELL", KO.dell],
  msi: ["MSI", "msi"],
  asus: ["ASUS", "asus"],
  acer: ["Acer", "ACER", "acer", KO.acer],
  cpu: ["CPU"],
  "cpu-cooler": [KO.cpuCooler],
  hdd: ["HDD"],
  ssd: [KO.ssd],
  memory: [KO.memory],
  mainboard: [KO.mainboard],
  "graphics-card": [KO.graphicsCard],
  case: [KO.keyboardCase, "케이스"],
  "power-supply": [KO.powerSupply],
};

const SEARCH_STOP_WORDS = new Set([
  "용",
  "용도",
  "추천",
  "제품",
  "상품",
  "해줘",
  "해주세요",
  "찾아줘",
]);

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const createLooseRegex = (value) => {
  const escaped = escapeRegex(String(value).trim());
  const withFlexibleSpaces = escaped.replace(/\s+/g, "\\s*");

  return new RegExp(withFlexibleSpaces, "i");
};

const tokenizeKeyword = (keyword) => {
  const rawTokens = String(keyword || "")
    .trim()
    .split(/[\s,./|+_-]+/)
    .map((token) => token.trim())
    .filter(Boolean);

  const expandedTokens = rawTokens.flatMap((token) => {
    const withoutPurposeSuffix = token.replace(/(용)+$/g, "");
    return withoutPurposeSuffix && withoutPurposeSuffix !== token
      ? [token, withoutPurposeSuffix]
      : [token];
  });

  return [...new Set(expandedTokens)]
    .filter((token) => token.length >= 2)
    .filter((token) => !SEARCH_STOP_WORDS.has(token));
};

const normalizeType = (type) =>
  String(type || "")
    .trim()
    .toLowerCase();

const getTypeTags = (type) => TYPE_FILTER_MAP[normalizeType(type)] ?? [];

const createProductSearchConditions = (regex) => [
  { name: regex },
  { tag: regex },
  { url: regex },
  { "priceOptions.optionName": regex },
];

const createTagConditions = (tags) =>
  tags.flatMap((tag) => createProductSearchConditions(createLooseRegex(tag)));

const createKeywordConditions = (keyword) => {
  const keywordTokens = tokenizeKeyword(keyword);

  return keywordTokens.length > 0
    ? keywordTokens.flatMap((token) =>
        createProductSearchConditions(createLooseRegex(token)),
      )
    : createProductSearchConditions(createLooseRegex(keyword));
};

const buildProductQuery = ({ category, keyword, type } = {}) => {
  const query = {};
  const andConditions = [];
  const typeTags = getTypeTags(type);

  if (typeTags.length) {
    andConditions.push({ $or: createTagConditions(typeTags) });
  }

  if (category) {
    andConditions.push({
      $or: createProductSearchConditions(createLooseRegex(category)),
    });
  }

  if (keyword) {
    andConditions.push({ $or: createKeywordConditions(keyword) });
  }

  if (andConditions.length > 0) {
    query.$and = andConditions;
  }

  return query;
};

const parsePriceNumber = (value) =>
  Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;

module.exports = {
  KO,
  TYPE_FILTER_MAP,
  buildProductQuery,
  createKeywordConditions,
  createLooseRegex,
  createProductSearchConditions,
  createTagConditions,
  getTypeTags,
  parsePriceNumber,
  tokenizeKeyword,
};
