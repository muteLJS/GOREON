import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import LikeAfterIcon from "@/assets/icons/like-after.svg";
import LikeBeforeIcon from "@/assets/icons/like-before.svg";
import ProductHeroImage from "@/assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";
import { useToast } from "@/components/Toast/toastContext";
import { addToWishlist } from "@/store/slices/wishlistSlice";
import { normalizeImageUrl } from "@/utils/image";
import { buildProductDetailPath, getProductObjectId } from "@/utils/productIdentity";
import CartIconButton from "components/CartIconButton/CartIconButton";

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;

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

function PackageCard({
  title,
  description,
  price,
  mainImage,
  detailItems,
  product,
  defaultOpen = false,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const mainImageSrc = normalizeImageUrl(mainImage) || ProductHeroImage;
  const packageProduct = product ?? {
    name: title,
    title,
    price,
    image: mainImage,
    option: "추천 조합",
  };

  const packageProducts = detailItems.map((item) => item.product).filter(Boolean);
  const allPackageItemsWishlisted =
    packageProducts.length > 0 &&
    packageProducts.every((item) =>
      wishlistItems.some((wishlistItem) => getProductObjectId(wishlistItem) === getProductObjectId(item)),
    );

  const handlePackageWishlistClick = (event) => {
    event.stopPropagation();
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
      navigate(detailPath);
    }
  };

  return (
    <div className={`pakage_box ${isOpen ? "is-open" : ""}`}>
      <div className="pakage_big">
        <img
          src={mainImageSrc}
          alt="pakage_img"
          className="pakage_img"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = ProductHeroImage;
          }}
        />
        <div className="pakage_texts">
          <p>{title}</p>
          <p className="gray_text">{description}</p>
          <div className="pakage_bottom">
            <p>{price}</p>
            <div className="icons">
              <CartIconButton product={packageProduct} size="sm" />
              <button
                type="button"
                className="wishlist-icon-button wishlist-icon-button--sm"
                aria-label="추천 조합 전체 찜하기"
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
                <img
                  src={normalizeImageUrl(item.image) || ProductHeroImage}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = ProductHeroImage;
                  }}
                />
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
