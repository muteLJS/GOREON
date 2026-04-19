const userService = require("../services/userService");

async function listUsers(req, res) {
  const users = await userService.listUsers();
  res.status(200).json({ data: users });
}

async function getUser(req, res) {
  const user = await userService.getUserById(req.params.userId);
  res.status(200).json({ data: user });
}

async function createUser(req, res) {
  const user = await userService.createUser(req.body);
  res.status(201).json({ data: user });
}

module.exports = {
  listUsers,
  getUser,
  createUser,
};
