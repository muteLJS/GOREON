import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "@/store/slices/userSlice";
import api from "@/utils/api";

const getHashParams = () => new URLSearchParams(window.location.hash.replace(/^#/, ""));

const getSocialDebugContext = () => ({
  currentUrl: window.location.href,
  callbackPath: window.location.pathname,
  hash: window.location.hash,
  referrer: document.referrer || "(empty)",
  userAgent: window.navigator.userAgent,
});

const normalizeUser = (user) => ({
  id: user.id || user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  provider: user.provider,
  profileImage: user.profileImage,
});

function SocialLoginCallback() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [message, setMessage] = useState("소셜 로그인 처리 중입니다...");
  const hasStartedRef = useRef(false);

  useEffect(() => {
    if (hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;

    const completeSocialLogin = async () => {
      const params = getHashParams();
      const error = params.get("error");
      const success = params.get("success");
      const provider = params.get("provider") || "unknown";

      console.info("[auth][social-callback] started", {
        provider,
        success,
        error,
        ...getSocialDebugContext(),
      });

      if (error || success !== "1") {
        console.error("[auth][social-callback] provider callback failed", {
          provider,
          success,
          error,
          hint:
            "OAuth provider callback did not complete normally. Check backend Render logs for [auth][social-oauth-callback] details.",
        });
        setMessage("소셜 로그인에 실패했습니다.");
        navigate("/login", { replace: true, state: { authError: error, authProvider: provider } });
        return;
      }

      try {
        window.history.replaceState(null, "", window.location.pathname);

        const response = await api.get("/users/me");
        const user = normalizeUser(response.data?.data || response.data);

        localStorage.setItem("userInfo", JSON.stringify(user));
        dispatch(login({ user }));
        navigate("/", { replace: true });
      } catch (requestError) {
        const status = requestError.response?.status;

        console.error("[auth][social-callback] request failed", {
          provider,
          message: requestError.message,
          status,
          responseData: requestError.response?.data,
          requestUrl: requestError.config?.url,
          probableCause:
            status === 401
              ? "Social login succeeded, but the auth cookie was not included on /users/me. Check Set-Cookie on the OAuth callback response and Cookie on the subsequent /users/me request."
              : "Check backend logs and network response details.",
          ...getSocialDebugContext(),
        });

        localStorage.removeItem("userInfo");
        setMessage("소셜 로그인 정보를 가져오지 못했습니다.");
        navigate("/login", {
          replace: true,
          state: {
            authError: status === 401 ? "social_session_missing" : "social_profile_fetch_failed",
            authProvider: provider,
          },
        });
      }
    };

    completeSocialLogin();
  }, [dispatch, navigate]);

  return (
    <main className="social-login-callback" aria-live="polite">
      {message}
    </main>
  );
}

export default SocialLoginCallback;
