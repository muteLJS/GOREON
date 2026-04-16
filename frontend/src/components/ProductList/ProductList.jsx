import "./ProductList.scss";

import ProductListRow from "../ProductList-row/ProductList-row";

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
