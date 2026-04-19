const express = require("express");

const asyncHandler = require("../utils/asyncHandler");
const cartController = require("../controllers/cartController");

const router = express.Router();

router.get("/:userId", asyncHandler(cartController.getCart));
router.put("/:userId", asyncHandler(cartController.upsertCart));

module.exports = router;
