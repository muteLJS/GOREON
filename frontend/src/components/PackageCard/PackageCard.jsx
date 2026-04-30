import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import LikeAfterIcon from "@/assets/icons/like-after.svg";
import LikeBeforeIcon from "@/assets/icons/like-before.svg";
import CartIcon from "@/assets/icons/cart-straight.svg";
import { useToast } from "@/components/Toast/toastContext";
import { addToCart } from "@/store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
import { trackAddToCart, trackGuidedShopping } from "@/utils/analytics";
import { buildProductDetailPath, getProductObjectId } from "@/utils/productIdentity";

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;
const buildCartItemId = (productId, optionKey) => `${productId}::${optionKey || "default"}`;

const toCartItem = (product, label) => {
  const productId = getProductObjectId(product);
  const option =
    product?.option ?? product?.spec ?? product?.priceOptions?.[0]?.optionName ?? "기본 옵션";
  const optionKey = String(product?.optionId ?? option ?? "default");

  return {
    id: product?.cartItemId ?? buildCartItemId(productId, optionKey),
    productId,
    _id: productId,
    category: product?.category ?? label ?? "상품",
    name: product?.name ?? product?.title ?? "상품명",
    option,
    price: parsePrice(product?.price),
    image: product?.image ?? product?.heroImage ?? "",
    quantity: 1,
  };
};

const toWishlistItem = (product) => {
  const productId = getProductObjectId(product);

  return {
    id: productId,
    _id: productId,
    productId,
    name: product?.name ?? product?.title ?? "상품명",
    price: parsePrice(product?.price),
    image: product?.image ?? product?.heroImage ?? "",
    rating: Number(product?.rating) || 0,
  };
};

const normalizeImageSrc = (src) => {
  const imageSrc = String(src ?? "").trim();

  if (!imageSrc || imageSrc.startsWith("http:///")) {
    return "";
  }

  return imageSrc;
};

const ImageOrSkeleton = ({ src, alt, className = "" }) => {
  const imageSrc = normalizeImageSrc(src);

  if (!imageSrc) {
    return (
      <Skeleton
        className={`package-image-skeleton ${className}`.trim()}
        containerClassName="package-image-skeleton-container"
      />
    );
  }

  return <img src={imageSrc} alt={alt} className={className} />;
};

function PackageCard({
  title,
  description,
  price,
  mainImage,
  detailItems = [],
  defaultOpen = false,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const packageProducts = detailItems.map((item) => item.product).filter(Boolean);

  const handlePackageCartClick = (event) => {
    event.stopPropagation();

    let addedCount = 0;

    detailItems.forEach((item) => {
      const cartItem = toCartItem(item.product, item.label);

      if (cartItem.productId) {
        dispatch(addToCart(cartItem));
        addedCount += 1;
      }
    });

    if (addedCount > 0) {
      trackGuidedShopping({
        signal: "package_add_to_cart",
        source: "recommendation_package",
        label: title ?? "추천 조합",
        value: addedCount,
        params: {
          item_count: addedCount,
        },
      });
      trackAddToCart(title ?? "추천 조합");
      showToast("추천 조합 상품을 장바구니에 담았습니다.");
    }
  };

  const allPackageItemsWishlisted =
    packageProducts.length > 0 &&
    packageProducts.every((item) =>
      wishlistItems.some(
        (wishlistItem) => getProductObjectId(wishlistItem) === getProductObjectId(item),
      ),
    );

  const handlePackageWishlistClick = (event) => {
    event.stopPropagation();

    trackGuidedShopping({
      signal: allPackageItemsWishlisted ? "package_wishlist_remove" : "package_wishlist_add",
      source: "recommendation_package",
      label: title ?? "추천 조합",
      value: packageProducts.length,
      params: {
        item_count: packageProducts.length,
      },
    });

    if (allPackageItemsWishlisted) {
      packageProducts.forEach((item) => {
        const productId = getProductObjectId(item);

        if (productId) {
          dispatch(removeFromWishlist(productId));
        }
      });

      showToast("찜 목록에서 제거했습니다.");
      return;
    }

    let addedCount = 0;

    packageProducts.forEach((item) => {
      const wishlistItem = toWishlistItem(item);

      const isAlreadyWishlisted = wishlistItems.some(
        (existingItem) => getProductObjectId(existingItem) === wishlistItem.productId,
      );

      if (wishlistItem.productId && !isAlreadyWishlisted) {
        dispatch(addToWishlist(wishlistItem));
        addedCount += 1;
      }
    });

    showToast(addedCount > 0 ? "찜 목록에 추가했습니다." : "이미 찜 목록에 담겨 있습니다.");
  };

  const handleDetailItemClick = (item) => {
    const detailPath = buildProductDetailPath(item.product);

    if (detailPath) {
      trackGuidedShopping({
        signal: "package_product_click",
        source: "recommendation_package",
        label: item.title ?? item.product?.name,
      });
      navigate(detailPath);
    }
  };

  return (
    <div className={`pakage_box ${isOpen ? "is-open" : ""}`}>
      <div className="pakage_big">
        <ImageOrSkeleton src={mainImage} alt={title || "추천 조합 이미지"} className="pakage_img" />

        <div className="pakage_texts">
          <p>{title}</p>
          <p className="gray_text">{description}</p>

          <div className="pakage_bottom">
            <p>{price}</p>

            <div className="icons">
              <button
                type="button"
                className="cart-icon-button cart-icon-button--sm"
                aria-label="추천 조합 전체 장바구니 담기"
                onClick={handlePackageCartClick}
              >
                <img src={CartIcon} alt="" />
              </button>

              <button
                type="button"
                className="wishlist-icon-button wishlist-icon-button--sm"
                aria-label={
                  allPackageItemsWishlisted ? "추천 조합 전체 찜 해제" : "추천 조합 전체 찜하기"
                }
                onClick={handlePackageWishlistClick}
              >
                <img src={allPackageItemsWishlisted ? LikeAfterIcon : LikeBeforeIcon} alt="" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="pakage_small">
        <div className="pakage_small_inner">
          {detailItems.map((item, index) => (
            <div className="pakage_inner" key={`${item.label}-${index}`}>
              <button
                type="button"
                className="pakage_img_box"
                onClick={() => handleDetailItemClick(item)}
                aria-label={`${item.title} 상세페이지로 이동`}
              >
                <ImageOrSkeleton src={item.image} alt={item.title || item.label || "상품 이미지"} />
              </button>

              <button
                type="button"
                className="pakage_item"
                onClick={() => handleDetailItemClick(item)}
              >
                <p>{item.label}</p>
                <p className="gray_text pakage_item_title">{item.title}</p>
                <p className="gray_text pakage_item_option">{item.subtitle}</p>
              </button>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        className={`chevron ${!isOpen ? "is-open" : ""}`}
        aria-expanded={isOpen}
        aria-label="패키지 상세 항목 보기"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 24 12">
          <path d="M2 10L12 2L22 10" />
        </svg>
      </button>
    </div>
  );
}

export default PackageCard;
