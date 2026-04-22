import "./ProductCardVertical.scss";
import { useNavigate } from "react-router-dom";
import Rating from "@/components/Rating/Rating";

function ProductCardVertical({ product, action }) {
  const navigate = useNavigate();

  const handleTitleClick = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <div className="product-card-vertical">
      <img className="product-card-vertical__thumbnail" src={product.image} alt={product.name} />
      <button className="product-card-vertical__title" type="button" onClick={handleTitleClick}>
        {product.name}
      </button>
      <div className="product-card-vertical__rating">
        <Rating rating={product.rating} />
      </div>
      <div className="product-card-vertical__bottom">
        <div className="product-card-vertical__price">₩{product.price.toLocaleString("ko-KR")}</div>
        {action && <div className="product-card-vertical__action">{action}</div>}
      </div>
    </div>
  );
}

export default ProductCardVertical;
