const express = require("express");
const {
  createAiRecommendation,
} = require("../controllers/recommendationController");

const router = express.Router();

router.post("/ai", createAiRecommendation);

module.exports = router;
