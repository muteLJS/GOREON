const Order = require("../models/Order");

const createOrder = async (req, res, next) => {
  try {
    const { items, totalAmount } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "주문 상품이 필요합니다." });
    }

    if (typeof totalAmount !== "number" || totalAmount < 0) {
      return res
        .status(400)
        .json({ message: "총 주문 금액이 올바르지 않습니다." });
    }

    const normalizedItems = items.map((item) => ({
      product: item.product,
      name: item.name,
      category: item.category || "",
      option: item.option || "",
      thumb: item.thumb || "",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
    }));

    const order = await Order.create({
      user: req.user._id,
      items: normalizedItems,
      totalAmount,
      status: "placed",
    });

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      orderedAt: -1,
    });

    res.json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};
