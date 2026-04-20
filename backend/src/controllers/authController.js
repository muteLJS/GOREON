const { registerUser, loginUser } = require("../services/authService");

const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    res.status(201).json({ data: result });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    res.status(200).json({ data: result });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
