const express = require("express");

const authController = require("../controllers/authController");
const auth = require("../middleware/auth");
const asyncHandler = require("../utils/asyncHandler");

const router = express.Router();

router.post("/register", asyncHandler(authController.register));
router.post("/login", asyncHandler(authController.login));
router.get("/me", auth, asyncHandler(authController.me));

module.exports = router;
