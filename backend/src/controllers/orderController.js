const mongoose = require("mongoose");
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

    const invalidItem = items.find((item) => !mongoose.isValidObjectId(item.product));

    if (invalidItem) {
      return res.status(400).json({ message: "상품 정보가 올바르지 않습니다." });
    }

    const normalizedItems = items.map((item) => ({
      product: item.product,
      name: item.name,
      category: item.category || "",
      option: item.option || "",
      thumb: item.thumb || "",
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 1,
      status: "placed",
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

const confirmOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    if (!mongoose.isValidObjectId(orderId)) {
      return res.status(400).json({ message: "주문 정보가 올바르지 않습니다." });
    }

    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "주문을 찾을 수 없습니다." });
    }

    if (
      order.status !== "confirmed" ||
      order.items.some((item) => item.status !== "confirmed")
    ) {
      order.status = "confirmed";
      order.items.forEach((item) => {
        item.status = "confirmed";
      });
      await order.save();
    }

    res.json(order);
  } catch (error) {
    next(error);
  }
};

const confirmOrderItem = async (req, res, next) => {
  try {
    const { orderId, itemIndex } = req.params;
    const itemIndexNumber = Number(itemIndex);

    if (
      !mongoose.isValidObjectId(orderId) ||
      !Number.isInteger(itemIndexNumber) ||
      itemIndexNumber < 0
    ) {
      return res.status(400).json({ message: "주문 상품 정보가 올바르지 않습니다." });
    }

    const order = await Order.findOne({ _id: orderId, user: req.user._id });

    if (!order) {
      return res.status(404).json({ message: "주문을 찾을 수 없습니다." });
    }

    const orderItem = order.items[itemIndexNumber];

    if (!orderItem) {
      return res.status(404).json({ message: "주문 상품을 찾을 수 없습니다." });
    }

    if (orderItem.status !== "confirmed") {
      orderItem.status = "confirmed";
    }

    order.status = order.items.every((item) => item.status === "confirmed")
      ? "confirmed"
      : "placed";
    await order.save();

    res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  confirmOrder,
  confirmOrderItem,
};
