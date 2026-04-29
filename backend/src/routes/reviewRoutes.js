const express = require("express");
const auth = require("../middleware/auth");
const optionalAuth = require("../middleware/optionalAuth");
const upload = require("../middleware/upload");
const {
  getReviewsByProduct,
  getMyReviewByProduct,
  createReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/:productId/me", auth, getMyReviewByProduct);
router.get("/:productId", optionalAuth, getReviewsByProduct);
router.post("/", auth, upload.array("images", 5), createReview);
router.patch("/:reviewId", auth, upload.array("images", 5), updateReview);
router.delete("/:reviewId", auth, deleteReview);

module.exports = router;
