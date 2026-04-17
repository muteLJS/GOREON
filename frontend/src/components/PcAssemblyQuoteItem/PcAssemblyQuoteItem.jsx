import "./PcAssemblyQuoteItem.scss";
import QuantityUp from "@/assets/icons/quantity-up.svg";
import QuantityDown from "@/assets/icons/quantity-down.svg";

function PcAssemblyQuoteItem({
  isSelected,
  onSelect,
  productId,
  category,
  name,
  option,
  price,
  quantity,
  image,
  compatibility,
}) {
  return (
    <div className="pc-assembly-quote-item" data-product-id={productId}>
      <label className="pc-assembly-quote-item__select">
        <input type="checkbox" checked={isSelected} onChange={onSelect} />
        <span className="pc-assembly-quote-item__select-mark" />
      </label>

      <div className="pc-assembly-quote-item__image">
        <img src={image} alt={name} />
      </div>

      <div className="pc-assembly-quote-item__info">
        <div className="pc-assembly-quote-item__info-top">
          <div className="pc-assembly-quote-item__info-category">{category}</div>
          <span className={`indicator indicator--${compatibility}`} />
        </div>

        <div className="pc-assembly-quote-item__info-middle">
          <div className="pc-assembly-quote-item__info-name">{name}</div>
          <div className="pc-assembly-quote-item__info-option">
            {`옵션명 : ${option ? option : "-"}`}
          </div>
        </div>

        <div className="pc-assembly-quote-item__info-bottom">
          <div className="pc-assembly-quote-item__info-price">
            ₩ {price.toLocaleString("ko-KR")}
          </div>
          <div className="pc-assembly-quote-item__info-action">
            <button type="button">
              <img src={QuantityDown} alt="" />
            </button>
            <span>{quantity}</span>
            <button type="button">
              <img src={QuantityUp} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PcAssemblyQuoteItem;
