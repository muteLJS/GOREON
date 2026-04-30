import { useDispatch, useSelector } from "react-redux";

import CartIcon from "@/assets/icons/cart-straight.svg";
import { useToast } from "@/components/Toast/toastContext";
import { addToCart } from "@/store/slices/cartSlice";
import { getProductObjectId } from "@/utils/productIdentity";
import "./CartIconButton.scss";
import { trackAddToCart, trackGuidedShopping, trackSelfDiscoveryShopping } from "@/utils/analytics";

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;
const buildCartItemId = (productId, optionKey) => `${productId}::${optionKey || "default"}`;

function CartIconButton({ product, className = "", size = "md", analyticsContext }) {
  const dispatch = useDispatch();
  const { showToast } = useToast();
  const cartItems = useSelector((state) => state.cart.items);

  const handleClick = (event) => {
    event.stopPropagation();

    const productId = getProductObjectId(product);

    if (!productId) {
      return;
    }

    const optionKey = String(product?.optionId ?? product?.option ?? product?.spec ?? "default");
    const cartItemId = product?.cartItemId ?? buildCartItemId(productId, optionKey);
    const isAlreadyInCart = cartItems.some((item) => item.id === cartItemId);

    dispatch(
      addToCart({
        id: cartItemId,
        productId,
        _id: productId,
        category: product?.category ?? "상품",
        name: product?.name ?? product?.title ?? "상품명",
        option: product?.option ?? product?.spec ?? "기본 옵션",
        price: parsePrice(product?.price),
        image: product?.image ?? product?.heroImage ?? "",
        quantity: 1,
      }),
    );

    showToast(isAlreadyInCart ? "장바구니 수량이 추가되었습니다." : "장바구니에 담았습니다.");
  };

  const handleAddToCart = () => {
    const productName = product?.name ?? product?.title ?? "상품명";

    if (analyticsContext?.behavior === "guided") {
      trackGuidedShopping({
        signal: analyticsContext.signal ?? "add_to_cart",
        source: analyticsContext.source,
        label: productName,
      });
    }

    if (analyticsContext?.behavior === "self_discovery") {
      trackSelfDiscoveryShopping({
        signal: analyticsContext.signal ?? "add_to_cart",
        source: analyticsContext.source,
        label: productName,
      });
    }

    trackAddToCart(productName);
  };

  return (
    <button
      type="button"
      className={`cart-icon-button cart-icon-button--${size} ${className}`.trim()}
      aria-label="장바구니 담기"
      onClick={(event) => {
        handleClick(event);
        handleAddToCart();
      }}
    >
      <img src={CartIcon} alt="" />
    </button>
  );
}

export default CartIconButton;
