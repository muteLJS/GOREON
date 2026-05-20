import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import RouteLoading from "@/components/RouteLoading/RouteLoading";
import { login } from "@/store/slices/userSlice";
import api from "@/utils/api";

const getCallbackParams = () => {
  const searchParams = new URLSearchParams(window.location.search);
  const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""));

  return {
    success: searchParams.get("success") || hashParams.get("success"),
    error: searchParams.get("error") || hashParams.get("error"),
    provider: searchParams.get("provider") || hashParams.get("provider"),
  };
};

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
      const { error, success, provider } = getCallbackParams();

      if (error || success !== "1") {
        console.error("[auth][social-callback] login failed", {
          provider,
          error,
          success,
          search: window.location.search,
          hash: window.location.hash,
        });

        setMessage("소셜 로그인에 실패했습니다.");
        navigate("/login", {
          replace: true,
          state: {
            authError: error || "social_login_failed",
            authProvider: provider,
          },
        });
        return;
      }

      try {
        localStorage.removeItem("authToken");

        const response = await api.get("/users/me");
        const user = normalizeUser(response.data?.data || response.data);

        localStorage.setItem("userInfo", JSON.stringify(user));
        dispatch(login({ user }));
        navigate("/", { replace: true });
      } catch (requestError) {
        const status = requestError.response?.status;

        console.error("[auth][social] session restore failed after callback", {
          provider,
          status,
          message: requestError.message,
          data: requestError.response?.data,
        });

        localStorage.removeItem("authToken");
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

  return <RouteLoading message={message} />;
}

export default SocialLoginCallback;
