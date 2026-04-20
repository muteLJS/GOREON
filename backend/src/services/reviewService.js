const Review = require("../models/Review");

async function listReviews(filters = {}) {
  const query = {};

  if (filters.productId) {
    query.productId = filters.productId;
  }

  return Review.find(query)
    .populate("userId", "name")
    .sort({ createdAt: -1 })
    .lean();
}

async function createReview(payload) {
  return Review.create(payload);
}

module.exports = {
  listReviews,
  createReview,
};
