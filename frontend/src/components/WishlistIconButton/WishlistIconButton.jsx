import { useDispatch, useSelector } from "react-redux";

import LikeAfterIcon from "@/assets/icons/like-after.svg";
import LikeBeforeIcon from "@/assets/icons/like-before.svg";
import { useToast } from "@/components/Toast/toastContext";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";
import { getProductObjectId } from "@/utils/productIdentity";
import "./WishlistIconButton.scss";
import { trackGuidedShopping, trackSelfDiscoveryShopping, trackWishlist } from "@/utils/analytics";

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;

function WishlistIconButton({ product, className = "", iconClassName = "", size = "md", analyticsContext }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const productId = getProductObjectId(product);
  const isWishlisted = wishlistItems.some((item) => getProductObjectId(item) === productId);

  const handleClick = (event) => {
    event.stopPropagation();

    if (!productId) {
      return;
    }

    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));
      showToast("찜 목록에서 제거했습니다.");
      return;
    }

    dispatch(
      addToWishlist({
        id: productId,
        _id: productId,
        productId,
        name: product?.name ?? product?.title ?? "상품명",
        price: parsePrice(product?.price),
        image: product?.image ?? product?.heroImage ?? "",
        rating: Number(product?.rating) || 0,
      }),
    );

    showToast("찜 목록에 추가했습니다.");
  };

  const handleWishlist = () => {
    const productName = product?.name ?? product?.title ?? "상품명";

    if (analyticsContext?.behavior === "guided") {
      trackGuidedShopping({
        signal: analyticsContext.signal ?? "click_wishlist",
        source: analyticsContext.source,
        label: productName,
      });
    }

    if (analyticsContext?.behavior === "self_discovery") {
      trackSelfDiscoveryShopping({
        signal: analyticsContext.signal ?? "click_wishlist",
        source: analyticsContext.source,
        label: productName,
      });
    }

    trackWishlist(productName);
  };

  return (
    <button
      type="button"
      className={`wishlist-icon-button wishlist-icon-button--${size} ${className}`.trim()}
      aria-label={isWishlisted ? "찜 해제" : "찜하기"}
      onClick={(event) => {
        handleClick(event);
        handleWishlist();
      }}
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
