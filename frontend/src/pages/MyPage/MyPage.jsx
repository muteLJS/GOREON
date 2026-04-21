import "./MyPage.scss";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import AiBadgeIcon from "@/assets/icons/mypage_ai.png";
import CartStraightIcon from "@/assets/icons/cart-straight.svg";
import LikeAfterIcon from "@/assets/icons/like-after.svg";
import LikeBeforeIcon from "@/assets/icons/like-before.svg";
import ReviewIcon from "@/assets/icons/review.png";
import products from "@/data/products_list.json";
import { addToCart } from "@/store/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/store/slices/wishlistSlice";

const FALLBACK_USER = {
  name: "NickName",
  email: "abcd123@gmail.com",
  phone: "010-1234-5678",
};

const INFO_FIELDS = [
  { key: "name", label: "닉네임" },
  { key: "email", label: "이메일" },
  { key: "phone", label: "전화번호" },
];

const INITIAL_HISTORY_COUNT = 2;

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;
const getProductId = (product) => product?._id ?? product?.productId ?? product?.id ?? 1;

const formatPrice = (value) =>
  `₩${new Intl.NumberFormat("ko-KR").format(parsePrice(value))}`;

const buildCartPayload = (product) => {
  const productId = getProductId(product);

  return {
    id: product.id ?? productId,
    productId,
    category: product?.category ?? "상품",
    name: product?.name ?? product?.title ?? "상품명",
    option: product?.option ?? product?.spec ?? "기본 옵션",
    price: parsePrice(product?.price),
    image: product?.image ?? product?.heroImage ?? "",
    quantity: 1,
  };
};

const buildWishlistPayload = (product) => {
  const productId = getProductId(product);

  return {
    id: productId,
    name: product?.name ?? product?.title ?? "상품명",
    price: parsePrice(product?.price),
    image: product?.image ?? product?.heroImage ?? "",
    rating: Number(product?.rating) || 0,
  };
};

const showActionAlert = (message) => {
  if (typeof window === "undefined") {
    return;
  }

  window.alert(message);
};

const mappedProducts = products.slice(0, 24).map((product, index) => ({
  id: product.id ?? index + 1,
  name: product.name ?? `추천 상품 ${index + 1}`,
  price: formatPrice(product.price),
  image: product.image ?? "",
  spec: product.priceOptions?.[0]?.optionName ?? "M3칩 / GPU / 발열 안정",
  desc: "영상 편집에 적합한 고성능 노트북",
  tags: ["#영상편집", "#영상편집"],
}));

const recentProducts = mappedProducts.slice(0, 6);

const aiHistory = [
  {
    date: "2026.04.07",
    title: "영상 편집용 추천이에요.",
    subtitle: "250만원 이하 / 휴대성 고려",
    items: mappedProducts.slice(0, 4),
  },
  {
    date: "2026.04.05",
    title: "가성비 노트북 추천이에요.",
    subtitle: "100만원 이하 / 가성비 / 기본 작업용",
    items: mappedProducts.slice(4, 8),
  },
  {
    date: "2026.04.03",
    title: "대학생용 노트북 추천이에요.",
    subtitle: "가벼운 무게 / 문서 작업 중점",
    items: mappedProducts.slice(8, 12),
  },
  {
    date: "2026.04.01",
    title: "출장용 노트북 추천이에요.",
    subtitle: "배터리 우선 / 휴대성 중점",
    items: mappedProducts.slice(12, 16),
  },
  {
    date: "2026.03.29",
    title: "게임 겸용 노트북 추천이에요.",
    subtitle: "그래픽 성능 / 쿨링 고려",
    items: mappedProducts.slice(16, 20),
  },
];

function MetricIcon({ type }) {
  if (type === "cart") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M3.5 5.5h2.6l1.8 8h9.2l1.9-5.8H7.6" />
        <circle cx="10" cy="18.5" r="1.5" />
        <circle cx="17" cy="18.5" r="1.5" />
      </svg>
    );
  }

  if (type === "wish") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 19.3 5.4 13a4.2 4.2 0 0 1 5.9-6l.7.7.7-.7a4.2 4.2 0 1 1 5.9 6Z" />
      </svg>
    );
  }

  return <img src={ReviewIcon} alt="" />;
}

function EditableField({ field, value, activeField, onChange, onToggle }) {
  const isEditing = activeField === field.key;

  return (
    <div className="my-page__info-item">
      <p className="my-page__info-label">{field.label}</p>
      <div className="my-page__info-row">
        <div className="my-page__info-value">
          {isEditing ? (
            <input
              type={field.key === "email" ? "email" : "text"}
              value={value}
              onChange={(event) => onChange(field.key, event.target.value)}
            />
          ) : (
            <span>{value}</span>
          )}
        </div>
        <button
          type="button"
          className={`my-page__edit-button ${
            isEditing ? "my-page__edit-button--done" : "my-page__edit-button--edit"
          }`}
          onClick={() => onToggle(field.key)}
        >
          {isEditing ? "완료" : "수정"}
        </button>
      </div>
    </div>
  );
}

function ProductRailCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const productId = getProductId(product);
  const isWishlisted = wishlistItems.some((item) => item.id === productId);

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(addToCart(buildCartPayload(product)));
    showActionAlert("장바구니에 추가되었습니다.");
  };

  const handleToggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));
      showActionAlert("찜한 상품에서 제거되었습니다.");
      return;
    }

    dispatch(addToWishlist(buildWishlistPayload(product)));
    showActionAlert("찜한 상품에 추가 되었습니다.");
  };

  return (
    <article className="my-page__rail-card">
      <div className="my-page__rail-card-media-wrap">
        <Link to={`/product/${product.id}`} className="my-page__rail-card-media">
          <img src={product.image} alt={product.name} />
        </Link>
        <div className="my-page__rail-card-actions">
          <button type="button" aria-label="장바구니 담기" onClick={handleAddToCart}>
            <img src={CartStraightIcon} alt="" />
          </button>
          <button
            type="button"
            aria-label={isWishlisted ? "찜 해제" : "찜하기"}
            onClick={handleToggleWishlist}
          >
            <img src={isWishlisted ? LikeAfterIcon : LikeBeforeIcon} alt="" />
          </button>
        </div>
      </div>
      <Link to={`/product/${product.id}`} className="my-page__rail-card-copy">
        <p className="my-page__rail-card-name">{product.name}</p>
        <p className="my-page__rail-card-price">{product.price}</p>
      </Link>
    </article>
  );
}

function AiRecommendationCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const productId = getProductId(product);
  const isWishlisted = wishlistItems.some((item) => item.id === productId);

  const handleAddToCart = (event) => {
    event.preventDefault();
    event.stopPropagation();

    dispatch(addToCart(buildCartPayload(product)));
    showActionAlert("장바구니에 추가되었습니다.");
  };

  const handleToggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (isWishlisted) {
      dispatch(removeFromWishlist(productId));
      showActionAlert("찜한 상품에서 제거되었습니다.");
      return;
    }

    dispatch(addToWishlist(buildWishlistPayload(product)));
    showActionAlert("찜한 상품에 추가 되었습니다.");
  };

  return (
    <article className="my-page__ai-card">
      <div className="my-page__ai-card-media-wrap">
        <Link to={`/product/${product.id}`} className="my-page__ai-card-media">
          <img src={product.image} alt={product.name} />
        </Link>
        <div className="my-page__ai-card-actions">
          <button type="button" aria-label="장바구니 담기" onClick={handleAddToCart}>
            <img src={CartStraightIcon} alt="" />
          </button>
          <button
            type="button"
            aria-label={isWishlisted ? "찜 해제" : "찜하기"}
            onClick={handleToggleWishlist}
          >
            <img src={isWishlisted ? LikeAfterIcon : LikeBeforeIcon} alt="" />
          </button>
        </div>
      </div>

      <Link to={`/product/${product.id}`} className="my-page__ai-card-copy">
        <p className="my-page__ai-card-name">{product.name}</p>
        <p className="my-page__ai-card-desc">{product.desc}</p>
        <p className="my-page__ai-card-spec">{product.spec}</p>
        <div className="my-page__ai-card-tags">
          {product.tags.map((tag) => (
            <span key={`${product.id}-${tag}`}>{tag}</span>
          ))}
        </div>
        <p className="my-page__ai-card-price">{product.price}</p>
      </Link>
    </article>
  );
}

export default function MyPage() {
  const userInfo = useSelector((state) => state.user.userInfo);
  const cartCount = useSelector((state) => state.cart.items.length);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const displayUser = {
    ...FALLBACK_USER,
    ...userInfo,
  };

  const [profileDraft, setProfileDraft] = useState(displayUser);
  const [editingField, setEditingField] = useState("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(INITIAL_HISTORY_COUNT);
  const [renderedHistoryCount, setRenderedHistoryCount] = useState(INITIAL_HISTORY_COUNT);
  const [isHistoryAnimating, setIsHistoryAnimating] = useState(false);
  const historyShellRef = useRef(null);
  const historyListRef = useRef(null);
  const recentRailRef = useRef(null);
  const recentRailDragRef = useRef({
    pointerId: null,
    startX: 0,
    startY: 0,
    startScrollLeft: 0,
    isDragging: false,
  });
  const recentRailDidDragRef = useRef(false);
  const historyAnimationFrameRef = useRef(null);
  const pendingHistoryCountRef = useRef(null);
  const pendingHistoryHeightRef = useRef(null);
  const [historyListHeight, setHistoryListHeight] = useState(0);

  useEffect(() => {
    setProfileDraft(displayUser);
  }, [displayUser.email, displayUser.name, displayUser.phone]);

  useEffect(() => {
    if (!historyListRef.current) {
      return;
    }

    setHistoryListHeight(historyListRef.current.scrollHeight);
  }, []);

  useEffect(() => {
    return () => {
      if (historyAnimationFrameRef.current) {
        window.cancelAnimationFrame(historyAnimationFrameRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!historyListRef.current || isHistoryAnimating) {
      return;
    }

    setHistoryListHeight(historyListRef.current.scrollHeight);
  }, [isHistoryAnimating, renderedHistoryCount]);

  useEffect(() => {
    if (!historyListRef.current || isHistoryAnimating || typeof ResizeObserver === "undefined") {
      return;
    }

    const list = historyListRef.current;
    const observer = new ResizeObserver(() => {
      if (isHistoryAnimating || !historyListRef.current) {
        return;
      }

      setHistoryListHeight(historyListRef.current.scrollHeight);
    });

    observer.observe(list);

    return () => {
      observer.disconnect();
    };
  }, [isHistoryAnimating, renderedHistoryCount]);

  const metrics = [
    { key: "cart", label: "장바구니", value: cartCount, href: "/cart" },
    { key: "wish", label: "찜한 상품", value: wishlistCount, href: "/wishlist" },
    { key: "review", label: "주문내역", value: 3, href: "/order-history" },
  ];

  const handleFieldChange = (field, nextValue) => {
    setProfileDraft((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const handleFieldToggle = (field) => {
    setEditingField((prev) => (prev === field ? "" : field));
  };

  const resetRecentRailDrag = () => {
    const rail = recentRailRef.current;

    if (rail) {
      rail.classList.remove("is-dragging");
    }

    recentRailDragRef.current = {
      pointerId: null,
      startX: 0,
      startY: 0,
      startScrollLeft: 0,
      isDragging: false,
    };
  };

  const handleRecentRailPointerDown = (event) => {
    const rail = recentRailRef.current;

    if (!rail) {
      return;
    }

    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    if (event.target.closest("button")) {
      return;
    }

    recentRailDidDragRef.current = false;
    recentRailDragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startScrollLeft: rail.scrollLeft,
      isDragging: false,
    };

    rail.setPointerCapture?.(event.pointerId);
  };

  const handleRecentRailPointerMove = (event) => {
    const rail = recentRailRef.current;
    const dragState = recentRailDragRef.current;

    if (!rail || dragState.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - dragState.startX;
    const deltaY = event.clientY - dragState.startY;

    if (!dragState.isDragging) {
      if (Math.abs(deltaX) < 6 && Math.abs(deltaY) < 6) {
        return;
      }

      if (Math.abs(deltaX) <= Math.abs(deltaY)) {
        resetRecentRailDrag();
        return;
      }

      dragState.isDragging = true;
      recentRailDidDragRef.current = true;
      rail.classList.add("is-dragging");
    }

    rail.scrollLeft = dragState.startScrollLeft - deltaX;
  };

  const handleRecentRailPointerEnd = (event) => {
    const rail = recentRailRef.current;
    const dragState = recentRailDragRef.current;

    if (!rail || dragState.pointerId !== event.pointerId) {
      return;
    }

    rail.releasePointerCapture?.(event.pointerId);

    if (dragState.isDragging) {
      window.requestAnimationFrame(() => {
        recentRailDidDragRef.current = false;
      });
    }

    resetRecentRailDrag();
  };

  const handleRecentRailClickCapture = (event) => {
    if (!recentRailDidDragRef.current) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();
  };

  const getCurrentHistoryHeight = () => {
    if (!historyShellRef.current) {
      return 0;
    }

    return Math.ceil(historyShellRef.current.getBoundingClientRect().height);
  };

  const measureCollapsedHistoryHeight = (nextCount) => {
    if (!historyShellRef.current || !historyListRef.current) {
      return 0;
    }

    const shell = historyShellRef.current;
    const list = historyListRef.current;
    const measureWrap = document.createElement("div");
    const clone = list.cloneNode(true);

    while (clone.children.length > nextCount) {
      clone.removeChild(clone.lastElementChild);
    }

    measureWrap.style.position = "absolute";
    measureWrap.style.left = "0";
    measureWrap.style.top = "0";
    measureWrap.style.width = `${shell.clientWidth}px`;
    measureWrap.style.height = "auto";
    measureWrap.style.overflow = "visible";
    measureWrap.style.visibility = "hidden";
    measureWrap.style.pointerEvents = "none";
    measureWrap.style.zIndex = "-1";
    measureWrap.appendChild(clone);
    shell.appendChild(measureWrap);

    const measuredHeight = Math.ceil(clone.getBoundingClientRect().height);
    shell.removeChild(measureWrap);

    return measuredHeight;
  };

  const animateHistoryCountChange = (nextCount) => {
    if (!historyListRef.current) {
      setVisibleHistoryCount(nextCount);
      setRenderedHistoryCount(nextCount);
      return;
    }

    if (historyAnimationFrameRef.current) {
      window.cancelAnimationFrame(historyAnimationFrameRef.current);
    }

    const startHeight = getCurrentHistoryHeight();
    setHistoryListHeight(startHeight);
    setIsHistoryAnimating(true);

    if (nextCount > renderedHistoryCount) {
      setVisibleHistoryCount(nextCount);
      setRenderedHistoryCount(nextCount);
      pendingHistoryCountRef.current = null;
      pendingHistoryHeightRef.current = null;

      historyAnimationFrameRef.current = window.requestAnimationFrame(() => {
        historyAnimationFrameRef.current = window.requestAnimationFrame(() => {
          if (!historyListRef.current) {
            return;
          }

          setHistoryListHeight(historyListRef.current.scrollHeight);
        });
      });

      return;
    }

    const nextHeight = measureCollapsedHistoryHeight(nextCount) || startHeight;

    pendingHistoryCountRef.current = nextCount;
    pendingHistoryHeightRef.current = nextHeight;

    if (Math.abs(startHeight - nextHeight) < 1) {
      pendingHistoryCountRef.current = null;
      pendingHistoryHeightRef.current = null;
      setVisibleHistoryCount(nextCount);
      setRenderedHistoryCount(nextCount);
      setHistoryListHeight(nextHeight);
      setIsHistoryAnimating(false);
      return;
    }

    historyAnimationFrameRef.current = window.requestAnimationFrame(() => {
      setHistoryListHeight(nextHeight);
    });
  };

  const visibleHistory = aiHistory.slice(0, renderedHistoryCount);
  const hasMoreHistory = visibleHistoryCount < aiHistory.length;
  const canToggleHistory = aiHistory.length > INITIAL_HISTORY_COUNT;

  return (
    <main className="my-page">
      <div className="my-page__mobile-frame">
        <header className="my-page__header">
          <h1>마이 페이지</h1>
        </header>

        <section className="my-page__profile-card">
          <div className="my-page__profile-main">
            <p className="my-page__nickname">{profileDraft.name}</p>
            <p className="my-page__email">{profileDraft.email}</p>
          </div>

          <div className="my-page__metrics">
            {metrics.map((metric, index) => (
              <Link key={metric.key} to={metric.href} className="my-page__metric">
                <span
                  className={`my-page__metric-icon ${
                    metric.key === "review" ? "my-page__metric-icon--review" : ""
                  }`}
                >
                  <MetricIcon type={metric.key} />
                </span>
                <strong>{metric.value}</strong>
                <span>{metric.label}</span>
                {index < metrics.length - 1 ? <i className="my-page__metric-divider" /> : null}
              </Link>
            ))}
          </div>
        </section>

        <div className="my-page__overview-grid">
          <section className="my-page__section">
            <h2 className="my-page__section-title">개인정보 수정</h2>
            <div className="my-page__info-panel">
              {INFO_FIELDS.map((field) => (
                <EditableField
                  key={field.key}
                  field={field}
                  value={profileDraft[field.key] ?? ""}
                  activeField={editingField}
                  onChange={handleFieldChange}
                  onToggle={handleFieldToggle}
                />
              ))}
            </div>
          </section>

          <section className="my-page__section">
            <h2 className="my-page__section-title">최근 본 상품</h2>
            <div className="my-page__recent-panel">
              <div
                ref={recentRailRef}
                className="my-page__rail"
                onPointerDown={handleRecentRailPointerDown}
                onPointerMove={handleRecentRailPointerMove}
                onPointerUp={handleRecentRailPointerEnd}
                onPointerCancel={handleRecentRailPointerEnd}
                onClickCapture={handleRecentRailClickCapture}
              >
                {recentProducts.map((product) => (
                  <ProductRailCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          </section>
        </div>

        <section className="my-page__section">
          <h2 className="my-page__section-title">AI 추천 기록</h2>
          <div
            ref={historyShellRef}
            className="my-page__history-list-shell"
            style={{ height: `${historyListHeight}px` }}
            onTransitionEnd={(event) => {
              if (
                event.target !== event.currentTarget ||
                event.propertyName !== "height"
              ) {
                return;
              }

              if (pendingHistoryCountRef.current !== null) {
                const nextCount = pendingHistoryCountRef.current;
                const nextHeight = pendingHistoryHeightRef.current;
                pendingHistoryCountRef.current = null;
                pendingHistoryHeightRef.current = null;
                setVisibleHistoryCount(nextCount);
                setRenderedHistoryCount(nextCount);

                historyAnimationFrameRef.current = window.requestAnimationFrame(() => {
                  if (!historyListRef.current) {
                    setIsHistoryAnimating(false);
                    return;
                  }

                  setHistoryListHeight(
                    nextHeight ?? Math.ceil(historyListRef.current.getBoundingClientRect().height),
                  );
                  setIsHistoryAnimating(false);
                });

                return;
              }

              if (!historyListRef.current) {
                setIsHistoryAnimating(false);
                return;
              }

              setHistoryListHeight(historyListRef.current.scrollHeight);
              setIsHistoryAnimating(false);
            }}
          >
            <div ref={historyListRef} className="my-page__history-list">
              {visibleHistory.map((history) => (
                <article key={history.date} className="my-page__history-group">
                  <div className="my-page__history-date-row">
                    <p className="my-page__history-date">{history.date}</p>
                    <div className="my-page__history-line" />
                  </div>

                  <div className="my-page__history-panel">
                    <div className="my-page__history-head">
                      <img src={AiBadgeIcon} alt="" className="my-page__history-badge" />
                      <div>
                        <p className="my-page__history-title">{history.title}</p>
                        <p className="my-page__history-subtitle">{history.subtitle}</p>
                      </div>
                    </div>

                    <div
                      className={`my-page__ai-grid ${
                        history.items.length >= 3 ? "my-page__ai-grid--slider" : ""
                      }`}
                    >
                      {history.items.map((product) => (
                        <AiRecommendationCard
                          key={`${history.date}-${product.id}`}
                          product={product}
                        />
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        {canToggleHistory ? (
          <div className="my-page__more-wrap">
            <button
              type="button"
              className="my-page__more-button"
              disabled={isHistoryAnimating}
              onClick={() => {
                if (hasMoreHistory) {
                  animateHistoryCountChange(
                    Math.min(visibleHistoryCount + 2, aiHistory.length),
                  );
                  return;
                }

                animateHistoryCountChange(INITIAL_HISTORY_COUNT);
              }}
            >
              {hasMoreHistory ? "과거 검색결과 더보기" : "과거 검색결과 접기"}
            </button>
          </div>
        ) : null}
      </div>
    </main>
  );
}
