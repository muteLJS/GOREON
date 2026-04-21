import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuoteItem } from "@/store/slices/quoteSlice";
import "./PcAssembly.scss";

import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import ProductCardHorizontal from "@/components/ProductCard/ProductCardHorizontal";
import Modal from "@/components/Modal/Modal";
import PcAssemblyQuote from "@/pages/PcAssemblyQuote/PcAssemblyQuote";

import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import CheckIcon from "@/assets/icons/check.svg";
import CloseIcon from "@/assets/event/close.svg";
import { PC_ASSEMBLY_CATEGORIES, pcAssemblyProducts } from "@/utils/pcAssemblyProducts";

function PcAssembly() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.quote.items);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("CPU");
  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 1024px)").matches);
  const assemblyRef = useRef(null);
  const [quotePanelWidth, setQuotePanelWidth] = useState(1216);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (!(isDesktop && isQuoteOpen)) return undefined;

    const updateWidth = () => {
      const width = assemblyRef.current?.getBoundingClientRect().width;
      if (width) setQuotePanelWidth(Math.round(width));
    };

    updateWidth();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updateWidth);
      return () => window.removeEventListener("resize", updateWidth);
    }

    const observer = new ResizeObserver(updateWidth);
    if (assemblyRef.current) observer.observe(assemblyRef.current);
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

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = useMemo(
    () => pcAssemblyProducts.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  );

  const handleAddQuoteItem = (product) => {
    dispatch(
      addQuoteItem({
        id: `${product.category}-${product.id}`,
        productId: product.id,
        category: product.category,
        name: product.name,
        option: product.option,
        price: product.price,
        quantity: 1,
        image: product.image,
        compatibility: "ok",
        status: "ok",
      }),
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
        <div className="pc-assembly__product-grid">
          {filteredProducts.map((product) => (
            <ProductCardVertical
              key={product.id}
              product={product}
              action={
                <button
                  className="pc-assembly__add-button"
                  onClick={() => handleAddQuoteItem(product)}
                >
                  담기
                </button>
              }
            />
          ))}
        </div>

        <section className="pc-assembly__bottom">
          <div className="pc-assembly__summary-grid">
            <button className="pc-assembly__total">
              TOTAL : ₩{totalPrice.toLocaleString("ko-KR")}
            </button>
            <button className="pc-assembly__list-button" onClick={() => setIsQuoteOpen(true)}>
              견적 리스트
            </button>
          </div>
          <div className="pc-assembly__compatibility">
            <div className="pc-assembly__compatibility-count">
              <img src={CheckIcon} alt="체크" />
              부품 {items.length}개 선택
            </div>
            <div className="pc-assembly__compatibility-status">호환성 모두 이상 없음</div>
          </div>
        </section>
      </section>

      <section className="pc-assembly__desktop">
        <aside className="pc-assembly__sidebar">
          <button className="pc-assembly__total">
            TOTAL : ₩{totalPrice.toLocaleString("ko-KR")}
          </button>
          <div className="pc-assembly__desktop-filter">
            <div className="pc-assembly__desktop-filter-title">카테고리</div>
            <div className="pc-assembly__desktop-filter-list">{filterContent}</div>
          </div>
        </aside>

        <div className="pc-assembly__main">
          <section className="pc-assembly__desktop-top">
            <div className="pc-assembly__compatibility">
              <div className="pc-assembly__compatibility-count">
                <img src={CheckIcon} alt="체크" />
                부품 {items.length}개 선택
              </div>
              <div className="pc-assembly__compatibility-status">호환성 모두 이상 없음</div>
            </div>
            <button className="pc-assembly__list-button" onClick={() => setIsQuoteOpen(true)}>
              견적 리스트
            </button>
          </section>

          <div className="pc-assembly__desktop-list">
            {filteredProducts.map((product) => (
              <ProductCardHorizontal
                key={product.id}
                product={product}
                action={
                  <button
                    className="pc-assembly__add-button"
                    onClick={() => handleAddQuoteItem(product)}
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
        <Modal title="필터" onClose={() => setIsFilterOpen(false)}>
          {filterContent}
        </Modal>
      )}

      {!isDesktop && isQuoteOpen && (
        <Modal
          title="견적 리스트"
          onClose={() => setIsQuoteOpen(false)}
          className="modal--fullscreen pc-assembly__quote-modal"
          overlayClassName="modal-overlay--fullscreen"
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
