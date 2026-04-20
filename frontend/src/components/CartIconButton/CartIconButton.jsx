import { useDispatch } from "react-redux";

import CartIcon from "@/assets/icons/cart.svg";
import { addToCart } from "@/store/slices/cartSlice";
import "./CartIconButton.scss";

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;

function CartIconButton({ product, className = "" }) {
  const dispatch = useDispatch();

  const handleClick = (event) => {
    event.stopPropagation();

    const productId = product?._id ?? product?.productId ?? product?.id ?? 1;
    const cartItemId = product?.id ?? productId;

    dispatch(
      addToCart({
        id: cartItemId,
        productId,
        category: product?.category ?? "상품",
        name: product?.name ?? product?.title ?? "상품명",
        option: product?.option ?? product?.spec ?? "기본 옵션",
        price: parsePrice(product?.price),
        image: product?.image ?? product?.heroImage ?? "",
        quantity: 1,
      }),
    );
  };

  return (
    <button
      type="button"
      className={`cart-icon-button ${className}`.trim()}
      aria-label="장바구니 담기"
      onClick={handleClick}
    >
      <img src={CartIcon} alt="" />
    </button>
  );
}

export default CartIconButton;
