import { useDispatch, useSelector } from "react-redux";

import LikeAfterIcon from "@/assets/icons/like-after.svg";
import LikeBeforeIcon from "@/assets/icons/like-before.svg";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
import "./WishlistIconButton.scss";

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;

function WishlistIconButton({ product, className = "", iconClassName = "" }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const productId = product?._id ?? product?.productId ?? product?.id ?? 1;
  const isWishlisted = wishlistItems.some((item) => item.id === productId);

  const handleClick = (event) => {
    event.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));
      return;
    }

    dispatch(
      addToWishlist({
        id: productId,
        name: product?.name ?? product?.title ?? "상품명",
        price: parsePrice(product?.price),
        image: product?.image ?? product?.heroImage ?? "",
        rating: Number(product?.rating) || 0,
      }),
    );
  };

  return (
    <button
      type="button"
      className={`wishlist-icon-button ${isWishlisted ? "is-active" : ""} ${className}`.trim()}
      aria-label={isWishlisted ? "찜 해제" : "찜하기"}
      onClick={handleClick}
    >
      <img
        src={isWishlisted ? LikeAfterIcon : LikeBeforeIcon}
        alt=""
        className={`wishlist-icon-button__icon ${
          isWishlisted ? "is-active" : "is-idle"
        } ${iconClassName}`.trim()}
      />
    </button>
  );
}

export default WishlistIconButton;
