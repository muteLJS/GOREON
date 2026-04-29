import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import PrevIcon from "assets/icons/prev.svg";
import CouponIcon from "assets/event/couponIcon.svg";
import { fetchProducts as fetchProductList } from "@/api/products";

import EventModalStepShell from "./EventModalStepShell";

const formatPrice = (price) => `${Number(price).toLocaleString("ko-KR")}원`;
const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;

const toProductSummary = (product) => {
  const image = product.image || product.thumbnail || "";

  return {
    id: String(product._id),
    _id: String(product._id),
    productId: String(product._id),
    name: product.name,
    option: product.priceOptions?.[0]?.optionName || product.option || "옵션명: 용량, 뭐 등등",
    originalPrice: parsePrice(product.price),
    image,
  };
};

function MyBenefitView({ titleId, benefitConfigs, coupon, onBack }) {
  const navigate = useNavigate();
  const benefitConfig = benefitConfigs[0];
  const [products, setProducts] = useState([]);

  const productItems = useMemo(() => {
    return products.map((product) => ({
      ...product,
      originalPriceText: formatPrice(product.originalPrice),
      discountLabel: `${coupon.discountRate}% 쿠폰 적용가`,
      discountPriceText: formatPrice(
        Math.round(product.originalPrice * (1 - coupon.discountRate / 100)),
      ),
    }));
  }, [coupon.discountRate, products]);

  useEffect(() => {
    const controller = new AbortController();

    const loadProducts = async () => {
      try {
        const nextProducts = (
          await fetchProductList({
            params: { type: benefitConfig.productQueryType },
            signal: controller.signal,
          })
        )
          .slice(0, benefitConfig.productLimit)
          .map((product) => toProductSummary(product));

        setProducts(nextProducts);
      } catch (error) {
        if (error.name !== "CanceledError") {
          setProducts([]);
        }
      }
    };

    loadProducts();

    return () => controller.abort();
  }, [benefitConfig.productLimit, benefitConfig.productQueryType]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  return (
    <EventModalStepShell
      titleId={titleId}
      className="event-modal-view--benefit"
      toolbar={
        <>
          <button type="button" className="event-modal__icon-button" onClick={onBack}>
            <img src={PrevIcon} alt="" />
          </button>
          <span id={titleId} className="event-modal-view__toolbar-title">
            {benefitConfig.headerTitle}
          </span>
        </>
      }
    >
      <section className="event-modal-benefit__summary" aria-labelledby={titleId}>
        <div className="event-modal-benefit__summary-copy">
          <strong className="event-modal-benefit__summary-title">
            <span className="event-modal-benefit__summary-rate">{coupon.discountRate}%</span>
            {coupon.title.replace(`${coupon.discountRate}%`, "")}
          </strong>
          <span className="event-modal-benefit__summary-expire">{coupon.expireText}</span>
        </div>
        <img src={CouponIcon} alt="" className="event-modal-benefit__summary-icon" />
      </section>

      <section className="event-modal-benefit__recommendation">
        <div className="event-modal-benefit__recommendation-header">
          <h2 className="event-modal-benefit__recommendation-title">
            {benefitConfig.recommendationTitle}
          </h2>
          <span className="event-modal-benefit__recommendation-badge">
            {benefitConfig.recommendationBadge}
          </span>
        </div>
        <p className="event-modal-benefit__recommendation-description">
          {benefitConfig.recommendationDescription}
        </p>
      </section>

      <ul className="event-modal-benefit__list">
        {productItems.map((product) => (
          <li key={product._id} className="event-modal-benefit__item">
            <button
              type="button"
              className="event-modal-benefit__link"
              onClick={() => handleProductClick(product._id)}
            >
              <img src={product.image} alt={product.name} className="event-modal-benefit__thumb" />
              <div className="event-modal-benefit__item-body">
                <strong className="event-modal-benefit__item-title">{product.name}</strong>
                <p className="event-modal-benefit__item-option">{product.option}</p>
                <p className="event-modal-benefit__item-price">{product.originalPriceText}</p>
                <div className="event-modal-benefit__item-discount">
                  <span className="event-modal-benefit__item-discount-label">
                    {product.discountLabel}
                  </span>
                  <strong className="event-modal-benefit__item-discount-price">
                    {product.discountPriceText}
                  </strong>
                </div>
              </div>
            </button>
          </li>
        ))}
      </ul>
    </EventModalStepShell>
  );
}

export default MyBenefitView;
