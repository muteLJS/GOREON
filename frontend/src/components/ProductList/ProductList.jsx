/* -------------------------------------------------------------------------- */
/* [컴포넌트] 상품 리스트 (ProductList)                                         */
/* 설명: 상품 카드 배열을 받아 반복 렌더링하는 리스트 컴포넌트입니다.           */
/* -------------------------------------------------------------------------- */

import styles from "./ProductList.module.scss";
import { registerModuleStyles } from "styles/registerModuleStyles";

import ProductListRow from "components/ProductList-row/ProductList-row";

registerModuleStyles(styles);

function ProductList({
  items,
  selectedIds,
  onSelectItem,
  onChangeQuantity,
  onCartClick,
  onWishClick,
}) {
  return (
    <div className="product-list">
      {items.map((item) => (
        <ProductListRow
          key={item.id}
          item={item}
          isSelected={selectedIds.includes(item.id)}
          onSelect={() => onSelectItem(item.id)}
          onDecrease={() => onChangeQuantity(item.id, item.quantity - 1)}
          onIncrease={() => onChangeQuantity(item.id, item.quantity + 1)}
          onCartClick={() => onCartClick?.(item)}
          onWishClick={() => onWishClick?.(item)}
        />
      ))}
    </div>
  );
}

export default ProductList;
