import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import LikeAfterIcon from "@/assets/icons/like-after.svg";
import LikeBeforeIcon from "@/assets/icons/like-before.svg";
import { addToWishlist } from "@/store/slices/wishlistSlice";
import CartIconButton from "components/CartIconButton/CartIconButton";

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;

const getProductId = (product) => product?._id ?? product?.productId ?? product?.id;

const toWishlistItem = (product) => ({
  id: getProductId(product),
  name: product?.name ?? product?.title ?? "상품명",
  price: parsePrice(product?.price),
  image: product?.image ?? product?.heroImage ?? "",
  rating: Number(product?.rating) || 0,
});

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
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const packageProduct = product ?? {
    id: title,
    name: title,
    price,
    image: mainImage,
    option: "추천 조합",
  };

  const packageProducts = detailItems.map((item) => item.product).filter(Boolean);
  const allPackageItemsWishlisted =
    packageProducts.length > 0 &&
    packageProducts.every((item) =>
      wishlistItems.some((wishlistItem) => wishlistItem.id === getProductId(item)),
    );

  const handlePackageWishlistClick = (event) => {
    event.stopPropagation();

    packageProducts.forEach((item) => {
      const wishlistItem = toWishlistItem(item);

      if (wishlistItem.id !== undefined) {
        dispatch(addToWishlist(wishlistItem));
      }
    });
  };

  const handleDetailItemClick = (item) => {
    const productId = getProductId(item.product);

    if (productId !== undefined && productId !== null) {
      navigate(`/product/${productId}`);
    }
  };

  return (
    <div className={`pakage_box ${isOpen ? "is-open" : ""}`}>
      <div className="pakage_big">
        <img src={mainImage} alt="pakage_img" className="pakage_img" />
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
                <img src={item.image} alt="" />
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
