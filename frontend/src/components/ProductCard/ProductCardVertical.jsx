import "./ProductCardVertical.scss";
import { useNavigate } from "react-router-dom";

import Rating from "@/components/Rating/Rating";
import ProductHeroImage from "@/assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";
import { normalizeImageUrl } from "@/utils/image";
import { buildProductDetailPath } from "@/utils/productIdentity";

function ProductCardVertical({ product, action }) {
  const navigate = useNavigate();
  const detailPath = buildProductDetailPath(product);
  const imageSrc = normalizeImageUrl(product.image) || ProductHeroImage;

  return (
    <div
      className="product-card-vertical"
      onClick={() => {
        if (detailPath) {
          navigate(detailPath);
        }
      }}
    >
      <img
        className="product-card-vertical__thumbnail"
        src={imageSrc}
        alt={product.name}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = ProductHeroImage;
        }}
      />
      <div className="product-card-vertical__title">{product.name}</div>
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
