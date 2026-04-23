import "./ProductDetail.scss";
import productList from "@/data/products_list.json";
import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import arrowIcon from "@/assets/icons/prev.svg";
import WishlistIconButton from "@/components/WishlistIconButton/WishlistIconButton";
import ReviewSection from "../../components/ReviewSection/ReviewSection";
import { addToCart } from "../../store/slices/cartSlice";
import { addRecentViewed } from "@/store/slices/recentViewed";
import ChevronDown from "../../assets/icons/chevron-down.svg";
import api from "../../utils/api";

import ProductHeroImage from "../../assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";

const formatPrice = (price) => `￦ ${price.toLocaleString("ko-KR")}`;
const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;
const normalizeImageUrl = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw) {
    return "";
  }
  if (raw.startsWith("http:///")) {
    return "";
  }
  if (raw.startsWith("http://")) {
    return `https://${raw.slice("http://".length)}`;
  }
  return raw;
};

const mapReview = (review) => ({
  id: String(review._id),
  author: review.user?.name || "익명",
  date: new Date(review.createdAt).toLocaleDateString("ko-KR").replace(/ /g, ""),
  body: review.content || "",
  rating: Number(review.rating) || 0,
  images: Array.isArray(review.images)
    ? review.images.map((image) => normalizeImageUrl(image))
    : [],
  helpfulCount: 0,
});

function getProductDetailByIdFromJson(id) {
  const product = productList.find((item) => String(item.id) === String(id));

  if (!product) {
    return null;
  }

  const price = parsePrice(product.price);
  const tags = Array.isArray(product.tag) ? product.tag : [];
  const heroImage = normalizeImageUrl(product.image) || ProductHeroImage;
  const normalizedDetailImages = Array.isArray(product.detailImages)
    ? product.detailImages.map((src) => normalizeImageUrl(src)).filter(Boolean)
    : [];
  const gallery =
    normalizedDetailImages.length > 0
      ? normalizedDetailImages
      : [heroImage, heroImage, heroImage, heroImage, heroImage];
  const options =
    Array.isArray(product.priceOptions) && product.priceOptions.length > 0
      ? product.priceOptions.map((option, index) => ({
          id: `option-${index + 1}`,
          label: option.optionName || `옵션 ${index + 1}`,
          price: parsePrice(option.price) || price,
        }))
      : [{ id: "default", label: "기본 옵션", price }];

  return {
    id: String(product.id),
    brand: tags[0] || String(product.name ?? "").split(" ")[0] || "브랜드 정보 준비중",
    title: product.name,
    subtitle: `${tags[1] || tags[0] || "상품"} 카테고리 추천 상품`,
    shortDescription: `${product.name}의 핵심 정보와 옵션을 상세 페이지에서 확인할 수 있습니다.`,
    price,
    rating: Number(product.rating) || 0,
    heroImage,
    gallery,
    options,
  };
}

function getProductDetailFromApi(product) {
  const price = parsePrice(product.price);
  const heroImage = normalizeImageUrl(product.image) || ProductHeroImage;
  const detailImages = Array.isArray(product.detailImages)
    ? product.detailImages.map((src) => normalizeImageUrl(src)).filter(Boolean)
    : [];
  const gallery =
    detailImages.length > 0
      ? detailImages
      : [heroImage, heroImage, heroImage, heroImage, heroImage];
  const options =
    Array.isArray(product.priceOptions) && product.priceOptions.length > 0
      ? product.priceOptions.map((option, index) => ({
          id: `option-${index + 1}`,
          label: option.optionName || `옵션 ${index + 1}`,
          price: parsePrice(option.price) || price,
        }))
      : [{ id: "default", label: "기본 옵션", price }];
  const tags = Array.isArray(product.tag) ? product.tag : [];

  return {
    id: String(product._id ?? product.id),
    brand: tags[0] || String(product.name ?? "").split(" ")[0] || "브랜드 정보 준비중",
    title: product.name,
    subtitle: `${tags[1] || tags[0] || "상품"} 카테고리 추천 상품`,
    shortDescription: `${product.name}의 핵심 정보와 옵션을 상세 페이지에서 확인할 수 있습니다.`,
    price,
    rating: Number(product.rating) || 0,
    heroImage,
    gallery,
    options,
  };
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tabsRef = useRef(null);
  const overviewRef = useRef(null);
  const reviewsRef = useRef(null);

  const [product, setProduct] = useState(null);
  const [status, setStatus] = useState("loading");
  const [selectedOptionId, setSelectedOptionId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("overview");
  const [isOverviewExpanded, setIsOverviewExpanded] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [reviewSummary, setReviewSummary] = useState({
    rating: 0,
    reviewCount: 0,
    photoCount: 0,
    gallery: [],
  });

  useEffect(() => {
    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setStatus("loading");

        const productResponse = await api.get(`/products/${id}`, {
          signal: controller.signal,
        });

        const nextProduct = getProductDetailFromApi(
          productResponse.data.data ?? productResponse.data,
        );
        setProduct(nextProduct);

        const reviewResponse = await api.get(`/reviews/${nextProduct.id}`, {
          signal: controller.signal,
        });

        const mappedReviews = reviewResponse.data.map(mapReview);
        const gallery = mappedReviews.flatMap((review) => review.images || []);
        const reviewCount = mappedReviews.length;
        const photoCount = gallery.length;
        const rating =
          reviewCount > 0
            ? mappedReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
            : 0;

        setReviews(mappedReviews);
        setReviewSummary({
          rating,
          reviewCount,
          photoCount,
          gallery,
        });

        setStatus("success");
      } catch (error) {
        if (error.name === "CanceledError") {
          return;
        }

        const fallbackProduct = getProductDetailByIdFromJson(id);
        setProduct(fallbackProduct);
        setReviews([]);
        setReviewSummary({
          rating: 0,
          reviewCount: 0,
          photoCount: 0,
          gallery: [],
        });
        setStatus(fallbackProduct ? "success" : "error");
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [id]);

  useEffect(() => {
    if (!product) {
      return;
    }

    setSelectedOptionId(product.options[0]?.id ?? "");
    setQuantity(1);
    setActiveTab("overview");
    setIsOverviewExpanded(false);
  }, [product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    dispatch(
      addRecentViewed({
        id: product.id,
        productId: product.id,
        name: product.title,
        price: formatPrice(product.price),
        image: product.heroImage,
        rating: product.rating,
      }),
    );
  }, [dispatch, id, product]);

  useEffect(() => {
    if (!product) {
      return;
    }

    const updateActiveTabFromScroll = () => {
      const tabsElement = tabsRef.current;
      const stickyTop = tabsElement
        ? Number.parseFloat(window.getComputedStyle(tabsElement).top) || 0
        : 0;
      const activationOffset = stickyTop + (tabsElement?.offsetHeight ?? 0) + 24;
      const reviewsTop = reviewsRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;

      setActiveTab((prev) => {
        const nextTab = reviewsTop <= activationOffset ? "reviews" : "overview";
        return prev === nextTab ? prev : nextTab;
      });
    };

    updateActiveTabFromScroll();
    window.addEventListener("scroll", updateActiveTabFromScroll, { passive: true });
    window.addEventListener("resize", updateActiveTabFromScroll);

    return () => {
      window.removeEventListener("scroll", updateActiveTabFromScroll);
      window.removeEventListener("resize", updateActiveTabFromScroll);
    };
  }, [product]);

  if (status === "loading") {
    return (
      <main className="product-detail">
        <section className="product-detail__story">
          <h1 className="product-detail__title">상품을 불러오는 중입니다.</h1>
        </section>
      </main>
    );
  }

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

  const selectedOption = product.options.find((option) => option.id === selectedOptionId) || null;
  const displayOption = selectedOption || product.options[0];
  const totalPrice = displayOption.price * quantity;
  const categoryLabel = product.subtitle.split(" 카테고리")[0] || "상품";

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
    if (!targetRef.current) {
      return;
    }

    const tabsElement = tabsRef.current;
    const stickyTop = tabsElement
      ? Number.parseFloat(window.getComputedStyle(tabsElement).top) || 0
      : 0;
    const scrollOffset = stickyTop + (tabsElement?.offsetHeight ?? 0) + 16;
    const targetTop = targetRef.current.getBoundingClientRect().top + window.scrollY - scrollOffset;

    window.scrollTo({
      top: Math.max(0, targetTop),
      behavior: "smooth",
    });
  };

  const renderTabs = () => (
    <div className="product-detail__tabs" ref={tabsRef}>
      <button
        type="button"
        className={activeTab === "overview" ? "is-active" : ""}
        onClick={() => handleTabClick("overview")}
      >
        상세정보
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

  const renderReviewPhotoSwiper = () =>
    reviewSummary.gallery?.length ? (
      <div className="product-detail__review-photo-swiper" aria-label="리뷰 이미지 모음">
        <Swiper
          modules={[FreeMode]}
          slidesPerView="auto"
          spaceBetween={12}
          freeMode
          grabCursor
          watchOverflow
        >
          {reviewSummary.gallery.map((image, index) => (
            <SwiperSlide key={`${product.id}-review-photo-${index}`}>
              <img
                src={image}
                alt={`리뷰 이미지 ${index + 1}`}
                onError={(event) => {
                  event.currentTarget.src = ProductHeroImage;
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    ) : null;

  return (
    <main className="product-detail">
      <nav className="product-detail__breadcrumb" aria-label="상품 경로">
        <span>PC</span>
        <img src={arrowIcon} alt="arrow" className="product-detail__arrow" />
        <span>{categoryLabel}</span>
      </nav>

      <section className="product-detail__hero">
        <div className="product-detail__visual">
          <div className="product-detail__visual-frame">
            <img
              src={product.heroImage}
              alt={product.title}
              className="product-detail__hero-image"
              onError={(event) => {
                event.currentTarget.src = ProductHeroImage;
              }}
            />

            <WishlistIconButton
              product={{
                id: product.id,
                name: product.title,
                price: product.price,
                image: product.heroImage,
              }}
              className="product-detail__favorite"
              iconClassName="product-detail__favorite-icon"
            />
          </div>
        </div>

        <div className="product-detail__content">
          <h1 className="product-detail__title">{product.title}</h1>
          <p className="product-detail__price">{formatPrice(product.price)}</p>
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
                장바구니 담기
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
                {product.gallery.map((image, index) => (
                  <img
                    key={`${product.id}-detail-${index}`}
                    src={image}
                    alt={`${product.brand} 상세 이미지 ${index + 1}`}
                    onError={(event) => {
                      event.currentTarget.src = ProductHeroImage;
                    }}
                  />
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
        {renderReviewPhotoSwiper()}
        <ReviewSection
          rating={reviewSummary.rating}
          reviewCount={reviewSummary.reviewCount}
          photoCount={reviewSummary.photoCount}
          gallery={reviewSummary.gallery}
          reviews={reviews}
        />
      </section>
    </main>
  );
}

export default ProductDetail;
