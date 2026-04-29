const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { getAccessTokenFromRequest } = require("../utils/authCookies");

const getBearerTokenFromRequest = (req) => {
  const authorizationHeader = String(req.headers.authorization || "").trim();

  if (!authorizationHeader.startsWith("Bearer ")) {
    return null;
  }

  return authorizationHeader.slice("Bearer ".length).trim() || null;
};

const optionalAuth = async (req, res, next) => {
  try {
    const token =
      getAccessTokenFromRequest(req) || getBearerTokenFromRequest(req);

    if (!token) {
      return next();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type && decoded.type !== "access") {
      return next();
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (user) {
      req.user = user;
    }

    return next();
  } catch {
    return next();
  }
};

module.exports = optionalAuth;
