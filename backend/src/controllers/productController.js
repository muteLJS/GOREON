const Product = require("../models/Product");

const TYPE_FILTER_MAP = {
  laptop: { category: "노트북" },
  notebook: { category: "노트북" },
  desktop: { category: "데스크탑" },
  monitor: { category: "모니터" },
  keyboard: { category: "키보드" },
  mouse: { category: "마우스" },
  "pc-accessory": { category: "PC 주변기기" },
  "pc-part": { category: "PC 부품" },
  "pc-parts": { category: "PC 부품" },
  smartphone: { category: "스마트폰" },
  smartwatch: { category: "스마트워치" },
  earphone: { category: "이어폰" },
  tablet: { category: "태블릿" },
  "tablet-accessory": { category: "태블릿 액세서리" },
  pencil: { category: "펜슬" },
  "keyboard-case": { category: "키보드 케이스" },
  printer: { category: "프린터" },
  router: { category: "공유기" },
  webcam: { category: "웹캠" },
  speaker: { category: "스피커" },
  "power-bank": { category: "보조배터리" },
  apple: { brand: "Apple" },
  samsung: { brand: "Samsung" },
  lg: { brand: "LG" },
  hp: { brand: "HP" },
  lenovo: { brand: "Lenovo" },
  dell: { brand: "Dell" },
  msi: { brand: "MSI" },
  asus: { brand: "ASUS" },
  acer: { brand: "Acer" },
};

const escapeRegex = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getProducts = async (req, res, next) => {
  try {
    const { category, keyword, type } = req.query;
    const query = {};
    const typeFilter = TYPE_FILTER_MAP[String(type || "").trim().toLowerCase()];

    if (typeFilter?.category) {
      query.category = typeFilter.category;
    }

    if (typeFilter?.brand) {
      query.brand = new RegExp(`^${escapeRegex(typeFilter.brand)}$`, "i");
    }

    if (category) {
      query.category = category;
    }

    if (keyword) {
      const keywordRegex = new RegExp(escapeRegex(keyword), "i");
      query.$or = [
        { name: keywordRegex },
        { brand: keywordRegex },
        { category: keywordRegex },
        { "specs.tags": keywordRegex },
        { "specs.priceOptions.optionName": keywordRegex },
      ];
    }

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();
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
