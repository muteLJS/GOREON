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
import ProductImage from "@/assets/products/product-example.jpg";
import CloseIcon from "@/assets/event/close.svg";

const productList = [
  {
    id: 1,
    category: "CPU",
    name: "인텔 코어 i5-14400F",
    rating: 4,
    image: ProductImage,
    price: 200000,
  },
  {
    id: 2,
    category: "CPU",
    name: "AMD 라이젠5 7500F",
    rating: 5,
    image: ProductImage,
    price: 230000,
  },
  {
    id: 3,
    category: "CPU",
    name: "AMD 라이젠7 7700",
    rating: 4,
    image: ProductImage,
    price: 329000,
  },
  {
    id: 4,
    category: "램",
    name: "삼성전자 DDR5-5600 16GB",
    rating: 4,
    image: ProductImage,
    price: 59000,
  },
  {
    id: 5,
    category: "램",
    name: "SK하이닉스 DDR5-5600 16GB",
    rating: 4,
    image: ProductImage,
    price: 62000,
  },
  {
    id: 6,
    category: "램",
    name: "G.SKILL Ripjaws S5 DDR5-6000 32GB",
    rating: 5,
    image: ProductImage,
    price: 159000,
  },
  {
    id: 7,
    category: "메인보드",
    name: "MSI PRO B760M-A WIFI",
    rating: 4,
    image: ProductImage,
    price: 189000,
  },
  {
    id: 8,
    category: "메인보드",
    name: "ASUS PRIME B760M-A",
    rating: 4,
    image: ProductImage,
    price: 169000,
  },
  {
    id: 9,
    category: "메인보드",
    name: "GIGABYTE B650M K",
    rating: 4,
    image: ProductImage,
    price: 155000,
  },
  {
    id: 10,
    category: "그래픽카드",
    name: "ZOTAC RTX 4060 SOLO",
    rating: 4,
    image: ProductImage,
    price: 449000,
  },
  {
    id: 11,
    category: "그래픽카드",
    name: "MSI RTX 4060 VENTUS 2X",
    rating: 4,
    image: ProductImage,
    price: 479000,
  },
  {
    id: 12,
    category: "그래픽카드",
    name: "SAPPHIRE RX 7600 PULSE",
    rating: 4,
    image: ProductImage,
    price: 389000,
  },
  {
    id: 13,
    category: "저장장치",
    name: "삼성전자 990 EVO Plus 1TB",
    rating: 5,
    image: ProductImage,
    price: 129000,
  },
  {
    id: 14,
    category: "저장장치",
    name: "SK하이닉스 Platinum P41 1TB",
    rating: 5,
    image: ProductImage,
    price: 139000,
  },
  {
    id: 15,
    category: "저장장치",
    name: "WD Blue SN580 1TB",
    rating: 4,
    image: ProductImage,
    price: 99000,
  },
  {
    id: 16,
    category: "케이스",
    name: "darkFlash DS900 ARGB",
    rating: 4,
    image: ProductImage,
    price: 69000,
  },
  {
    id: 17,
    category: "케이스",
    name: "3RSYS L600 Quiet",
    rating: 4,
    image: ProductImage,
    price: 79000,
  },
  {
    id: 18,
    category: "케이스",
    name: "마이크로닉스 COOLMAX 섀도우2",
    rating: 4,
    image: ProductImage,
    price: 59000,
  },
  {
    id: 19,
    category: "파워",
    name: "마이크로닉스 Classic II 750W",
    rating: 4,
    image: ProductImage,
    price: 119000,
  },
  {
    id: 20,
    category: "파워",
    name: "FSP HYDRO G PRO 750W",
    rating: 5,
    image: ProductImage,
    price: 139000,
  },
  {
    id: 21,
    category: "파워",
    name: "시소닉 FOCUS GX-850",
    rating: 5,
    image: ProductImage,
    price: 189000,
  },
];

const categories = ["CPU", "램", "메인보드", "그래픽카드", "저장장치", "케이스", "파워"];

function PcAssembly() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.quote.items);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("CPU");
  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 1024px)").matches);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onChange = (e) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const assemblyRef = useRef(null);
  const [quotePanelWidth, setQuotePanelWidth] = useState(1200);

  useEffect(() => {
    if (!(isDesktop && isQuoteOpen)) return;

    const updateWidth = () => {
      const el = assemblyRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setQuotePanelWidth(Math.round(r.width));
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);

    return () => {
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
    () => productList.filter((product) => product.category === selectedCategory),
    [selectedCategory],
  );

  const handleAddQuoteItem = (product) => {
    dispatch(
      addQuoteItem({
        id: `${product.category}-${product.id}`,
        productId: product.id,
        category: product.category,
        name: product.name,
        option: "기본옵션",
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
      {categories.map((category) => (
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
        <Modal title="견적 리스트" onClose={() => setIsQuoteOpen(false)}>
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
