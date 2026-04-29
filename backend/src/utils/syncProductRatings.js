const mongoose = require("mongoose");

const Product = require("../models/Product");
const Review = require("../models/Review");

function normalizeRating(value) {
  return Number((Number(value) || 0).toFixed(1));
}

async function syncProductRating(productId) {
  const targetProductId =
    typeof productId === "string"
      ? new mongoose.Types.ObjectId(productId)
      : productId;

  const [result] = await Review.aggregate([
    { $match: { product: targetProductId } },
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  const nextRating = normalizeRating(result?.averageRating);

  await Product.updateOne(
    { _id: targetProductId },
    {
      $set: {
        rating: nextRating,
        reviewCount: Number(result?.reviewCount) || 0,
      },
    },
  );

  return nextRating;
}

async function syncAllProductRatings() {
  const ratingSummaries = await Review.aggregate([
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);

  await Product.updateMany({}, { $set: { rating: 0, reviewCount: 0 } });

  if (ratingSummaries.length === 0) {
    return { matchedProducts: 0 };
  }

  const operations = ratingSummaries.map((summary) => ({
    updateOne: {
      filter: { _id: summary._id },
      update: {
        $set: {
          rating: normalizeRating(summary.averageRating),
          reviewCount: Number(summary.reviewCount) || 0,
        },
      },
    },
  }));

  await Product.bulkWrite(operations, { ordered: false });

  return { matchedProducts: ratingSummaries.length };
}

module.exports = {
  syncProductRating,
  syncAllProductRatings,
};
