import "../../styles/_mixins.scss";
import "./Login.scss";
import user from "../../assets/icons/user.svg";
import lock from "../../assets/icons/lock.svg";
import kakao from "../../assets/icons/kakao.svg";
import naver from "../../assets/icons/naver.svg";
import google from "../../assets/icons/google.svg";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { login } from "../../store/slices/userSlice";
import api, { ACCESS_TOKEN_STORAGE_KEY } from "../../utils/api";

const defaultLoginForm = {
  email: "",
  password: "",
};

const defaultRegisterForm = {
  email: "",
  password: "",
  passwordCheck: "",
  nickname: "",
  phone: "",
};

const persistAuth = (payload) => {
  localStorage.setItem("userInfo", JSON.stringify(payload.user));

  if (payload.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, payload.accessToken);
  }
};

const normalizeAuthPayload = (auth) => ({
  user: auth.user,
  accessToken: auth.accessToken,
});

const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const getAuthErrorMessage = (error, fallbackMessage) => {
  if (!error.response) {
    return "서버에 연결하지 못했습니다. 백엔드가 실행 중인지 확인해주세요.";
  }

  const serverMessage = error.response?.data?.error?.message;

  if (!serverMessage) {
    return error.response?.data?.message || fallbackMessage;
  }

  const messageMap = {
    "Email already in use": "이미 가입된 이메일입니다.",
    "Password must be at least 8 characters": "비밀번호는 8자 이상이어야 합니다.",
    "Invalid registration request": "이메일, 비밀번호, 닉네임을 모두 입력해주세요.",
    "Invalid login request": "이메일과 비밀번호를 모두 입력해주세요.",
    "Authentication failed": "로그인 정보를 확인해주세요.",
  };

  return messageMap[serverMessage] || serverMessage;
};

const getSocialAuthErrorMessage = (providerLabel, authError) => {
  if (authError === "social_session_missing") {
    return `${providerLabel} 로그인은 완료됐지만 세션을 확인하지 못했습니다. 브라우저 쿠키 설정을 확인 후 다시 시도해주세요.`;
  }

  if (authError === "social_profile_fetch_failed") {
    return `${providerLabel} 로그인 후 사용자 정보를 가져오지 못했습니다. 다시 시도해주세요.`;
  }

  if (authError === "social_login_failed") {
    return `${providerLabel} 로그인 처리 중 서버 오류가 발생했습니다. 백엔드 로그를 확인해주세요.`;
  }

  if (authError === "Authorization code is required") {
    return `${providerLabel} 로그인 승인 코드가 전달되지 않았습니다. 다시 시도해주세요.`;
  }

  if (authError?.includes("social login is not configured")) {
    return `${providerLabel} 소셜 로그인 설정이 완료되지 않았습니다. 서버 환경변수를 확인해주세요.`;
  }

  if (authError?.includes("Failed to exchange")) {
    return `${providerLabel} 인증 토큰 교환에 실패했습니다. 소셜 앱 설정의 Redirect URI를 확인해주세요.`;
  }

  if (authError?.includes("Failed to fetch")) {
    return `${providerLabel} 사용자 프로필 조회에 실패했습니다. 소셜 제공자 동의 항목과 앱 권한을 확인해주세요.`;
  }

  if (authError === "Invalid social login payload") {
    return `${providerLabel}에서 필수 사용자 정보를 받지 못했습니다. 동의 항목과 계정 정보를 확인해주세요.`;
  }

  if (authError === "Kakao email consent is required") {
    return "카카오 이메일 제공 동의가 필요합니다. 카카오 로그인 동의항목에서 이메일 제공에 동의해주세요.";
  }

  if (authError) {
    return `${providerLabel} 로그인에 실패했습니다. 사유: ${authError}`;
  }

  return `${providerLabel} 로그인에 실패했습니다. 다시 시도해주세요.`;
};

const validateLoginForm = (form) => {
  if (!form.email.trim()) {
    return "이메일을 입력해주세요.";
  }

  if (!isValidEmail(form.email)) {
    return "올바른 이메일 형식으로 입력해주세요.";
  }

  if (!form.password) {
    return "비밀번호를 입력해주세요.";
  }

  return "";
};

const validateRegisterForm = (form) => {
  if (!form.email.trim()) {
    return "이메일을 입력해주세요.";
  }

  if (!isValidEmail(form.email)) {
    return "올바른 이메일 형식으로 입력해주세요.";
  }

  if (!form.password) {
    return "비밀번호를 입력해주세요.";
  }

  if (form.password.length < 8) {
    return "비밀번호는 8자 이상이어야 합니다.";
  }

  if (!form.passwordCheck) {
    return "비밀번호 확인을 입력해주세요.";
  }

  if (form.password !== form.passwordCheck) {
    return "비밀번호 확인이 일치하지 않습니다.";
  }

  if (!form.nickname.trim()) {
    return "닉네임을 입력해주세요.";
  }

  if (!form.phone.trim()) {
    return "전화번호를 입력해주세요.";
  }

  return "";
};

const useAuthActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const fallbackPath = location.state?.from || "/";

  const submitLogin = async (form, setError) => {
    const validationMessage = validateLoginForm(form);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setError("");
      const response = await api.post("/auth/login", form);
      const payload = normalizeAuthPayload(response.data.data);
      persistAuth(payload);
      dispatch(login(payload));
      navigate(fallbackPath);
    } catch (error) {
      console.error("[auth][login] request failed", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
      });
      setError(getAuthErrorMessage(error, "로그인에 실패했습니다."));
    }
  };

  const submitRegister = async (form, setError) => {
    const validationMessage = validateRegisterForm(form);

    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    try {
      setError("");
      const response = await api.post("/auth/register", {
        email: form.email,
        password: form.password,
        name: form.nickname,
        phone: form.phone,
      });
      const payload = normalizeAuthPayload(response.data.data);
      persistAuth(payload);
      dispatch(login(payload));
      navigate(fallbackPath);
    } catch (error) {
      console.error("[auth][register] request failed", {
        message: error.message,
        code: error.code,
        status: error.response?.status,
        data: error.response?.data,
        payload: {
          email: form.email,
          nickname: form.nickname,
          phone: form.phone,
        },
      });
      setError(getAuthErrorMessage(error, "회원가입에 실패했습니다."));
    }
  };

  return { submitLogin, submitRegister };
};

const socialProviders = [
  { provider: "kakao", label: "카카오 로그인", icon: kakao },
  { provider: "naver", label: "네이버 로그인", icon: naver },
  { provider: "google", label: "구글 로그인", icon: google },
];

const getSocialAuthUrl = (provider) => {
  const apiBaseUrl = (api.defaults.baseURL || "http://localhost:8081/api").replace(/\/$/, "");
  return `${apiBaseUrl}/auth/${provider}`;
};

const startSocialLogin = (provider) => {
  window.location.assign(getSocialAuthUrl(provider));
};

const SocialLoginButtons = ({ onSocialLogin = startSocialLogin }) => (
  <div className="social-icons">
    {socialProviders.map((item) => (
      <button
        key={item.provider}
        type="button"
        className="social-icon-button"
        aria-label={item.label}
        onClick={() => onSocialLogin(item.provider)}
      >
        <img src={item.icon} alt="" />
      </button>
    ))}
  </div>
);

const MobileLogin = ({
  onShowRegister,
  loginForm,
  setLoginForm,
  onSubmit,
  error,
  onSocialLogin,
}) => {
  return (
    <>
      <section className="mobile-login">
        <h2>로그인</h2>
        <form onSubmit={onSubmit}>
          <div className="input-container">
            <div className="inputBox">
              <img src={user} alt="icon" />
              <input
                type="email"
                placeholder="이메일을 입력하세요."
                name="email"
                value={loginForm.email}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </div>
            <div className="inputBox">
              <img src={lock} alt="icon" />
              <input
                type="password"
                placeholder="비밀번호를 입력해주세요"
                name="password"
                value={loginForm.password}
                onChange={(event) =>
                  setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                }
              />
            </div>
          </div>
          {error ? <p className="auth-error-message">{error}</p> : null}
          <div className="button-container">
            <button className="button-base" type="submit">
              로그인
            </button>
            <button type="button" onClick={onShowRegister} className="button-reverse">
              회원가입
            </button>
            <p>계정을 잊어버리셨나요?</p>
          </div>
        </form>
        <div className="social-container">
          <div className="social">
            <hr />
            <p>소셜로그인</p>
            <hr />
          </div>
          <SocialLoginButtons onSocialLogin={onSocialLogin} />
        </div>
      </section>
    </>
  );
};
const MobileRegister = ({
  onShowLogin,
  registerForm,
  setRegisterForm,
  onSubmit,
  error,
  onSocialLogin,
}) => {
  return (
    <>
      <section className="mobile-register">
        <h2>회원가입</h2>
        <form onSubmit={onSubmit}>
          <div className="input-container">
            <div className="inputBox">
              <img src={user} alt="icon" />
              <input
                type="email"
                placeholder="이메일을 입력해주세요"
                name="email"
                value={registerForm.email}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                }
              />
            </div>
            <div className="inputBox">
              <img src={lock} alt="icon" />
              <input
                type="password"
                placeholder="비밀번호를 입력하세요"
                name="password"
                value={registerForm.password}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                }
              />
            </div>
            <div className="inputBox">
              <img src={lock} alt="icon" />
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                name="passwordCheck"
                value={registerForm.passwordCheck}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, passwordCheck: event.target.value }))
                }
              />
            </div>
            <div className="inputBox">
              <img src={lock} alt="icon" />
              <input
                type="text"
                placeholder="닉네임을 입력하세요"
                name="nickname"
                value={registerForm.nickname}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, nickname: event.target.value }))
                }
              />
            </div>
            <div className="inputBox">
              <img src={lock} alt="icon" />
              <input
                type="text"
                placeholder="전화번호를 입력하세요"
                name="phone"
                value={registerForm.phone}
                onChange={(event) =>
                  setRegisterForm((prev) => ({ ...prev, phone: event.target.value }))
                }
              />
            </div>
          </div>
          {error ? <p className="auth-error-message">{error}</p> : null}
          <div className="button-container">
            <button onClick={onShowLogin} className="button-reverse" type="button">
              로그인
            </button>
            <button type="submit" className="button-base">
              회원가입
            </button>
            <p>계정을 잊어버리셨나요?</p>
          </div>
        </form>
        <div className="social-container">
          <div className="social">
            <hr />
            <p>소셜로그인</p>
            <hr />
          </div>
          <SocialLoginButtons onSocialLogin={onSocialLogin} />
        </div>
      </section>
    </>
  );
};
const PcLogin = ({ initialMode = "login" }) => {
  const [isSignUp, setIsSignUp] = useState(initialMode === "register");
  const [loginForm, setLoginForm] = useState(defaultLoginForm);
  const [registerForm, setRegisterForm] = useState(defaultRegisterForm);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const { submitLogin, submitRegister } = useAuthActions();

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    await submitLogin(loginForm, setLoginError);
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    await submitRegister(registerForm, setRegisterError);
  };

  return (
    <section className="pc">
      <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
        <div className="form-container sign-up-container">
          <form onSubmit={handleRegisterSubmit}>
            <h1 className="form-title">회원가입</h1>
            <div className="input-container">
              <div className="inputBox">
                <img src={user} alt="icon" />
                <input
                  type="email"
                  placeholder="이메일을 입력해주세요"
                  name="email"
                  value={registerForm.email}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </div>
              <div className="inputBox">
                <img src={lock} alt="icon" />
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요"
                  name="password"
                  value={registerForm.password}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </div>
              <div className="inputBox">
                <img src={lock} alt="icon" />
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  name="passwordCheck"
                  value={registerForm.passwordCheck}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({
                      ...prev,
                      passwordCheck: event.target.value,
                    }))
                  }
                />
              </div>
              <div className="inputBox">
                <img src={lock} alt="icon" />
                <input
                  type="text"
                  placeholder="닉네임을 입력하세요"
                  name="nickname"
                  value={registerForm.nickname}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, nickname: event.target.value }))
                  }
                />
              </div>
              <div className="inputBox">
                <img src={lock} alt="icon" />
                <input
                  type="text"
                  placeholder="전화번호를 입력하세요"
                  name="phone"
                  value={registerForm.phone}
                  onChange={(event) =>
                    setRegisterForm((prev) => ({ ...prev, phone: event.target.value }))
                  }
                />
              </div>
            </div>
            {registerError ? <p className="auth-error-message">{registerError}</p> : null}
            <button type="submit">회원가입</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form onSubmit={handleLoginSubmit}>
            <h1 className="form-title">로그인</h1>
            <div className="input-container">
              <div className="inputBox">
                <img src={user} alt="icon" />
                <input
                  type="email"
                  placeholder="이메일을 입력하세요."
                  name="email"
                  value={loginForm.email}
                  onChange={(event) =>
                    setLoginForm((prev) => ({ ...prev, email: event.target.value }))
                  }
                />
              </div>
              <div className="inputBox">
                <img src={user} alt="icon" />
                <input
                  type="password"
                  placeholder="비밀번호를 입력하세요."
                  name="password"
                  value={loginForm.password}
                  onChange={(event) =>
                    setLoginForm((prev) => ({ ...prev, password: event.target.value }))
                  }
                />
              </div>
            </div>
            {loginError ? <p className="auth-error-message">{loginError}</p> : null}
            <div className="button-container">
              <a href="#">계정을 잊어버리셨나요?</a>
              <button type="submit" className="button-base">
                로그인
              </button>
            </div>
            <div className="social-container">
              <div className="social">
                <hr />
                <p>소셜로그인</p>
                <hr />
              </div>
              <SocialLoginButtons />
            </div>
          </form>
        </div>
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <div className="overlay-title">
                <h1>다시 만나서 반가워요!</h1>
                <p>로그인하고 맞춤 쇼핑을 이어가세요</p>
              </div>
              <button
                type="button"
                className="ghost button-reverse"
                onClick={() => setIsSignUp(false)}
              >
                로그인
              </button>
            </div>
            <div className="overlay-panel overlay-right">
              <div className="overlay-title">
                <h1>환영해요!</h1>
                <p>간단한 정보 입력으로 시작해보세요.</p>
              </div>
              <button
                type="button"
                className="ghost button-reverse"
                onClick={() => setIsSignUp(true)}
              >
                회원가입
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Login({ initialMode = "login" }) {
  const location = useLocation();
  const [isRegister, setIsRegister] = useState(initialMode === "register");
  const [loginForm, setLoginForm] = useState(defaultLoginForm);
  const [registerForm, setRegisterForm] = useState(defaultRegisterForm);
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const { submitLogin, submitRegister } = useAuthActions();

  const handleMobileLoginSubmit = async (event) => {
    event.preventDefault();
    await submitLogin(loginForm, setLoginError);
  };

  const handleMobileRegisterSubmit = async (event) => {
    event.preventDefault();
    await submitRegister(registerForm, setRegisterError);
  };

  useEffect(() => {
    if (location.state?.authError) {
      const providerLabelMap = {
        kakao: "카카오",
        google: "구글",
        naver: "네이버",
      };
      const provider = location.state?.authProvider;
      const providerLabel = providerLabelMap[provider] || "소셜";
      const authError = location.state?.authError;

      setLoginError(getSocialAuthErrorMessage(providerLabel, authError));
    }
  }, [location.state]);

  return (
    <>
      <div className="mobile-only">
        {isRegister ? (
          <MobileRegister
            onShowLogin={() => setIsRegister(false)}
            registerForm={registerForm}
            setRegisterForm={setRegisterForm}
            onSubmit={handleMobileRegisterSubmit}
            error={registerError}
            onSocialLogin={startSocialLogin}
          />
        ) : (
          <MobileLogin
            onShowRegister={() => setIsRegister(true)}
            loginForm={loginForm}
            setLoginForm={setLoginForm}
            onSubmit={handleMobileLoginSubmit}
            error={loginError}
            onSocialLogin={startSocialLogin}
          />
        )}
      </div>
      <PcLogin initialMode={initialMode} />
    </>
  );
}
