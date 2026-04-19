const Cart = require("../models/Cart");

async function getCartByUserId(userId) {
  return Cart.findOne({ userId }).populate("items.productId").lean();
}

async function upsertCart(userId, items) {
  return Cart.findOneAndUpdate(
    { userId },
    { userId, items },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );
}

module.exports = {
  getCartByUserId,
  upsertCart,
};
