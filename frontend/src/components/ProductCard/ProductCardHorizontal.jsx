import "./ProductCardHorizontal.scss";
import { useNavigate } from "react-router-dom";
import Rating from "@/components/Rating/Rating";

function ProductCardHorizontal({ product, action }) {
  const navigate = useNavigate();
  const productId = product?._id ?? product?.productId ?? product?.id;

  return (
    <div className="product-card-horizontal" onClick={() => navigate(`/product/${productId}`)}>
      <img className="product-card-horizontal__thumbnail" src={product.image} alt={product.name} />
      <div className="product-card-horizontal__content">
        <div className="product-card-horizontal__title">{product.name}</div>
        <div className="product-card-horizontal__rating">
          <Rating rating={product.rating} />
        </div>
        <div className="product-card-horizontal__bottom">
          <div className="product-card-horizontal__price">₩{product.price.toLocaleString("ko-KR")}</div>
          {action && (
            <div className="product-card-horizontal__action" onClick={(e) => e.stopPropagation()}>
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProductCardHorizontal;
