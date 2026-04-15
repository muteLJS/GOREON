/* -------------------------------------------------------------------------- */
/* [페이지] 찜하기 (Wishlist)                                                 */
/* 찜하기: 하트를 누른 관심 상품 목록 모아보기                                */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import "./Wishlist.scss";
import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import ProductImage from "@/assets/products/product-example.jpg";
import cartIcon from "@/assets/icons/cart-straight.svg";
import likeAffterIcon from "@/assets/icons/like-after.svg";
import resetIcon from "@/assets/icons/reset.svg";
import arrowIcon from "@/assets/icons/prev.svg";

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

const FilterMenuList = ({ children }) => {
  return (
    <li>
      <input type="checkbox" />
      <p>{children}</p>
    </li>
  );
};

const FilterMenuBox = ({ title, items }) => {
  return (
    <div className="side_menu_bottom">
      <div className="side_menu_bottom_filter_container">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default function List() {
  const MIN = 10000;
  const MAX = 1600000 * 2;
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(160000);

  const handleChange = (e) => {
    if (e.target.name === "min") {
      setMinValue(e.target.value);
    } else {
      setMaxValue(e.target.value);
    }
  };

  const productLength = productList.length;
  const manufacturerList = ["APPLE", "SAMSUNG", "ASUS", "LENOVO"];
  // 무게 영어로
  const weightList = ["1Kg 미만", "1Kg ~ 2Kg", "2Kg ~ 3Kg", "3Kg 이상"];
  const screenSizeList = ["13인치", "14인치", "15인치", "16인치", "17인치 이상"];
  const gpulist = ["내장그래픽", "외장그래픽"];

  return (
    <>
      <main className="list-wrap">
        <section className="list-assembly__banner">
          <img src={banner1} alt="광고 배너 1" />
        </section>
        <section className="list-wrap-content">
          <section className="side_menu">
            <div className="side_menu_top">
              <h2>카테고리 분류</h2>
            </div>
            <div className="side_menu_bottom_container">
              <h3 className="title">전체상품</h3>
              <FilterMenuBox title={"노트북"} />
              <FilterMenuBox title={"모니터"} />
              <FilterMenuBox title={"이어폰"} />
            </div>
          </section>
          <section className="list-assembly">
            <section className="list-assembly__top">
              <h2 className="list-assembly__title">
                찜한 상품 <span>({productLength})</span>
              </h2>
              <div className="filter-container">
                <button className="filter-button">
                  전체 상품 <img src={ChevronDownIcon} alt="down" />
                </button>
              </div>
            </section>
            <section className="list-assembly__content">
              <div className="list-assembly__product-grid">
                {productList.map((product) => (
                  <ProductCardVertical
                    key={product.id}
                    product={product}
                    action={
                      <div className="list-assembly__button_container">
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
          </section>
        </section>
      </main>
    </>
  );
}
