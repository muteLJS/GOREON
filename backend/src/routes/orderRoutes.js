const express = require("express");
const auth = require("../middleware/auth");
const {
  createOrder,
  getMyOrders,
  confirmOrder,
} = require("../controllers/orderController");

const router = express.Router();

router.get("/me", auth, getMyOrders);
router.patch("/:orderId/confirm", auth, confirmOrder);
router.post("/", auth, createOrder);

module.exports = router;
