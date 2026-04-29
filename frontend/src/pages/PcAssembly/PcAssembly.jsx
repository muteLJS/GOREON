import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { lockPageScroll } from "@/utils/scrollLock";

import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import CheckIcon from "@/assets/icons/check.svg";
import CloseIcon from "@/assets/event/close.svg";
import resetIcon from "@/assets/icons/reset.svg";
import Modal from "@/components/Modal/Modal";
import ProductCardHorizontal from "@/components/ProductCard/ProductCardHorizontal";
import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import useProductCatalog from "@/hooks/useProductCatalog";
import PcAssemblyQuote from "@/pages/PcAssemblyQuote/PcAssemblyQuote";
import { addQuoteItem } from "@/store/slices/quoteSlice";
import {
  PC_ASSEMBLY_CATEGORIES,
  getPcAssemblyPerformanceChecks,
  getPcAssemblyProducts,
} from "@/utils/pcAssemblyProducts";
import "./PcAssembly.scss";
import { useToast } from "@/components/Toast/toastContext";

function PcAssembly() {
  const { showToast } = useToast();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.quote.items);
  const { products } = useProductCatalog();

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("CPU");
  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 1024px)").matches);
  const [isMobile, setIsMobile] = useState(window.matchMedia("(max-width: 767px)").matches);
  const assemblyRef = useRef(null);
  const desktopSectionRef = useRef(null);
  const [quotePanelWidth, setQuotePanelWidth] = useState(1216);

  useEffect(() => {
    const desktopMq = window.matchMedia("(min-width: 1024px)");
    const mobileMq = window.matchMedia("(max-width: 767px)");
    const handleDesktopChange = (event) => setIsDesktop(event.matches);
    const handleMobileChange = (event) => setIsMobile(event.matches);

    desktopMq.addEventListener("change", handleDesktopChange);
    mobileMq.addEventListener("change", handleMobileChange);

    return () => {
      desktopMq.removeEventListener("change", handleDesktopChange);
      mobileMq.removeEventListener("change", handleMobileChange);
    };
  }, []);

  useEffect(() => {
    if (!(isDesktop && isQuoteOpen)) return undefined;

    const updateWidth = () => {
      const width =
        desktopSectionRef.current?.getBoundingClientRect().width ??
        assemblyRef.current?.getBoundingClientRect().width;
      if (width) setQuotePanelWidth(Math.round(width));
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    if (desktopSectionRef.current) {
      observer.observe(desktopSectionRef.current);
    } else if (assemblyRef.current) {
      observer.observe(assemblyRef.current);
    }
    window.addEventListener("resize", updateWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, [isDesktop, isQuoteOpen]);

  useEffect(() => {
    if (!(isDesktop && isQuoteOpen)) return undefined;
    return lockPageScroll();
  }, [isDesktop, isQuoteOpen]);

  const pcAssemblyProducts = useMemo(() => getPcAssemblyProducts(products), [products]);
  const getQuoteItemQuantity = (item) => Number(item.quantity) || 1;
  const quoteItemCount = items.reduce((sum, item) => sum + getQuoteItemQuantity(item), 0);
  const totalPrice = items.reduce((sum, item) => sum + item.price * getQuoteItemQuantity(item), 0);
  const formattedTotalPrice = totalPrice.toLocaleString("ko-KR");

  const filteredProducts = useMemo(
    () => pcAssemblyProducts.filter((product) => product.category === selectedCategory),
    [pcAssemblyProducts, selectedCategory],
  );
  const compatibilityChecks = useMemo(
    () => getPcAssemblyPerformanceChecks(items, products),
    [items, products],
  );
  const compatibilityStatus = useMemo(() => {
    if (!compatibilityChecks.length) return null;
    if (compatibilityChecks.some((row) => row.level === "error")) {
      return { level: "error", text: "호환성 확인 필요" };
    }
    return null;
  }, [compatibilityChecks]);

  const handleAddQuoteItem = (product, event) => {
    event?.stopPropagation();

    dispatch(
      addQuoteItem({
        id: `${product.category}-${product._id}`,
        _id: product._id,
        productId: product._id,
        category: product.category,
        name: product.name,
        option: product.option,
        price: product.price,
        quantity: 1,
        image: product.image,
        rating: product.rating,
        compatibility: "ok",
        status: "ok",
      }),
      showToast("견적 리스트에 담았습니다."),
    );
  };

  const resetFilters = () => {
    setSelectedCategory(PC_ASSEMBLY_CATEGORIES[0] ?? "CPU");
  };

  const renderCategoryOptions = (idPrefix) => (
    <ul className="pc-assembly-filter-options">
      {PC_ASSEMBLY_CATEGORIES.map((category) => (
        <li key={category} className="pc-assembly-filter-option">
          <label htmlFor={`${idPrefix}-${category}`} className="pc-assembly-filter-option__label">
            <input
              id={`${idPrefix}-${category}`}
              checked={selectedCategory === category}
              type="checkbox"
              onChange={() => setSelectedCategory(category)}
            />
            <p>{category}</p>
          </label>
        </li>
      ))}
    </ul>
  );

  const desktopFilterContent = (
    <section className="pc-assembly-filter-panel" aria-label="PC 조립 필터">
      <div className="pc-assembly-filter-panel__top">
        <h2>필터</h2>
        <div className="pc-assembly-filter-panel__reset">
          <p>초기화</p>
          <button type="button" onClick={resetFilters} aria-label="필터 초기화">
            <img src={resetIcon} alt="" />
          </button>
        </div>
      </div>
      <div className="pc-assembly-filter-panel__body">
        <div className="pc-assembly-filter-group">
          <div className="pc-assembly-filter-group__title">
            <h3>카테고리</h3>
          </div>
          {renderCategoryOptions("pc-assembly-desktop-category")}
        </div>
      </div>
    </section>
  );

  const mobileFilterContent = (
    <div className="pc-assembly-mobile-filter">
      <div className="pc-assembly-mobile-filter__tabs">
        <button type="button" className="pc-assembly-mobile-filter__tab is-active">
          카테고리
        </button>
      </div>
      <div className="pc-assembly-mobile-filter__content">
        {renderCategoryOptions("pc-assembly-mobile-category")}
      </div>
      <div className="pc-assembly-mobile-filter__actions">
        <button type="button" className="pc-assembly-mobile-filter__reset" onClick={resetFilters}>
          초기화 <img src={resetIcon} alt="" />
        </button>
      </div>
    </div>
  );

  const renderSectionBar = () => (
    <section className="pc-assembly__section-bar" aria-label="견적 요약">
      <strong className="pc-assembly__total">TOTAL : ₩{formattedTotalPrice}</strong>
      <div className="pc-assembly__compatibility">
        <div className="pc-assembly__compatibility-count">
          <img src={CheckIcon} alt="체크" />
          부품 {quoteItemCount}개 선택
        </div>
        {compatibilityStatus && (
          <div
            className={`pc-assembly__compatibility-status pc-assembly__compatibility-status--${compatibilityStatus.level}`}
          >
            {compatibilityStatus.text}
          </div>
        )}
        <button
          type="button"
          className="pc-assembly__list-button"
          onClick={() => setIsQuoteOpen(true)}
        >
          견적 리스트
        </button>
      </div>
    </section>
  );

  return (
    <main className="pc-assembly" ref={assemblyRef}>
      <section className="pc-assembly__banner">
        <img src={banner1} alt="광고 배너 1" />
      </section>

      <section className="pc-assembly__top">
        <h2 className="pc-assembly__title">PC 조립</h2>
        <button type="button" className="filter-button" onClick={() => setIsFilterOpen(true)}>
          필터 <img src={ChevronDownIcon} alt="down" />
        </button>
      </section>

      <section className="pc-assembly__content">
        {renderSectionBar()}

        <div className="pc-assembly__product-grid">
          {filteredProducts.map((product) => (
            <ProductCardVertical
              key={product._id}
              product={product}
              action={
                <button
                  type="button"
                  className="pc-assembly__add-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddQuoteItem(product);
                  }}
                >
                  담기
                </button>
              }
            />
          ))}
        </div>
      </section>

      <section className="pc-assembly__desktop" ref={desktopSectionRef}>
        {renderSectionBar()}

        <aside className="pc-assembly__sidebar">{desktopFilterContent}</aside>

        <div className="pc-assembly__main">
          <div className="pc-assembly__desktop-list">
            {filteredProducts.map((product) => (
              <ProductCardHorizontal
                key={product._id}
                product={product}
                action={
                  <button
                    type="button"
                    className="pc-assembly__add-button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleAddQuoteItem(product);
                    }}
                  >
                    담기
                  </button>
                }
              />
            ))}
          </div>
        </div>
      </section>

      {isFilterOpen && (
        <Modal
          title="필터"
          onClose={() => setIsFilterOpen(false)}
          className="pc-assembly-mobile-filter-modal"
          showCloseButton={false}
        >
          {mobileFilterContent}
        </Modal>
      )}

      {!isDesktop && isQuoteOpen && (
        <Modal
          title="견적 리스트"
          onClose={() => setIsQuoteOpen(false)}
          className="modal--fullscreen pc-assembly__quote-modal"
          overlayClassName="modal-overlay--fullscreen pc-assembly__quote-overlay"
          showCloseButton={false}
          dragToClose={isMobile}
        >
          <PcAssemblyQuote isModal />
        </Modal>
      )}

      {isDesktop && isQuoteOpen && (
        <div className="pc-assembly__desktop-quote-layer" role="dialog" aria-modal="true">
          <div className="pc-assembly__desktop-quote-dim" onClick={() => setIsQuoteOpen(false)} />
          <section
            className="pc-assembly__desktop-quote-panel"
            style={{ "--quote-w": `${quotePanelWidth}px` }}
          >
            <header className="pc-assembly__desktop-quote-header">
              <h3>견적 리스트</h3>
              <button
                type="button"
                className="pc-assembly__desktop-quote-close"
                onClick={() => setIsQuoteOpen(false)}
                aria-label="닫기"
              >
                <img src={CloseIcon} alt="" />
              </button>
            </header>
            <div className="pc-assembly__desktop-quote-body">
              <PcAssemblyQuote isModal />
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default PcAssembly;
