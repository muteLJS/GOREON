const mongoose = require("mongoose");

const priceOptionSchema = new mongoose.Schema(
  {
    optionName: {
      type: String,
      default: "",
    },
    price: {
      type: String,
      default: "",
    },
  },
  { _id: false, strict: false },
);

const productSchema = new mongoose.Schema(
  {
    id: {
      type: Number,
      index: true,
    },
    image: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
    name: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    price: {
      type: String,
      default: "",
    },
    priceOptions: {
      type: [priceOptionSchema],
      default: [],
    },
    detailImages: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
    },
    tag: {
      type: [String],
      default: [],
      index: true,
    },
  },
  {
    id: false,
    strict: false,
  },
);

module.exports = mongoose.model("Product", productSchema);
