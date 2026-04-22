const express = require("express");
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getReviewsByProduct,
  createReview,
} = require("../controllers/reviewController");

const router = express.Router();

router.get("/:productId", getReviewsByProduct);
router.post("/", auth, upload.array("images", 5), createReview);

module.exports = router;
