const express = require("express");
const {
  register,
  login,
  refresh,
  logout,
  social,
  startSocialOAuth,
  socialOAuthCallback,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.post("/social", social);
router.get("/:provider/callback", socialOAuthCallback);
router.get("/:provider", startSocialOAuth);

module.exports = router;
