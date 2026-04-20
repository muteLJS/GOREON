const express = require("express");
const auth = require("../middleware/auth");
const { getCart, addToCart } = require("../controllers/cartController");

const router = express.Router();

router.get("/", auth, getCart);
router.post("/", auth, addToCart);

module.exports = router;
