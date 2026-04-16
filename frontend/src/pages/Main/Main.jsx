<<<<<<< Updated upstream
import "./Main.scss";

function Main() {
=======
﻿import "./Main.scss";
import AI_Logo from "assets/logo/ai/character.svg";
import Review_user from "assets/Icons/review_user.svg";
import Book from "assets/Icons/main/book.svg";
import Cart from "assets/Icons/main/cart.svg";
import Direct from "assets/Icons/main/direct.svg";
import Game from "assets/Icons/main/game.svg";
import Lighting from "assets/Icons/main/lighting.svg";
import Like from "assets/Icons/main/like.svg";
import Together from "assets/Icons/main/together.svg";
import More from "components/more/More";
import Rating from "@/components/Rating/Rating";

import LikeCircle from "components/like/like_circle";
import Cart_straight from "assets/Icons/cart-straight.svg";

function Main() {
  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

>>>>>>> Stashed changes
  return (
    <main className="main-page">
      <section className="main-page__section">
        <div className="section__AI sections">
          <div className="AI_description">
            <button>AI 전자기기 추천 서비스</button>
            <p>
              복잡한 스펙비교,
              <br /> 이제 <span className="input">AI 고르미</span>에게
              <br /> 맡기세요
            </p>
            <p>
              용도 · 예산 · 사용환경을 말하면
              <br /> 수천 개의 제품 중 딱 맞는 전자기기를 골라드려요
              <div className="br">어려운 스펙 설명 없이, 쉽고 빠르게.</div>
            </p>
          </div>
          <img src="assets/logo/ai/characters.svg" alt="AI_logo" />
        </div>
        <div className="AI_chat">
          <form action="#" method="POST">
            <div className=""></div>
          </form>
        </div>
      </section>
      <section className="main-page__section">
<<<<<<< Updated upstream
        <div className="section__AI_Review sections" />
=======
        <div className="section__AI_Review sections">
          <div className="text_box">
            <h2>AI 추천 제품 실제 구매 리뷰</h2>
            <h4>고르미의 추천을 받고 구매한 고객들의 생생한 리뷰입니다.</h4>
          </div>
          <div className="review_box">
            <div className="review_main">
              <div className="AI_box">
                <div className="user_info">
                  <img src={Review_user} alt="review_user_img" />
                  <p className="user_name">User**6*</p>
                </div>
                <div className="stars" aria-label="별점 5점">
                  <Rating rating={5} />
                </div>
              </div>
              <p className="item_name">갤럭시 탭 S10</p>
              <p className="description">
                고르미가 “RAM 6GB면 충분한 이유”를 어르신 눈높이에서 설명해줬어요. <br />
                처음엔 아이패드랑 고민했는데 안드로이즈가 더 익숙하실 거라는 포인트가 정확했습니다.
                부모님도 잘 쓰고 계세요!
              </p>
            </div>
            <div className="review_main">
              <div className="AI_box">
                <div className="user_info">
                  <img src={Review_user} alt="review_user_img" />
                  <p className="user_name">User**6*</p>
                </div>
                <div className="stars" aria-label="별점 5점">
                  <Rating rating={5} />
                </div>
              </div>
              <p className="item_name">갤럭시 탭 S10</p>
              <p className="description">
                고르미가 “RAM 6GB면 충분한 이유”를 어르신 눈높이에서 설명해줬어요. <br />
                처음엔 아이패드랑 고민했는데 안드로이즈가 더 익숙하실 거라는 포인트가 정확했습니다.
                부모님도 잘 쓰고 계세요!
              </p>
            </div>
            <div className="review_main">
              <div className="AI_box">
                <div className="user_info">
                  <img src={Review_user} alt="review_user_img" />
                  <p className="user_name">User**6*</p>
                </div>
                <div className="stars" aria-label="별점 5점">
                  <Rating rating={5} />
                </div>
              </div>
              <p className="item_name">갤럭시 탭 S10</p>
              <p className="description">
                고르미가 “RAM 6GB면 충분한 이유”를 어르신 눈높이에서 설명해줬어요. <br />
                처음엔 아이패드랑 고민했는데 안드로이즈가 더 익숙하실 거라는 포인트가 정확했습니다.
                부모님도 잘 쓰고 계세요!
              </p>
            </div>
          </div>
        </div>
>>>>>>> Stashed changes
      </section>
      <section className="main-page__section">
        <div className="section__Set_Category sections" />
      </section>
      <section className="main-page__section">
        <div className="section__Collarborates sections" />
      </section>
      <section className="main-page__section">
        <div className="section__New_Update sections" />
      </section>
    </main>
  );
}

export default Main;
