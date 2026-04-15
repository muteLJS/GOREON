import "./Main.scss";
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

import LikeCircle from "components/like/like_circle";
import Cart_straight from "assets/Icons/cart-straight.svg";

function Main() {
  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const renderStar = (index) => (
    <svg key={index} viewBox="0 0 9 9" aria-hidden="true">
      <path d="M4.88.72c-.04-.07-.09-.12-.16-.16A.43.43 0 0 0 4.5.5a.43.43 0 0 0-.38.22 12.06 12.06 0 0 0-.91 2.12.49.49 0 0 1-.46.33c-.64.02-1.27.08-1.9.19a.43.43 0 0 0-.23.69 14.5 14.5 0 0 0 1.52 1.28c.16.12.23.33.17.52-.24.71-.4 1.44-.5 2.19-.05.33.31.57.62.41.62-.32 1.21-.68 1.77-1.1a.51.51 0 0 1 .6 0c.56.42 1.15.78 1.77 1.1.31.16.67-.08.63-.41a12.88 12.88 0 0 0-.5-2.19.5.5 0 0 1 .16-.52 14.45 14.45 0 0 0 1.52-1.28.43.43 0 0 0-.23-.69 12.67 12.67 0 0 0-1.9-.19.49.49 0 0 1-.45-.33A12.06 12.06 0 0 0 4.88.72Z" />
    </svg>
  );

  return (
    <main className="main-page">
      <h1 className="hidden">메인 페이지</h1>
      <section className="main-page__section">
        <div className="section__AI sections">
          <div className="AI_container">
            <div className="AI_description">
              <button>
                <div className="circle"></div>AI 전자기기 추천 서비스
              </button>
              <h2 className="AI_Main_text">
                복잡한 스펙 비교,
                <br /> 이제 <span className="input">AI 고르미</span>에게
                <br /> 맡기세요
              </h2>
              <p className="AI_sub_text">
                용도 · 예산 · 사용환경을 말하면
                <br /> 수천 개의 제품 중 딱 맞는 전자기기를 골라드려요
                <br />
                어려운 스펙 설명 없이, 쉽고 빠르게.
              </p>
              <div className="AI_Chat_row_2">
                <button>🎬 유튜브용 편집용 노트북</button>
                <button>🎮 FPS 게임에 맞는 모니터</button>
                <button>📚 대학생 첫 노트북 50만원 이하</button>
                <button>👨‍👩‍👦 부모님 쉽게 쓸 테블릿</button>
                <button>🖨 가정용 프린터 추천</button>
              </div>
            </div>
            <img src={AI_Logo} alt="AI_logo" className="AI_logo" />
          </div>
          <div className="AI_chat_container">
            <form action="#" method="POST">
              <div className="AI_Chat_row_1">
                <textarea
                  name="ai_chat"
                  id="ai_chat"
                  rows={1}
                  placeholder="무엇이든 물어보세요!"
                  onInput={handleInput}
                />
                <button>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="green">
                    <circle cx="12" cy="12" r="12" fill="#0AA6A6" />
                    <path
                      d="M8 13L12 9L16 13"
                      stroke="white"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>
              <div className="AI_Chat_row_2">
                <button>🎬 유튜브용 편집용 노트북</button>
                <button>🎮 FPS 게임에 맞는 모니터</button>
                <button>📚 대학생 첫 노트북 50만원 이하</button>
                <button>👨‍👩‍👦 부모님 쉽게 쓸 테블릿</button>
                <button>🖨 가정용 프린터 추천</button>
              </div>
            </form>
          </div>
        </div>
      </section>
      <section className="main-page__section">
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
                  {[...Array(5)].map((_, index) => renderStar(index))}
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
                  {[...Array(5)].map((_, index) => renderStar(index))}
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
                  {[...Array(5)].map((_, index) => renderStar(index))}
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
      </section>
      <section className="main-page__section">
        <div className="section__Set_Category sections">
          <div className="category_top">
            <h2>목적별 추천 카테고리</h2>
            <h4>어떤 용도로 사용하시나요? 목적에 맞는 제품을 바로 찾아드려요</h4>
            <More />
          </div>
          <div className="categories">
            <form action="#">
              <input type="radio" id="direct" name="category" className="hidden" checked />
              <label htmlFor="direct" className="category category_1">
                <img src={Direct} alt="direct" />
                <p>영상 편집</p>
              </label>
              <input type="radio" id="game" name="category" className="hidden" />
              <label htmlFor="game" className="category category_2">
                <img src={Game} alt="game" />
                <p>게이밍</p>
              </label>
              <input type="radio" id="student" name="category" className="hidden" />
              <label htmlFor="student" className="category category_3">
                <img src={Book} alt="student" />
                <p>학생</p>
              </label>
              <input type="radio" id="together" name="category" className="hidden" />
              <label htmlFor="together" className="category category_4">
                <img src={Together} alt="together" />
                <p>부모님</p>
              </label>
            </form>
          </div>
          <div className="item_box">
            <div className="items">
              <div className="item_img_box">
                <img
                  src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png"
                  alt="items"
                  className="item_img"
                />
                <div className="icons">
                  <button>
                    <img src={Cart_straight} alt="cart" />
                  </button>
                  <LikeCircle />
                </div>
              </div>
              <p className="item_name">MacBook Pro 14 M3</p>
              <div className="options">
                <p>#안정성</p>
                <p>#파이널컷</p>
                <p>#프리미어</p>
              </div>
              <p className="item_price">￦2,419,000</p>
              <div className="item_colors">
                <div className="color1 colors"></div>
                <div className="color2 colors"></div>
              </div>
            </div>
            <div className="items">
              <div className="item_img_box">
                <img
                  src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png"
                  alt="items"
                  className="item_img"
                />
                <div className="icons">
                  <button>
                    <img src={Cart_straight} alt="cart" />
                  </button>
                  <LikeCircle />
                </div>
              </div>
              <p className="item_name">MacBook Pro 14 M3</p>
              <div className="options">
                <p>#안정성</p>
                <p>#파이널컷</p>
                <p>#프리미어</p>
              </div>
              <p className="item_price">￦2,419,000</p>
              <div className="item_colors">
                <div className="color1 colors"></div>
                <div className="color2 colors"></div>
              </div>
            </div>
            <div className="items">
              <div className="item_img_box">
                <img
                  src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png"
                  alt="items"
                  className="item_img"
                />
                <div className="icons">
                  <button>
                    <img src={Cart_straight} alt="cart" />
                  </button>
                  <LikeCircle />
                </div>
              </div>
              <p className="item_name">MacBook Pro 14 M3</p>
              <div className="options">
                <p>#안정성</p>
                <p>#파이널컷</p>
                <p>#프리미어</p>
              </div>
              <p className="item_price">￦2,419,000</p>
              <div className="item_colors">
                <div className="color1 colors"></div>
                <div className="color2 colors"></div>
              </div>
            </div>
          </div>
          <div className="unfilled">
            <div className="filled"></div>
          </div>
        </div>
      </section>
      <section className="main-page__section">
        <div className="section__Collarborates sections">
          <div className="texts">
            <h2>추천 조합</h2>
            <h4>함께 사면 시너지 효과가 큰 제품 세트를 고르미가 골라드려요</h4>
          </div>
          <div className="pakage_boxs">
            <div className="pakage_box">
              <div className="pakage_big">
                <img
                  src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/recommend_img.png"
                  alt="pakage_img"
                  className="pakage_img"
                />
                <div className="pakage_texts">
                  <p>영상편집 패키지</p>
                  <p className="gray_text">
                    큰 화면, 직관적 UI <br />
                    영상통화 · 유튜브에 딱 맞게
                  </p>
                  <div className="pakage_bottom">
                    <p>￦ 2,419,000</p>
                    <div className="icons">
                      <button>
                        <img src={Cart_straight} alt="cart" />
                      </button>
                      <LikeCircle className="like-circle--sm" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pakage_small">
                <div className="pakage_inner">
                  <div className="pakage_img_box">
                    <img
                      src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/cart_item_img.png"
                      alt=""
                    />
                  </div>
                  <div className="pakage_item">
                    <p>CPU</p>
                    <p className="gray_text">인텔 코어i5-14세대 14400F</p>
                    <p className="gray_text">(랩터레이크 리프레시) (밸류팩 정품)</p>
                  </div>
                </div>
                <div className="pakage_inner">
                  <div className="pakage_img_box">
                    <img
                      src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/cart_item_img.png"
                      alt=""
                    />
                  </div>
                  <div className="pakage_item">
                    <p>CPU</p>
                    <p className="gray_text">인텔 코어i5-14세대 14400F</p>
                    <p className="gray_text">(랩터레이크 리프레시) (밸류팩 정품)</p>
                  </div>
                </div>{" "}
                <div className="pakage_inner">
                  <div className="pakage_img_box">
                    <img
                      src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/cart_item_img.png"
                      alt=""
                    />
                  </div>
                  <div className="pakage_item">
                    <p>CPU</p>
                    <p className="gray_text">인텔 코어i5-14세대 14400F</p>
                    <p className="gray_text">(랩터레이크 리프레시) (밸류팩 정품)</p>
                  </div>
                </div>{" "}
                <div className="pakage_inner">
                  <div className="pakage_img_box">
                    <img
                      src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/cart_item_img.png"
                      alt=""
                    />
                  </div>
                  <div className="pakage_item">
                    <p>CPU</p>
                    <p className="gray_text">인텔 코어i5-14세대 14400F</p>
                    <p className="gray_text">(랩터레이크 리프레시) (밸류팩 정품)</p>
                  </div>
                </div>
              </div>
              <div className="chevron" aria-hidden="true">
                <svg viewBox="0 0 24 12">
                  <path d="M2 10L12 2L22 10" />
                </svg>
              </div>
            </div>
            <div className="pakage_box">
              <div className="pakage_big">
                <img
                  src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/recommend_img.png"
                  alt="pakage_img"
                  className="pakage_img"
                />
                <div className="pakage_texts">
                  <p>영상편집 패키지</p>
                  <p className="gray_text">
                    큰 화면, 직관적 UI <br />
                    영상통화 · 유튜브에 딱 맞게
                  </p>
                  <div className="pakage_bottom">
                    <p>￦ 2,419,000</p>
                    <div className="icons">
                      <button>
                        <img src={Cart_straight} alt="cart" />
                      </button>
                      <LikeCircle className="like-circle--sm" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="pakage_small">
                <div className="pakage_inner">
                  <div className="pakage_img_box">
                    <img
                      src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/cart_item_img.png"
                      alt=""
                    />
                  </div>
                  <div className="pakage_item">
                    <p>CPU</p>
                    <p className="gray_text">인텔 코어i5-14세대 14400F</p>
                    <p className="gray_text">(랩터레이크 리프레시) (밸류팩 정품)</p>
                  </div>
                </div>
              </div>
              <div className="chevron" aria-hidden="true">
                <svg viewBox="0 0 24 12">
                  <path d="M2 10L12 2L22 10" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="main-page__section">
        <div className="section__New_Update sections">
          <div className="category_top">
            <h2>최신 업데이트 상품</h2>
            <h4>새로 입고된 신제품과 업데이트된 상품이에요</h4>
            <More />
          </div>
          <div className="item_boxs">
            <div className="item_row">
              <div className="item_box">
                <div className="items">
                  <div className="item_img_box">
                    <img
                      src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png"
                      alt="items"
                      className="item_img"
                    />
                    <div className="icons">
                      <button>
                        <img src={Cart_straight} alt="cart" />
                      </button>
                      <LikeCircle />
                    </div>
                  </div>
                  <div className="item_texts">
                    <p className="item_name">MacBook Pro 14 M3</p>
                    <p className="item_price">￦2,419,000</p>
                    <p className="item_spec">주요스펙</p>
                  </div>
                </div>
              </div>
              <div className="item_box">
                <div className="items">
                  <div className="item_img_box">
                    <img
                      src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png"
                      alt="items"
                      className="item_img"
                    />
                    <div className="icons">
                      <button>
                        <img src={Cart_straight} alt="cart" />
                      </button>
                      <LikeCircle />
                    </div>
                  </div>
                  <div className="item_texts">
                    <p className="item_name">MacBook Pro 14 M3</p>
                    <p className="item_price">￦2,419,000</p>
                    <p className="item_spec">주요스펙</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="item_row">
              <div className="item_box">
                <div className="items">
                  <div className="item_img_box">
                    <img
                      src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png"
                      alt="items"
                      className="item_img"
                    />
                    <div className="icons">
                      <button>
                        <img src={Cart_straight} alt="cart" />
                      </button>
                      <LikeCircle />
                    </div>
                  </div>
                  <div className="item_texts">
                    <p className="item_name">MacBook Pro 14 M3</p>
                    <p className="item_price">￦2,419,000</p>
                    <p className="item_spec">주요스펙</p>
                  </div>
                </div>
              </div>
              <div className="item_box">
                <div className="items">
                  <div className="item_img_box">
                    <img
                      src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png"
                      alt="items"
                      className="item_img"
                    />
                    <div className="icons">
                      <button>
                        <img src={Cart_straight} alt="cart" />
                      </button>
                      <LikeCircle />
                    </div>
                  </div>
                  <div className="item_texts">
                    <p className="item_name">MacBook Pro 14 M3</p>
                    <p className="item_price">￦2,419,000</p>
                    <p className="item_spec">주요스펙</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Main;
