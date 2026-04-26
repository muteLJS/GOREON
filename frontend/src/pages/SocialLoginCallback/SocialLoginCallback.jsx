import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { login } from "@/store/slices/userSlice";
import api from "@/utils/api";

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
      const accessToken = params.get("accessToken");

      if (error || success !== "1") {
        setMessage("소셜 로그인에 실패했습니다.");
        navigate("/login", { replace: true, state: { authError: error } });
        return;
      }

      try {
        if (accessToken) {
          localStorage.setItem("authToken", accessToken);
        } else {
          localStorage.removeItem("authToken");
        }

        window.history.replaceState(null, "", window.location.pathname);

        const response = await api.get("/users/me");
        const user = normalizeUser(response.data?.data || response.data);

        localStorage.setItem("userInfo", JSON.stringify(user));
        dispatch(login({ user }));
        navigate("/", { replace: true });
      } catch (requestError) {
        console.error("[auth][social-callback] request failed", {
          message: requestError.message,
          status: requestError.response?.status,
        });
        localStorage.removeItem("authToken");
        localStorage.removeItem("userInfo");
        setMessage("소셜 로그인 정보를 가져오지 못했습니다.");
        navigate("/login", { replace: true });
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
