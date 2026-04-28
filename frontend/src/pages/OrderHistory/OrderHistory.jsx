import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductHeroImage from "@/assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";
import { useToast } from "@/components/Toast/toastContext";
import ReviewWrite from "@/components/ReviewWrite/ReviewWrite";
import { normalizeImageUrl } from "@/utils/image";
import api from "../../utils/api";
import "./OrderHistory.scss";

const PROGRESS_STEPS = [
  { label: "장바구니", num: 1, href: "/cart" },
  { label: "결제", num: 2, href: "/payment" },
  { label: "주문내역", num: 3, href: "/order-history" },
];

const formatOrderDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}.${month}.${day}`;
};

const groupOrdersByDate = (orders) => {
  const groups = new Map();

  orders.forEach((order) => {
    const dateKey = formatOrderDate(order.orderedAt);

    if (!groups.has(dateKey)) {
      groups.set(dateKey, []);
    }

    const items = Array.isArray(order.items) ? order.items : [];

    groups.get(dateKey).push(
      ...items.map((item, index) => ({
        ...item,
        orderId: order._id,
        orderStatus: order.status,
        itemKey: `${order._id}-${item.product}-${index}`,
      })),
    );
  });

  return Array.from(groups.entries()).map(([date, items]) => ({
    date,
    items,
  }));
};

function OrderHistory() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [orders, setOrders] = useState([]);
  const [fetchStatus, setFetchStatus] = useState("loading");
  const [reviewTarget, setReviewTarget] = useState(null);
  const [confirmingOrderIds, setConfirmingOrderIds] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchOrders = async () => {
      try {
        setFetchStatus("loading");

        const response = await api.get("/orders/me");
        const nextOrders = Array.isArray(response.data) ? response.data : [];

        if (!isMounted) {
          return;
        }

        setOrders(nextOrders);
        setFetchStatus("success");
      } catch (error) {
        if (!isMounted) {
          return;
        }

        if (error.response?.status === 401) {
          navigate("/login", { state: { from: "/order-history" } });
          return;
        }

        setOrders([]);
        setFetchStatus("error");
      }
    };

    fetchOrders();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  const groupedOrders = useMemo(() => groupOrdersByDate(orders), [orders]);

  const handleConfirmPurchase = async (orderId) => {
    try {
      setConfirmingOrderIds((prev) => [...prev, orderId]);

      const response = await api.patch(`/orders/${orderId}/confirm`);
      const confirmedOrder = response.data;

      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order._id === confirmedOrder._id ? confirmedOrder : order,
        ),
      );

      showToast("구매가 확정되었습니다.");
    } catch (error) {
      showToast(error.response?.data?.message || "구매 확정에 실패했습니다.");
    } finally {
      setConfirmingOrderIds((prev) => prev.filter((id) => id !== orderId));
    }
  };

  const handleTrackDelivery = () => {
    showToast("배송 조회 서비스 준비중입니다.");
  };

  const renderItemActions = (item) => {
    const isConfirmed = item.orderStatus === "confirmed";
    const isConfirming = confirmingOrderIds.includes(item.orderId);

    if (!isConfirmed) {
      return (
        <button
          type="button"
          className="order-history-item__action-button order-history-item__action-button--confirm"
          onClick={() => handleConfirmPurchase(item.orderId)}
          disabled={isConfirming}
        >
          {isConfirming ? "처리중..." : "구매 확정"}
        </button>
      );
    }

    return (
      <>
        <button
          type="button"
          className="order-history-item__action-button order-history-item__action-button--delivery"
          onClick={handleTrackDelivery}
        >
          배송 조회
        </button>
        <button
          type="button"
          className="order-history-item__action-button order-history-item__action-button--review"
          onClick={() => setReviewTarget({ productId: item.product })}
        >
          리뷰 작성
        </button>
      </>
    );
  };

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
          {fetchStatus === "loading" ? (
            <section className="order-history-page__group">
              <div className="order-history-page__card">
                <p>주문내역을 불러오는 중입니다.</p>
              </div>
            </section>
          ) : fetchStatus === "error" ? (
            <section className="order-history-page__group">
              <div className="order-history-page__card">
                <p>주문내역을 불러오지 못했습니다.</p>
              </div>
            </section>
          ) : groupedOrders.length === 0 ? (
            <section className="order-history-page__group">
              <div className="order-history-page__card">
                <p>주문내역이 없습니다.</p>
              </div>
            </section>
          ) : (
            groupedOrders.map((group) => (
              <section key={group.date} className="order-history-page__group">
                <div className="order-history-page__date-row">
                  <p className="order-history-page__date">{group.date}</p>
                  <div className="order-history-page__date-line" />
                </div>

                <div className="order-history-page__card">
                  {group.items.map((item, idx) => {
                    const itemKey = item.itemKey;
                    const thumbSrc = normalizeImageUrl(item.thumb) || ProductHeroImage;

                    return (
                      <div key={itemKey}>
                        <article className="order-history-item">
                          <div className="order-history-item__top">
                            <div className="order-history-item__thumb">
                              <img
                                src={thumbSrc}
                                alt={item.name}
                                onError={(event) => {
                                  event.currentTarget.onerror = null;
                                  event.currentTarget.src = ProductHeroImage;
                                }}
                              />
                            </div>

                            <div className="order-history-item__info">
                              <p className="order-history-item__category">{item.category}</p>
                              <p className="order-history-item__name">{item.name}</p>
                              <p className="order-history-item__desc" />
                              <p className="order-history-item__option">{item.option}</p>
                              <span className="order-history-item__price">
                                {Number(item.price || 0).toLocaleString("ko-KR")}
                              </span>
                            </div>

                            <div className="order-history-item__action">
                              {renderItemActions(item)}
                            </div>
                          </div>

                          <div className="order-history-item__action--mobile">
                            {renderItemActions(item)}
                          </div>
                        </article>

                        {idx < group.items.length - 1 && (
                          <div className="order-history-item__divider" />
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>
      </div>

      {reviewTarget && (
        <ReviewWrite productId={reviewTarget.productId} onClose={() => setReviewTarget(null)} />
      )}
    </section>
  );
}

export default OrderHistory;
