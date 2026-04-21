import { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addQuoteItem } from "@/store/slices/quoteSlice";
import api from "@/utils/api";
import { analyzePcCompatibility } from "@/utils/pcCompatibility";
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

const pcPartCategories = [
  { label: "CPU", quoteCategory: "CPU", apiTypes: ["cpu"] },
  { label: "램", quoteCategory: "램", apiTypes: ["memory"] },
  { label: "메인보드", quoteCategory: "메인보드", apiTypes: ["mainboard"] },
  { label: "그래픽카드", quoteCategory: "그래픽카드", apiTypes: ["graphics-card"] },
  { label: "저장장치", quoteCategory: "저장장치", apiTypes: ["ssd", "hdd"] },
  { label: "케이스", quoteCategory: "케이스", apiTypes: ["case"] },
  { label: "파워", quoteCategory: "파워", apiTypes: ["power-supply"] },
];

const categories = pcPartCategories.map((category) => category.label);

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;

const normalizeImageUrl = (value) => {
  const raw = String(value ?? "").trim();
  if (!raw || raw.startsWith("http:///")) return "";
  if (raw.startsWith("http://")) return `https://${raw.slice("http://".length)}`;
  return raw;
};

const getProductKey = (product) => String(product._id ?? product.id);

const shouldKeepProductForCategory = (product, category) => {
  if (category.label !== "케이스") return true;

  const tags = Array.isArray(product.tag) ? product.tag.join(" ") : "";
  const text = `${product.name ?? ""} ${tags}`;
  return text.includes("PC부품") || /(^|\s)케이스(\s|$)/.test(text);
};

const normalizePcPartProduct = (product, category) => ({
  id: getProductKey(product),
  productId: product._id ?? product.id,
  sourceProductId: product.id,
  category: category.quoteCategory,
  name: product.name,
  image: normalizeImageUrl(product.image) || ProductImage,
  rating: Number(product.rating) || 0,
  price: parsePrice(product.price),
  raw: product,
});

function PcAssembly() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.quote.items);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isQuoteOpen, setIsQuoteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("CPU");
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [isDesktop, setIsDesktop] = useState(window.matchMedia("(min-width: 1024px)").matches);
  const assemblyRef = useRef(null);
  const [quotePanelWidth, setQuotePanelWidth] = useState(1216);

  useEffect(() => {
    const controller = new AbortController();
    const category = pcPartCategories.find((item) => item.label === selectedCategory);

    const fetchProducts = async () => {
      if (!category) {
        setProducts([]);
        setStatus("error");
        setErrorMessage("알 수 없는 PC 부품 카테고리입니다.");
        return;
      }

      try {
        setStatus("loading");
        setErrorMessage("");
        const responses = await Promise.all(
          category.apiTypes.map((type) =>
            api.get("/products", {
              params: { type },
              signal: controller.signal,
            }),
          ),
        );

        const uniqueProducts = new Map();
        responses
          .flatMap((response) => response.data.data ?? [])
          .filter((product) => shouldKeepProductForCategory(product, category))
          .forEach((product) => {
            uniqueProducts.set(getProductKey(product), normalizePcPartProduct(product, category));
          });

        setProducts([...uniqueProducts.values()]);
        setStatus("success");
      } catch (error) {
        if (error.name === "CanceledError" || error.name === "AbortError") return;
        setProducts([]);
        setStatus("error");
        setErrorMessage("PC 부품 상품을 불러오지 못했습니다.");
      }
    };

    fetchProducts();

    return () => controller.abort();
  }, [selectedCategory]);

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
  const compatibility = useMemo(() => analyzePcCompatibility(items), [items]);
  const filteredProducts = products;

  const handleAddQuoteItem = (product) => {
    dispatch(
      addQuoteItem({
        id: `${product.category}-${product.id}`,
        productId: product.productId ?? product.id,
        sourceProductId: product.sourceProductId,
        category: product.category,
        name: product.name,
        option: "기본옵션",
        price: product.price,
        quantity: 1,
        image: product.image,
        raw: product.raw,
        compatibility: "ok",
        status: "ok",
      }),
    );
  };

  const renderProductList = (cardType = "vertical") => {
    if (status === "loading") {
      return <p className="pc-assembly__state">PC 부품 상품을 불러오는 중입니다.</p>;
    }

    if (status === "error") {
      return <p className="pc-assembly__state">{errorMessage}</p>;
    }

    if (filteredProducts.length === 0) {
      return <p className="pc-assembly__state">해당 카테고리 상품이 없습니다.</p>;
    }

    return filteredProducts.map((product) => {
      const action = (
        <button
          type="button"
          className="pc-assembly__add-button"
          onClick={() => handleAddQuoteItem(product)}
        >
          담기
        </button>
      );

      return cardType === "horizontal" ? (
        <ProductCardHorizontal key={product.id} product={product} action={action} />
      ) : (
        <ProductCardVertical key={product.id} product={product} action={action} />
      );
    });
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
        <div className="pc-assembly__product-grid">{renderProductList()}</div>

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
            <div className={`pc-assembly__compatibility-status is-${compatibility.level}`}>
              {compatibility.message}
            </div>
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
              <div className={`pc-assembly__compatibility-status is-${compatibility.level}`}>
                {compatibility.message}
              </div>
            </div>
            <button className="pc-assembly__list-button" onClick={() => setIsQuoteOpen(true)}>
              견적 리스트
            </button>
          </section>

          <div className="pc-assembly__desktop-list">{renderProductList("horizontal")}</div>
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
