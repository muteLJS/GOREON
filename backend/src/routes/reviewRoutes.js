const express = require("express");

const asyncHandler = require("../utils/asyncHandler");
const reviewController = require("../controllers/reviewController");

const router = express.Router();

router.get("/", asyncHandler(reviewController.getReviews));
router.post("/", asyncHandler(reviewController.createReview));

module.exports = router;
