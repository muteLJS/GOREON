const express = require("express");

const asyncHandler = require("../utils/asyncHandler");
const userController = require("../controllers/userController");

const router = express.Router();

router.get("/", asyncHandler(userController.listUsers));
router.post("/", asyncHandler(userController.createUser));
router.get("/:userId", asyncHandler(userController.getUser));

module.exports = router;
