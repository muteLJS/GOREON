/* -------------------------------------------------------------------------- */
/* [페이지] 찜하기 (Wishlist)                                                 */
/* 찜하기: 하트를 누른 관심 상품 목록 모아보기                                */
/* -------------------------------------------------------------------------- */
import "./Wishlist.scss";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import resetIcon from "@/assets/icons/reset.svg";
import CartIconButton from "@/components/CartIconButton/CartIconButton";
import Modal from "@/components/Modal/Modal";
import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import WishlistIconButton from "@/components/WishlistIconButton/WishlistIconButton";
import useProductCatalog from "@/hooks/useProductCatalog";
import { getProductListKey, getProductObjectId } from "@/utils/productIdentity";

const DESKTOP_MEDIA_QUERY = "(min-width: 1024px)";

const WISHLIST_CATEGORY_FILTERS = [
  { label: "노트북", keywords: ["노트북", "갤럭시북", "그램", "맥북", "notebook", "laptop"] },
  { label: "데스크탑", keywords: ["데스크탑", "desktop"] },
  { label: "모니터", keywords: ["모니터", "monitor"] },
  { label: "스마트폰", keywords: ["스마트폰", "휴대폰", "핸드폰", "갤럭시", "아이폰"] },
  { label: "태블릿", keywords: ["태블릿", "아이패드", "갤럭시탭", "tablet"] },
  {
    label: "PC 부품",
    keywords: [
      "PC 부품",
      "PC부품",
      "CPU",
      "메인보드",
      "메모리",
      "그래픽카드",
      "SSD",
      "HDD",
      "케이스",
      "파워",
    ],
  },
  { label: "주변기기", keywords: ["주변기기", "PC 주변기기", "웹캠", "스피커", "헤드셋"] },
  { label: "키보드", keywords: ["키보드", "keyboard"] },
  { label: "마우스", keywords: ["마우스", "mouse"] },
  { label: "이어폰", keywords: ["이어폰", "헤드셋", "earphone"] },
];

const normalizeFilterText = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/\s+/g, "");

const getProductSearchText = (product) =>
  [
    product.name,
    product.title,
    product.url,
    ...(Array.isArray(product.tag) ? product.tag : []),
    ...(Array.isArray(product.priceOptions)
      ? product.priceOptions.map((option) => option?.optionName).filter(Boolean)
      : []),
  ]
    .join(" ")
    .toLowerCase();

const productMatchesCategory = (product, categoryLabel) => {
  const category = WISHLIST_CATEGORY_FILTERS.find((item) => item.label === categoryLabel);

  if (!category) {
    return true;
  }

  const normalizedProductText = normalizeFilterText(getProductSearchText(product));

  return category.keywords.some((keyword) =>
    normalizedProductText.includes(normalizeFilterText(keyword)),
  );
};

const FilterMenuList = ({ children, checked, onChange, inputId }) => {
  return (
    <li className="wishlist-filter-option">
      <label htmlFor={inputId} className="wishlist-filter-option__label">
        <input id={inputId} checked={checked} type="checkbox" onChange={onChange} />
        <p>{children}</p>
      </label>
    </li>
  );
};

const FilterMenuBox = ({ title, selectedCategories, onToggle }) => {
  return (
    <div className="side_menu_bottom">
      <div className="side_menu_bottom_filter_container">
        <h3>{title}</h3>
      </div>
      <ul className="side_menu_bottom_filter_list">
        {WISHLIST_CATEGORY_FILTERS.map((category) => (
          <FilterMenuList
            key={category.label}
            inputId={`wishlist-category-${category.label}`}
            checked={selectedCategories.includes(category.label)}
            onChange={() => onToggle(category.label)}
          >
            {category.label}
          </FilterMenuList>
        ))}
      </ul>
    </div>
  );
};

export default function Wishlist() {
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const { products: catalogProducts } = useProductCatalog();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeMobileFilterTab, setActiveMobileFilterTab] = useState("카테고리 분류");

  const catalogProductMap = useMemo(() => {
    const nextMap = new Map();

    catalogProducts.forEach((product) => {
      const productId = getProductObjectId(product);

      if (productId) {
        nextMap.set(productId, product);
      }
    });

    return nextMap;
  }, [catalogProducts]);

  const wishlistProducts = useMemo(
    () =>
      wishlistItems.map((item) => {
        const productId = getProductObjectId(item);
        const catalogProduct = productId ? catalogProductMap.get(productId) : null;

        return catalogProduct ? { ...item, ...catalogProduct } : item;
      }),
    [catalogProductMap, wishlistItems],
  );
  const filteredWishlistProducts = useMemo(() => {
    if (selectedCategories.length === 0) {
      return wishlistProducts;
    }

    return wishlistProducts.filter((product) =>
      selectedCategories.some((category) => productMatchesCategory(product, category)),
    );
  }, [selectedCategories, wishlistProducts]);
  const wishlistLength = filteredWishlistProducts.length;
  const activeMobileFilterGroup =
    activeMobileFilterTab === "카테고리 분류" ? WISHLIST_CATEGORY_FILTERS : [];

  const handleFilterToggle = (category) => {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(category)
        ? currentCategories.filter((item) => item !== category)
        : [...currentCategories, category],
    );
  };

  const resetFilters = () => {
    setSelectedCategories([]);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia(DESKTOP_MEDIA_QUERY);
    const syncFilterModalToViewport = (event = mediaQuery) => {
      if (event.matches) {
        setIsFilterModalOpen(false);
      }
    };

    syncFilterModalToViewport();
    mediaQuery.addEventListener("change", syncFilterModalToViewport);

    return () => {
      mediaQuery.removeEventListener("change", syncFilterModalToViewport);
    };
  }, []);

  return (
    <>
      <main className="list-wrap-wishlist">
        <section className="list-wrap-content">
          <section className="side_menu">
            <div className="side_menu_top">
              <h2>필터</h2>
              <div className="side_menu_rightbox">
                <p>초기화</p>
                <button type="button" onClick={resetFilters} aria-label="필터 초기화">
                  <img src={resetIcon} alt="" />
                </button>
              </div>
            </div>
            <div className="side_menu_bottom_container">
              <FilterMenuBox
                title="카테고리 분류"
                selectedCategories={selectedCategories}
                onToggle={handleFilterToggle}
              />
            </div>
          </section>

          <section className="list-assembly">
            <section className="list-assembly__banner">
              <img src={banner1} alt="광고 배너 1" />
            </section>

            <section className="list-assembly__top">
              <h2 className="list-assembly__title">
                찜한 상품 <span>({wishlistLength})</span>
              </h2>
              <div className="filter-container">
                <button
                  className="filter-button"
                  type="button"
                  onClick={() => setIsFilterModalOpen(true)}
                >
                  필터 <img src={ChevronDownIcon} alt="down" />
                </button>
              </div>
            </section>

            <section className="list-assembly__content">
              {filteredWishlistProducts.length > 0 ? (
                <div className="list-assembly__product-grid">
                  {filteredWishlistProducts.map((product) => (
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
              ) : (
                <p className="list-assembly__state">
                  {wishlistItems.length > 0
                    ? "조건에 맞는 찜한 상품이 없습니다."
                    : "찜한 상품이 없습니다."}
                </p>
              )}
            </section>
          </section>
        </section>
      </main>

      {isFilterModalOpen ? (
        <Modal
          title="필터"
          onClose={() => setIsFilterModalOpen(false)}
          className="wishlist-mobile-filter-modal"
          showCloseButton={false}
        >
          <div className="wishlist-mobile-filter">
            <div className="wishlist-mobile-filter__tabs">
              <button
                type="button"
                className={`wishlist-mobile-filter__tab ${
                  activeMobileFilterTab === "카테고리 분류" ? "is-active" : ""
                }`}
                onClick={() => setActiveMobileFilterTab("카테고리 분류")}
              >
                카테고리 분류
              </button>
            </div>

            <div className="wishlist-mobile-filter__content">
              <ul className="wishlist-mobile-filter__options">
                {activeMobileFilterGroup.map((category) => (
                  <FilterMenuList
                    key={`mobile-${category.label}`}
                    inputId={`mobile-wishlist-category-${category.label}`}
                    checked={selectedCategories.includes(category.label)}
                    onChange={() => handleFilterToggle(category.label)}
                  >
                    {category.label}
                  </FilterMenuList>
                ))}
              </ul>
            </div>

            <div className="wishlist-mobile-filter__actions">
              <button
                type="button"
                className="wishlist-mobile-filter__reset"
                onClick={resetFilters}
              >
                초기화 <img src={resetIcon} alt="" />
              </button>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}
