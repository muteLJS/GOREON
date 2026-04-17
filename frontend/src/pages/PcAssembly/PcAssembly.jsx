/* -------------------------------------------------------------------------- */
/* [페이지] PC 맞춤 견적 (PcAssembly)                                           */
/* 설명: 사용 목적과 예산에 맞는 PC 견적을 안내하는 페이지입니다.             */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addQuoteItem } from "@/store/slices/quoteSlice";
import "./PcAssembly.scss";

import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import ProductCardHorizontal from "@/components/ProductCard/ProductCardHorizontal";
import Modal from "@/components/Modal/Modal";

import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import CheckIcon from "@/assets/icons/check.svg";
import ProductImage from "@/assets/products/product-example.jpg";

/* productList 더미데이터 */
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
    name: "ZOTAC GAMING 지포스 RTX 4060 SOLO",
    rating: 4,
    image: ProductImage,
    price: 449000,
  },
  {
    id: 11,
    category: "그래픽카드",
    name: "MSI 지포스 RTX 4060 VENTUS 2X",
    rating: 4,
    image: ProductImage,
    price: 479000,
  },
  {
    id: 12,
    category: "그래픽카드",
    name: "SAPPHIRE 라데온 RX 7600 PULSE",
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
    name: "Western Digital WD Blue SN580 1TB",
    rating: 4,
    image: ProductImage,
    price: 99000,
  },
  {
    id: 16,
    category: "케이스",
    name: "darkFlash DS900 ARGB 강화유리",
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
    name: "마이크로닉스 COOLMAX 쉐도우 2",
    rating: 4,
    image: ProductImage,
    price: 59000,
  },
  {
    id: 19,
    category: "파워",
    name: "마이크로닉스 Classic II 750W GOLD",
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
    name: "시소닉 FOCUS GX-850 GOLD",
    rating: 5,
    image: ProductImage,
    price: 189000,
  },
];

/* 필터 더미데이터 */
const categories = ["CPU", "램", "메인보드", "그래픽카드", "저장장치", "케이스", "파워"];

function PcAssembly() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const items = useSelector((state) => state.quote.items);
  const totalPrice = items.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("CPU");
  const filteredProducts = productList.filter((product) => product.category === selectedCategory);

  const handleAddQuoteItem = (product) => {
    const quoteItem = {
      id: product.id,
      productId: product.id,
      category: product.category,
      name: product.name,
      option: null,
      price: product.price,
      quantity: 1,
      image: product.image,
      compatibility: "ok",
      product,
    };

    dispatch(addQuoteItem(quoteItem));
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
    <main className="pc-assembly">
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
                  type="button"
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
            <button
              className="pc-assembly__list-button"
              onClick={() => navigate("/pc-assembly-quote")}
            >
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

            <button
              className="pc-assembly__list-button"
              onClick={() => navigate("/pc-assembly-quote")}
            >
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
                    type="button"
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
    </main>
  );
}

export default PcAssembly;
