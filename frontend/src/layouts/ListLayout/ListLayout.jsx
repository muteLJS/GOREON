/* -------------------------------------------------------------------------- */
/* [페이지] 검색 결과 (Search)                                                */
/* 사용자가 입력한 검색어에 일치하는 상품 및 스펙 비교 결과를 나열합니다.     */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import "./ListLayout.scss";
import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";

import cartIcon from "@/assets/icons/cart-straight.svg";
import likeAffterIcon from "@/assets/icons/like-after.svg";
import resetIcon from "@/assets/icons/reset.svg";
import { useSearchParams } from "react-router-dom";

const TYPE_LABEL_MAP = {
  laptop: "노트북",
  notebook: "노트북",
  desktop: "데스크탑",
  monitor: "모니터",
  keyboard: "키보드",
  mouse: "마우스",
  "pc-accessory": "PC 주변기기",
  "pc-part": "PC 부품",
  smartphone: "스마트폰",
  smartwatch: "스마트워치",
  earphone: "이어폰",
  tablet: "태블릿",
  "tablet-accessory": "태블릿 액세서리",
  pencil: "펜슬",
  "keyboard-case": "키보드 케이스",
  printer: "프린터",
  router: "공유기",
  webcam: "웹캠",
  "power-bank": "보조배터리",
  apple: "Apple",
  samsung: "Samsung",
  lg: "LG",
  hp: "HP",
  lenovo: "Lenovo",
  dell: "Dell",
  msi: "MSI",
  asus: "ASUS",
  acer: "Acer",
};

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
      <ul className="side_menu_bottom_filter_list">
        {items.map((item, index) => (
          <FilterMenuList key={index}>{item}</FilterMenuList>
        ))}
      </ul>
    </div>
  );
};

export default function ListLayout({ filteredProducts, status, errorMessage, selectedTypeLabel }) {
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");
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

  const filteredLength = filteredProducts.length;
  // const selectedTypeLabel = TYPE_LABEL_MAP[type] ?? type ?? "전체 상품";
  const manufacturerList = ["APPLE", "SAMSUNG", "ASUS", "LENOVO"];
  const weightList = ["1Kg 미만", "1Kg ~ 2Kg", "2Kg ~ 3Kg", "3Kg 이상"];
  const screenSizeList = ["13인치", "14인치", "15인치", "16인치", "17인치 이상"];
  const gpulist = ["내장그래픽", "외장그래픽"];

  return (
    <>
      <main className="list-wrap">
        <section className="list-wrap-content">
          <section className="side_menu">
            <div className="side_menu_top">
              <h2>필터</h2>
              <div className="side_menu_rightbox">
                <p>초기화</p>
                <button>
                  <img src={resetIcon} alt="reset" />
                </button>
              </div>
            </div>
            <div className="side_menu_bottom_container">
              <FilterMenuBox items={manufacturerList} title={"제조사"} />
              <FilterMenuBox items={weightList} title={"무게"} />
              <FilterMenuBox items={screenSizeList} title={"화면크기"} />
              <FilterMenuBox items={gpulist} title={"GPU 종류"} />
              <div className="side_menu_bottom_range">
                <h3>가격</h3>
                <input
                  type="range"
                  min={MIN}
                  max={MAX}
                  step={10000}
                  onChange={handleChange}
                  className="range-input range-input--min"
                />
                <div className="value">
                  <p>₩{minValue}</p>
                  <p>₩{maxValue}</p>
                </div>
              </div>
            </div>
          </section>
          <section className="list-assembly">
            <section className="list-assembly__banner">
              <img src={banner1} alt="광고 배너 1" />
            </section>
            <section className="list-assembly__top">
              <h2 className="list-assembly__title">
                {selectedTypeLabel}
                <span>({filteredLength})</span>
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
            <section className="list-assembly__content">
              {status === "loading" ? (
                <p className="list-assembly__state">상품을 불러오는 중입니다.</p>
              ) : null}
              {status === "error" ? <p className="list-assembly__state">{errorMessage}</p> : null}
              {status === "success" && filteredProducts.length === 0 ? (
                <p className="list-assembly__state">조건에 맞는 상품이 없습니다.</p>
              ) : null}
              {status === "success" && filteredProducts.length > 0 ? (
                <div className="list-assembly__product-grid">
                  {filteredProducts.map((product) => (
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
              ) : null}
            </section>
          </section>
        </section>
      </main>
    </>
  );
}
