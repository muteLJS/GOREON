const User = require("../models/User");
const ApiError = require("../utils/ApiError");

async function listUsers() {
  return User.find().select("-password").sort({ createdAt: -1 }).lean();
}

async function getUserById(userId) {
  const user = await User.findById(userId).select("-password").lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return user;
}

async function createUser(payload) {
  const user = await User.create(payload);
  return user.toJSON();
}

module.exports = {
  listUsers,
  getUserById,
  createUser,
};
