const productService = require("../services/productService");

async function getProducts(req, res) {
  const products = await productService.listProducts(req.query);
  res.status(200).json({ data: products });
}

async function getProduct(req, res) {
  const product = await productService.getProductById(req.params.productId);
  res.status(200).json({ data: product });
}

async function createProduct(req, res) {
  const product = await productService.createProduct(req.body);
  res.status(201).json({ data: product });
}

module.exports = {
  getProducts,
  getProduct,
  createProduct,
};
