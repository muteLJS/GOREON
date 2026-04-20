import "./ProductList-name,price.scss";

function ProductListNamePrice({ category, name, option, priceLabel, children }) {
  return (
    <div className="product-list-name-price">
      <div className="product-list-name-price__details">
        <p className="product-list-name-price__category">{category}</p>
        <p className="product-list-name-price__name">{name}</p>
        <p className="product-list-name-price__option">{option}</p>
      </div>

      <div className="product-list-name-price__footer">
        <strong className="product-list-name-price__price">{priceLabel}</strong>
        {children}
      </div>
    </div>
  );
}

export default ProductListNamePrice;
