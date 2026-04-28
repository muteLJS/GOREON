import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import RouteLoading from "@/components/RouteLoading/RouteLoading";
import { login } from "@/store/slices/userSlice";
import api, { ACCESS_TOKEN_STORAGE_KEY } from "@/utils/api";

const getHashParams = () => new URLSearchParams(window.location.hash.replace(/^#/, ""));

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
      const accessToken = params.get("accessToken");

      if (error || success !== "1") {
        console.error("[auth][social] callback failed before session restore", {
          provider,
          success,
          error,
        });
        setMessage("소셜 로그인에 실패했습니다.");
        navigate("/login", { replace: true, state: { authError: error, authProvider: provider } });
        return;
      }

      try {
        if (accessToken) {
          localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, accessToken);
        }

        window.history.replaceState(null, "", window.location.pathname);

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

        localStorage.removeItem("userInfo");
        localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY);
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
