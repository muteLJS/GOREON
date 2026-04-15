import "./cart_circle.scss";

function CartCircle({ onClick }) {
  return (
    <button type="button" className="cart-circle" onClick={onClick} aria-label="장바구니 담기">
      <svg viewBox="0 0 24 24" className="cart-circle__icon" aria-hidden="true">
        <path
          className="cart-circle__line"
          d="M4 5H6.2L7.7 14.2H17L18.4 8.2H8.1"
        />
        <circle className="cart-circle__wheel" cx="10" cy="18" r="1.35" />
        <circle className="cart-circle__wheel" cx="16" cy="18" r="1.35" />
      </svg>
    </button>
  );
}

export default CartCircle;
