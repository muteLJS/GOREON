const Review = require("../models/Review");

const getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    next(error);
  }
};

const createReview = async (req, res, next) => {
  try {
    const imageUrls = (req.files || []).map(
      (file) => `${req.protocol}://${req.get("host")}/uploads/${file.filename}`,
    );

    const review = await Review.create({
      user: req.user._id,
      product: req.body.product,
      rating: Number(req.body.rating),
      content: req.body.content,
      images: imageUrls,
    });

    res.status(201).json(review);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getReviewsByProduct,
  createReview,
};
