import "./Header.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import LogoIcon from "assets/logo/logo/icon.svg";
import LogoFull from "assets/logo/logo/icon&text.svg";
import Cart from "assets/header/header-icons/cart.svg";
import Like from "assets/header/header-icons/like.svg";
import Search from "assets/header/header-icons/search.svg";
import User from "assets/header/header-icons/user.svg";
import ChevronDown from "assets/icons/chevron-down.svg";

const categoryMenu = [
  {
    id: 1,
    key: "computer",
    title: "컴퓨터",
    items: ["노트북", "데스크탑", "모니터", "키보드", "마우스", "PC 주변기기", "PC 부품"],
  },
  {
    id: 2,
    key: "mobile",
    title: "모바일",
    items: ["스마트폰", "스마트워치", "이어폰"],
  },
  {
    id: 3,
    key: "tablet",
    title: "태블릿",
    items: ["태블릿", "태블릿 액세서리", "펜슬", "키보드 케이스"],
  },
  {
    id: 4,
    key: "accessory",
    title: "생활가전",
    items: ["프린터", "공유기", "웹캠", "보조배터리"],
  },
];

const brandMenu = [
  {
    id: 1,
    key: "premium",
    title: "프리미엄",
    items: ["Apple", "Samsung", "LG"],
  },
  {
    id: 2,
    key: "value",
    title: "가성비",
    items: ["HP", "Lenovo", "Dell"],
  },
  {
    id: 3,
    key: "gaming",
    title: "게이밍",
    items: ["MSI", "ASUS", "Acer"],
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
  console.log("Header rendering");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState("category");
  const [expandedCategories, setExpandedCategories] = useState(() => createExpandedState(categoryMenu));
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
                          <li className="dropdown__list-item" key={item}>
                            <Link to="/category">{item}</Link>
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
                          <li className="dropdown__list-item dropdown__brand-item" key={brand}>
                            <Link to="/category">{brand}</Link>
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
                        <li key={item} className="mobile-menu__list-item">
                          <Link to="/category" onClick={() => setIsMobileMenuOpen(false)}>
                            {item}
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
                        <li key={item} className="mobile-menu__list-item">
                          <Link to="/category" onClick={() => setIsMobileMenuOpen(false)}>
                            {item}
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
