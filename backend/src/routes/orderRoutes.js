const express = require("express");
const auth = require("../middleware/auth");
const { createOrder, getMyOrders } = require("../controllers/orderController");

const router = express.Router();

router.get("/me", auth, getMyOrders);
router.post("/", auth, createOrder);

module.exports = router;
