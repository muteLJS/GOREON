import { Link } from "react-router-dom";

import { buildProductDetailPath } from "@/utils/productIdentity";
import CartIconButton from "../CartIconButton/CartIconButton";
import WishlistIconButton from "../WishlistIconButton/WishlistIconButton";

function ChatProductCard({ product }) {
  const tags = Array.isArray(product.tags) ? product.tags : [];
  const detailPath = product.detailPath ?? buildProductDetailPath(product) ?? "/product";

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
          {tags.map((tag) => (
            <span key={tag} className="chat-widget__product-tag">
              {tag}
            </span>
          ))}
        </div>

        <p className="chat-widget__product-price">{product.price}</p>

        <Link to={detailPath} className="chat-widget__product-link">
          {product.ctaLabel}
        </Link>
      </div>
    </article>
  );
}

export default ChatProductCard;
