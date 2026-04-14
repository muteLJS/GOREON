/* -------------------------------------------------------------------------- */
/* [컴포넌트] 상품 리스트 행 (ProductListRow)                                   */
/* 설명: 장바구니에서 사용하는 가로형 상품 카드 UI 컴포넌트입니다.              */
/* -------------------------------------------------------------------------- */

import "./ProductList-row.scss";

import { Link } from "react-router-dom";

import CartIcon from "assets/icons/cart-straight.svg";
import LikeAfterIcon from "assets/icons/like-after.svg";
import ProductListNamePrice from "components/ProductList-name,price/ProductList-name,price";

function formatPrice(price) {
  return `₩ ${price.toLocaleString("ko-KR")}`;
}

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

function ProductListRow({
  item,
  isSelected,
  onSelect,
  onDecrease,
  onIncrease,
  onCartClick,
  onWishClick,
}) {
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

        <button
          type="button"
          className="product-list-row__overlay-button product-list-row__overlay-button--cart"
          aria-label="장바구니 담기"
          onClick={onCartClick}
        >
          <img src={CartIcon} alt="" />
        </button>

        <button
          type="button"
          className="product-list-row__overlay-button product-list-row__overlay-button--wish"
          aria-label="찜하기"
          onClick={onWishClick}
        >
          <img src={LikeAfterIcon} alt="" />
        </button>
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
