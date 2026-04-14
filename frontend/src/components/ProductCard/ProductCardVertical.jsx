import "./ProductCardVertical.scss";

import Rating from "@/components/Rating/Rating";

function ProductCardVertical({ product, action }) {
  return (
    <div className="product-card-vertical">
      <img src={product.image} alt="노트북" />
      <div className="product-card-vertical__title">{product.name}</div>
      <div className="product-card-vertical__rating">
        <Rating rating={product.rating} />
      </div>
      <div className="product-card-vertical__bottom">
        <div className="product-card-vertical__price">{product.price}</div>
        {action && <div className="product-card-vertical__action">{action}</div>}
      </div>
    </div>
  );
}

export default ProductCardVertical;
