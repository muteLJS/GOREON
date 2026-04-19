const Product = require("../models/Product");
const ApiError = require("../utils/ApiError");

async function listProducts(filters = {}) {
  const query = {};

  if (filters.category) {
    query.category = filters.category;
  }

  if (filters.brand) {
    query.brand = filters.brand;
  }

  return Product.find(query).sort({ createdAt: -1 }).lean();
}

async function getProductById(productId) {
  const product = await Product.findById(productId).lean();

  if (!product) {
    throw new ApiError(404, "Product not found");
  }

  return product;
}

async function createProduct(payload) {
  return Product.create(payload);
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
};
