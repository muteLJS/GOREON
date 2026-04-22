import "./ProductCardVertical.scss";
import { useNavigate } from "react-router-dom";
import Rating from "@/components/Rating/Rating";

function ProductCardVertical({ product, action }) {
  const navigate = useNavigate();
  const productId = product?._id ?? product?.productId ?? product?.id;

  return (
    <div className="product-card-vertical" onClick={() => navigate(`/product/${productId}`)}>
      <img className="product-card-vertical__thumbnail" src={product.image} alt="노트북" />
      <div className="product-card-vertical__title">{product.name}</div>
      <div className="product-card-vertical__rating">
        <Rating rating={product.rating} />
      </div>
      <div className="product-card-vertical__bottom">
        <div className="product-card-vertical__price">₩{product.price.toLocaleString("ko-KR")}</div>
        {action && (
          <div className="product-card-vertical__action" onClick={(e) => e.stopPropagation()}>
            {action}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductCardVertical;
