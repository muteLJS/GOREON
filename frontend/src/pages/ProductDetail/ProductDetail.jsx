import "./ProductDetail.scss";
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
