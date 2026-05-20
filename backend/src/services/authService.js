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

const SOCIAL_PROVIDERS = ["google", "kakao", "naver"];

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
    // Cookie removal on the client is enough when the refresh token is already invalid.
  }
};

const findUserBySocialIdentity = (provider, providerId) =>
  User.findOne({
    $or: [
      { provider, providerId },
      {
        socialProviders: {
          $elemMatch: { provider, providerId },
        },
      },
    ],
  });

const applySocialProvider = (user, { provider, providerId, profileImage }) => {
  const now = new Date();
  const socialProviders = Array.isArray(user.socialProviders) ? user.socialProviders : [];
  const linkedProvider = socialProviders.find(
    (item) => item.provider === provider && item.providerId === providerId,
  );

  if (linkedProvider) {
    linkedProvider.lastLoginAt = now;

    if (profileImage) {
      linkedProvider.profileImage = profileImage;
    }

    return;
  }

  socialProviders.push({
    provider,
    providerId,
    profileImage: profileImage || "",
    linkedAt: now,
    lastLoginAt: now,
  });
  user.socialProviders = socialProviders;
};

const updateSocialUser = async (user, { provider, providerId, email, profileImage }) => {
  applySocialProvider(user, { provider, providerId, profileImage });

  if (!user.providerId && user.provider === provider) {
    user.providerId = providerId;
  }

  if (!user.email && email) {
    user.email = email;
  }

  await user.save();
  return user;
};

const createSocialUser = async ({ provider, providerId, email, name, profileImage }) =>
  User.create({
    name: name || `${provider} user`,
    email,
    provider,
    providerId,
    socialProviders: [
      {
        provider,
        providerId,
        profileImage: profileImage || "",
      },
    ],
    profileImage: profileImage || "",
  });

const socialLogin = async ({ provider, providerId, email, name, profileImage }) => {
  const normalizedProvider = provider?.trim().toLowerCase();
  const normalizedProviderId = String(providerId ?? "").trim();
  const normalizedEmail = email?.trim().toLowerCase();

  if (!SOCIAL_PROVIDERS.includes(normalizedProvider) || !normalizedProviderId) {
    throw new ApiError(400, "Invalid social login payload");
  }

  const socialPayload = {
    provider: normalizedProvider,
    providerId: normalizedProviderId,
    email: normalizedEmail,
    name,
    profileImage,
  };

  let user = normalizedEmail ? await User.findOne({ email: normalizedEmail }) : null;
  user = user || (await findUserBySocialIdentity(normalizedProvider, normalizedProviderId));

  if (!user) {
    try {
      user = await createSocialUser(socialPayload);
    } catch (error) {
      if (error?.code !== 11000 || !normalizedEmail) {
        throw error;
      }

      user = await User.findOne({ email: normalizedEmail });

      if (!user) {
        throw error;
      }

      user = await updateSocialUser(user, socialPayload);
    }
  } else {
    user = await updateSocialUser(user, socialPayload);
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
