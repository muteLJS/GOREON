/* -------------------------------------------------------------------------- */
/* [페이지] PC 맞춤 견적 (PcAssembly)                                           */
/* 설명: 사용 목적과 예산에 맞는 PC 견적을 안내하는 페이지입니다.             */
/* -------------------------------------------------------------------------- */

import "./PcAssembly.scss";
import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import ProductImage from "@/assets/products/product-example.jpg";

const productList = [
  {
    id: 1,
    name: "LG전자 2026 그램 프로16 16Z95U-GS5WK",
    rating: 4,
    image: ProductImage,
    price: "₩1,000,000",
  },
  {
    id: 2,
    name: "삼성전자 갤럭시북5 프로 NT960XHA-KD72G",
    rating: 5,
    image: ProductImage,
    price: "₩1,489,000",
  },
  {
    id: 3,
    name: "레노버 아이디어패드 슬림5 16AHP9",
    rating: 4,
    image: ProductImage,
    price: "₩849,000",
  },
  {
    id: 4,
    name: "ASUS 비보북 S 15 OLED S5507QA",
    rating: 3,
    image: ProductImage,
    price: "₩1,249,000",
  },
  {
    id: 5,
    name: "HP 파빌리온 Aero 13-bg0010AU",
    rating: 4,
    image: ProductImage,
    price: "₩929,000",
  },
  {
    id: 6,
    name: "MSI 모던 15 H AI C1MG-U7",
    rating: 5,
    image: ProductImage,
    price: "₩1,159,000",
  },
];

function PcAssembly() {
  return (
    <main className="pc-assembly">
      <section className="pc-assembly__banner">
        <img src={banner1} alt="광고 배너 1" />
      </section>

      <section className="pc-assembly__top">
        <h2 className="pc-assembly__title">PC 조립</h2>
        <button className="filter-button">
          필터 <img src={ChevronDownIcon} alt="down" />
        </button>
      </section>

      <section className="pc-assembly__content">
        <div className="pc-assembly__product-grid">
          {productList.map((product) => (
            <ProductCardVertical
              key={product.id}
              product={product}
              action={<button type="button">담기</button>}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default PcAssembly;
