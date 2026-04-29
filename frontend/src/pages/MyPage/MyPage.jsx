import "./MyPage.scss";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import AiBadgeIcon from "@/assets/icons/mypage_ai.png";
import MypageCartIcon from "@/assets/icons/Mypage_cart.svg";
import MypageLikeIcon from "@/assets/icons/Mypage_like.svg";
import ReviewIcon from "@/assets/icons/review.png";
import ProductHeroImage from "@/assets/img/intel-core-ultra5-250kf-plus-product-image-genuine.jpg";
import CartIconButton from "@/components/CartIconButton/CartIconButton";
import { useToast } from "@/components/Toast/toastContext";
import WishlistIconButton from "@/components/WishlistIconButton/WishlistIconButton";
import { logout, updateUserInfo } from "@/store/slices/userSlice";
import { normalizeImageUrl } from "@/utils/image";
import { getProductListKey, getProductObjectId } from "@/utils/productIdentity";
import api from "@/utils/api";

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
const DESKTOP_BREAKPOINT = 1024;

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;
const getProductId = (product) => getProductObjectId(product) ?? "1";

const formatPrice = (value) => `₩${new Intl.NumberFormat("ko-KR").format(parsePrice(value))}`;
const formatHistoryDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "날짜 정보 없음";
  }

  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, "0")}.${String(
    date.getDate(),
  ).padStart(2, "0")}`;
};

const formatHistoryTag = (value) => {
  const normalized = String(value ?? "").trim();

  if (!normalized) {
    return "";
  }

  return normalized.startsWith("#") ? normalized : `#${normalized}`;
};

const createHistoryTitle = (query) => {
  const normalized = String(query ?? "")
    .trim()
    .replace(/[.!?~]+$/g, "");

  if (!normalized) {
    return "AI 추천 결과";
  }

  return `"${normalized}"에 대한 추천 결과예요.`;
};

function MetricIcon({ type }) {
  if (type === "cart") {
    return <img src={MypageCartIcon} alt="" />;
  }

  if (type === "wish") {
    return <img src={MypageLikeIcon} alt="" />;
  }

  return <img src={ReviewIcon} alt="" />;
}

function EditableField({ field, value, activeField, onChange, onToggle }) {
  const isEditing = activeField === field.key;

  return (
    <div className="my-page__info-item">
      <p className="my-page__info-label">{field.label}</p>
      <div className="my-page__info-row">
        <div
          className={`my-page__info-value ${isEditing ? "my-page__info-value--editing" : ""}`.trim()}
        >
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
  const productId = getProductId(product);
  const imageSrc = normalizeImageUrl(product.image) || ProductHeroImage;

  return (
    <article className="my-page__rail-card">
      <div className="my-page__rail-card-media-wrap">
        <Link to={`/product/${productId}`} className="my-page__rail-card-media" draggable={false}>
          <img
            src={imageSrc}
            alt={product.name}
            draggable={false}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = ProductHeroImage;
            }}
          />
        </Link>
      </div>
      <Link to={`/product/${productId}`} className="my-page__rail-card-copy" draggable={false}>
        <p className="my-page__rail-card-name">{product.name}</p>
      </Link>
      <div className="my-page__rail-card-footer">
        <p className="my-page__rail-card-price">{product.price}</p>
        <div className="my-page__rail-card-actions">
          <CartIconButton product={product} size="sm" />
          <WishlistIconButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}

function AiRecommendationCard({ product }) {
  const productId = getProductId(product);
  const imageSrc = normalizeImageUrl(product.image) || ProductHeroImage;

  return (
    <article className="my-page__ai-card">
      <div className="my-page__ai-card-media-wrap">
        <Link to={`/product/${productId}`} className="my-page__ai-card-media">
          <img
            src={imageSrc}
            alt={product.name}
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = ProductHeroImage;
            }}
          />
        </Link>
      </div>

      <div className="my-page__ai-card-content">
        <Link to={`/product/${productId}`} className="my-page__ai-card-copy">
          <p className="my-page__ai-card-name">{product.name}</p>
          <p className="my-page__ai-card-desc">{product.desc}</p>
          {product.tags.length > 0 ? (
            <div className="my-page__ai-card-tags">
              {product.tags.map((tag) => (
                <span key={`${productId}-${tag}`}>{tag}</span>
              ))}
            </div>
          ) : null}
        </Link>
        <p className="my-page__ai-card-price">{product.price}</p>
        <div className="my-page__ai-card-actions">
          <CartIconButton product={product} size="sm" />
          <WishlistIconButton product={product} size="sm" />
        </div>
      </div>
    </article>
  );
}

export default function MyPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const userInfo = useSelector((state) => state.user.userInfo);
  const cartCount = useSelector((state) => state.cart.items.length);
  const wishlistCount = useSelector((state) => state.wishlist.items.length);
  const recentProducts = useSelector((state) => state.recentViewed.items);
  const aiRecommendationHistoryItems = useSelector((state) => state.aiRecommendationHistory.items);
  const displayUser = useMemo(
    () => ({
      ...FALLBACK_USER,
      ...userInfo,
    }),
    [userInfo],
  );
  const aiHistory = useMemo(
    () =>
      aiRecommendationHistoryItems.map((history) => ({
        id: history.id,
        date: formatHistoryDate(history.createdAt),
        title: createHistoryTitle(history.query),
        subtitle: history.message || "상품 데이터 기준으로 추천한 결과입니다.",
        items: Array.isArray(history.products)
          ? history.products.map((product) => ({
              id: getProductObjectId(product),
              _id: getProductObjectId(product),
              productId: getProductObjectId(product),
              name: product.name ?? "추천 상품",
              price: formatPrice(product.price),
              image: product.image ?? "",
              desc: product.reason ?? product.spec ?? "상품 데이터 기준 추천",
              tags:
                product.matchedCriteria?.length > 0
                  ? product.matchedCriteria.slice(0, 3).map(formatHistoryTag).filter(Boolean)
                  : ["#AI추천"],
              rating: Number(product.rating) || 0,
            }))
          : [],
      })),
    [aiRecommendationHistoryItems],
  );

  const [profileDraft, setProfileDraft] = useState(displayUser);
  const [editingField, setEditingField] = useState("");
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(INITIAL_HISTORY_COUNT);
  const [renderedHistoryCount, setRenderedHistoryCount] = useState(INITIAL_HISTORY_COUNT);
  const [isHistoryAnimating, setIsHistoryAnimating] = useState(false);
  const [savingField, setSavingField] = useState("");
  const [isDesktopViewport, setIsDesktopViewport] = useState(() =>
    typeof window === "undefined" ? false : window.innerWidth >= DESKTOP_BREAKPOINT,
  );
  const historyShellRef = useRef(null);
  const historyListRef = useRef(null);
  const historyAnimationFrameRef = useRef(null);
  const pendingHistoryCountRef = useRef(null);
  const pendingHistoryHeightRef = useRef(null);
  const [historyListHeight, setHistoryListHeight] = useState(0);

  useEffect(() => {
    setProfileDraft(displayUser);
  }, [displayUser]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const desktopQuery = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
    const syncViewportState = () => {
      setIsDesktopViewport(desktopQuery.matches);
    };

    syncViewportState();

    if (desktopQuery.addEventListener) {
      desktopQuery.addEventListener("change", syncViewportState);
    } else {
      desktopQuery.addListener(syncViewportState);
    }

    return () => {
      if (desktopQuery.removeEventListener) {
        desktopQuery.removeEventListener("change", syncViewportState);
      } else {
        desktopQuery.removeListener(syncViewportState);
      }
    };
  }, []);

  useEffect(() => {
    const defaultVisibleCount = Math.min(INITIAL_HISTORY_COUNT, aiHistory.length);

    setVisibleHistoryCount((prev) => {
      if (aiHistory.length === 0) {
        return 0;
      }

      return Math.min(Math.max(prev, defaultVisibleCount), aiHistory.length);
    });

    setRenderedHistoryCount((prev) => {
      if (aiHistory.length === 0) {
        return 0;
      }

      return Math.min(Math.max(prev, defaultVisibleCount), aiHistory.length);
    });
  }, [aiHistory.length]);

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const fetchMe = async () => {
      try {
        const response = await api.get("/users/me");

        dispatch(updateUserInfo(response.data));
      } catch (error) {
        console.error("[mypage][me] request failed", {
          message: error.message,
          status: error.response?.status,
          data: error.response?.data,
        });
      }
    };

    fetchMe();
  }, [dispatch, isLoggedIn]);

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

  const renderAiRecommendationItems = (history) => {
    const shouldUseSlider = history.items.length >= 3;
    const gridClassName = `my-page__ai-grid ${shouldUseSlider ? "my-page__ai-grid--slider" : ""}`;

    if (shouldUseSlider && !isDesktopViewport) {
      return (
        <Swiper
          className={gridClassName}
          slidesPerView="auto"
          spaceBetween={10}
          breakpoints={{
            768: {
              spaceBetween: 14,
            },
          }}
          grabCursor
          watchOverflow
        >
          {history.items.map((product) => (
            <SwiperSlide
              key={`${history.id}-${getProductListKey(product)}`}
              className="my-page__ai-slide"
            >
              <AiRecommendationCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>
      );
    }

    return (
      <div className={gridClassName}>
        {history.items.map((product) => (
          <AiRecommendationCard
            key={`${history.id}-${getProductListKey(product)}`}
            product={product}
          />
        ))}
      </div>
    );
  };

  const handleFieldChange = (field, nextValue) => {
    setProfileDraft((prev) => ({
      ...prev,
      [field]: nextValue,
    }));
  };

  const handleLogout = async () => {
    await api.post("/auth/logout").catch((error) => {
      console.warn("[auth][logout] request failed", {
        message: error.message,
        status: error.response?.status,
      });
    });

    dispatch(logout());
    navigate("/");
  };

  const handleFieldToggle = async (field) => {
    if (editingField !== field) {
      setEditingField(field);
      return;
    }

    try {
      setSavingField(field);

      const response = await api.patch("/users/me", {
        name: profileDraft.name,
        email: profileDraft.email,
        phone: profileDraft.phone,
      });

      dispatch(updateUserInfo(response.data));
      setProfileDraft((prev) => ({
        ...prev,
        ...response.data,
      }));
      setEditingField("");
      showToast("회원정보가 수정되었습니다.");
    } catch {
      showToast("회원정보 수정에 실패했습니다.");
    } finally {
      setSavingField("");
    }
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
            <div className="my-page__profile-top">
              <div className="my-page__profile-copy">
                <p className="my-page__nickname">{profileDraft.name}</p>
                <p className="my-page__email">{profileDraft.email}</p>
              </div>
              {isLoggedIn ? (
                <button type="button" className="my-page__logout-button" onClick={handleLogout}>
                  로그아웃
                </button>
              ) : null}
            </div>
          </div>

          <div className="my-page__metrics">
            {metrics.map((metric, index) => (
              <Link key={metric.key} to={metric.href} className="my-page__metric">
                <span className={`my-page__metric-icon my-page__metric-icon--${metric.key}`}>
                  <MetricIcon type={metric.key} />
                </span>
                <strong>{metric.value}</strong>
                <span className="my-page__metric-label">{metric.label}</span>
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
                  activeField={savingField || editingField}
                  onChange={handleFieldChange}
                  onToggle={handleFieldToggle}
                />
              ))}
            </div>
          </section>

          <section className="my-page__section">
            <h2 className="my-page__section-title">최근 본 상품</h2>
            <div
              className={`my-page__recent-panel${
                recentProducts.length === 0 ? " my-page__recent-panel--empty" : ""
              }`}
            >
              {recentProducts.length > 0 ? (
                <Swiper
                  className="my-page__rail"
                  slidesPerView="auto"
                  spaceBetween={14}
                  breakpoints={{
                    768: {
                      spaceBetween: 16,
                    },
                    1024: {
                      spaceBetween: 18,
                    },
                  }}
                  grabCursor={recentProducts.length > 1}
                  allowTouchMove={recentProducts.length > 1}
                  simulateTouch={recentProducts.length > 1}
                  watchOverflow
                >
                  {recentProducts.map((product, index) => (
                    <SwiperSlide
                      key={`${getProductId(product)}-${index}`}
                      className="my-page__rail-slide"
                    >
                      <ProductRailCard product={product} />
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <p className="my-page__empty-message">최근 본 상품이 없습니다.</p>
              )}
            </div>
          </section>
        </div>

        <section className="my-page__section">
          <h2 className="my-page__section-title">AI 추천 기록</h2>
          {aiHistory.length > 0 ? (
            <div
              ref={historyShellRef}
              className="my-page__history-list-shell"
              style={{ height: `${historyListHeight}px` }}
              onTransitionEnd={(event) => {
                if (event.target !== event.currentTarget || event.propertyName !== "height") {
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
                      nextHeight ??
                        Math.ceil(historyListRef.current.getBoundingClientRect().height),
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
                  <article key={history.id} className="my-page__history-group">
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

                      {renderAiRecommendationItems(history)}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          ) : (
            <div className="my-page__history-panel my-page__history-panel--empty">
              <p className="my-page__empty-message">AI 추천 기록이 없습니다.</p>
            </div>
          )}
        </section>

        {canToggleHistory ? (
          <div className="my-page__more-wrap">
            <button
              type="button"
              className="my-page__more-button"
              disabled={isHistoryAnimating}
              onClick={() => {
                if (hasMoreHistory) {
                  animateHistoryCountChange(Math.min(visibleHistoryCount + 2, aiHistory.length));
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
