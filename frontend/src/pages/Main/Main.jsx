import "./Main.scss";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import AI_Logo from "assets/logo/ai/character.svg";
import Review_user from "assets/Icons/review_user.svg";
import Book from "assets/Icons/main/book.svg";
import Direct from "assets/Icons/main/direct.svg";
import Game from "assets/Icons/main/game.svg";
import Lighting from "assets/Icons/main/lighting.svg";
import Together from "assets/Icons/main/together.svg";
import More from "components/more/More";
import PackageCard from "components/PackageCard/PackageCard";
import PromptButtonList from "components/PromptButtonList/PromptButtonList";
import ReviewCard from "components/ReviewCard/ReviewCard";
import UpdateSubCard from "components/UpdateSubCard/UpdateSubCard";
import EventModal from "components/EventModal/EventModal";

import LikeCircle from "components/like/like_circle";
import Cart_straight from "assets/Icons/cart-straight.svg";

function Main() {
  const [showAiResult, setShowAiResult] = useState(false);
  const [isAiSwitching, setIsAiSwitching] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(true);
  const [categorySwiperState, setCategorySwiperState] = useState({
    progress: 0,
    thumbWidth: 25,
  });
  const aiSwitchTimeoutRef = useRef(null);
  const promptItems = [
    "🎬 유튜브용 편집용 노트북",
    "🎮 FPS 게임에 맞는 모니터",
    "📚 대학생 첫 노트북 50만원 이하",
    "👨‍👩‍👦 부모님 쉽게 쓸 테블릿",
    "🖨 가정용 프린터 추천",
  ];
  const reviewDescription = (
    <>
      고르미가 “RAM 6GB면 충분한 이유”를 어르신 눈높이에서 설명해줬어요. <br />
      처음엔 아이패드랑 고민했는데 안드로이즈가 더 익숙하실 거라는 포인트가 정확했습니다. 부모님도
      잘 쓰고 계세요!
    </>
  );
  const packageItems = [
    {
      label: "CPU",
      title: "인텔 코어i5-14세대 14400F",
      subtitle: "(랩터레이크 리프레시) (밸류팩 정품)",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/cart_item_img.png",
    },
    {
      label: "CPU",
      title: "인텔 코어i5-14세대 14400F",
      subtitle: "(랩터레이크 리프레시) (밸류팩 정품)",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/cart_item_img.png",
    },
    {
      label: "CPU",
      title: "인텔 코어i5-14세대 14400F",
      subtitle: "(랩터레이크 리프레시) (밸류팩 정품)",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/cart_item_img.png",
    },
    {
      label: "CPU",
      title: "인텔 코어i5-14세대 14400F",
      subtitle: "(랩터레이크 리프레시) (밸류팩 정품)",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/cart_item_img.png",
    },
  ];
  const updateSubItems = [
    {
      title: "영상편집 패키지",
      description: (
        <>
          큰 화면, 직관적 UI <br />
          영상통화 · 유튜브에 딱 맞게
        </>
      ),
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/recommend_img.png",
    },
    {
      title: "영상편집 패키지",
      description: (
        <>
          큰 화면, 직관적 UI <br />
          영상통화 · 유튜브에 딱 맞게
        </>
      ),
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/recommend_img.png",
    },
    {
      title: "영상편집 패키지",
      description: (
        <>
          큰 화면, 직관적 UI <br />
          영상통화 · 유튜브에 딱 맞게
        </>
      ),
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/recommend_img.png",
    },
  ];
  const categoryItems = [
    {
      name: "MacBook Pro 14 M3",
      price: "￦2,419,000",
      tags: ["#안정성", "#파이널컷", "#프리미어"],
    },
    {
      name: "LG gram Pro 16",
      price: "￦1,989,000",
      tags: ["#휴대성", "#대학생", "#문서작업"],
    },
    {
      name: "ROG Zephyrus G14",
      price: "￦2,299,000",
      tags: ["#게이밍", "#고성능", "#RTX"],
    },
    {
      name: "Galaxy Book5 Pro 360",
      price: "￦1,799,000",
      tags: ["#터치", "#필기", "#OLED"],
    },
    {
      name: "iPad Air 13",
      price: "￦1,249,000",
      tags: ["#크리에이티브", "#휴대성", "#M시리즈"],
    },
    {
      name: "Surface Laptop 7",
      price: "￦1,699,000",
      tags: ["#업무용", "#가벼움", "#배터리"],
    },
  ];
  const aiResultItems = [
    {
      name: "갤럭시 탭 S10",
      spec: "128/256GB, WiFi,그레이",
      price: "632,000원",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/product_detail_main_img.png",
    },
    {
      name: "갤럭시 탭 S10",
      spec: "128/256GB, WiFi,그레이",
      price: "632,000원",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/product_detail_main_img.png",
    },
    {
      name: "갤럭시 탭 S10",
      spec: "128/256GB, WiFi,그레이",
      price: "632,000원",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/product_detail_main_img.png",
    },
  ];
  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleCategorySwiperChange = (swiper) => {
    const visibleSlides =
      typeof swiper.params.slidesPerView === "number" ? swiper.params.slidesPerView : 1;
    const clampedVisibleSlides = Math.min(visibleSlides, categoryItems.length);
    const maxIndex = Math.max(categoryItems.length - clampedVisibleSlides, 0);
    const nextProgress = maxIndex === 0 ? 0 : swiper.activeIndex / maxIndex;
    const nextThumbWidth = (clampedVisibleSlides / categoryItems.length) * 100 * 0.78;

    setCategorySwiperState({
      progress: nextProgress,
      thumbWidth: nextThumbWidth,
    });
  };

  const handleAiSubmit = (e) => {
    e.preventDefault();
    if (showAiResult) {
      return;
    }
    setIsAiSwitching(true);
    setShowAiResult(true);
    aiSwitchTimeoutRef.current = window.setTimeout(() => {
      setIsAiSwitching(false);
      aiSwitchTimeoutRef.current = null;
    }, 650);
  };

  useEffect(
    () => () => {
      if (aiSwitchTimeoutRef.current) {
        window.clearTimeout(aiSwitchTimeoutRef.current);
      }
    },
    [],
  );

  const renderAiReviewSection = () => (
    <section className="main-page__section main-page__section--ai-review">
      <div className="back back--ai-review" />
      <div className="section__AI_Review sections section__AI_Review--revealed">
        <div className="text_box">
          <h2>AI 추천 제품 실제 구매 리뷰</h2>
          <h4>고르미의 추천을 받고 구매한 고객들의 생생한 리뷰입니다.</h4>
        </div>
        <div className="review_box">
          <ReviewCard
            userImage={Review_user}
            userName="User**6*"
            productName="갤럭시 탭 S10"
            description={reviewDescription}
          />
          <ReviewCard
            userImage={Review_user}
            userName="User**6*"
            productName="갤럭시 탭 S10"
            description={reviewDescription}
          />
          <ReviewCard
            userImage={Review_user}
            userName="User**6*"
            productName="갤럭시 탭 S10"
            description={reviewDescription}
          />
        </div>
      </div>
    </section>
  );

  const renderInitialAiSection = (isLeaving = false) => (
    <div className={`ai-stage__layer ai-stage__layer--initial ${isLeaving ? "is-leaving" : ""}`}>
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
              <PromptButtonList items={promptItems} />
            </div>
          </div>
          <img src={AI_Logo} alt="AI_logo" className="AI_logo" />
        </div>
        <div className="AI_chat_container">
          <form action="#" method="POST" onSubmit={handleAiSubmit}>
            <div className="AI_Chat_row_1">
              <textarea
                name="ai_chat"
                id="ai_chat"
                rows={1}
                placeholder="무엇이든 물어보세요!"
                onInput={handleInput}
              />
              <button className="submit" type="submit">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              <PromptButtonList items={promptItems} variant="result" />
              <button className="submit" type="submit">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#0AA6A6" />
                  <path
                    d="M13 22L20 15L27 22"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );

  const renderResultAiSection = (isEntering = false) => (
    <div className={`ai-stage__layer ai-stage__layer--result ${isEntering ? "is-entering" : ""}`}>
      <div className="section__AI_result sections">
        <Swiper
          className="recommends"
          slidesPerView={1.4}
          spaceBetween={12}
          breakpoints={{
            768: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
            1024: {
              slidesPerView: 3,
              spaceBetween: 24,
            },
          }}
        >
          {aiResultItems.map((item, index) => (
            <SwiperSlide key={`ai-result-${index}`}>
              <div className="recommend">
                <img src={item.image} alt="" />
                <div className="texts">
                  <p>{item.name}</p>
                  <p>{item.spec}</p>
                </div>
                <div className="go">
                  <p className="price">{item.price}</p>
                  <div className="chevron" aria-hidden="true">
                    <svg viewBox="0 0 24 12">
                      <path d="M2 10L12 2L22 10" />
                    </svg>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
        <div className="AI_chat_response">
          <img src={Lighting} alt="Lighting" />
          <p>대학생에게 인기 있는 가벼운 노트북 3가지를 추천해드릴게요</p>
        </div>
        <div className="AI_chat_container">
          <form action="#" method="POST" onSubmit={handleAiSubmit}>
            <div className="AI_Chat_row_1">
              <textarea
                name="ai_chat"
                id="ai_chat"
                rows={1}
                placeholder="대학생용 가벼운 노트북 추천해줘."
                onInput={handleInput}
              />
            </div>
            <div className="AI_Chat_row_2">
              <PromptButtonList items={promptItems} />
              <button className="submit" type="submit">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                  <circle cx="20" cy="20" r="20" fill="#0AA6A6" />
                  <path
                    d="M13 22L20 15L27 22"
                    stroke="white"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </form>
          <div className="AI_container">
            <img src={AI_Logo} alt="AI_logo" className="AI_logo" />
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <main className="main-page">
      <h1 className="hidden">메인 페이지</h1>
      <section
        className={`main-page__section main-page__section--ai ${
          showAiResult ? "is-ai-result" : "is-ai-initial"
        } ${isAiSwitching ? "is-ai-switching" : ""}`}
      >
        <div className={`back ${showAiResult ? "back--ai-result" : "back--ai"}`} />
        <div className="ai-stage">
          {!showAiResult || isAiSwitching ? renderInitialAiSection(isAiSwitching) : null}
          {showAiResult ? renderResultAiSection(isAiSwitching) : null}
        </div>
      </section>
      {showAiResult ? renderAiReviewSection() : null}
      <section className="main-page__section">
        <div className="back back--set-category" />
        <div className="section__Set_Category sections">
          <div className="category_top">
            <div className="main-texts">
              <h2>목적별 추천 카테고리</h2>
              <h4>어떤 용도로 사용하시나요? 목적에 맞는 제품을 바로 찾아드려요</h4>
            </div>
            <More />
          </div>
          <div className="categories">
            <form action="#">
              <input type="radio" id="direct" name="category" className="hidden" defaultChecked />
              <label htmlFor="direct" className="category category_1 pointer">
                <img src={Direct} alt="direct" />
                <p>영상 편집</p>
              </label>
              <input type="radio" id="game" name="category" className="hidden" />
              <label htmlFor="game" className="category category_2 pointer">
                <img src={Game} alt="game" />
                <p>게이밍</p>
              </label>
              <input type="radio" id="student" name="category" className="hidden" />
              <label htmlFor="student" className="category category_3 pointer">
                <img src={Book} alt="student" />
                <p>학생</p>
              </label>
              <input type="radio" id="together" name="category" className="hidden" />
              <label htmlFor="together" className="category category_4 pointer">
                <img src={Together} alt="together" />
                <p>부모님</p>
              </label>
            </form>
          </div>
          <Swiper
            className="item_box category_swiper"
            spaceBetween={6}
            slidesPerView={2.1}
            onSwiper={handleCategorySwiperChange}
            onSlideChange={handleCategorySwiperChange}
            breakpoints={{
              1024: {
                slidesPerView: 3.1,
                spaceBetween: 20,
              },
            }}
          >
            {categoryItems.map((item) => (
              <SwiperSlide key={item.name}>
                <div className="items pointer">
                  <div className="item_img_box">
                    <img
                      src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png"
                      alt="items"
                      className="item_img"
                    />
                    <div className="icons">
                      <button type="button">
                        <img src={Cart_straight} alt="cart" />
                      </button>
                      <LikeCircle />
                    </div>
                  </div>
                  <p className="item_name">{item.name}</p>
                  <div className="options">
                    {item.tags.map((tag) => (
                      <p key={tag}>{tag}</p>
                    ))}
                  </div>
                  <p className="item_price">{item.price}</p>
                  <div className="item_colors">
                    <div className="color1 colors"></div>
                    <div className="color2 colors"></div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          <div className="unfilled">
            <div
              className="filled"
              style={{
                width: `${categorySwiperState.thumbWidth}%`,
                left: `calc((100% - ${categorySwiperState.thumbWidth}%) * ${categorySwiperState.progress})`,
              }}
            ></div>
          </div>
        </div>
      </section>
      <section className="main-page__section">
        <div className="back back--collaborates" />
        <div className="section__Collarborates sections">
          <div className="category_top">
            <div className="texts">
              <h2>추천 조합</h2>
              <h4>함께 사면 시너지 효과가 큰 제품 세트를 고르미가 골라드려요</h4>
            </div>
            <More className="more--desktop-only" />
          </div>
          <div className="pakage_boxs">
            <PackageCard
              title="영상편집 패키지"
              description={
                <>
                  큰 화면, 직관적 UI <br />
                  영상통화 · 유튜브에 딱 맞게
                </>
              }
              price="￦ 2,419,000"
              mainImage="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/recommend_img.png"
              detailItems={packageItems}
            />
            <PackageCard
              title="영상편집 패키지"
              description={
                <>
                  큰 화면, 직관적 UI <br />
                  영상통화 · 유튜브에 딱 맞게
                </>
              }
              price="￦ 2,419,000"
              mainImage="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/recommend_img.png"
              detailItems={packageItems.slice(0, 1)}
            />
            <PackageCard
              title="영상편집 패키지"
              description={
                <>
                  큰 화면, 직관적 UI <br />
                  영상통화 · 유튜브에 딱 맞게
                </>
              }
              price="￦ 2,419,000"
              mainImage="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/recommend_img.png"
              detailItems={packageItems.slice(0, 2)}
            />
          </div>
        </div>
      </section>
      <section className="main-page__section">
        <div className="back back--new-update" />
        <div className="section__New_Update sections">
          <div className="category_top">
            <h2>최신 업데이트 상품</h2>
            <h4>새로 입고된 신제품과 업데이트된 상품이에요</h4>
            <More />
          </div>
          <div className="desktop">
            <div className="main_item">
              <div className="back_img">
                <img
                  src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/recommend_img.png"
                  alt="pakage_img"
                  className="pakage_img"
                />
              </div>
              <div className="modal_info">
                <div className="options">
                  <div className="option">
                    <p>CPU</p>
                    <p className="item_info">인텔 코어 i5 14400F</p>
                  </div>
                  <div className="option">
                    <p>RAM</p>
                    <p className="item_info">16 GB</p>
                  </div>
                  <div className="option">
                    <p>VGA</p>
                    <p className="item_info">RTX 5060</p>
                  </div>
                  <div className="option">
                    <p>OS</p>
                    <p className="item_info">Window 11 (home)</p>
                  </div>
                  <div className="option">
                    <p>모니터</p>
                    <p className="item_info">FHD / 144 Hz</p>
                  </div>
                  <div className="option">
                    <p>가격</p>
                    <p className="item_info">￦ 2,419,000</p>
                  </div>
                </div>
                <div className="icons">
                  <button>
                    <img src={Cart_straight} alt="cart" />
                  </button>
                  <LikeCircle />
                </div>
              </div>
            </div>
            <div className="sub_item">
              {updateSubItems.map((item, index) => (
                <UpdateSubCard
                  key={`update-sub-${index}`}
                  image={item.image}
                  title={item.title}
                  description={item.description}
                />
              ))}
            </div>
          </div>
          <div className="mobile">
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
                        <LikeCircle className="like-circle--sm" />
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
                        <LikeCircle className="like-circle--sm" />
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
        </div>
      </section>

      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />
    </main>
  );
}

export default Main;
