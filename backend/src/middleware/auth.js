const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { getAccessTokenFromRequest } = require("../utils/authCookies");

const auth = async (req, res, next) => {
  try {
    const token = getAccessTokenFromRequest(req);

    if (!token) {
      return res.status(401).json({ message: "인증이 필요합니다." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.type && decoded.type !== "access") {
      return res.status(401).json({ message: "인증에 실패했습니다." });
    }

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ message: "인증에 실패했습니다." });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: "인증에 실패했습니다." });
  }
};

module.exports = auth;
