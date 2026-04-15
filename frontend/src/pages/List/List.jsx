/* -------------------------------------------------------------------------- */
/* [페이지] 검색 결과 (Search)                                                */
/* 사용자가 입력한 검색어에 일치하는 상품 및 스펙 비교 결과를 나열합니다.     */
/* -------------------------------------------------------------------------- */

import { useState } from "react";
import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import ProductImage from "@/assets/products/product-example.jpg";
import cartIcon from "@/assets/icons/cart-straight.svg";
import likeAffterIcon from "@/assets/icons/like-after.svg";

/* productList 더미데이터 */
const productList = [
  {
    id: 1,
    name: "LG전자 2026 그램 프로16 16Z95U-GS5WK",
    rating: 4,
    image: ProductImage,
    price: 1000000,
  },
  {
    id: 2,
    name: "삼성전자 갤럭시북5 프로 NT960XHA-KD72G",
    rating: 5,
    image: ProductImage,
    price: 1489000,
  },
  {
    id: 3,
    name: "레노버 아이디어패드 슬림5 16AHP9",
    rating: 4,
    image: ProductImage,
    price: 849000,
  },
  {
    id: 4,
    name: "ASUS 비보북 S 15 OLED S5507QA",
    rating: 3,
    image: ProductImage,
    price: 1249000,
  },
  {
    id: 5,
    name: "HP 파빌리온 Aero 13-bg0010AU",
    rating: 4,
    image: ProductImage,
    price: 929000,
  },
  {
    id: 6,
    name: "MSI 모던 15 H AI C1MG-U7",
    rating: 5,
    image: ProductImage,
    price: 1159000,
  },
];

export default function List() {
  const [totalPrice, setTotalPrice] = useState(400000);
  const productLength = productList.length;
  return (
    <div>
      <main className="pc-assembly">
        <section className="pc-assembly__banner">
          <img src={banner1} alt="광고 배너 1" />
        </section>
        <section className="pc-assembly__top">
          <h2 className="pc-assembly__title">
            노트북 전체 <span>({productLength})</span>
          </h2>
          <div className="filter-container">
            <button className="filter-button">
              필터 <img src={ChevronDownIcon} alt="down" />
            </button>
            <button className="filter-button">
              인기상품순 <img src={ChevronDownIcon} alt="down" />
            </button>
          </div>
        </section>
        <section className="pc-assembly__content">
          <div className="pc-assembly__product-grid">
            {productList.map((product) => (
              <ProductCardVertical
                key={product.id}
                product={product}
                action={
                  <div className="button-container">
                    <button className="cart-add-button" type="button">
                      <img src={cartIcon} alt="" />
                    </button>
                    <button className="cart-add-button" type="button">
                      <img src={likeAffterIcon} alt="" />
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
