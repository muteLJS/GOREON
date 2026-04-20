import "./ProductList-row.scss";

import { Link } from "react-router-dom";

import CartIconButton from "../CartIconButton/CartIconButton";
import WishlistIconButton from "../WishlistIconButton/WishlistIconButton";
import ProductListNamePrice from "../ProductList-name,price/ProductList-name,price";
import { formatPrice } from "../../utils/cart";

function ProductThumbnail({ imageSrc, name }) {
  return (
    <div className="product-list-row__thumbnail">
      {imageSrc ? (
        <img className="product-list-row__thumbnail-image" src={imageSrc} alt={name} />
      ) : (
        <span className="product-list-row__thumbnail-empty">이미지 없음</span>
      )}
    </div>
  );
}

function ProductListRow({ item, isSelected, onSelect, onDecrease, onIncrease }) {
  const imageSrc = item.imageSrc ?? item.image ?? item.thumbnailImage ?? item.thumbnail ?? "";

  return (
    <article className="product-list-row">
      <div className="product-list-row__media">
        <label className="product-list-row__check">
          <input type="checkbox" checked={isSelected} onChange={onSelect} />
          <span className="product-list-row__check-mark" />
        </label>

        <Link
          to={`/product/${item.productId}`}
          className="product-list-row__image-link"
          aria-label={`${item.name} 상세 페이지로 이동`}
        >
          <ProductThumbnail imageSrc={imageSrc} name={item.name} />
        </Link>

        <CartIconButton
          product={item}
          className="product-list-row__overlay-button product-list-row__overlay-button--cart"
        />

        <WishlistIconButton
          product={item}
          className="product-list-row__overlay-button product-list-row__overlay-button--wish"
        />
      </div>

      <ProductListNamePrice
        category={item.category}
        name={item.name}
        option={item.option}
        priceLabel={formatPrice(item.price)}
      >
        <div className="product-list-row__quantity" aria-label="수량 조절">
          <button
            type="button"
            className="product-list-row__quantity-button"
            onClick={onDecrease}
            aria-label={`${item.name} 수량 감소`}
          >
            -
          </button>
          <span>{item.quantity}</span>
          <button
            type="button"
            className="product-list-row__quantity-button"
            onClick={onIncrease}
            aria-label={`${item.name} 수량 증가`}
          >
            +
          </button>
        </div>
      </ProductListNamePrice>
    </article>
  );
}

export default ProductListRow;
