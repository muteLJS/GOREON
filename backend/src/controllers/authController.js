const {
  registerUser,
  loginUser,
  refreshAuth,
  logoutUser,
  socialLogin,
} = require("../services/authService");
const {
  createAuthorizationUrl,
  handleSocialCallback,
} = require("../services/socialOAuthService");
const {
  setAuthCookies,
  clearAuthCookies,
  getRefreshTokenFromRequest,
} = require("../utils/authCookies");

const getClientSocialCallbackUrl = (params) => {
  const clientOrigin = (process.env.CLIENT_ORIGIN || "http://localhost:5173").replace(/\/$/, "");
  return `${clientOrigin}/auth/social/callback#${new URLSearchParams(params).toString()}`;
};

const sendAuthResponse = (res, statusCode, result) => {
  setAuthCookies(res, result);
  res.status(statusCode).json({
    data: {
      user: result.user,
    },
  });
};

const register = async (req, res, next) => {
  try {
    const result = await registerUser(req.body);
    sendAuthResponse(res, 201, result);
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await loginUser(req.body);
    sendAuthResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

const refresh = async (req, res, next) => {
  try {
    const result = await refreshAuth(getRefreshTokenFromRequest(req));
    sendAuthResponse(res, 200, result);
  } catch (error) {
    clearAuthCookies(res);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await logoutUser(getRefreshTokenFromRequest(req));
    clearAuthCookies(res);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const social = async (req, res, next) => {
  try {
    const result = await socialLogin(req.body);
    sendAuthResponse(res, 200, result);
  } catch (error) {
    next(error);
  }
};

const startSocialOAuth = async (req, res, next) => {
  try {
    res.redirect(createAuthorizationUrl(req.params.provider));
  } catch (error) {
    next(error);
  }
};

const socialOAuthCallback = async (req, res) => {
  try {
    const result = await handleSocialCallback(req.params.provider, req.query);
    setAuthCookies(res, result);
    res.redirect(getClientSocialCallbackUrl({ success: "1" }));
  } catch (error) {
    const message = error.statusCode === 500 ? "social_login_failed" : error.message;
    clearAuthCookies(res);
    res.redirect(getClientSocialCallbackUrl({ error: message || "social_login_failed" }));
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  social,
  startSocialOAuth,
  socialOAuthCallback,
};
