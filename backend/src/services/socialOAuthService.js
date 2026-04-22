const crypto = require("crypto");
const ApiError = require("../utils/ApiError");
const { socialLogin } = require("./authService");

const PROVIDER_CONFIG = {
  google: {
    clientId: "GOOGLE_CLIENT_ID",
    clientSecret: "GOOGLE_CLIENT_SECRET",
    redirectUri: "GOOGLE_REDIRECT_URI",
    authorizeUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenUrl: "https://oauth2.googleapis.com/token",
    userInfoUrl: "https://openidconnect.googleapis.com/v1/userinfo",
    scope: "openid email profile",
  },
  kakao: {
    clientId: "KAKAO_CLIENT_ID",
    clientSecret: "KAKAO_CLIENT_SECRET",
    redirectUri: "KAKAO_REDIRECT_URI",
    authorizeUrl: "https://kauth.kakao.com/oauth/authorize",
    tokenUrl: "https://kauth.kakao.com/oauth/token",
    userInfoUrl: "https://kapi.kakao.com/v2/user/me",
    scope: "account_email profile_nickname profile_image",
    optionalSecret: true,
  },
  naver: {
    clientId: "NAVER_CLIENT_ID",
    clientSecret: "NAVER_CLIENT_SECRET",
    redirectUri: "NAVER_REDIRECT_URI",
    authorizeUrl: "https://nid.naver.com/oauth2.0/authorize",
    tokenUrl: "https://nid.naver.com/oauth2.0/token",
    userInfoUrl: "https://openapi.naver.com/v1/nid/me",
  },
};

const getProviderConfig = (provider) => {
  const normalizedProvider = provider?.trim().toLowerCase();
  const config = PROVIDER_CONFIG[normalizedProvider];

  if (!config) {
    throw new ApiError(400, "Unsupported social provider");
  }

  const clientId = process.env[config.clientId];
  const clientSecret = process.env[config.clientSecret];
  const redirectUri = process.env[config.redirectUri];

  if (!clientId || !redirectUri || (!clientSecret && !config.optionalSecret)) {
    throw new ApiError(500, `${normalizedProvider} social login is not configured`);
  }

  return {
    ...config,
    provider: normalizedProvider,
    clientId,
    clientSecret,
    redirectUri,
  };
};

const createState = () => crypto.randomBytes(16).toString("hex");

const parseJsonResponse = async (response, errorMessage) => {
  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new ApiError(502, body.error_description || body.error || errorMessage);
  }

  return body;
};

const postForm = async (url, payload, errorMessage) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
    },
    body: new URLSearchParams(payload),
  });

  return parseJsonResponse(response, errorMessage);
};

const getJson = async (url, accessToken, errorMessage) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return parseJsonResponse(response, errorMessage);
};

const createAuthorizationUrl = (provider) => {
  const config = getProviderConfig(provider);
  const params = new URLSearchParams({
    response_type: "code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    state: createState(),
  });

  if (config.scope) {
    params.set("scope", config.scope);
  }

  if (config.provider === "google") {
    params.set("access_type", "offline");
    params.set("prompt", "select_account");
  }

  return `${config.authorizeUrl}?${params.toString()}`;
};

const getTokenPayload = (config, code, state) => {
  const payload = {
    grant_type: "authorization_code",
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    code,
  };

  if (config.clientSecret) {
    payload.client_secret = config.clientSecret;
  }

  if (config.provider === "naver" && state) {
    payload.state = state;
  }

  return payload;
};

const exchangeToken = async (config, code, state) => {
  const tokenPayload = getTokenPayload(config, code, state);

  if (config.provider === "naver") {
    const url = `${config.tokenUrl}?${new URLSearchParams(tokenPayload).toString()}`;
    const response = await fetch(url);
    return parseJsonResponse(response, "Failed to exchange Naver token");
  }

  return postForm(config.tokenUrl, tokenPayload, `Failed to exchange ${config.provider} token`);
};

const mapProviderUser = (provider, profile) => {
  if (provider === "google") {
    return {
      provider,
      providerId: profile.sub,
      email: profile.email,
      name: profile.name,
      profileImage: profile.picture,
    };
  }

  if (provider === "kakao") {
    return {
      provider,
      providerId: profile.id,
      email: profile.kakao_account?.email,
      name: profile.kakao_account?.profile?.nickname,
      profileImage: profile.kakao_account?.profile?.profile_image_url,
    };
  }

  const naverProfile = profile.response ?? {};

  return {
    provider,
    providerId: naverProfile.id,
    email: naverProfile.email,
    name: naverProfile.name || naverProfile.nickname,
    profileImage: naverProfile.profile_image,
  };
};

const handleSocialCallback = async (provider, query) => {
  const config = getProviderConfig(provider);

  if (query.error) {
    throw new ApiError(400, query.error_description || query.error);
  }

  if (!query.code) {
    throw new ApiError(400, "Authorization code is required");
  }

  const token = await exchangeToken(config, query.code, query.state);

  if (!token.access_token) {
    throw new ApiError(502, "Social provider did not return access token");
  }

  const profile = await getJson(
    config.userInfoUrl,
    token.access_token,
    `Failed to fetch ${config.provider} profile`,
  );

  return socialLogin(mapProviderUser(config.provider, profile));
};

module.exports = {
  createAuthorizationUrl,
  handleSocialCallback,
};
