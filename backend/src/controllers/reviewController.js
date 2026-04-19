const reviewService = require("../services/reviewService");

async function getReviews(req, res) {
  const reviews = await reviewService.listReviews(req.query);
  res.status(200).json({ data: reviews });
}

async function createReview(req, res) {
  const review = await reviewService.createReview(req.body);
  res.status(201).json({ data: review });
}

module.exports = {
  getReviews,
  createReview,
};
