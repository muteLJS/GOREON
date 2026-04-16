import { Link } from "react-router-dom";
import LikeCircle from "../like/like_circle";
import CartStraightIcon from "../../assets/icons/cart-straight.svg";

function ChatProductCard({ product }) {
  return (
    <article className="chat-widget__product-card">
      <div className="chat-widget__product-media">
        <img src={product.image} alt={product.name} className="chat-widget__product-image" />

        <div className="chat-widget__product-actions">
          <button
            type="button"
            className="chat-widget__icon-button"
            aria-label={`${product.name} 장바구니`}
          >
            <img src={CartStraightIcon} alt="" />
          </button>

          <LikeCircle className="chat-widget__favorite-button" />
        </div>
      </div>

      <div className="chat-widget__product-body">
        <p className="chat-widget__product-title">{product.name}</p>
        <p className="chat-widget__product-description">{product.description}</p>
        <p className="chat-widget__product-spec">{product.spec}</p>

        <div className="chat-widget__product-tags">
          {product.tags.map((tag) => (
            <span key={tag} className="chat-widget__product-tag">
              {tag}
            </span>
          ))}
        </div>

        <p className="chat-widget__product-price">{product.price}</p>

        <Link to={product.detailPath} className="chat-widget__product-link">
          {product.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

export default ChatProductCard;
