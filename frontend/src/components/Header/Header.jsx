import "./Header.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LogoIcon from "../../assets/logo/logo/icon.svg";
import LogoFull from "../../assets/logo/logo/icon&text.svg";
import Cart from "../../assets/header/header-icons/cart.svg";
import Like from "../../assets/header/header-icons/like.svg";
import Search from "../../assets/header/header-icons/search.svg";
import User from "../../assets/header/header-icons/user.svg";
import ChevronDown from "../../assets/icons/chevron-down.svg";

const categoryMenu = [
  {
    id: 1,
    key: "computer",
    title: "컴퓨터",
    items: [
      { label: "노트북", type: "notebook" },
      { label: "데스크탑", type: "desktop" },
      { label: "모니터", type: "monitor" },
      { label: "키보드", type: "keyboard" },
      { label: "마우스", type: "mouse" },
      { label: "PC 주변기기", type: "pc-accessory" },
      { label: "PC 부품", type: "pc-part" },
    ],
  },
  {
    id: 2,
    key: "mobile",
    title: "모바일",
    items: [
      { label: "스마트폰", type: "smartphone" },
      { label: "스마트워치", type: "smartwatch" },
      { label: "이어폰", type: "earphone" },
    ],
  },
  {
    id: 3,
    key: "tablet",
    title: "태블릿",
    items: [
      { label: "태블릿", type: "tablet" },
      { label: "태블릿 액세서리", type: "tablet-accessory" },
      { label: "펜슬", type: "pencil" },
      { label: "키보드 케이스", type: "keyboard-case" },
    ],
  },
  {
    id: 4,
    key: "accessory",
    title: "생활가전",
    items: [
      { label: "프린터", type: "printer" },
      { label: "공유기", type: "router" },
      { label: "웹캠", type: "webcam" },
      { label: "보조배터리", type: "power-bank" },
    ],
  },
];

const brandMenu = [
  {
    id: 1,
    key: "premium",
    title: "프리미엄",
    items: [
      {
        label: "Apple",
        type: "apple",
      },
      {
        label: "Samsung",
        type: "samsung",
      },
      {
        label: "LG",
        type: "lg",
      },
    ],
  },

  {
    id: 2,
    key: "value",
    title: "가성비",
    items: [
      {
        label: "HP",
        type: "hp",
      },
      {
        label: "Lenovo",
        type: "lenovo",
      },
      {
        label: "Dell",
        type: "dell",
      },
    ],
  },
  {
    id: 3,
    key: "gaming",
    title: "게이밍",
    items: [
      {
        label: "MSI",
        type: "msi",
      },
      {
        label: "ASUS",
        type: "asus",
      },
      {
        label: "Acer",
        type: "acer",
      },
    ],
  },
];

const mobileTabs = [
  { key: "category", label: "품목별" },
  { key: "brand", label: "브랜드별" },
  { key: "pc-build", label: "PC 조립" },
];

const createExpandedState = (items) =>
  items.reduce((acc, item) => {
    acc[item.key] = true;
    return acc;
  }, {});

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState("category");
  const [expandedCategories, setExpandedCategories] = useState(() =>
    createExpandedState(categoryMenu),
  );
  const [expandedBrands, setExpandedBrands] = useState(() => createExpandedState(brandMenu));

  const headerIcons = [
    { id: 1, name: "search", src: Search, alt: "검색" },
    { id: 2, name: "cart", src: Cart, alt: "장바구니" },
    { id: 3, name: "like", src: Like, alt: "찜 목록" },
    { id: 4, name: "user", src: User, alt: "마이페이지" },
  ];

  useEffect(() => {
    const handleToggleMenu = () => {
      setIsMobileMenuOpen((prev) => !prev);
    };

    const handleCloseMenu = () => {
      setIsMobileMenuOpen(false);
    };

    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener("toggle-mobile-menu", handleToggleMenu);
    window.addEventListener("close-mobile-menu", handleCloseMenu);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("toggle-mobile-menu", handleToggleMenu);
      window.removeEventListener("close-mobile-menu", handleCloseMenu);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isMobileMenuOpen);

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMobileMenuOpen]);

  const toggleCategorySection = (sectionKey) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  const toggleBrandSection = (sectionKey) => {
    setExpandedBrands((prev) => ({
      ...prev,
      [sectionKey]: !prev[sectionKey],
    }));
  };

  return (
    <header className="header">
      <div className="header__top">
        <h1 className="header__logo">
          <Link to="/" aria-label="GOREON 홈">
            <img src={LogoIcon} alt="GOREON 아이콘" className="header__logo-icon" />
            <img src={LogoFull} alt="GOREON 로고" className="header__logo-full" />
          </Link>
        </h1>

        <div className="header__right">
          <div className="header__icons">
            {headerIcons.map((icon) => (
              <button
                type="button"
                className={`header__icon-btn header__icon-btn--${icon.name}`}
                key={icon.id}
                aria-label={icon.alt}
              >
                <img src={icon.src} alt="" />
              </button>
            ))}
          </div>

          <div className="header__auth">
            <button type="button">로그인</button>
            <button type="button">회원가입</button>
          </div>
        </div>

        <button type="button" className="header__mobile-user" aria-label="마이페이지">
          <img src={User} alt="" />
        </button>
      </div>

      <nav className="header__nav" aria-label="메인 메뉴">
        <ul className="gnb">
          <li className="gnb__item gnb__item--with-dropdown">
            <button type="button" className="gnb__button">
              품목별
            </button>
            <div className="dropdown dropdown--category">
              <div className="dropdown__panel">
                <div className="dropdown__inner dropdown__inner--category">
                  {categoryMenu.map((category) => (
                    <div className="dropdown__column" key={category.id}>
                      <div className="dropdown__title">{category.title}</div>
                      <ul className="dropdown__list">
                        {category.items.map((item) => (
                          <li className="dropdown__list-item" key={item.type}>
                            <Link to={`/list?type=${item.type}`}>{item.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </li>

          <li className="gnb__item gnb__item--with-dropdown">
            <button type="button" className="gnb__button">
              브랜드별
            </button>

            <div className="dropdown dropdown--brand">
              <div className="dropdown__panel">
                <div className="dropdown__inner dropdown__inner--brand">
                  {brandMenu.map((group) => (
                    <div className="dropdown__column" key={group.id}>
                      <div className="dropdown__title">{group.title}</div>
                      <ul className="dropdown__list dropdown__list--brand">
                        {group.items.map((brand) => (
                          <li className="dropdown__list-item dropdown__brand-item" key={brand.type}>
                            <Link to={`/list?type=${brand.type}`}>{brand.label}</Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </li>

          <li className="gnb__item">
            <Link to="/pc-assembly" className="gnb__link">
              PC 조립
            </Link>
          </li>
        </ul>
      </nav>

      <div className={`mobile-menu ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="mobile-menu__tabs" role="tablist" aria-label="모바일 메뉴">
          {mobileTabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={activeMobileTab === tab.key}
              className={`mobile-menu__tab ${activeMobileTab === tab.key ? "is-active" : ""}`}
              onClick={() => setActiveMobileTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="mobile-menu__content">
          {activeMobileTab === "category" && (
            <div className="mobile-menu__section-group">
              {categoryMenu.map((section) => (
                <section className="mobile-menu__section" key={section.key}>
                  <button
                    type="button"
                    className="mobile-menu__section-button"
                    onClick={() => toggleCategorySection(section.key)}
                    aria-expanded={expandedCategories[section.key]}
                  >
                    <span>{section.title}</span>
                    <img
                      src={ChevronDown}
                      alt=""
                      className={`mobile-menu__chevron ${
                        expandedCategories[section.key] ? "is-open" : ""
                      }`}
                    />
                  </button>

                  {expandedCategories[section.key] && (
                    <ul className="mobile-menu__list">
                      {section.items.map((item) => (
                        <li key={item.type} className="mobile-menu__list-item">
                          <Link
                            to={`/list?type=${item.type}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}

          {activeMobileTab === "brand" && (
            <div className="mobile-menu__section-group">
              {brandMenu.map((section) => (
                <section className="mobile-menu__section" key={section.key}>
                  <button
                    type="button"
                    className="mobile-menu__section-button"
                    onClick={() => toggleBrandSection(section.key)}
                    aria-expanded={expandedBrands[section.key]}
                  >
                    <span>{section.title}</span>
                    <img
                      src={ChevronDown}
                      alt=""
                      className={`mobile-menu__chevron ${
                        expandedBrands[section.key] ? "is-open" : ""
                      }`}
                    />
                  </button>
                  {expandedBrands[section.key] && (
                    <ul className="mobile-menu__list mobile-menu__list--brand-text">
                      {section.items.map((item) => (
                        <li key={item.type} className="mobile-menu__list-item">
                          <Link
                            to={`/list?type=${item.type}`}
                            onClick={() => setIsMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>
          )}

          {activeMobileTab === "pc-build" && (
            <div className="mobile-menu__cta">
              <p className="mobile-menu__cta-title">PC 조립</p>
              <p className="mobile-menu__cta-text">
                원하는 사양과 예산에 맞는 조립 PC 페이지로 바로 이동할 수 있어요.
              </p>
              <Link
                to="/pc-assembly"
                className="mobile-menu__cta-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                PC 조립 페이지로 이동
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
