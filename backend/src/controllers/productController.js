const Product = require("../models/Product");

const KO = {
  acer: "\uC5D0\uC774\uC11C",
  apple: "\uC560\uD50C",
  cpuCooler: "CPU\uCFE8\uB7EC",
  copyPaper: "\uBCF5\uC0AC\uC6A9\uC9C0",
  desktop: "\uB370\uC2A4\uD06C\uD0D1",
  dell: "\uB378",
  earphone: "\uC774\uC5B4\uD3F0",
  graphicsCard: "\uADF8\uB798\uD53D\uCE74\uB4DC",
  headset: "\uD5E4\uB4DC\uC14B",
  keyboard: "\uD0A4\uBCF4\uB4DC",
  keyboardCase: "\uD0A4\uBCF4\uB4DC\uCF00\uC774\uC2A4",
  laptop: "\uB178\uD2B8\uBD81",
  laptopBag: "\uB178\uD2B8\uBD81\uAC00\uBC29",
  lenovo: "\uB808\uB178\uBC84",
  mainboard: "\uBA54\uC778\uBCF4\uB4DC",
  memory: "\uBA54\uBAA8\uB9AC",
  monitor: "\uBAA8\uB2C8\uD130",
  mouse: "\uB9C8\uC6B0\uC2A4",
  pcAccessory: "PC\uC8FC\uBCC0\uAE30\uAE30",
  pcAccessorySpaced: "PC \uC8FC\uBCC0\uAE30\uAE30",
  pcPart: "PC\uBD80\uD488",
  pcPartSpaced: "PC \uBD80\uD488",
  pencil: "\uD130\uCE58\uD39C",
  powerBank: "\uBCF4\uC870\uBC30\uD130\uB9AC",
  powerSupply: "\uD30C\uC6CC\uC11C\uD50C\uB77C\uC774",
  printer: "\uD504\uB9B0\uD130",
  router: "\uACF5\uC720\uAE30",
  samsung: "\uC0BC\uC131",
  server: "\uC11C\uBC84",
  smartphone: "\uC2A4\uB9C8\uD2B8\uD3F0",
  smartwatch: "\uC2A4\uB9C8\uD2B8\uC6CC\uCE58",
  ssd: "SSD",
  tablet: "\uD0DC\uBE14\uB9BF",
  tabletAccessory: "\uD0DC\uBE14\uB9BF\uC561\uC138\uC11C\uB9AC",
  tabletAccessorySpaced: "\uD0DC\uBE14\uB9BF \uC561\uC138\uC11C\uB9AC",
  webcam: "\uC6F9\uCEA0",
  wiredEarphone: "\uC720\uC120\uC774\uC5B4\uD3F0",
  wirelessEarphone: "\uBB34\uC120\uC774\uC5B4\uD3F0",
  workstation: "\uC6CC\uD06C\uC2A4\uD14C\uC774\uC158",
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
  speaker: ["\uC2A4\uD53C\uCEE4"],
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
  case: [KO.keyboardCase, "\uCF00\uC774\uC2A4"],
  "power-supply": [KO.powerSupply],
};

const SEARCH_STOP_WORDS = new Set([
  "\uC6A9",
  "\uC6A9\uB3C4",
  "\uCD94\uCC9C",
  "\uC81C\uD488",
  "\uC0C1\uD488",
]);

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

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
    const withoutPurposeSuffix = token.replace(/(\uC6A9)+$/g, "");
    return withoutPurposeSuffix && withoutPurposeSuffix !== token
      ? [token, withoutPurposeSuffix]
      : [token];
  });

  return [...new Set(expandedTokens)]
    .filter((token) => token.length >= 2)
    .filter((token) => !SEARCH_STOP_WORDS.has(token));
};

const createProductSearchConditions = (regex) => [
  { name: regex },
  { tag: regex },
  { url: regex },
  { "priceOptions.optionName": regex },
];

const createTagConditions = (tags) =>
  tags.flatMap((tag) => createProductSearchConditions(createLooseRegex(tag)));

const getProducts = async (req, res, next) => {
  try {
    const { category, keyword, type } = req.query;
    const query = {};
    const andConditions = [];
    const typeTags = TYPE_FILTER_MAP[String(type || "").trim().toLowerCase()];

    if (typeTags?.length) {
      andConditions.push({ $or: createTagConditions(typeTags) });
    }

    if (category) {
      andConditions.push({ $or: createProductSearchConditions(createLooseRegex(category)) });
    }

    if (keyword) {
      const keywordTokens = tokenizeKeyword(keyword);
      const keywordConditions =
        keywordTokens.length > 0
          ? keywordTokens.flatMap((token) => createProductSearchConditions(createLooseRegex(token)))
          : createProductSearchConditions(createLooseRegex(keyword));

      andConditions.push({ $or: keywordConditions });
    }

    if (andConditions.length > 0) {
      query.$and = andConditions;
    }

    const products = await Product.find(query).sort({ id: 1, _id: 1 }).lean();
    res.json({ data: products });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).lean();

    if (!product) {
      return res.status(404).json({ error: { message: "Product not found" } });
    }

    return res.json({ data: product });
  } catch (error) {
    return next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ data: product });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
};
