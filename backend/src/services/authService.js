const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const env = require("../config/env");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");

function createToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    },
    env.jwtSecret,
    { expiresIn: "7d" }
  );
}

function sanitizeUser(user) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

async function register(payload) {
  const email = payload.email?.trim().toLowerCase();
  const { password, name, phone = "" } = payload;

  if (!email || !password || !name) {
    throw new ApiError(400, "Email, password, and name are required");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: passwordHash,
    name,
    phone,
  });

  return {
    token: createToken(user),
    user: sanitizeUser(user),
  };
}

async function login(payload) {
  const email = payload.email?.trim().toLowerCase();
  const { password } = payload;

  if (!email || !password) {
    throw new ApiError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid email or password");
  }

  return {
    token: createToken(user),
    user: sanitizeUser(user),
  };
}

async function getCurrentUser(userId) {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  return sanitizeUser(user);
}

module.exports = {
  register,
  login,
  getCurrentUser,
};
