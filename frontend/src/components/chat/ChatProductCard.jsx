import { Link } from "react-router-dom";
import CartIconButton from "../CartIconButton/CartIconButton";
import WishlistIconButton from "../WishlistIconButton/WishlistIconButton";

function ChatProductCard({ product }) {
  return (
    <article className="chat-widget__product-card">
      <div className="chat-widget__product-media">
        <img src={product.image} alt={product.name} className="chat-widget__product-image" />

        <div className="chat-widget__product-actions">
          <CartIconButton product={product} className="chat-widget__icon-button" />

          <WishlistIconButton product={product} className="chat-widget__favorite-button" />
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
