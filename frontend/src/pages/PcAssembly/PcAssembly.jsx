import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import CheckIcon from "@/assets/icons/check.svg";
import CloseIcon from "@/assets/event/close.svg";
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
    if (!(isDesktop && isQuoteOpen)) return;
    const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prevOverflow = document.body.style.overflow;
    const prevPaddingRight = document.body.style.paddingRight;

    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = `${scrollBarWidth}px`;

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.paddingRight = prevPaddingRight;
    };
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

  const handleAddQuoteItem = (product) => {
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

  const filterContent = (
    <div className="pc-assembly__filter">
      {PC_ASSEMBLY_CATEGORIES.map((category) => (
        <button
          key={category}
          type="button"
          className={`pc-assembly__filter-category ${selectedCategory === category ? "is-active" : ""}`}
          onClick={() => setSelectedCategory(category)}
        >
          {category}
        </button>
      ))}
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
        <button className="filter-button" onClick={() => setIsFilterOpen(true)}>
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

        <aside className="pc-assembly__sidebar">
          <div className="pc-assembly__desktop-filter">
            <div className="pc-assembly__desktop-filter-title">카테고리</div>
            <div className="pc-assembly__desktop-filter-list">{filterContent}</div>
          </div>
        </aside>

        <div className="pc-assembly__main">
          <div className="pc-assembly__desktop-list">
            {filteredProducts.map((product) => (
              <ProductCardHorizontal
                key={product._id}
                product={product}
                action={
                  <button
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
        <Modal title="필터" onClose={() => setIsFilterOpen(false)} showCloseButton={false}>
          {filterContent}
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
