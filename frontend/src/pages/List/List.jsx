/* -------------------------------------------------------------------------- */
/* [페이지] 검색 결과 (Search)                                                */
/* 사용자가 입력한 검색어에 일치하는 상품 및 스펙 비교 결과를 나열합니다.     */
/* -------------------------------------------------------------------------- */
import { useState } from "react";
import "./List.scss";
import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import ProductImage from "@/assets/products/product-example.jpg";
import cartIcon from "@/assets/icons/cart-straight.svg";
import likeAffterIcon from "@/assets/icons/like-after.svg";
import resetIcon from "@/assets/icons/reset.svg";
import { useSearchParams } from "react-router-dom";

const TYPE_LABEL_MAP = {
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
  acer: "Acer",
};

/* productList 더미데이터 */
const productList = [
  {
    id: 1,
    type: "notebook",
    name: "LG전자 2026 그램 프로16 16Z95U-GS5WK",
    rating: 4,
    image: ProductImage,
    price: 1000000,
  },

  {
    id: 2,
    type: "desktop",
    name: "삼성전자 올인원 DM530ADA-L58A",
    rating: 4,
    image: ProductImage,
    price: 1249000,
  },
  {
    id: 3,
    type: "desktop",
    name: "레노버 Legion T5 데스크탑",
    rating: 5,
    image: ProductImage,
    price: 1899000,
  },

  {
    id: 4,
    type: "monitor",
    name: "LG 울트라기어 27GR75Q",
    rating: 5,
    image: ProductImage,
    price: 429000,
  },
  {
    id: 5,
    type: "monitor",
    name: "삼성 오디세이 G5",
    rating: 4,
    image: ProductImage,
    price: 389000,
  },
  {
    id: 6,
    type: "monitor",
    name: "Dell S2722QC 4K 모니터",
    rating: 4,
    image: ProductImage,
    price: 499000,
  },

  {
    id: 7,
    type: "keyboard",
    name: "로지텍 MX Keys S",
    rating: 5,
    image: ProductImage,
    price: 149000,
  },

  {
    id: 8,
    type: "mouse",
    name: "로지텍 MX Master 3S",
    rating: 5,
    image: ProductImage,
    price: 119000,
  },
  {
    id: 9,
    type: "mouse",
    name: "로지텍 G304",
    rating: 4,
    image: ProductImage,
    price: 49000,
  },

  {
    id: 10,
    type: "pc-accessory",
    name: "USB-C 멀티허브 8in1",
    rating: 5,
    image: ProductImage,
    price: 69000,
  },
  {
    id: 11,
    type: "pc-accessory",
    name: "노트북 거치대 알루미늄 스탠드",
    rating: 4,
    image: ProductImage,
    price: 29000,
  },
  {
    id: 12,
    type: "pc-accessory",
    name: "웹캠 마운트 클램프",
    rating: 3,
    image: ProductImage,
    price: 19000,
  },

  {
    id: 13,
    type: "pc-part",
    name: "삼성 DDR5 16GB 메모리",
    rating: 5,
    image: ProductImage,
    price: 78000,
  },

  {
    id: 14,
    type: "smartphone",
    name: "삼성 갤럭시 S25",
    rating: 5,
    image: ProductImage,
    price: 1350000,
  },
  {
    id: 15,
    type: "smartphone",
    name: "Apple iPhone 17",
    rating: 5,
    image: ProductImage,
    price: 1550000,
  },

  {
    id: 16,
    type: "smartwatch",
    name: "Apple Watch Series 11",
    rating: 5,
    image: ProductImage,
    price: 599000,
  },
  {
    id: 17,
    type: "smartwatch",
    name: "갤럭시 워치8",
    rating: 4,
    image: ProductImage,
    price: 429000,
  },
  {
    id: 18,
    type: "smartwatch",
    name: "샤오미 스마트밴드 10 프로",
    rating: 3,
    image: ProductImage,
    price: 89000,
  },

  {
    id: 19,
    type: "earphone",
    name: "에어팟 프로 3세대",
    rating: 5,
    image: ProductImage,
    price: 349000,
  },

  {
    id: 20,
    type: "tablet",
    name: "아이패드 에어 13",
    rating: 5,
    image: ProductImage,
    price: 1099000,
  },
  {
    id: 21,
    type: "tablet",
    name: "갤럭시 탭 S10",
    rating: 4,
    image: ProductImage,
    price: 998000,
  },

  {
    id: 22,
    type: "tablet-accessory",
    name: "태블릿 북커버 케이스",
    rating: 4,
    image: ProductImage,
    price: 59000,
  },
  {
    id: 23,
    type: "tablet-accessory",
    name: "태블릿 강화유리 필름",
    rating: 3,
    image: ProductImage,
    price: 19000,
  },
  {
    id: 24,
    type: "tablet-accessory",
    name: "태블릿 파우치",
    rating: 4,
    image: ProductImage,
    price: 25000,
  },

  {
    id: 25,
    type: "pencil",
    name: "Apple Pencil Pro",
    rating: 5,
    image: ProductImage,
    price: 195000,
  },

  {
    id: 26,
    type: "keyboard-case",
    name: "아이패드 매직 키보드",
    rating: 5,
    image: ProductImage,
    price: 429000,
  },
  {
    id: 27,
    type: "keyboard-case",
    name: "갤럭시탭 북커버 키보드",
    rating: 4,
    image: ProductImage,
    price: 239000,
  },

  {
    id: 28,
    type: "printer",
    name: "캐논 PIXMA TS7790",
    rating: 4,
    image: ProductImage,
    price: 189000,
  },
  {
    id: 29,
    type: "printer",
    name: "엡손 EcoTank L6270",
    rating: 5,
    image: ProductImage,
    price: 349000,
  },
  {
    id: 30,
    type: "printer",
    name: "브라더 HL-L2365DW",
    rating: 4,
    image: ProductImage,
    price: 219000,
  },

  {
    id: 31,
    type: "router",
    name: "ipTIME AX3000M",
    rating: 4,
    image: ProductImage,
    price: 89000,
  },

  {
    id: 32,
    type: "webcam",
    name: "로지텍 C920 HD Pro",
    rating: 4,
    image: ProductImage,
    price: 99000,
  },
  {
    id: 33,
    type: "webcam",
    name: "앱코 QHD 웹캠 APC930",
    rating: 3,
    image: ProductImage,
    price: 69000,
  },

  {
    id: 34,
    type: "power-bank",
    name: "삼성 25W 보조배터리 10000mAh",
    rating: 4,
    image: ProductImage,
    price: 39000,
  },
  {
    id: 35,
    type: "power-bank",
    name: "샤오미 20000mAh 보조배터리",
    rating: 5,
    image: ProductImage,
    price: 49000,
  },
  {
    id: 36,
    type: "power-bank",
    name: "벨킨 10000mAh PD 보조배터리",
    rating: 4,
    image: ProductImage,
    price: 59000,
  },

  {
    id: 37,
    type: "apple",
    name: "Apple MacBook Air M4",
    rating: 5,
    image: ProductImage,
    price: 1590000,
  },

  {
    id: 38,
    type: "samsung",
    name: "삼성 갤럭시북5 360",
    rating: 4,
    image: ProductImage,
    price: 1690000,
  },
  {
    id: 39,
    type: "samsung",
    name: "삼성 갤럭시 탭 S10",
    rating: 5,
    image: ProductImage,
    price: 998000,
  },

  {
    id: 40,
    type: "lg",
    name: "LG 그램 17",
    rating: 5,
    image: ProductImage,
    price: 1790000,
  },
  {
    id: 41,
    type: "lg",
    name: "LG 울트라기어 27GR75Q",
    rating: 4,
    image: ProductImage,
    price: 429000,
  },
  {
    id: 42,
    type: "lg",
    name: "LG 코드제로 오브제컬렉션",
    rating: 4,
    image: ProductImage,
    price: 899000,
  },

  {
    id: 43,
    type: "hp",
    name: "HP 오멘 16",
    rating: 4,
    image: ProductImage,
    price: 1490000,
  },

  {
    id: 44,
    type: "lenovo",
    name: "레노버 Legion 5",
    rating: 4,
    image: ProductImage,
    price: 1390000,
  },
  {
    id: 45,
    type: "lenovo",
    name: "레노버 아이디어패드 Slim 5",
    rating: 4,
    image: ProductImage,
    price: 949000,
  },

  {
    id: 46,
    type: "dell",
    name: "Dell XPS 13",
    rating: 5,
    image: ProductImage,
    price: 1890000,
  },
  {
    id: 47,
    type: "dell",
    name: "Dell S2722QC 4K 모니터",
    rating: 4,
    image: ProductImage,
    price: 499000,
  },
  {
    id: 48,
    type: "dell",
    name: "Dell Inspiron 데스크탑",
    rating: 3,
    image: ProductImage,
    price: 1099000,
  },

  {
    id: 49,
    type: "msi",
    name: "MSI Sword 16",
    rating: 4,
    image: ProductImage,
    price: 1549000,
  },

  {
    id: 50,
    type: "acer",
    name: "Acer Nitro 5",
    rating: 3,
    image: ProductImage,
    price: 1199000,
  },
  {
    id: 51,
    type: "acer",
    name: "Acer Predator 모니터",
    rating: 4,
    image: ProductImage,
    price: 599000,
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
      <ul className={`side_menu_bottom_filter_list`}>
        {items.map((item, index) => (
          <FilterMenuList key={index}>{item}</FilterMenuList>
        ))}
      </ul>
    </div>
  );
};

export default function List() {
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
  const filteredProducts = type ? productList.filter((item) => item.type === type) : productList;
  const filteredLength = filteredProducts.length;
  const selectedTypeLabel = TYPE_LABEL_MAP[type] ?? "전체 상품";
  const manufacturerList = ["APPLE", "SAMSUNG", "ASUS", "LENOVO"];
  // 무게 영어로
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
            </section>
          </section>
        </section>
      </main>
    </>
  );
}
