const Product = require("../models/Product");
const Review = require("../models/Review");
const { buildProductQuery } = require("../utils/productSearch");

const normalizeReviewCount = (value) => {
  const reviewCount = Number(value);
  return Number.isFinite(reviewCount) && reviewCount > 0 ? reviewCount : 0;
};

const withReviewCounts = async (products) => {
  const productIds = products.map((product) => product._id);

  if (productIds.length === 0) {
    return products;
  }

  const reviewCounts = await Review.aggregate([
    { $match: { product: { $in: productIds } } },
    { $group: { _id: "$product", reviewCount: { $sum: 1 } } },
  ]);
  const reviewCountMap = new Map(
    reviewCounts.map((item) => [
      String(item._id),
      Number(item.reviewCount) || 0,
    ]),
  );

  return products.map((product) => ({
    ...product,
    reviewCount:
      reviewCountMap.get(String(product._id)) ??
      normalizeReviewCount(product.reviewCount) ??
      0,
  }));
};

const getProducts = async (req, res, next) => {
  try {
    const { category, keyword, type } = req.query;
    const query = buildProductQuery({ category, keyword, type });
    const products = await Product.find(query).sort({ _id: 1 }).lean();

    res.json({ data: await withReviewCounts(products) });
  } catch (error) {
    next(error);
  }
};

const getProductById = async (req, res, next) => {
  try {
    const idParam = String(req.params.id || "").trim();
    const numericId = Number(idParam);
    const product =
      Number.isInteger(numericId) && String(numericId) === idParam
        ? await Product.findOne({ id: numericId }).lean()
        : await Product.findById(idParam).lean();

    if (!product) {
      return res.status(404).json({ error: { message: "Product not found" } });
    }

    const [productWithReviewCount] = await withReviewCounts([product]);

    return res.json({ data: productWithReviewCount });
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
