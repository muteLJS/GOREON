const express = require("express");
const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/products", require("./productRoutes"));
router.use("/cart", require("./cartRoutes"));
router.use("/reviews", require("./reviewRoutes"));

module.exports = router;
