import { useState } from "react";
import LikeCircle from "components/like/like_circle";
import Cart_straight from "assets/Icons/cart-straight.svg";

function PackageCard({ title, description, price, mainImage, detailItems, defaultOpen = true }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className={`pakage_box ${isOpen ? "is-open" : ""}`}>
      <div className="pakage_big">
        <img src={mainImage} alt="pakage_img" className="pakage_img" />
        <div className="pakage_texts">
          <p>{title}</p>
          <p className="gray_text">{description}</p>
          <div className="pakage_bottom">
            <p>{price}</p>
            <div className="icons">
              <button type="button">
                <img src={Cart_straight} alt="cart" />
              </button>
              <LikeCircle />
            </div>
          </div>
        </div>
      </div>
      <div className="pakage_small">
        <div className="pakage_small_inner">
          {detailItems.map((item, index) => (
            <div className="pakage_inner" key={`${item.label}-${index}`}>
              <div className="pakage_img_box">
                <img src={item.image} alt="" />
              </div>
              <div className="pakage_item">
                <p>{item.label}</p>
                <p className="gray_text">{item.title}</p>
                <p className="gray_text">{item.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className={`chevron ${isOpen ? "is-open" : ""}`}
        aria-expanded={isOpen}
        aria-label="패키지 상세 항목 보기"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <svg viewBox="0 0 24 12">
          <path d="M2 10L12 2L22 10" />
        </svg>
      </button>
    </div>
  );
}

export default PackageCard;
