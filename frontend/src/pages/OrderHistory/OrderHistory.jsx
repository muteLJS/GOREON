import { useState } from "react";
import { Link } from "react-router-dom";
import ReviewWrite from "@/components/ReviewWrite/ReviewWrite";
import "./OrderHistory.scss";

const ORDER_DATA = [
  {
    date: "2026.04.16",
    items: [
      {
        id: 1,
        category: "CPU",
        name: "인텔 코어i5-14세대 14400F",
        desc: "(랩터레이크 리프레시) (밸류팩 정품)",
        option: "옵션명:용량, 뭐 등등",
        price: "₩ 20,000",
        thumb: "/images/cpu.png",
      },
      {
        id: 2,
        category: "CPU",
        name: "인텔 코어i5-14세대 14400F",
        desc: "(랩터레이크 리프레시) (밸류팩 정품)",
        option: "옵션명:용량, 뭐 등등",
        price: "₩ 20,000",
        thumb: "/images/cpu.png",
      },
    ],
  },
  {
    date: "2026.04.12",
    items: [
      {
        id: 3,
        category: "CPU",
        name: "인텔 코어i5-14세대 14400F",
        desc: "(랩터레이크 리프레시) (밸류팩 정품)",
        option: "옵션명:용량, 뭐 등등",
        price: "₩ 20,000",
        thumb: "/images/cpu.png",
      },
      {
        id: 4,
        category: "CPU",
        name: "인텔 코어i5-14세대 14400F",
        desc: "(랩터레이크 리프레시) (밸류팩 정품)",
        option: "옵션명:용량, 뭐 등등",
        price: "₩ 20,000",
        thumb: "/images/cpu.png",
      },
    ],
  },
  {
    date: "2026.04.10",
    items: [
      {
        id: 5,
        category: "CPU",
        name: "인텔 코어i5-14세대 14400F",
        desc: "(랩터레이크 리프레시) (밸류팩 정품)",
        option: "옵션명:용량, 뭐 등등",
        price: "₩ 20,000",
        thumb: "/images/cpu.png",
      },
      {
        id: 6,
        category: "CPU",
        name: "인텔 코어i5-14세대 14400F",
        desc: "(랩터레이크 리프레시) (밸류팩 정품)",
        option: "옵션명:용량, 뭐 등등",
        price: "₩ 20,000",
        thumb: "/images/cpu.png",
      },
    ],
  },
];

const PROGRESS_STEPS = [
  { label: "장바구니", num: 1, href: "/cart" },
  { label: "결제", num: 2, href: "/payment" },
  { label: "주문내역", num: 3, href: "/order-history" },
];

function OrderHistory() {
  const [reviewTarget, setReviewTarget] = useState(null);

  return (
    <section className="order-history-page">
      <div className="order-history-page__header">
        <h1 className="order-history-page__title">주문내역</h1>

        <nav className="order-history-page__progress" aria-label="주문 단계">
          <div className="order-history-page__progress-track" />

          {PROGRESS_STEPS.map((step) => (
            <div
              key={step.num}
              className={`order-history-page__progress-step${
                step.num === 3 ? " order-history-page__progress-step--active" : ""
              }`}
            >
              <Link
                to={step.href}
                className="order-history-page__progress-link"
                aria-current={step.num === 3 ? "page" : undefined}
              >
                {step.num}
              </Link>
              <strong>{step.label}</strong>
            </div>
          ))}
        </nav>
      </div>

      <div className="order-history-page__layout">
        <div className="order-history-page__groups">
          {ORDER_DATA.map((group) => (
            <section key={group.date} className="order-history-page__group">
              <div className="order-history-page__date-row">
                <p className="order-history-page__date">{group.date}</p>
                <div className="order-history-page__date-line" />
              </div>

              <div className="order-history-page__card">
                {group.items.map((item, idx) => (
                  <div key={item.id}>
                    <article className="order-history-item">
                      <div className="order-history-item__top">
                        <div className="order-history-item__thumb">
                          <img src={item.thumb} alt={item.name} />
                        </div>

                        <div className="order-history-item__info">
                          <p className="order-history-item__category">{item.category}</p>
                          <p className="order-history-item__name">{item.name}</p>
                          <p className="order-history-item__desc">{item.desc}</p>
                          <p className="order-history-item__option">{item.option}</p>
                          <span className="order-history-item__price">{item.price}</span>
                        </div>

                        <div className="order-history-item__action">
                          <button
                            type="button"
                            className="order-history-item__review-btn"
                            onClick={() => setReviewTarget({ productId: item.id })}
                          >
                            리뷰 작성
                          </button>
                        </div>
                      </div>

                      <div className="order-history-item__action--mobile">
                        <button
                          type="button"
                          className="order-history-item__review-btn"
                          onClick={() => setReviewTarget({ productId: item.id })}
                        >
                          리뷰 작성
                        </button>
                      </div>
                    </article>

                    {idx < group.items.length - 1 && (
                      <div className="order-history-item__divider" />
                    )}
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>

      {reviewTarget && (
        <ReviewWrite productId={reviewTarget.productId} onClose={() => setReviewTarget(null)} />
      )}
    </section>
  );
}

export default OrderHistory;
