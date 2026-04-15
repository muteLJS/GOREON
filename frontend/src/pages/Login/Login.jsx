import "../../styles/_mixins.scss";
import "./Login.scss";
import user from "assets/icons/user.svg";
import lock from "assets/icons/lock.svg";
import kakao from "assets/icons/kakao.svg";
import naver from "assets/icons/naver.svg";
import google from "assets/icons/google.svg";
import { useState } from "react";

const MobileLogin = ({ onShowRegister }) => {
  return (
    <>
      <section className="mobile-login">
        <h2>로그인</h2>
        <form action="">
          <div className="input-container">
            <div className="inputBox">
              <img src={user} alt="icon" />
              <input type="text" placeholder="이메일을 입력하세요." name="email" />
            </div>
            <div className="inputBox">
              <img src={lock} alt="icon" />
              <input type="password" placeholder="비밀번호를 입력해주세요" name="password" />
            </div>
          </div>
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
          <div className="social-icons">
            <img src={kakao} alt="google" />
            <img src={naver} alt="facebook" />
            <img src={google} alt="kakao" />
          </div>
        </div>
      </section>
    </>
  );
};
const MobileRegister = ({ onShowLogin }) => {
  return (
    <>
      <section className="mobile-register">
        <h2>회원가입</h2>
        <form action="">
          <div className="input-container">
            <div className="inputBox">
              <img src={user} alt="icon" />
              <input type="email" placeholder="이메일을 입력해주세요" name="email" />
            </div>
            <div className="inputBox">
              <img src={lock} alt="icon" />
              <input type="password" placeholder="비밀번호를 입력하세요" name="password" />
            </div>
            <div className="inputBox">
              <img src={lock} alt="icon" />
              <input
                type="password"
                placeholder="비밀번호를 다시 입력하세요"
                name="passwordCheck"
              />
            </div>
            <div className="inputBox">
              <img src={lock} alt="icon" />
              <input type="text" placeholder="닉네임을 입력하세요" name="nickname" />
            </div>
            <div className="inputBox">
              <img src={lock} alt="icon" />
              <input type="text" placeholder="전화번호를 입력하세요" name="phone" />
            </div>
          </div>
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
          <div className="social-icons">
            <img src={kakao} alt="google" />
            <img src={naver} alt="facebook" />
            <img src={google} alt="kakao" />
          </div>
        </div>
      </section>
    </>
  );
};
const PcLogin = () => {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    <section className="pc">
      <div className={`container ${isSignUp ? "right-panel-active" : ""}`}>
        <div className="form-container sign-up-container">
          <form action="#">
            <h1 className="form-title">회원가입</h1>
            <div className="input-container">
              <div className="inputBox">
                <img src={user} alt="icon" />
                <input type="email" placeholder="이메일을 입력해주세요" name="email" />
              </div>
              <div className="inputBox">
                <img src={lock} alt="icon" />
                <input type="password" placeholder="비밀번호를 입력하세요" name="password" />
              </div>
              <div className="inputBox">
                <img src={lock} alt="icon" />
                <input
                  type="password"
                  placeholder="비밀번호를 다시 입력하세요"
                  name="passwordCheck"
                />
              </div>
              <div className="inputBox">
                <img src={lock} alt="icon" />
                <input type="text" placeholder="닉네임을 입력하세요" name="nickname" />
              </div>
              <div className="inputBox">
                <img src={lock} alt="icon" />
                <input type="text" placeholder="전화번호를 입력하세요" name="phone" />
              </div>
            </div>
            <button type="submit">회원가입</button>
          </form>
        </div>
        <div className="form-container sign-in-container">
          <form action="#">
            <h1 className="form-title">로그인</h1>
            <div className="input-container">
              <div className="inputBox">
                <img src={user} alt="icon" />
                <input type="text" placeholder="이메일을 입력하세요." name="email" />
              </div>
              <div className="inputBox">
                <img src={user} alt="icon" />
                <input type="password" placeholder="비밀번호를 입력하세요." name="password" />
              </div>
            </div>
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
              <div className="social-icons">
                <img src={kakao} alt="google" />
                <img src={naver} alt="facebook" />
                <img src={google} alt="kakao" />
              </div>
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

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  return (
    <>
      <div className="mobile-only">
        {isRegister ? (
          <MobileRegister onShowLogin={() => setIsRegister(false)} />
        ) : (
          <MobileLogin onShowRegister={() => setIsRegister(true)} />
        )}
      </div>
      <PcLogin />
    </>
  );
}
