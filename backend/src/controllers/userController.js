const User = require("../models/User");

const getMe = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const name = String(req.body.name ?? "").trim();
    const email = String(req.body.email ?? "")
      .trim()
      .toLowerCase();
    const phone = String(req.body.phone ?? "").trim();

    if (!name || !email) {
      return res.status(400).json({
        message: "이름과 이메일은 필수입니다.",
      });
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: req.user._id },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "이미 사용 중인 이메일입니다.",
      });
    }

    req.user.name = name;
    req.user.email = email;
    req.user.phone = phone;

    await req.user.save();

    return res.json(req.user);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMe,
  updateMe,
};
