const jwt = require("jsonwebtoken");

const generateToken = (payload, options = {}) => {
  const tokenPayload =
    typeof payload === "object" && payload !== null ? payload : { userId: payload };

  return jwt.sign(tokenPayload, process.env.JWT_SECRET, options);
};

module.exports = generateToken;
