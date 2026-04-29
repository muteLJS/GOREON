const Review = require("../models/Review");
const { uploadReviewImage } = require("../utils/r2");
const { syncProductRating } = require("../utils/syncProductRatings");

const getReviewsByProduct = async (req, res, next) => {
  try {
    const reviews = await Review.find({ product: req.params.productId })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });
    const currentUserId = req.user?._id ? String(req.user._id) : "";

    res.json(
      reviews.map((review) => {
        const reviewObject = review.toObject();
        const reviewUserId = String(
          reviewObject.user?._id || reviewObject.user || "",
        );

        return {
          ...reviewObject,
          isMine: Boolean(currentUserId && reviewUserId === currentUserId),
        };
      }),
    );
  } catch (error) {
    next(error);
  }
};

const populateReviewUser = (review) =>
  review.populate("user", "name profileImage");

const getMyReviewByProduct = async (req, res, next) => {
  try {
    const review = await Review.findOne({
      product: req.params.productId,
      user: req.user._id,
    }).populate("user", "name profileImage");

    res.json(review ? { ...review.toObject(), isMine: true } : null);
  } catch (error) {
    next(error);
  }
};

const uploadReviewImages = async (files = []) =>
  Promise.all(files.map((file) => uploadReviewImage(file)));

const buildReviewPayload = (body) => ({
  product: body.product,
  rating: Number(body.rating),
  content: String(body.content || "").trim(),
});

const validateReviewPayload = (
  { product, rating, content },
  { requireProduct = true } = {},
) => {
  if (requireProduct && !product) {
    return "상품 정보가 필요합니다.";
  }

  if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
    return "별점은 1점부터 5점까지 선택해 주세요.";
  }

  if (!content) {
    return "리뷰 내용을 입력해 주세요.";
  }

  return null;
};

const createReview = async (req, res, next) => {
  try {
    const imageUrls = await uploadReviewImages(req.files || []);
    const payload = buildReviewPayload(req.body);
    const validationMessage = validateReviewPayload(payload);

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    const existingReview = await Review.findOne({
      user: req.user._id,
      product: payload.product,
    });

    if (existingReview) {
      existingReview.rating = payload.rating;
      existingReview.content = payload.content;
      existingReview.images =
        imageUrls.length > 0 ? imageUrls : existingReview.images;

      await existingReview.save();
      await syncProductRating(existingReview.product);
      await populateReviewUser(existingReview);

      return res.json(existingReview);
    }

    const review = await Review.create({
      user: req.user._id,
      product: payload.product,
      rating: payload.rating,
      content: payload.content,
      images: imageUrls,
    });

    await syncProductRating(review.product);
    await populateReviewUser(review);

    return res.status(201).json(review);
  } catch (error) {
    return next(error);
  }
};

const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    }

    if (String(review.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "리뷰 수정 권한이 없습니다." });
    }

    const imageUrls = await uploadReviewImages(req.files || []);
    const payload = buildReviewPayload(req.body);
    const validationMessage = validateReviewPayload(payload, {
      requireProduct: false,
    });

    if (validationMessage) {
      return res.status(400).json({ message: validationMessage });
    }

    review.rating = payload.rating;
    review.content = payload.content;

    if (imageUrls.length > 0) {
      review.images = imageUrls;
    }

    await review.save();
    await syncProductRating(review.product);
    await populateReviewUser(review);

    return res.json(review);
  } catch (error) {
    return next(error);
  }
};

const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "리뷰를 찾을 수 없습니다." });
    }

    if (String(review.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "리뷰 삭제 권한이 없습니다." });
    }

    const productId = review.product;
    await review.deleteOne();
    await syncProductRating(productId);

    return res.json({ deletedReviewId: req.params.reviewId, productId });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getReviewsByProduct,
  getMyReviewByProduct,
  createReview,
  updateReview,
  deleteReview,
};
