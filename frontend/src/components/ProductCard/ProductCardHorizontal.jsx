import "./ProductCardHorizontal.scss";
import { useNavigate } from "react-router-dom";

import Rating from "@/components/Rating/Rating";
import ProductHeroImage from "@/assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";
import { normalizeImageUrl } from "@/utils/image";
import { buildProductDetailPath } from "@/utils/productIdentity";

function ProductCardHorizontal({ product, action }) {
  const navigate = useNavigate();
  const detailPath = buildProductDetailPath(product);
  const imageSrc = normalizeImageUrl(product.image) || ProductHeroImage;

  const handleTitleClick = () => {
    if (detailPath) {
      navigate(detailPath);
    }
  };

  return (
    <div
      className="product-card-horizontal"
      onClick={() => {
        if (detailPath) {
          navigate(detailPath);
        }
      }}
    >
      <img
        className="product-card-horizontal__thumbnail"
        src={imageSrc}
        alt={product.name}
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = ProductHeroImage;
        }}
      />
      <div className="product-card-horizontal__content">
        <button
          className="product-card-horizontal__title"
          type="button"
          onClick={handleTitleClick}
        >
          {product.name}
        </button>
        <div className="product-card-horizontal__rating">
          <Rating rating={product.rating} />
        </div>
        <div className="product-card-horizontal__bottom">
          <div className="product-card-horizontal__price">₩{product.price.toLocaleString("ko-KR")}</div>
          {action && <div className="product-card-horizontal__action">{action}</div>}
        </div>
      </div>
    </div>
  );
}

export default ProductCardHorizontal;
