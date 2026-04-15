/* -------------------------------------------------------------------------- */
/* [컴포넌트] 장바구니 버튼                                                   */
/* -------------------------------------------------------------------------- */
import styles from "./cart.module.scss";


import { registerModuleStyles } from "styles/registerModuleStyles";

registerModuleStyles(styles);

function Cart({ active = false, onClick }) {
  return (
    <button
      type="button"
      className={`cart-icon ${active ? "is-active" : ""}`}
      onClick={onClick}
      aria-pressed={active}
      aria-label="장바구니 담기"
    >
      <svg viewBox="0 0 24 24" className="cart-icon__svg" aria-hidden="true">
        <path className="cart-icon__line" d="M4.5 5.5h2l1.5 8.2h8.2l1.6-6.3H7.2" />
        <circle className="cart-icon__wheel" cx="10" cy="18.4" r="1.2" />
        <circle className="cart-icon__wheel" cx="16.2" cy="18.4" r="1.2" />
      </svg>
    </button>
  );
}

export default Cart;
