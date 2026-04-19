const cartService = require("../services/cartService");

async function getCart(req, res) {
  const cart = await cartService.getCartByUserId(req.params.userId);
  res.status(200).json({ data: cart });
}

async function upsertCart(req, res) {
  const cart = await cartService.upsertCart(req.params.userId, req.body.items || []);
  res.status(200).json({ data: cart });
}

module.exports = {
  getCart,
  upsertCart,
};
