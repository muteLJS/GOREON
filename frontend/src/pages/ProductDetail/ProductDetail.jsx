import "./ProductDetail.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import arrowIcon from "@/assets/icons/prev.svg";
import { fetchProductById } from "@/api/products";
import RouteLoading from "@/components/RouteLoading/RouteLoading";
import { useToast } from "@/components/Toast/toastContext";
import WishlistIconButton from "@/components/WishlistIconButton/WishlistIconButton";
import ReviewSection from "../../components/ReviewSection/ReviewSection";
import ReviewWrite from "@/components/ReviewWrite/ReviewWrite";
import { addToCart } from "../../store/slices/cartSlice";
import { addRecentViewed } from "@/store/slices/recentViewed";
import ChevronDown from "../../assets/icons/chevron-down.svg";
import api from "../../utils/api";
import { normalizeImageUrl } from "@/utils/image";
import { trackViewProduct } from "@/utils/analytics";

import ProductHeroImage from "../../assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";

const formatPrice = (price) => `￦ ${price.toLocaleString("ko-KR")}`;
const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;

const getUserId = (user) => String(user?._id ?? user?.id ?? user?.userId ?? user ?? "");

const mapReview = (review) => ({
  id: String(review._id),
  _id: String(review._id),
  product: String(review.product?._id ?? review.product ?? ""),
  userId: getUserId(review.user),
  author: review.user?.name || "익명",
  date: new Date(review.createdAt).toLocaleDateString("ko-KR").replace(/ /g, ""),
  createdAt: review.createdAt,
  content: review.content || "",
  body: review.content || "",
  rating: Number(review.rating) || 0,
  images: Array.isArray(review.images)
    ? review.images.map((image) => normalizeImageUrl(image)).filter(Boolean)
    : [],
  helpfulCount: 0,
  isMine: Boolean(review.isMine),
});

const buildReviewSummary = (mappedReviews) => {
  const gallery = mappedReviews.flatMap((review) => review.images || []);
  const reviewCount = mappedReviews.length;
  const photoCount = gallery.length;
  const rating =
    reviewCount > 0
      ? mappedReviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : 0;

  return {
    rating,
    reviewCount,
    photoCount,
    gallery,
  };
};

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
    _id: String(product._id),
    productId: String(product._id),
    legacyId: product.id ? String(product.id) : "",
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
  const { showToast } = useToast();
  const cartItems = useSelector((state) => state.cart.items);
  const authChecked = useSelector((state) => state.user.authChecked);
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);

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
  const [editingReview, setEditingReview] = useState(null);
  const [ownedReviewId, setOwnedReviewId] = useState("");
  const reviewSummary = useMemo(() => buildReviewSummary(reviews), [reviews]);

  useEffect(() => {
    if (!authChecked) {
      return undefined;
    }

    const controller = new AbortController();

    const fetchProduct = async () => {
      try {
        setStatus("loading");

        const nextProduct = getProductDetailFromApi(
          await fetchProductById(id, { signal: controller.signal }),
        );
        setProduct(nextProduct);

        const reviewResponse = await api.get(`/reviews/${nextProduct._id}`, {
          signal: controller.signal,
        });

        const mappedReviews = reviewResponse.data.map(mapReview);

        setReviews(mappedReviews);

        if (isLoggedIn) {
          try {
            const myReviewResponse = await api.get(`/reviews/${nextProduct._id}/me`, {
              signal: controller.signal,
            });
            setOwnedReviewId(myReviewResponse.data?._id ? String(myReviewResponse.data._id) : "");
          } catch {
            setOwnedReviewId("");
          }
        } else {
          setOwnedReviewId("");
        }

        setStatus("success");
      } catch (error) {
        if (error.name === "CanceledError") {
          return;
        }

        setProduct(null);
        setReviews([]);
        setEditingReview(null);
        setOwnedReviewId("");
        setStatus("error");
      }
    };

    fetchProduct();

    return () => controller.abort();
  }, [authChecked, id, isLoggedIn]);

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
        _id: product._id,
        id: product._id,
        productId: product._id,
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
      const reviewsTop =
        reviewsRef.current?.getBoundingClientRect().top ?? Number.POSITIVE_INFINITY;

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

  useEffect(() => {
    if (product?.name) {
      trackViewProduct(product.name);
    }
  }, [product]);

  if (status === "loading") {
    return <RouteLoading message="상품을 불러오는 중입니다..." />;
  }

  if (!product) {
    return (
      <main className="product-detail">
        <section className="product-detail__story">
          <h1 className="product-detail__title">상품을 찾을 수 없습니다.</h1>
          <p className="product-detail__feature-body">요청한 상품 정보를 불러오지 못했습니다.</p>
        </section>
      </main>
    );
  }

  const selectedOption = product.options.find((option) => option.id === selectedOptionId) || null;
  const displayOption = selectedOption || product.options[0];
  const totalPrice = displayOption.price * quantity;
  const categoryLabel = product.subtitle.split(" 카테고리")[0] || "상품";
  const checkoutItem = {
    id: `${product._id}-${displayOption.id}`,
    _id: product._id,
    productId: product._id,
    category: categoryLabel,
    name: product.title,
    option: displayOption.label,
    price: displayOption.price,
    image: product.heroImage,
    quantity,
  };

  const handleAddToCart = (shouldShowToast = true) => {
    const isAlreadyInCart = cartItems.some((item) => item.id === checkoutItem.id);

    dispatch(addToCart(checkoutItem));

    if (shouldShowToast) {
      showToast(isAlreadyInCart ? "장바구니 수량이 추가되었습니다." : "장바구니에 담았습니다.");
    }
  };

  const handleReviewSaved = (savedReview) => {
    const mappedReview = { ...mapReview(savedReview), isMine: true };

    setReviews((prevReviews) => {
      const hasReview = prevReviews.some((review) => review.id === mappedReview.id);
      return hasReview
        ? prevReviews.map((review) => (review.id === mappedReview.id ? mappedReview : review))
        : [mappedReview, ...prevReviews];
    });
    setOwnedReviewId(mappedReview.id);
    setEditingReview(null);
  };

  const handleDeleteReview = async (review) => {
    if (!window.confirm("작성한 리뷰를 삭제하시겠습니까?")) {
      return;
    }

    try {
      await api.delete(`/reviews/${review.id}`);

      setReviews((prevReviews) => prevReviews.filter((item) => item.id !== review.id));
      if (String(ownedReviewId) === String(review.id)) {
        setOwnedReviewId("");
      }
      showToast("리뷰가 삭제되었습니다.");
    } catch (error) {
      showToast(error.response?.data?.message || "리뷰 삭제에 실패했습니다.");
    }
  };

  const handleBuyNow = () => {
    navigate("/payment", {
      state: {
        orderItems: [checkoutItem],
        checkoutSource: "direct-buy",
      },
    });
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
            <SwiperSlide key={`${product._id}-review-photo-${index}`}>
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
                _id: product._id,
                productId: product._id,
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
                    key={`${product._id}-detail-${index}`}
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
          onEditReview={setEditingReview}
          onDeleteReview={handleDeleteReview}
        />
      </section>

      {editingReview && (
        <ReviewWrite
          productId={product._id}
          initialReview={editingReview}
          onClose={() => setEditingReview(null)}
          onSaved={handleReviewSaved}
        />
      )}
    </main>
  );
}

export default ProductDetail;
