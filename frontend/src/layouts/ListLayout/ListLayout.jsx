/* -------------------------------------------------------------------------- */
/* [페이지] 검색 결과 (Search)                                                */
/* 사용자가 입력한 검색어에 일치하는 상품 및 스펙 비교 결과를 나열합니다.     */
/* -------------------------------------------------------------------------- */
import { useEffect, useMemo, useState } from "react";
import "./ListLayout.scss";
import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import CartIconButton from "@/components/CartIconButton/CartIconButton";
import Modal from "@/components/Modal/Modal";
import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import WishlistIconButton from "@/components/WishlistIconButton/WishlistIconButton";

import resetIcon from "@/assets/icons/reset.svg";
import { compareProductsByNewest, getProductListKey } from "@/utils/productIdentity";
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
  "pc-parts": "PC 부품",
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
  speaker: "스피커",
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

const SORT_OPTIONS = ["인기상품", "최신상품", "리뷰 많은 상품"];
const DEFAULT_SORT_OPTION = SORT_OPTIONS[0];

const DEFAULT_FILTER_GROUPS = [
  {
    title: "제품군",
    items: ["노트북", "데스크탑", "모니터", "스마트폰", "태블릿", "PC 부품", "주변기기"],
  },
  {
    title: "제조사",
    items: ["APPLE", "SAMSUNG", "LG", "HP", "LENOVO", "DELL", "ASUS", "MSI"],
  },
];

const CATEGORY_FILTER_GROUPS = {
  notebook: [
    {
      title: "제조사",
      items: ["APPLE", "SAMSUNG", "LG", "HP", "LENOVO", "DELL", "ASUS", "MSI", "ACER"],
    },
    { title: "화면크기", items: ["13인치", "14인치", "15인치", "16인치", "17인치 이상"] },
    { title: "무게", items: ["1kg 미만", "1kg ~ 1.5kg", "1.5kg ~ 2kg", "2kg 이상"] },
    { title: "메모리/저장장치", items: ["8GB", "16GB", "32GB 이상", "256GB", "512GB", "1TB 이상"] },
    { title: "GPU 종류", items: ["내장그래픽", "외장그래픽"] },
  ],
  desktop: [
    {
      title: "제조사",
      items: ["삼성전자", "HP", "DELL", "Lenovo", "MSI", "ASUS", "영웅컴퓨터", "다나와표준PC"],
    },
    { title: "CPU 계열", items: ["Intel Core i5", "Intel Core i7", "AMD Ryzen 5", "AMD Ryzen 7"] },
    { title: "메모리", items: ["8GB", "16GB", "32GB 이상"] },
    { title: "저장장치", items: ["SSD 512GB 이하", "SSD 1TB", "SSD 2TB 이상"] },
    { title: "GPU 종류", items: ["내장그래픽", "RTX 4060", "RTX 4070", "RTX 4080 이상", "Radeon"] },
    { title: "용도", items: ["사무용", "게이밍", "크리에이터", "워크스테이션"] },
  ],
  monitor: [
    {
      title: "제조사",
      items: ["삼성전자", "LG전자", "알파스캔", "BenQ", "크로스오버", "DELL", "ASUS", "MSI"],
    },
    { title: "화면크기", items: ["24인치 이하", "27인치", "32인치", "34인치 이상"] },
    { title: "해상도", items: ["FHD", "QHD", "UHD/4K", "WQHD/울트라와이드"] },
    { title: "주사율", items: ["60Hz", "75Hz", "100Hz", "144Hz", "165Hz 이상"] },
    { title: "패널", items: ["IPS", "VA", "OLED", "TN"] },
    { title: "용도", items: ["사무용", "디자인/영상", "게이밍", "콘솔용"] },
  ],
  keyboard: [
    {
      title: "제조사",
      items: ["로지텍", "앱코", "AULA", "CORSAIR", "COX", "Razer", "스틸시리즈", "HyperX"],
    },
    { title: "연결 방식", items: ["유선", "무선", "블루투스", "멀티페어링"] },
    { title: "키 방식", items: ["기계식", "멤브레인", "펜타그래프", "무접점"] },
    { title: "배열", items: ["풀배열", "텐키리스", "미니/컴팩트"] },
    { title: "축/스위치", items: ["청축", "적축", "갈축", "저소음축", "광축"] },
    { title: "용도", items: ["사무용", "게이밍", "휴대용", "Mac 호환"] },
  ],
  mouse: [
    { title: "제조사", items: ["로지텍", "Razer", "스틸시리즈", "앱코", "COX", "ASUS", "MSI"] },
    { title: "연결 방식", items: ["유선", "무선", "블루투스"] },
    { title: "용도", items: ["사무용", "게이밍", "휴대용", "인체공학"] },
    { title: "센서/DPI", items: ["일반", "고DPI", "게이밍 센서"] },
    { title: "버튼 수", items: ["3버튼", "5버튼", "6버튼 이상"] },
    { title: "무게", items: ["초경량", "일반", "묵직한 타입"] },
  ],
  "pc-accessory": [
    {
      title: "제품군",
      items: ["웹캠", "헤드셋", "스피커", "마이크", "USB 허브", "케이블/젠더", "쿨링패드"],
    },
    { title: "제조사", items: ["로지텍", "Creative", "JBL", "Britz", "Elgato", "Razer", "앱코"] },
    { title: "연결 방식", items: ["USB", "3.5mm", "블루투스", "무선 동글"] },
    { title: "용도", items: ["화상회의", "방송/스트리밍", "게이밍", "사무용"] },
  ],
  "pc-parts": [
    {
      title: "부품 종류",
      items: [
        "CPU",
        "메인보드",
        "메모리",
        "그래픽카드",
        "SSD",
        "HDD",
        "케이스",
        "CPU쿨러",
        "파워서플라이",
      ],
    },
    {
      title: "제조사",
      items: [
        "인텔",
        "AMD",
        "삼성전자",
        "SK하이닉스",
        "마이크론",
        "GIGABYTE",
        "MSI",
        "ASUS",
        "ZOTAC",
        "PALIT",
      ],
    },
    { title: "호환 플랫폼", items: ["Intel", "AMD", "DDR4", "DDR5", "M.2", "SATA"] },
    { title: "용량/성능", items: ["500GB 이하", "1TB", "2TB 이상", "8GB", "16GB", "32GB 이상"] },
    { title: "그래픽카드 칩셋", items: ["RTX 4060", "RTX 4070", "RTX 4080 이상", "Radeon"] },
    { title: "파워 용량", items: ["500W 이하", "600W", "700W", "800W 이상"] },
  ],
  smartphone: [
    { title: "제조사", items: ["APPLE", "SAMSUNG", "샤오미"] },
    { title: "저장용량", items: ["64GB", "128GB", "256GB", "512GB 이상"] },
    { title: "화면크기", items: ["6인치 미만", "6.0 ~ 6.5인치", "6.5인치 이상"] },
    { title: "통신", items: ["5G", "LTE"] },
    { title: "구매 방식", items: ["자급제", "통신사 모델"] },
    { title: "용도", items: ["카메라", "게임", "가성비", "프리미엄"] },
  ],
  smartwatch: [
    { title: "제조사", items: ["APPLE", "SAMSUNG", "샤오미", "어메이즈핏"] },
    { title: "호환 OS", items: ["iOS", "Android", "공용"] },
    { title: "크기", items: ["40mm 이하", "41~44mm", "45mm 이상"] },
    { title: "통신", items: ["블루투스", "LTE"] },
    { title: "기능", items: ["운동/헬스", "GPS", "심박/수면", "방수"] },
    { title: "스트랩", items: ["스포츠", "메탈", "가죽", "교체 가능"] },
  ],
  earphone: [
    { title: "제조사", items: ["APPLE", "SAMSUNG", "SONY", "JBL", "QCY", "샥즈", "Creative"] },
    { title: "타입", items: ["무선이어폰", "유선이어폰", "오픈형", "커널형", "골전도"] },
    { title: "연결 방식", items: ["블루투스", "USB-C", "3.5mm"] },
    { title: "기능", items: ["노이즈캔슬링", "주변음 허용", "방수", "저지연"] },
    { title: "용도", items: ["통화", "운동", "음악감상", "게이밍"] },
  ],
  tablet: [
    { title: "제조사", items: ["APPLE", "SAMSUNG", "Lenovo", "샤오미"] },
    { title: "화면크기", items: ["8인치 이하", "10~11인치", "12인치 이상"] },
    { title: "저장용량", items: ["64GB", "128GB", "256GB", "512GB 이상"] },
    { title: "통신", items: ["Wi-Fi", "LTE/5G"] },
    { title: "펜 지원", items: ["펜 포함", "펜 별도", "펜 미지원"] },
    { title: "용도", items: ["필기/학습", "영상감상", "드로잉", "업무용"] },
  ],
  "tablet-accessory": [
    {
      title: "제품군",
      items: ["케이스", "보호필름", "거치대", "충전기", "키보드 케이스", "펜촉/펜 액세서리"],
    },
    { title: "호환 브랜드", items: ["iPad", "Galaxy Tab", "Lenovo Tab", "공용"] },
    { title: "호환 크기", items: ["8인치", "10~11인치", "12인치 이상"] },
    { title: "기능", items: ["스탠드", "자석 부착", "충격 보호", "종이질감", "강화유리"] },
  ],
  pencil: [
    { title: "제조사", items: ["APPLE", "SAMSUNG", "로지텍", "서드파티"] },
    { title: "호환 기기", items: ["iPad", "Galaxy Tab", "범용 정전식"] },
    { title: "충전 방식", items: ["무선충전", "USB-C", "건전지", "충전식"] },
    { title: "기능", items: ["필압", "틸트", "팜리젝션", "자석 부착"] },
    { title: "용도", items: ["필기", "드로잉", "업무 메모"] },
  ],
  "keyboard-case": [
    { title: "호환 브랜드", items: ["iPad", "Galaxy Tab", "공용"] },
    { title: "배열/언어", items: ["한글", "영문", "트랙패드 포함", "트랙패드 없음"] },
    { title: "연결 방식", items: ["블루투스", "스마트 커넥터", "포고핀"] },
    { title: "보호 형태", items: ["폴리오", "탈착식", "범퍼형"] },
    { title: "기능", items: ["각도 조절", "백라이트", "펜 수납"] },
  ],
  printer: [
    { title: "제조사", items: ["삼성전자", "Canon", "Epson", "HP", "Brother"] },
    { title: "방식", items: ["잉크젯", "레이저", "무한잉크", "포토프린터"] },
    { title: "컬러", items: ["흑백", "컬러"] },
    { title: "기능", items: ["복합기", "스캔", "복사", "팩스", "자동양면"] },
    { title: "연결", items: ["USB", "Wi-Fi", "유선 LAN", "모바일 출력"] },
    { title: "용도", items: ["가정용", "사무용", "사진 출력"] },
  ],
  router: [
    { title: "제조사", items: ["EFM", "ipTIME", "ASUS", "TP-Link", "Netgear"] },
    { title: "Wi-Fi 규격", items: ["Wi-Fi 5", "Wi-Fi 6", "Wi-Fi 6E", "Wi-Fi 7"] },
    { title: "속도", items: ["1Gbps 이하", "기가비트", "2.5Gbps 이상"] },
    { title: "커버리지", items: ["원룸", "아파트", "대형 공간", "Mesh 지원"] },
    { title: "기능", items: ["Mesh", "VPN", "QoS", "자녀보호", "게이밍"] },
  ],
  speaker: [
    { title: "제조사", items: ["JBL", "Creative", "Britz", "로지텍", "SONY"] },
    { title: "타입", items: ["블루투스", "PC 스피커", "사운드바", "휴대용", "2채널", "2.1채널"] },
    { title: "연결 방식", items: ["블루투스", "USB", "3.5mm", "광입력", "HDMI ARC"] },
    { title: "용도", items: ["PC용", "TV용", "캠핑/휴대", "게이밍", "음악감상"] },
    { title: "기능", items: ["방수", "마이크 내장", "RGB", "리모컨"] },
  ],
  "power-bank": [
    { title: "제조사", items: ["ANKER", "아트뮤", "샤오미", "삼성전자", "벨킨"] },
    { title: "용량", items: ["5,000mAh 이하", "10,000mAh", "20,000mAh", "30,000mAh 이상"] },
    { title: "출력", items: ["18W 이하", "20W", "30W", "45W 이상"] },
    { title: "포트", items: ["USB-A", "USB-C", "2포트", "3포트 이상"] },
    { title: "기능", items: ["고속충전", "PD", "무선충전", "노트북 충전 가능", "잔량 표시"] },
  ],
};

const BRAND_FILTER_GROUPS = [
  {
    title: "제품군",
    items: ["노트북", "데스크탑", "모니터", "스마트폰", "태블릿", "PC 부품", "주변기기"],
  },
  {
    title: "용도",
    items: ["사무/학습", "영상편집", "게이밍", "휴대성 우선", "프리미엄", "가성비"],
  },
];

const BRAND_TYPES = new Set([
  "apple",
  "samsung",
  "lg",
  "hp",
  "lenovo",
  "dell",
  "msi",
  "asus",
  "acer",
]);

const TYPE_ALIAS_MAP = {
  laptop: "notebook",
  "pc-part": "pc-parts",
};

const getFilterGroupsByType = (type) => {
  const normalizedType = TYPE_ALIAS_MAP[type] ?? type;

  if (CATEGORY_FILTER_GROUPS[normalizedType]) {
    return CATEGORY_FILTER_GROUPS[normalizedType];
  }

  if (BRAND_TYPES.has(normalizedType)) {
    return BRAND_FILTER_GROUPS;
  }

  return DEFAULT_FILTER_GROUPS;
};

const parsePrice = (value) => Number(String(value ?? "0").replace(/[^0-9]/g, "")) || 0;

const getPriceBounds = (products) => {
  const prices = products
    .map((product) => parsePrice(product.price))
    .filter((price) => Number.isFinite(price) && price > 0);

  if (prices.length === 0) {
    return { min: 0, max: 0 };
  }

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
};

const normalizeFilterText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "");

const getProductSearchText = (product) =>
  [
    product.name,
    ...(Array.isArray(product.tag) ? product.tag : []),
    ...(Array.isArray(product.priceOptions)
      ? product.priceOptions.map((option) => option?.optionName).filter(Boolean)
      : []),
  ]
    .join(" ")
    .toLowerCase();

const matchesSelectedFilters = (product, selectedFilters) => {
  const productText = getProductSearchText(product);

  return Object.entries(selectedFilters).every(([_groupTitle, values]) => {
    if (values.length === 0) {
      return true;
    }

    const normalizedProductText = normalizeFilterText(productText);

    return values.some((value) => normalizedProductText.includes(normalizeFilterText(value)));
  });
};

const sortProducts = (products, sortValue) => {
  const sortedProducts = [...products];

  if (sortValue === "최신상품") {
    return sortedProducts.sort(compareProductsByNewest);
  }

  if (sortValue === "인기상품" || sortValue === "리뷰 많은 상품") {
    return sortedProducts.sort(
      (left, right) => (Number(right.rating) || 0) - (Number(left.rating) || 0),
    );
  }

  return sortedProducts;
};

const FilterMenuList = ({ children, checked, onChange, inputId }) => {
  return (
    <li className="filter-option">
      <label htmlFor={inputId} className="filter-option__label">
        <input id={inputId} checked={checked} type="checkbox" onChange={onChange} />
        <p>{children}</p>
      </label>
    </li>
  );
};

const FilterMenuBox = ({ title, items, selectedValues, onToggle }) => {
  return (
    <div className="side_menu_bottom">
      <div className="side_menu_bottom_filter_container">
        <h3>{title}</h3>
      </div>
      <ul className="side_menu_bottom_filter_list">
        {items.map((item) => (
          <FilterMenuList
            key={`${title}-${item}`}
            inputId={`${title}-${item}`}
            checked={selectedValues.includes(item)}
            onChange={() => onToggle(title, item)}
          >
            {item}
          </FilterMenuList>
        ))}
      </ul>
    </div>
  );
};

const PriceFilterBox = ({
  className = "",
  minValue,
  maxValue,
  minPrice,
  maxPrice,
  priceRangePercent,
  onMinChange,
  onMaxChange,
}) => {
  const isDisabled = minPrice === maxPrice;

  return (
    <div className={`price-filter ${className}`.trim()}>
      <h3>가격</h3>
      <div className="range-slider">
        <div
          className="range-slider__rail"
          style={{
            "--range-left": String(priceRangePercent.left),
            "--range-right": String(priceRangePercent.right),
          }}
        >
          <div className="range-slider__track" />
          <div className="range-slider__active" />
        </div>
        <input
          type="range"
          name="min"
          min={minPrice}
          max={maxPrice}
          step={1}
          value={minValue}
          onChange={onMinChange}
          className="range-input range-input--min"
          disabled={isDisabled}
          aria-label="최소 가격"
        />
        <input
          type="range"
          name="max"
          min={minPrice}
          max={maxPrice}
          step={1}
          value={maxValue}
          onChange={onMaxChange}
          className="range-input range-input--max"
          disabled={isDisabled}
          aria-label="최대 가격"
        />
      </div>
      <div className="value">
        <p>₩ {Number(minValue).toLocaleString("ko-KR")}</p>
        <p>₩ {Number(maxValue).toLocaleString("ko-KR")}</p>
      </div>
    </div>
  );
};

export default function ListLayout({
  filteredProducts,
  status,
  errorMessage,
  selectedType,
  selectedTypeLabel,
  searchLabel,
  searchLabelSpan,
}) {
  const [searchParams] = useSearchParams();
  const type = selectedType ?? searchParams.get("type") ?? "";
  const priceBounds = useMemo(() => getPriceBounds(filteredProducts), [filteredProducts]);
  const [minValue, setMinValue] = useState(priceBounds.min);
  const [maxValue, setMaxValue] = useState(priceBounds.max);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [selectedSort, setSelectedSort] = useState(DEFAULT_SORT_OPTION);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);
  const [activeMobileFilterTab, setActiveMobileFilterTab] = useState("");

  const filterGroups = getFilterGroupsByType(type);
  const mobileFilterGroups = useMemo(() => filterGroups, [filterGroups]);
  const titleLabel = selectedTypeLabel ?? TYPE_LABEL_MAP[type] ?? "전체 상품";
  const priceRangePercent = useMemo(() => {
    const range = priceBounds.max - priceBounds.min;

    if (range <= 0) {
      return {
        left: 0,
        right: 0,
      };
    }

    return {
      left: ((minValue - priceBounds.min) / range) * 100,
      right: 100 - ((maxValue - priceBounds.min) / range) * 100,
    };
  }, [maxValue, minValue, priceBounds.max, priceBounds.min]);
  const visibleProducts = useMemo(() => {
    const priceFilteredProducts = filteredProducts.filter((product) => {
      const price = parsePrice(product.price);

      if (!price) {
        return true;
      }

      return price >= Number(minValue) && price <= Number(maxValue);
    });
    const optionFilteredProducts = priceFilteredProducts.filter((product) =>
      matchesSelectedFilters(product, selectedFilters),
    );

    return sortProducts(optionFilteredProducts, selectedSort);
  }, [filteredProducts, maxValue, minValue, selectedFilters, selectedSort]);
  const filteredLength = visibleProducts.length;
  const activeMobileFilterGroup =
    mobileFilterGroups.find((group) => group.title === activeMobileFilterTab) ??
    mobileFilterGroups[0] ??
    null;

  const handleMinChange = (event) => {
    const nextValue = Number(event.target.value);

    setMinValue(Math.min(nextValue, maxValue));
  };

  const handleMaxChange = (event) => {
    const nextValue = Number(event.target.value);

    setMaxValue(Math.max(nextValue, minValue));
  };

  const handleFilterToggle = (title, item) => {
    setSelectedFilters((currentFilters) => {
      const currentValues = currentFilters[title] ?? [];
      const nextValues = currentValues.includes(item)
        ? currentValues.filter((value) => value !== item)
        : [...currentValues, item];
      const nextFilters = { ...currentFilters };

      if (nextValues.length > 0) {
        nextFilters[title] = nextValues;
      } else {
        delete nextFilters[title];
      }

      return nextFilters;
    });
  };

  const resetFilters = () => {
    setSelectedFilters({});
    setMinValue(priceBounds.min);
    setMaxValue(priceBounds.max);
  };

  const resetMobileFilterConditions = () => {
    setSelectedFilters({});
    setMinValue(priceBounds.min);
    setMaxValue(priceBounds.max);
  };

  useEffect(() => {
    setSelectedFilters({});
    setMinValue(priceBounds.min);
    setMaxValue(priceBounds.max);
  }, [priceBounds.max, priceBounds.min, searchLabel, type]);

  useEffect(() => {
    setActiveMobileFilterTab(mobileFilterGroups[0]?.title ?? "가격");
  }, [mobileFilterGroups]);

  return (
    <>
      <main className="list-wrap">
        <section className="list-wrap-content">
          <section className="side_menu">
            <div className="side_menu_top">
              <h2>필터</h2>
              <div className="side_menu_rightbox">
                <p>초기화</p>
                <button type="button" onClick={resetFilters}>
                  <img src={resetIcon} alt="reset" />
                </button>
              </div>
            </div>
            <div className="side_menu_bottom_container">
              {filterGroups.map((group) => (
                <FilterMenuBox
                  key={group.title}
                  items={group.items}
                  selectedValues={selectedFilters[group.title] ?? []}
                  title={group.title}
                  onToggle={handleFilterToggle}
                />
              ))}
              <PriceFilterBox
                className="side_menu_bottom_range"
                minValue={minValue}
                maxValue={maxValue}
                minPrice={priceBounds.min}
                maxPrice={priceBounds.max}
                priceRangePercent={priceRangePercent}
                onMinChange={handleMinChange}
                onMaxChange={handleMaxChange}
              />
            </div>
          </section>
          <section className="list-assembly">
            <section className="list-assembly__banner">
              <img src={banner1} alt="광고 배너 1" />
            </section>
            <section className="list-assembly__top">
              <h2 className="list-assembly__title">
                {searchLabel ? null : titleLabel}
                {searchLabel ?? ""}
                <span>{searchLabelSpan}</span>

                <span>({filteredLength}) </span>
              </h2>
              <div className="filter-container">
                <button
                  type="button"
                  className="filter-button"
                  onClick={() => setIsFilterModalOpen(true)}
                >
                  필터 <img src={ChevronDownIcon} alt="down" />
                </button>
                <button
                  type="button"
                  className="filter-button"
                  onClick={() => setIsSortModalOpen(true)}
                >
                  {selectedSort}순 <img src={ChevronDownIcon} alt="down" />
                </button>
              </div>
              <button
                type="button"
                className="list-assembly__desktop-sort-button"
                onClick={() => setIsSortModalOpen(true)}
              >
                {selectedSort}순 <img src={ChevronDownIcon} alt="down" />
              </button>
            </section>
            <section className="list-assembly__content">
              {status === "loading" ? (
                <p className="list-assembly__state">상품을 불러오는 중입니다.</p>
              ) : null}
              {status === "error" ? <p className="list-assembly__state">{errorMessage}</p> : null}
              {status === "success" && visibleProducts.length === 0 ? (
                <p className="list-assembly__state">조건에 맞는 상품이 없습니다.</p>
              ) : null}
              {status === "success" && visibleProducts.length > 0 ? (
                <div className="list-assembly__product-grid">
                  {visibleProducts.map((product) => (
                    <ProductCardVertical
                      key={getProductListKey(product)}
                      product={product}
                      action={
                        <div className="list-assembly__button-container">
                          <CartIconButton product={product} size="sm" />
                          <WishlistIconButton product={product} size="sm" />
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
      {isFilterModalOpen ? (
        <Modal
          title="필터"
          onClose={() => setIsFilterModalOpen(false)}
          className="list-mobile-filter-modal"
          showCloseButton={false}
        >
          <div className="list-mobile-filter">
            <div className="list-mobile-filter__tabs">
              {mobileFilterGroups.map((group) => (
                <button
                  key={group.title}
                  type="button"
                  className={`list-mobile-filter__tab ${
                    activeMobileFilterTab === group.title ? "is-active" : ""
                  }`}
                  onClick={() => setActiveMobileFilterTab(group.title)}
                >
                  {group.title}
                </button>
              ))}
              <button
                type="button"
                className={`list-mobile-filter__tab ${
                  activeMobileFilterTab === "가격" ? "is-active" : ""
                }`}
                onClick={() => setActiveMobileFilterTab("가격")}
              >
                가격
              </button>
            </div>

            <div className="list-mobile-filter__content">
              {activeMobileFilterTab === "가격" ? (
                <PriceFilterBox
                  className="list-mobile-filter__price"
                  minValue={minValue}
                  maxValue={maxValue}
                  minPrice={priceBounds.min}
                  maxPrice={priceBounds.max}
                  priceRangePercent={priceRangePercent}
                  onMinChange={handleMinChange}
                  onMaxChange={handleMaxChange}
                />
              ) : (
                <ul className="list-mobile-filter__options">
                  {activeMobileFilterGroup?.items.map((item) => (
                    <FilterMenuList
                      key={`${activeMobileFilterGroup.title}-${item}`}
                      inputId={`mobile-${activeMobileFilterGroup.title}-${item}`}
                      checked={(selectedFilters[activeMobileFilterGroup.title] ?? []).includes(item)}
                      onChange={() => handleFilterToggle(activeMobileFilterGroup.title, item)}
                    >
                      {item}
                    </FilterMenuList>
                  ))}
                </ul>
              )}
            </div>

            <div className="list-mobile-filter__actions">
              <button
                type="button"
                className="list-mobile-filter__reset"
                onClick={resetMobileFilterConditions}
              >
                초기화 <img src={resetIcon} alt="" />
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
      {isSortModalOpen ? (
        <Modal
          title="정렬"
          onClose={() => setIsSortModalOpen(false)}
          className="list-mobile-sort-modal"
          showCloseButton={false}
        >
          <div className="list-mobile-sort">
            <div className="list-mobile-sort__options">
              {SORT_OPTIONS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`list-mobile-sort__option ${
                    selectedSort === option ? "is-active" : ""
                  }`}
                  onClick={() => {
                    setSelectedSort(option);
                    setIsSortModalOpen(false);
                  }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
