const authService = require("../services/authService");

async function register(req, res) {
  const auth = await authService.register(req.body);
  res.status(201).json({ data: auth });
}

async function login(req, res) {
  const auth = await authService.login(req.body);
  res.status(200).json({ data: auth });
}

async function me(req, res) {
  const user = await authService.getCurrentUser(req.user.id);
  res.status(200).json({ data: user });
}

module.exports = {
  register,
  login,
  me,
};
