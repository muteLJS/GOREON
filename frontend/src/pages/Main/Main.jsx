import "./Main.scss";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";
import "swiper/css";
import AICharacter from "components/AICharacter/AICharacter";
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
import CartIconButton from "components/CartIconButton/CartIconButton";
import WishlistIconButton from "components/WishlistIconButton/WishlistIconButton";
import EventModal from "components/EventModal/EventModal";
import Cart_straight from "assets/icons/cart-straight.svg";
import LikeCircle from "components/Likecircle/Likecircle";

const MAIN_PRODUCT_ID = 1;
const MAIN_PRODUCT_IMAGE =
  "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png";
const MAIN_PACKAGE_IMAGE =
  "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/recommend_img.png";

const createMainProduct = ({ name, title, price, image, spec }) => ({
  id: MAIN_PRODUCT_ID,
  name: name ?? title ?? "상품명",
  price,
  image: image ?? MAIN_PRODUCT_IMAGE,
  spec,
});

function Main() {
  const [showAiResult, setShowAiResult] = useState(false);
  const [isAiSwitching, setIsAiSwitching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("direct");
  const [selectedSpecProduct, setSelectedSpecProduct] = useState(null);
  const [selectedUpdateIndex, setSelectedUpdateIndex] = useState(0);
  const [isDesktopCategory, setIsDesktopCategory] = useState(false);
  const [isTabletCategory, setIsTabletCategory] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(true);
  const [categorySwiperState, setCategorySwiperState] = useState({
    progress: 0,
    thumbWidth: 25,
  });
  const aiSwitchTimeoutRef = useRef(null);
  const categorySwiperRef = useRef(null);
  const categoryProgressRef = useRef(null);
  const categoryProgressFrameRef = useRef(null);
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
      price: "￦ 2,419,000",
      specs: [
        { label: "CPU", value: "인텔 코어 i5 14400F" },
        { label: "RAM", value: "16 GB" },
        { label: "VGA", value: "RTX 5060" },
        { label: "OS", value: "Window 11 (home)" },
        { label: "모니터", value: "FHD / 144 Hz" },
      ],
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
      price: "￦ 1,989,000",
      specs: [
        { label: "CPU", value: "Intel Core Ultra 7" },
        { label: "RAM", value: "16 GB LPDDR5x" },
        { label: "VGA", value: "Intel Arc Graphics" },
        { label: "OS", value: "Window 11 (home)" },
        { label: "모니터", value: "WQXGA / OLED" },
      ],
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
      price: "￦ 2,699,000",
      specs: [
        { label: "CPU", value: "AMD Ryzen AI 9 HX" },
        { label: "RAM", value: "32 GB" },
        { label: "VGA", value: "RTX 4060" },
        { label: "OS", value: "Window 11 (home)" },
        { label: "모니터", value: "4K / OLED" },
      ],
    },
  ];
  const selectedUpdateItem = updateSubItems[selectedUpdateIndex] ?? updateSubItems[0];
  const updateMobileItems = [
    {
      name: "MacBook Pro 14 M3",
      price: "￦2,419,000",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png",
      specs: [
        { label: "CPU", value: "M3 8코어 (8-Core, 10 GPU)" },
        { label: "RAM", value: "8GB 통합 메모리" },
        { label: "저장장치", value: "512GB SSD" },
        { label: "디스플레이", value: '14.2" Liquid Retina XDR' },
      ],
    },
    {
      name: "LG gram Pro 16",
      price: "￦1,989,000",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png",
      specs: [
        { label: "CPU", value: "Intel Core Ultra 7" },
        { label: "RAM", value: "16GB LPDDR5x" },
        { label: "저장장치", value: "512GB NVMe SSD" },
        { label: "디스플레이", value: '16" WQXGA OLED' },
      ],
    },
    {
      name: "ASUS ProArt P16",
      price: "￦2,699,000",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png",
      specs: [
        { label: "CPU", value: "AMD Ryzen AI 9 HX" },
        { label: "RAM", value: "32GB LPDDR5x" },
        { label: "저장장치", value: "1TB SSD" },
        { label: "디스플레이", value: '16" 4K OLED' },
      ],
    },
    {
      name: "Galaxy Book5 Pro 360",
      price: "￦1,799,000",
      image: "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png",
      specs: [
        { label: "CPU", value: "Intel Core Ultra 7" },
        { label: "RAM", value: "16GB 메모리" },
        { label: "저장장치", value: "512GB SSD" },
        { label: "디스플레이", value: '16" AMOLED 터치' },
      ],
    },
  ];
  const categoryItemsMap = {
    direct: [
      {
        name: "MacBook Pro 14 M3",
        price: "￦2,419,000",
        tags: ["#안정성", "#파이널컷", "#프리미어"],
      },
      {
        name: "LG gram Pro 16",
        price: "￦1,989,000",
        tags: ["#대화면", "#휴대성", "#영상편집입문"],
      },
      { name: "ASUS ProArt P16", price: "￦2,699,000", tags: ["#OLED", "#크리에이터", "#색감"] },
      {
        name: "Galaxy Book5 Pro 360",
        price: "￦1,799,000",
        tags: ["#터치", "#펜입력", "#멀티작업"],
      },
      { name: "iPad Air 13", price: "￦1,249,000", tags: ["#썸네일", "#가벼움", "#M시리즈"] },
      { name: "Surface Laptop 7", price: "￦1,699,000", tags: ["#업무겸용", "#배터리", "#슬림"] },
    ],
    game: [
      { name: "ROG Zephyrus G14", price: "￦2,299,000", tags: ["#게이밍", "#RTX", "#고주사율"] },
      { name: "Lenovo Legion 5i", price: "￦1,949,000", tags: ["#FPS", "#발열관리", "#가성비"] },
      { name: "OMEN 16", price: "￦1,899,000", tags: ["#144Hz", "#고성능", "#몰입감"] },
      { name: "Alienware m16", price: "￦2,899,000", tags: ["#프리미엄", "#QHD", "#RGB"] },
      { name: "MSI Katana 17", price: "￦1,659,000", tags: ["#17인치", "#RTX4060", "#입문게이밍"] },
      { name: "AORUS 15", price: "￦2,099,000", tags: ["#e스포츠", "#반응속도", "#성능"] },
    ],
    student: [
      { name: "LG gram 15", price: "￦1,589,000", tags: ["#가벼움", "#문서작업", "#배터리"] },
      { name: "Galaxy Book4", price: "￦1,129,000", tags: ["#대학생", "#휴대성", "#필기연동"] },
      {
        name: "MacBook Air 13 M3",
        price: "￦1,590,000",
        tags: ["#조용함", "#과제", "#오래가는배터리"],
      },
      {
        name: "ASUS Vivobook 15",
        price: "￦899,000",
        tags: ["#가성비", "#온라인강의", "#첫노트북"],
      },
      { name: "Surface Go 4", price: "￦879,000", tags: ["#태블릿겸용", "#필기", "#이동수업"] },
      { name: "Acer Swift Go 14", price: "￦1,099,000", tags: ["#휴대성", "#리포트", "#실속형"] },
    ],
    together: [
      { name: "Galaxy Tab S10", price: "￦632,000", tags: ["#큰글씨", "#영상통화", "#쉬운사용"] },
      { name: "iPad 11세대", price: "￦529,000", tags: ["#직관적", "#가족공유", "#안정성"] },
      { name: "LG 스탠바이미 Go", price: "￦1,179,000", tags: ["#큰화면", "#OTT", "#간편이동"] },
      { name: "갤럭시 A35", price: "￦449,000", tags: ["#쉬운UI", "#카메라", "#가성비"] },
      { name: "아이뮤즈 뮤패드", price: "￦289,000", tags: ["#입문형", "#유튜브", "#실속형"] },
      { name: "레노버 Tab Plus", price: "￦399,000", tags: ["#스피커", "#OTT", "#간편사용"] },
    ],
  };
  const categoryItems = categoryItemsMap[selectedCategory];
  const aiResultItems = [
    {
      name: "갤럭시 탭 S10",
      spec: "128/256GB, WiFi,그레이",
      price: "632,000원",
      image:
        "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/product_detail_main_img.png",
    },
    {
      name: "갤럭시 탭 S10",
      spec: "128/256GB, WiFi,그레이",
      price: "632,000원",
      image:
        "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/product_detail_main_img.png",
    },
    {
      name: "갤럭시 탭 S10",
      spec: "128/256GB, WiFi,그레이",
      price: "632,000원",
      image:
        "https://raw.githubusercontent.com/muteLJS/goreon-assets/main/product_detail_main_img.png",
    },
  ];
  const handleInput = (e) => {
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  const handleCategorySwiperChange = (swiper, progressValue) => {
    if (!swiper || swiper.destroyed || !swiper.params) {
      return;
    }

    const visibleSlides =
      typeof swiper.params.slidesPerView === "number" ? swiper.params.slidesPerView : 1;
    const clampedVisibleSlides = Math.min(visibleSlides, categoryItems.length);
    const maxIndex = Math.max(categoryItems.length - clampedVisibleSlides, 0);
    const activeIndex = swiper.params.loop ? swiper.realIndex : swiper.activeIndex;
    const rawProgress =
      typeof progressValue === "number"
        ? progressValue
        : typeof swiper.progress === "number"
          ? swiper.progress
          : maxIndex === 0
            ? 0
            : Math.min(activeIndex, maxIndex) / maxIndex;
    const nextProgress = Math.max(0, Math.min(rawProgress, 1));
    const nextThumbWidth = (clampedVisibleSlides / categoryItems.length) * 100 * 0.78;

    setCategorySwiperState({
      progress: nextProgress,
      thumbWidth: nextThumbWidth,
    });
  };

  const getCategorySwiperProgress = (swiper) => {
    if (!swiper || swiper.destroyed || !Array.isArray(swiper.slidesGrid)) {
      return typeof swiper?.progress === "number" ? swiper.progress : 0;
    }

    const translate = -swiper.getTranslate();
    const slidesGrid = swiper.slidesGrid;
    let slideIndex = swiper.activeIndex ?? 0;

    for (let index = 0; index < slidesGrid.length - 1; index += 1) {
      if (translate >= slidesGrid[index] && translate < slidesGrid[index + 1]) {
        slideIndex = index;
        break;
      }
    }

    const currentStart = slidesGrid[slideIndex] ?? 0;
    const nextStart = slidesGrid[slideIndex + 1] ?? currentStart + 1;
    const distance = Math.max(nextStart - currentStart, 1);
    const intraSlideProgress = Math.max(0, Math.min((translate - currentStart) / distance, 1));
    const slideEl = swiper.slides?.[slideIndex];
    const realIndexFromSlide = Number(slideEl?.getAttribute("data-swiper-slide-index"));
    const realIndex = Number.isFinite(realIndexFromSlide)
      ? realIndexFromSlide
      : swiper.params.loop
        ? swiper.realIndex
        : slideIndex;

    return ((realIndex + intraSlideProgress) % categoryItems.length) / categoryItems.length;
  };

  const moveCategorySwiperByProgress = (progress) => {
    const swiper = categorySwiperRef.current;

    if (!swiper || swiper.destroyed) {
      return;
    }

    const clampedProgress = Math.max(0, Math.min(progress, 1));
    const targetIndex = Math.round(clampedProgress * Math.max(categoryItems.length - 1, 0));

    if (swiper.params.loop && typeof swiper.slideToLoop === "function") {
      swiper.slideToLoop(targetIndex, 300);
    } else {
      swiper.slideTo(targetIndex, 300);
    }

    if (swiper.autoplay) {
      swiper.autoplay.start();
    }
  };

  const handleCategoryProgressPointerDown = (event) => {
    const progressBar = categoryProgressRef.current;

    if (!progressBar) {
      return;
    }

    const updateFromPointer = (pointerEvent) => {
      const rect = progressBar.getBoundingClientRect();
      const progress = rect.width === 0 ? 0 : (pointerEvent.clientX - rect.left) / rect.width;
      moveCategorySwiperByProgress(progress);
    };

    const handlePointerMove = (pointerEvent) => {
      updateFromPointer(pointerEvent);
    };

    const handlePointerUp = () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };

    event.preventDefault();
    updateFromPointer(event);
    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);
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

      if (categoryProgressFrameRef.current) {
        window.cancelAnimationFrame(categoryProgressFrameRef.current);
      }
    },
    [],
  );

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 1024px)");
    const tabletQuery = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");

    const syncScreenState = () => {
      setIsDesktopCategory(desktopQuery.matches);
      setIsTabletCategory(tabletQuery.matches);
    };

    syncScreenState();

    const addListener = (query, handler) => {
      if (query.addEventListener) {
        query.addEventListener("change", handler);
      } else {
        query.addListener(handler);
      }
    };

    const removeListener = (query, handler) => {
      if (query.removeEventListener) {
        query.removeEventListener("change", handler);
      } else {
        query.removeListener(handler);
      }
    };

    addListener(desktopQuery, syncScreenState);
    addListener(tabletQuery, syncScreenState);

    return () => {
      removeListener(desktopQuery, syncScreenState);
      removeListener(tabletQuery, syncScreenState);
    };
  }, []);

  useEffect(() => {
    const swiper = categorySwiperRef.current;
    if (!swiper || swiper.destroyed || !swiper.params) {
      return;
    }

    if (!isDesktopCategory && swiper.autoplay) {
      swiper.autoplay.stop();
    }

    if (swiper.params.loop && typeof swiper.slideToLoop === "function") {
      swiper.slideToLoop(0, 0, false);
    } else {
      swiper.slideTo(0, 0, false);
    }

    swiper.update();
    handleCategorySwiperChange(swiper);
  }, [isDesktopCategory, selectedCategory, categoryItems.length]);

  useEffect(() => {
    if (categoryProgressFrameRef.current) {
      window.cancelAnimationFrame(categoryProgressFrameRef.current);
      categoryProgressFrameRef.current = null;
    }

    if (!isDesktopCategory) {
      return undefined;
    }

    const tick = () => {
      const swiper = categorySwiperRef.current;

      if (swiper && !swiper.destroyed) {
        handleCategorySwiperChange(swiper, getCategorySwiperProgress(swiper));
      }

      categoryProgressFrameRef.current = window.requestAnimationFrame(tick);
    };

    categoryProgressFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (categoryProgressFrameRef.current) {
        window.cancelAnimationFrame(categoryProgressFrameRef.current);
        categoryProgressFrameRef.current = null;
      }
    };
  }, [isDesktopCategory, selectedCategory, categoryItems.length]);

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
          <AICharacter className="AI_logo" />
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

  const renderCategoryCard = (item) => (
    <div className="items pointer" key={item.name}>
      <div className="item_img_box">
        <img
          src="https://raw.githubusercontent.com/muteLJS/goreon-assets/main/new_img.png"
          alt="items"
          className="item_img"
        />
        <div className="icons">
          <button type="button" aria-label={`${item.name} 장바구니 담기`}>
            <img src={Cart_straight} alt="" />
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
  );

  const renderCategoryItems = () => {
    const isDesktop = isDesktopCategory;

    return (
      <>
        <Swiper
          key={`category-swiper-${selectedCategory}-${
            isDesktop ? "desktop" : isTabletCategory ? "tablet" : "mobile"
          }`}
          className="item_box category_swiper"
          modules={isDesktop ? [Autoplay, FreeMode] : undefined}
          spaceBetween={isDesktop ? 20 : isTabletCategory ? 24 : 16}
          slidesPerView={isDesktop ? 3.1 : isTabletCategory ? 3.1 : 2.1}
          allowTouchMove={true}
          grabCursor={isDesktop}
          loop={isDesktop}
          speed={isDesktop ? 6500 : 300}
          freeMode={isDesktop ? { enabled: true, momentum: false } : false}
          autoplay={
            isDesktop
              ? {
                  delay: 0,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false,
                }
              : false
          }
          onSwiper={(swiper) => {
            categorySwiperRef.current = swiper;
            handleCategorySwiperChange(swiper);
          }}
          onSlideChange={handleCategorySwiperChange}
          onProgress={handleCategorySwiperChange}
        >
          {categoryItems.map((item) => (
            <SwiperSlide key={item.name}>{renderCategoryCard(item)}</SwiperSlide>
          ))}
        </Swiper>
        <div
          className={`unfilled ${isDesktop ? "unfilled--desktop" : ""}`}
          ref={categoryProgressRef}
          onPointerDown={handleCategoryProgressPointerDown}
          role="slider"
          aria-label="목적별 추천 카테고리 위치"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(categorySwiperState.progress * 100)}
          tabIndex={0}
        >
          <div
            className={`filled ${isDesktop ? "filled--desktop" : ""}`}
            style={{
              width: `${categorySwiperState.thumbWidth}%`,
              left: `calc((100% - ${categorySwiperState.thumbWidth}%) * ${categorySwiperState.progress})`,
            }}
          ></div>
        </div>
      </>
    );
  };

  const renderPackageCards = () => (
    <>
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
    </>
  );

  const renderPackageSectionItems = () => {
    if (isDesktopCategory) {
      return <div className="pakage_boxs">{renderPackageCards()}</div>;
    }

    return (
      <Swiper
        className="pakage_boxs pakage_swiper"
        slidesPerView="auto"
        spaceBetween={isTabletCategory ? 28 : 24}
      >
        {[packageItems, packageItems.slice(0, 1), packageItems.slice(0, 2)].map(
          (detailItems, index) => (
            <SwiperSlide key={`package-${index}`}>
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
                detailItems={detailItems}
              />
            </SwiperSlide>
          ),
        )}
      </Swiper>
    );
  };

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
            <AICharacter className="AI_logo" />
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
        data-hide-floating-chat
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
              <input
                type="radio"
                id="direct"
                name="category"
                className="hidden"
                checked={selectedCategory === "direct"}
                onChange={() => setSelectedCategory("direct")}
              />
              <label htmlFor="direct" className="category category_1 pointer">
                <img src={Direct} alt="direct" />
                <p>영상 편집</p>
              </label>
              <input
                type="radio"
                id="game"
                name="category"
                className="hidden"
                checked={selectedCategory === "game"}
                onChange={() => setSelectedCategory("game")}
              />
              <label htmlFor="game" className="category category_2 pointer">
                <img src={Game} alt="game" />
                <p>게이밍</p>
              </label>
              <input
                type="radio"
                id="student"
                name="category"
                className="hidden"
                checked={selectedCategory === "student"}
                onChange={() => setSelectedCategory("student")}
              />
              <label htmlFor="student" className="category category_3 pointer">
                <img src={Book} alt="student" />
                <p>학생</p>
              </label>
              <input
                type="radio"
                id="together"
                name="category"
                className="hidden"
                checked={selectedCategory === "together"}
                onChange={() => setSelectedCategory("together")}
              />
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
            {categoryItems.map((item) => {
              const product = createMainProduct({ ...item, image: MAIN_PRODUCT_IMAGE });

              return (
                <SwiperSlide key={item.name}>
                  <div className="items pointer">
                    <div className="item_img_box">
                      <img src={MAIN_PRODUCT_IMAGE} alt="items" className="item_img" />
                      <div className="icons">
                        <CartIconButton product={product} />
                        <WishlistIconButton product={product} />
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
              );
            })}
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
          {renderPackageSectionItems()}
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
                  src={selectedUpdateItem.image}
                  alt={selectedUpdateItem.title}
                  className="pakage_img"
                />
              </div>
              <div className="modal_info">
                <div className="options">
                  {selectedUpdateItem.specs.map((spec) => (
                    <div className="option" key={spec.label}>
                      <p>{spec.label}</p>
                      <p className="item_info">{spec.value}</p>
                    </div>
                  ))}
                  <div className="option">
                    <p>가격</p>
                    <p className="item_info">{selectedUpdateItem.price}</p>
                  </div>
                </div>
                <div className="icons">
                  <CartIconButton
                    product={createMainProduct({
                      title: "영상편집 패키지",
                      price: "￦ 2,419,000",
                      image: MAIN_PACKAGE_IMAGE,
                    })}
                  />
                  <WishlistIconButton
                    product={createMainProduct({
                      title: "영상편집 패키지",
                      price: "￦ 2,419,000",
                      image: MAIN_PACKAGE_IMAGE,
                    })}
                  />
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
                  isActive={selectedUpdateIndex === index}
                  onClick={() => setSelectedUpdateIndex(index)}
                />
              ))}
            </div>
          </div>
          <div className="mobile">
            <div className="item_boxs">
              {[0, 2].map((startIndex) => (
                <div className="item_row" key={`update-mobile-row-${startIndex}`}>
                  {updateMobileItems.slice(startIndex, startIndex + 2).map((item) => (
                    <div className="item_box" key={item.name}>
                      <div className="items">
                        <div className="item_img_box">
                          <img src={item.image} alt={item.name} className="item_img" />
                          <div className="icons">
                            <button type="button" aria-label={`${item.name} 장바구니 담기`}>
                              <img src={Cart_straight} alt="" />
                            </button>
                            <LikeCircle />
                          </div>
                        </div>
                        <div className="item_texts">
                          <p className="item_name">{item.name}</p>
                          <p className="item_price">{item.price}</p>
                          <button
                            type="button"
                            className="item_spec"
                            onClick={() => setSelectedSpecProduct(item)}
                          >
                            주요스펙
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <EventModal isOpen={isEventModalOpen} onClose={() => setIsEventModalOpen(false)} />
    </main>
  );
}

export default Main;
