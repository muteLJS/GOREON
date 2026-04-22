const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const ApiError = require("../utils/ApiError");
const generateToken = require("../utils/generateToken");
const {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
} = require("../utils/authCookies");

const sanitizeUser = (user) => ({
  id: user._id.toString(),
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  provider: user.provider,
  profileImage: user.profileImage,
});

const createAuthResult = (user) => ({
  user: sanitizeUser(user),
  accessToken: generateToken(
    { userId: user._id, type: "access" },
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN },
  ),
  refreshToken: generateToken(
    {
      userId: user._id,
      type: "refresh",
      tokenVersion: user.tokenVersion || 0,
    },
    { expiresIn: REFRESH_TOKEN_EXPIRES_IN },
  ),
});

/* ---------------- 일반 회원가입 ---------------- */
const registerUser = async ({ name, email, password, phone }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name || !normalizedEmail || !password) {
    throw new ApiError(400, "Invalid registration request");
  }

  if (password.length < 8) {
    throw new ApiError(400, "Password must be at least 8 characters");
  }

  const existingUser = await User.findOne({ email: normalizedEmail });

  if (existingUser) {
    throw new ApiError(409, "Email already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    provider: "local",
  });

  return createAuthResult(user);
};

/* ---------------- 일반 로그인 ---------------- */
const loginUser = async ({ email, password }) => {
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    throw new ApiError(400, "Invalid login request");
  }

  const user = await User.findOne({ email: normalizedEmail });

  if (!user || user.provider !== "local") {
    throw new ApiError(401, "Authentication failed");
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new ApiError(401, "Authentication failed");
  }

  return createAuthResult(user);
};

/* ---------------- 토큰 재발급 ---------------- */
const refreshAuth = async (refreshToken) => {
  if (!refreshToken) {
    throw new ApiError(401, "Authentication required");
  }

  let decoded;

  try {
    decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
  } catch (error) {
    throw new ApiError(401, "Authentication required");
  }

  if (decoded.type !== "refresh") {
    throw new ApiError(401, "Authentication required");
  }

  const user = await User.findById(decoded.userId);

  if (!user || (user.tokenVersion || 0) !== (decoded.tokenVersion || 0)) {
    throw new ApiError(401, "Authentication required");
  }

  return createAuthResult(user);
};

/* ---------------- 로그아웃 ---------------- */
const logoutUser = async (refreshToken) => {
  if (!refreshToken) {
    return;
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);

    if (decoded.type !== "refresh") {
      return;
    }

    await User.findByIdAndUpdate(decoded.userId, { $inc: { tokenVersion: 1 } });
  } catch (error) {
    // 로그아웃은 클라이언트 쿠키 정리가 핵심이므로 만료/변조 토큰은 무시합니다.
  }
};

/* ---------------- 소셜 로그인 ---------------- */
const socialLogin = async ({
  provider,
  providerId,
  email,
  name,
  profileImage,
}) => {
  const normalizedProvider = provider?.trim().toLowerCase();
  const normalizedProviderId = String(providerId ?? "").trim();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!["google", "kakao", "naver"].includes(normalizedProvider) || !normalizedProviderId) {
    throw new ApiError(400, "Invalid social login payload");
  }

  let user = await User.findOne({
    provider: normalizedProvider,
    providerId: normalizedProviderId,
  });

  if (!user && normalizedEmail) {
    user = await User.findOne({ email: normalizedEmail });
  }

  if (!user) {
    user = await User.create({
      name: name || `${normalizedProvider} 사용자`,
      email: normalizedEmail,
      provider: normalizedProvider,
      providerId: normalizedProviderId,
      profileImage: profileImage || "",
    });
  } else {
    const updates = {};

    if (!user.providerId && user.provider !== "local") updates.providerId = normalizedProviderId;
    if (!user.email && normalizedEmail) updates.email = normalizedEmail;
    if (name && user.name !== name) updates.name = name;
    if (profileImage && user.profileImage !== profileImage) updates.profileImage = profileImage;

    if (Object.keys(updates).length > 0) {
      user.set(updates);
      await user.save();
    }
  }

  return createAuthResult(user);
};

module.exports = {
  registerUser,
  loginUser,
  refreshAuth,
  logoutUser,
  socialLogin,
};
