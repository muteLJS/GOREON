const express = require("express");
const auth = require("../middleware/auth");
const {
  getReviewsByProduct,
  createReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/:productId", getReviewsByProduct);
router.post("/", auth, createReview);

module.exports = router;
