import "./ProductDetail.scss";
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

﻿import "./ProductDetail.scss";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ReviewSection from "../../components/ReviewSection/ReviewSection";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice";
import LikeBefore from "../../assets/icons/like-before.svg";
import LikeAfter from "../../assets/icons/like-after.svg";
import ChevronDown from "../../assets/icons/chevron-down.svg";
import { getProductDetailById } from "../../data/products";

const formatPrice = (price) => `₩${price.toLocaleString("ko-KR")}`;

import ReviewSection from "../../components/ReviewSection/ReviewSection";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice";

import ProductHeroImage from "../../assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";
import DetailImage from "../../assets/img/intel-core-ultra5-250kf-plus-detail-description-genuine.jpg";
import LifestyleImage from "../../assets/img/amd-ryzen5-7400f-raphael-detail-description.jpg";
import LikeBefore from "../../assets/icons/like-before.svg";
import LikeAfter from "../../assets/icons/like-after.svg";

const defaultProduct = {
  id: "1",
  brand: "Intel Core Ultra 5",
  title: "인텔 코어 Ultra5 250KF Plus 정품",
  subtitle: "게이밍과 작업을 한 번에 잡는 차세대 퍼포먼스",
  shortDescription:
    "최신 세대 아키텍처 기반의 퍼포먼스로 게임, 스트리밍, 멀티태스킹까지 폭넓게 대응하는 데스크톱 CPU입니다.",
  price: 389000,
  rating: 4.8,
  reviewCount: 214,
  photoCount: 29,
  shipping: "평일 오후 2시 이전 주문 시 당일 출고",
  heroImage: ProductHeroImage,
  promoImage: DetailImage,
  secondaryImage: LifestyleImage,
  gallery: [
    ProductHeroImage,
    ProductHeroImage,
    ProductHeroImage,
    ProductHeroImage,
    ProductHeroImage,
  ],
  options: [
    { id: "box", label: "정품 박스", price: 389000 },
    { id: "tray", label: "벌크 / 트레이", price: 359000 },
  ],
  keyPoints: [
    {
      title: "높은 멀티코어 효율",
      body: "게임 실행 중에도 방송 송출과 백그라운드 작업을 안정적으로 처리하기 좋은 구성을 지향합니다.",
    },
    {
      title: "체감되는 반응 속도",
      body: "앱 실행, 프로젝트 빌드, 파일 압축 같은 반복 작업에서도 경쾌한 응답감을 기대할 수 있습니다.",
    },
    {
      title: "업그레이드 친화성",
      body: "메인스트림 조립 PC에 자연스럽게 어울려 게이밍부터 생산성 작업까지 폭넓게 구성할 수 있습니다.",
    },
  ],
  specs: [
    ["소켓", "LGA 1851"],
    ["코어 구성", "고성능 + 고효율 하이브리드"],
    ["용도", "게이밍 / 작업 / 스트리밍"],
    ["패키지", "정품 박스 / 벌크 선택 가능"],
    ["보증", "정품 기준 공식 유통 보증"],
    ["권장 조합", "DDR5 메모리 / 최신 메인보드"],
  ],
  reviews: [
    {
      id: 1,
      author: "User**6",
      date: "2026.04.07",
      body: "게임 프레임 유지가 안정적이고 작업할 때도 버벅임이 적어서 만족합니다. 발열 관리만 잘해주면 체감 성능이 꽤 좋습니다.",
      images: [ProductHeroImage, ProductHeroImage, ProductHeroImage, ProductHeroImage],
    },
    {
      id: 2,
      author: "User**6",
      date: "2026.04.07",
      body: "빌드 시간도 줄고 게임 실행도 빨라져서 업그레이드 효과를 확실히 느꼈습니다. 정품 포장 상태도 깔끔했습니다.",
      images: [ProductHeroImage, ProductHeroImage, ProductHeroImage, ProductHeroImage],
    },
    {
      id: 3,
      author: "User**0",
      date: "2026.04.07",
      body: "멀티태스킹이 많아도 답답하지 않고, 고주사율 게임에서도 안정적인 편이었습니다. 작업용과 게임용을 같이 보는 분들께 괜찮습니다.",
      images: [ProductHeroImage, ProductHeroImage, ProductHeroImage, ProductHeroImage],
    },
    {
      id: 4,
      author: "User**8",
      date: "2026.04.07",
      body: "초기 세팅 후 전력 제한만 조금 잡아주니 훨씬 안정적으로 사용 중입니다. 체감상 전 세대보다 여유가 생긴 느낌입니다.",
      images: [ProductHeroImage, ProductHeroImage, ProductHeroImage, ProductHeroImage],
    },
    {
      id: 5,
      author: "User**1",
      date: "2026.04.07",
      body: "조립 PC 새로 맞추면서 선택했는데 병목 없이 잘 돌아갑니다. 게임이랑 영상 편집을 같이 하는 환경에서 만족도가 높습니다.",
      images: [ProductHeroImage, ProductHeroImage, ProductHeroImage, ProductHeroImage],
    },
  ],
};

const productCatalog = {
  default: defaultProduct,
  1: defaultProduct,
  2: {
    ...defaultProduct,
    id: "2",
    brand: "LG gram Pro 16",
    title: "LG gram Pro 16 고성능 노트북",
    subtitle: "이동성과 작업 효율을 함께 챙긴 크리에이터 노트북",
    shortDescription:
      "가벼운 무게와 긴 배터리, 넉넉한 화면 크기를 바탕으로 영상 편집과 문서 작업을 폭넓게 소화하기 좋은 노트북입니다.",
    price: 1899000,
    shipping: "평일 오후 3시 이전 주문 시 당일 출고",
    options: [
      { id: "standard", label: "기본 구성", price: 1899000 },
      { id: "upgrade", label: "메모리 업그레이드", price: 2099000 },
    ],
    keyPoints: [
      {
        title: "가벼운 휴대성",
        body: "강의실, 카페, 사무실을 자주 오가는 사용자에게 부담이 적은 무게와 두께를 제공합니다.",
      },
      {
        title: "넓은 작업 화면",
        body: "영상 편집 타임라인과 여러 창을 동시에 띄워도 답답하지 않도록 16형 화면 구성을 활용할 수 있습니다.",
      },
      {
        title: "실사용 배터리",
        body: "외부 전원이 없는 환경에서도 문서 작업과 가벼운 편집을 안정적으로 이어가기 좋은 사용 시간을 기대할 수 있습니다.",
      },
    ],
    specs: [
      ["디스플레이", "16형 고해상도 패널"],
      ["프로세서", "Intel Core Ultra 7"],
      ["그래픽", "RTX 3050"],
      ["메모리", "32GB"],
      ["저장장치", "1TB SSD"],
      ["특징", "휴대성 / 영상 편집 / 문서 작업"],
    ],
  },
};

const formatPrice = (price) => `W ${price.toLocaleString("ko-KR")}`;


function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const overviewRef = useRef(null);
  const reviewsRef = useRef(null);

  const product = getProductDetailById(id);
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);

  if (!product) {
    return (
      <main className="product-detail">
        <section className="product-detail__story">
          <h1 className="product-detail__title">상품을 찾을 수 없습니다.</h1>
          <p className="product-detail__feature-body">
            요청한 상품 id에 해당하는 목록 데이터가 없습니다.
          </p>
        </section>
      </main>
    );
  }

  useEffect(() => {
    setSelectedOptionId(product.options[0]?.id ?? "");
    setQuantity(1);
    setActiveTab("overview");
    setIsOverviewExpanded(false);
  }, [product.id]);

  const selectedOption =
    product.options.find((option) => option.id === selectedOptionId) || null;
  const displayOption = selectedOption || product.options[0];
  const totalPrice = displayOption.price * quantity;
  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id));
      return;
    }

    dispatch(
      addToWishlist({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.heroImage,
      }),
    );
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: `${product.id}-${displayOption.id}`,
        productId: product.id,
        name: product.title,
        option: displayOption.label,
        price: displayOption.price,
        image: product.heroImage,
        quantity,
      }),
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    navigate("/payment");
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    const targetRef = tab === "overview" ? overviewRef : reviewsRef;
    targetRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const renderTabs = () => (
    <div className="product-detail__tabs">
      <button
        type="button"
        className={activeTab === "overview" ? "is-active" : ""}
        onClick={() => handleTabClick("overview")}
      >
        상품 설명
      </button>
      <button
        type="button"
        className={activeTab === "reviews" ? "is-active" : ""}
        onClick={() => handleTabClick("reviews")}
      >
        리뷰
      </button>
    </div>
  );

  return (
    <main className="product-detail">
      <section className="product-detail__hero">
        <div className="product-detail__visual">
          <div className="product-detail__visual-frame">
            <img src={product.heroImage} alt={product.title} className="product-detail__hero-image" />

            <button
              type="button"
              className="product-detail__favorite"
              aria-label={isWishlisted ? "찜 해제" : "찜하기"}
              onClick={handleWishlistToggle}
            >
              <img
                src={isWishlisted ? LikeAfter : LikeBefore}
                alt=""
                className={`product-detail__favorite-icon ${
                  isWishlisted ? "is-active" : "is-idle"
                }`}
              />
            </button>
          </div>
        </div>

        <div className="product-detail__content">
          <h1 className="product-detail__title">{product.title}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
          <p className="product-detail__feature-body">{product.shortDescription}</p>

          <div className="product-detail__purchase-box">
            <label className="product-detail__field" aria-label="옵션명">
              <select
                value={selectedOptionId}
                onChange={(event) => setSelectedOptionId(event.target.value)}
              >
                <option value="" disabled>
                  옵션명
                </option>
                {product.options.map((option) => (
                  <option value={option.id} key={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="product-detail__selected">
              <p className="product-detail__selected-label">{displayOption.label}</p>

              <div className="product-detail__selected-controls">
                <div className="product-detail__quantity">
                  <button type="button" onClick={() => handleQuantityChange(-1)}>
                    -
                  </button>
                  <span>{quantity}</span>
                  <button type="button" onClick={() => handleQuantityChange(1)}>
                    +
                  </button>
                </div>

                <strong className="product-detail__selected-price">
                  {formatPrice(displayOption.price)}
                </strong>
              </div>
            </div>

            <div className="product-detail__total">
              <span>총 상품 금액</span>
              <strong>{formatPrice(totalPrice)}</strong>
            </div>

            <div className="product-detail__actions">
              <button
                type="button"
                className="product-detail__button product-detail__button--ghost"
                onClick={handleAddToCart}
              >
                장바구니 넣기
              </button>
              <button
                type="button"
                className="product-detail__button product-detail__button--primary"
                onClick={handleBuyNow}
              >
                바로 구매하기
              </button>
            </div>
          </div>
        </div>
      </section>

      {renderTabs()}

      <section className="product-detail__story" ref={overviewRef}>
        <div
          className={`product-detail__overview-preview ${
            isOverviewExpanded ? "is-expanded" : "is-collapsed"
          }`}
        >
          <div className="product-detail__overview-preview-inner">
            <article className="product-detail__story-hero">
              <div className="product-detail__story-copy">
                <p className="product-detail__story-eyebrow">강력한 성능, 더 넓어진 활용도</p>
                <h2>{product.brand}</h2>
                <p>{product.subtitle}</p>
              </div>
              <div className="product-detail__story-image">
                <img src={product.promoImage} alt={`${product.brand} 프로모션 이미지`} />
              </div>
            </article>

            <article className="product-detail__reason-block">
              <p className="product-detail__section-label">{product.brand}</p>
              <h3 className="product-detail__section-title">선택의 이유를 한눈에</h3>

              <div className="product-detail__reason-grid">
                {product.keyPoints.map((point) => (
                  <div className="product-detail__reason-card" key={point.title}>
                    <p className="product-detail__reason-title">{point.title}</p>
                    <p className="product-detail__reason-body">{point.body}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="product-detail__feature-card">
              <div className="product-detail__feature-copy">
                <p className="product-detail__section-label">실전 체감 성능</p>
                <h3 className="product-detail__section-title">
                  게임과 작업 모두를 고려한 메인스트림 선택
                </h3>
                <p className="product-detail__feature-body">
                  최신 그래픽카드와의 조합, 멀티태스킹, 장시간 사용 환경까지 고려해 균형감 있게
                  사용할 수 있는 퍼포먼스를 중심으로 정리했습니다.
                </p>
              </div>
              <div className="product-detail__feature-image">
                <img src={product.secondaryImage} alt={`${product.brand} 사용 이미지`} />
              </div>
            </article>

            <article className="product-detail__specs">
              <div className="product-detail__specs-header">
                <p className="product-detail__section-label">핵심 사양</p>
                <h3 className="product-detail__section-title">기본 정보</h3>
              </div>

              <div className="product-detail__spec-list">
                {product.specs.map(([label, value]) => (
                  <div className="product-detail__spec-row" key={label}>
                    <span>{label}</span>
                    <strong>{value}</strong>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>

        <button
          type="button"
          className="product-detail__overview-toggle"
          onClick={() => setIsOverviewExpanded((prev) => !prev)}
        >
          <span>{isOverviewExpanded ? "상세정보 접기" : "상세정보 더보기"}</span>
          <img
            src={ChevronDown}
            alt=""
            aria-hidden="true"
            className={`product-detail__overview-toggle-icon ${
              isOverviewExpanded ? "is-expanded" : ""
            }`}
          />
        </button>
      </section>

      <section className="product-detail__reviews" ref={reviewsRef}>
        <ReviewSection
          rating={product.rating}
          reviewCount={product.reviewCount}
          photoCount={product.photoCount}
          gallery={product.gallery}
          reviews={product.reviews}
        />
      </section>
    </main>
  );
}

export default ProductDetail;
