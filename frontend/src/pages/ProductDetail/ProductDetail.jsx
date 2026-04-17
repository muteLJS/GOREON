import "./ProductDetail.scss";
import productList from "@/data/products_list.json";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import ReviewSection from "../../components/ReviewSection/ReviewSection";
import { addToCart } from "../../store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "../../store/slices/wishlistSlice";
import LikeBefore from "../../assets/icons/like-before.svg";
import LikeAfter from "../../assets/icons/like-after.svg";
import ChevronDown from "../../assets/icons/chevron-down.svg";

import ProductHeroImage from "../../assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";

const formatPrice = (price) => `W ${price.toLocaleString("ko-KR")}`;
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

const flattenProductList = (data) =>
  data.flatMap((entry, entryIndex) => {
    const hasNestedProducts = Array.isArray(entry?.products) || Array.isArray(entry?.subCategories);

    if (!hasNestedProducts) {
      return [
        {
          ...entry,
          categoryName: entry?.tag ?? "",
          categoryId: entry?.categoryId ?? null,
          routeId: String(entry?.id ?? entryIndex + 1),
        },
      ];
    }

    const categoryName = entry.categoryName ?? "";
    const directProducts = (entry.products ?? []).map((product, productIndex) => ({
      ...product,
      categoryName,
      categoryId: entry.categoryId,
      routeId: `${entry.categoryId ?? categoryName}-${product.id ?? productIndex + 1}-${productIndex}`,
    }));

    const subCategoryProducts = (entry.subCategories ?? []).flatMap((subCategory, subIndex) =>
      (subCategory.products ?? []).map((product, productIndex) => ({
        ...product,
        categoryName,
        categoryId: entry.categoryId,
        routeId: `${entry.categoryId ?? categoryName}-${subCategory.categoryId ?? subIndex}-${
          product.id ?? productIndex + 1
        }-${productIndex}`,
      })),
    );

    return [...directProducts, ...subCategoryProducts];
  });

function getProductDetailByIdFromJson(id) {
  const flatProducts = flattenProductList(productList);

  const product =
    flatProducts.find((item) => String(item.routeId) === String(id)) ??
    flatProducts.find((item) => String(item.id) === String(id));

  if (!product) {
    return null;
  }

  const price = parsePrice(product.price);
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
  const reviews = [
    {
      id: 1,
      author: "User**1",
      date: "2026.04.10",
      body: `${product.name} 기준으로 실사용 만족도가 높고 기본 구성이 안정적입니다.`,
      images: gallery.slice(0, 4),
    },
    {
      id: 2,
      author: "User**7",
      date: "2026.04.12",
      body: "옵션 선택폭이 넓고 가격대 비교가 쉬워 구매 결정에 도움이 됐습니다.",
      images: gallery.slice(0, 4),
    },
  ];

  return {
    id: String(product.routeId),
    brand: String(product.name ?? "").split(" ")[0] || "브랜드 정보 준비중",
    title: product.name,
    subtitle: `${product.categoryName} 카테고리 추천 상품`,
    shortDescription: `${product.name}의 핵심 정보와 옵션을 상세 페이지에서 확인할 수 있습니다.`,
    price,
    rating: Number(product.rating) || 0,
    reviewCount: reviews.length,
    photoCount: gallery.length,
    heroImage,
    gallery,
    options,
    reviews,
  };
}

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);

  const overviewRef = useRef(null);
  const reviewsRef = useRef(null);

  const product = getProductDetailByIdFromJson(id);
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
            <img
              src={product.heroImage}
              alt={product.title}
              className="product-detail__hero-image"
              onError={(event) => {
                event.currentTarget.src = ProductHeroImage;
              }}
            />

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
