const ACCESS_COOKIE_NAME = "access_token";
const REFRESH_COOKIE_NAME = "refresh_token";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

const ACCESS_COOKIE_MAX_AGE = 15 * 60 * 1000;
const REFRESH_COOKIE_MAX_AGE = 7 * 24 * 60 * 60 * 1000;

const isProduction = () => process.env.NODE_ENV === "production";
const getCookieDomain = () => {
  const domain = String(process.env.COOKIE_DOMAIN || "").trim();
  return domain || undefined;
};

const getBaseCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "none" : "lax",
  domain: getCookieDomain(),
});

const getAccessCookieOptions = () => ({
  ...getBaseCookieOptions(),
  maxAge: ACCESS_COOKIE_MAX_AGE,
  path: "/",
});

const getRefreshCookieOptions = () => ({
  ...getBaseCookieOptions(),
  maxAge: REFRESH_COOKIE_MAX_AGE,
  path: "/api/auth",
});

const parseCookies = (req) => {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) {
    return {};
  }

  return cookieHeader.split(";").reduce((cookies, part) => {
    const [rawName, ...rawValueParts] = part.trim().split("=");

    if (!rawName) {
      return cookies;
    }

    const value = rawValueParts.join("=");

    try {
      cookies[rawName] = decodeURIComponent(value);
    } catch (error) {
      cookies[rawName] = value;
    }

    return cookies;
  }, {});
};

const getAccessTokenFromRequest = (req) => {
  const cookies = parseCookies(req);
  return cookies[ACCESS_COOKIE_NAME] || null;
};

const getRefreshTokenFromRequest = (req) => {
  const cookies = parseCookies(req);
  return cookies[REFRESH_COOKIE_NAME] || null;
};

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  res.cookie(ACCESS_COOKIE_NAME, accessToken, getAccessCookieOptions());
  res.cookie(REFRESH_COOKIE_NAME, refreshToken, getRefreshCookieOptions());
};

const clearAuthCookies = (res) => {
  res.clearCookie(ACCESS_COOKIE_NAME, {
    ...getBaseCookieOptions(),
    path: "/",
  });
  res.clearCookie(REFRESH_COOKIE_NAME, {
    ...getBaseCookieOptions(),
    path: "/api/auth",
  });
};

module.exports = {
  ACCESS_TOKEN_EXPIRES_IN,
  REFRESH_TOKEN_EXPIRES_IN,
  setAuthCookies,
  clearAuthCookies,
  getAccessTokenFromRequest,
  getRefreshTokenFromRequest,
};
