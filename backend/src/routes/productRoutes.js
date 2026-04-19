const express = require("express");

const asyncHandler = require("../utils/asyncHandler");
const productController = require("../controllers/productController");

const router = express.Router();

router.get("/", asyncHandler(productController.getProducts));
router.post("/", asyncHandler(productController.createProduct));
router.get("/:productId", asyncHandler(productController.getProduct));

module.exports = router;
