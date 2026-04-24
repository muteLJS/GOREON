import "./Header.scss";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";

import LogoIcon from "@/assets/logo/logo/icon.svg";
import LogoFull from "@/assets/logo/logo/icon&text.svg";
import Cart from "@/assets/header/header-icons/cart.svg";
import Like from "@/assets/header/header-icons/like.svg";
import Search from "@/assets/header/header-icons/search.svg";
import User from "@/assets/header/header-icons/user.svg";
import AcerBrandIcon from "@/assets/header/nav/Acer.svg";
import AppleBrandIcon from "@/assets/header/nav/Apple.svg";
import AsusBrandIcon from "@/assets/header/nav/Asus.svg";
import DellBrandIcon from "@/assets/header/nav/Dell.svg";
import HpBrandIcon from "@/assets/header/nav/Hp.svg";
import LenovoBrandIcon from "@/assets/header/nav/Lenovo.svg";
import LGBrandIcon from "@/assets/header/nav/LG.svg";
import MsiBrandIcon from "@/assets/header/nav/Msi.svg";
import SamsungBrandIcon from "@/assets/header/nav/Samsung.svg";
import ChevronDown from "@/assets/icons/chevron-down.svg";
import Prev from "@/assets/icons/prev.svg";
import {
  BRAND_MENU,
  CATEGORY_MENU,
  DESKTOP_NAV_ITEMS,
  MOBILE_NAV_TABS,
  SEARCH_SUGGESTIONS,
} from "@/data/navigation";
import { logout } from "@/store/slices/userSlice";
import api from "@/utils/api";

const DESKTOP_BREAKPOINT = 1024;

const MOBILE_MENU_SECTIONS = {
  category: CATEGORY_MENU,
  brand: BRAND_MENU,
};

const DESKTOP_SEARCH_ICON_STYLE = {
  "--icon-width": "24px",
  "--icon-height": "24px",
};

const BRAND_ICONS = {
  acer: AcerBrandIcon,
  apple: AppleBrandIcon,
  asus: AsusBrandIcon,
  dell: DellBrandIcon,
  hp: HpBrandIcon,
  lenovo: LenovoBrandIcon,
  lg: LGBrandIcon,
  msi: MsiBrandIcon,
  samsung: SamsungBrandIcon,
};

const createExpandedState = (sections) =>
  sections.reduce((acc, section) => {
    acc[section.key] = true;
    return acc;
  }, {});

const createInitialExpandedMenus = () => ({
  category: createExpandedState(CATEGORY_MENU),
  brand: createExpandedState(BRAND_MENU),
});

function BrandMenuLabel({ item, iconClassName = "" }) {
  const icon = BRAND_ICONS[item.type];

  return (
    <>
      {icon ? (
        <img
          src={icon}
          alt=""
          aria-hidden="true"
          className={["brand-menu__icon", iconClassName].filter(Boolean).join(" ")}
        />
      ) : null}
      <span>{item.label}</span>
    </>
  );
}

function HeaderSearchForm({ searchQuery, onQueryChange, onSubmit, onSuggestionClick, onFocus }) {
  return (
    <form className="header__search-form" onSubmit={onSubmit}>
      <div className="header__search-input-wrap">
        <button type="submit" className="header__search-icon-button" aria-label="검색 실행">
          <img src={Search} alt="" className="header__search-icon" />
        </button>
        <input
          type="text"
          value={searchQuery}
          placeholder="검색어를 입력하세요"
          onChange={(event) => onQueryChange(event.target.value)}
          onFocus={onFocus}
        />
      </div>

      <div className="header__search-suggestions">
        {SEARCH_SUGGESTIONS.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="header__search-suggestion"
            onClick={() => onSuggestionClick(suggestion)}
          >
            {suggestion}
          </button>
        ))}
      </div>

      <button type="submit" className="header__search-submit">
        검색
      </button>
    </form>
  );
}

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const desktopSearchRef = useRef(null);
  const searchCloseTimerRef = useRef(null);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeMobileTab, setActiveMobileTab] = useState("category");
  const [expandedMobileMenus, setExpandedMobileMenus] = useState(createInitialExpandedMenus);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchPinned, setIsSearchPinned] = useState(false);
  const [activeDesktopMenu, setActiveDesktopMenu] = useState(null);
  const [hoveredDesktopMenu, setHoveredDesktopMenu] = useState(null);

  const headerIcons = [
    { key: "cart", src: Cart, alt: "장바구니", to: "/cart", width: 26, height: 23 },
    { key: "like", src: Like, alt: "찜 목록", to: "/wishlist", width: 26, height: 22 },
    {
      key: "user",
      src: User,
      alt: "마이페이지",
      to: isLoggedIn ? "/mypage" : "/login",
      width: 26,
      height: 26,
    },
  ];

  const clearSearchCloseTimer = () => {
    if (searchCloseTimerRef.current) {
      window.clearTimeout(searchCloseTimerRef.current);
      searchCloseTimerRef.current = null;
    }
  };

  const closeSearch = () => {
    clearSearchCloseTimer();
    setIsSearchOpen(false);
    setIsSearchPinned(false);
  };

  const isDesktopViewport = () => window.innerWidth >= DESKTOP_BREAKPOINT;

  useEffect(() => {
    const resetSearchState = () => {
      clearSearchCloseTimer();
      setIsSearchOpen(false);
      setIsSearchPinned(false);
    };

    const handleToggleMenu = () => {
      resetSearchState();
      setIsMobileMenuOpen((prev) => !prev);
    };

    const handleCloseMenu = () => {
      setIsMobileMenuOpen(false);
    };

    const handleToggleSearch = () => {
      if (!isDesktopViewport()) {
        setIsMobileMenuOpen(false);
        setIsSearchPinned((prevPinned) => {
          const nextPinned = !prevPinned;
          setIsSearchOpen(nextPinned);
          return nextPinned;
        });
      }
    };

    const handleResize = () => {
      if (isDesktopViewport()) {
        setIsMobileMenuOpen(false);
        resetSearchState();
      }
    };

    window.addEventListener("toggle-mobile-menu", handleToggleMenu);
    window.addEventListener("close-mobile-menu", handleCloseMenu);
    window.addEventListener("toggle-mobile-search", handleToggleSearch);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("toggle-mobile-menu", handleToggleMenu);
      window.removeEventListener("close-mobile-menu", handleCloseMenu);
      window.removeEventListener("toggle-mobile-search", handleToggleSearch);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle("mobile-menu-open", isMobileMenuOpen);

    return () => {
      document.body.classList.remove("mobile-menu-open");
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    clearSearchCloseTimer();
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsSearchPinned(false);
    setActiveDesktopMenu(null);
    setHoveredDesktopMenu(null);
  }, [location.pathname, location.search]);

  useEffect(() => {
    const resetSearchState = () => {
      clearSearchCloseTimer();
      setIsSearchOpen(false);
      setIsSearchPinned(false);
    };

    const handlePointerDown = (event) => {
      const isInsideDesktopSearch = desktopSearchRef.current?.contains(event.target);

      if (!isInsideDesktopSearch && isDesktopViewport()) {
        resetSearchState();
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        resetSearchState();
      }
    };

    const handleScroll = () => {
      resetSearchState();
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      clearSearchCloseTimer();
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleMobileSection = (tabKey, sectionKey) => {
    setExpandedMobileMenus((prev) => ({
      ...prev,
      [tabKey]: {
        ...prev[tabKey],
        [sectionKey]: !prev[tabKey][sectionKey],
      },
    }));
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/");
  };

  const handleLogout = async () => {
    await api.post("/auth/logout").catch((error) => {
      console.warn("[auth][logout] request failed", {
        message: error.message,
        status: error.response?.status,
      });
    });

    dispatch(logout());
    navigate("/");
  };

  const handleHomeClick = () => {
    window.dispatchEvent(new Event("reset-main-ai-section"));
  };

  const openSearchLayer = () => {
    if (isDesktopViewport()) {
      clearSearchCloseTimer();
      setIsSearchOpen(true);
    }
  };

  const closeSearchLayer = () => {
    if (isDesktopViewport() && !isSearchPinned) {
      clearSearchCloseTimer();
      searchCloseTimerRef.current = window.setTimeout(() => {
        setIsSearchOpen(false);
        searchCloseTimerRef.current = null;
      }, 120);
    }
  };

  const toggleSearchLayer = () => {
    const nextPinned = !isSearchPinned;
    setIsSearchPinned(nextPinned);
    setIsSearchOpen(nextPinned || isDesktopViewport());
  };

  const openDesktopMenu = (menuKey) => {
    if (isDesktopViewport()) {
      setHoveredDesktopMenu(menuKey);
      closeSearch();
    }
  };

  const toggleDesktopMenu = (menuKey) => {
    if (isDesktopViewport()) {
      setActiveDesktopMenu((prev) => (prev === menuKey ? null : menuKey));
      setHoveredDesktopMenu(null);
      closeSearch();
    }
  };

  const clearDesktopHover = () => {
    if (isDesktopViewport()) {
      setHoveredDesktopMenu(null);
    }
  };

  const submitSearch = (keyword = searchQuery) => {
    const nextQuery = keyword.trim();

    navigate(nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search");
    setSearchQuery(nextQuery);
    closeSearch();
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    submitSearch();
  };

  const handleMobileMenuLinkClick = () => {
    setIsMobileMenuOpen(false);
  };

  const activeMobileSections = MOBILE_MENU_SECTIONS[activeMobileTab];
  const isBrandTab = activeMobileTab === "brand";
  const isHomePage = location.pathname === "/";
  const visibleDesktopMenu = hoveredDesktopMenu ?? activeDesktopMenu;

  return (
    <header className="header">
      <div className="header__top">
        {isHomePage ? (
          <h1 className="header__logo header__logo--mobile">
            <Link to="/" aria-label="GOREON 홈" onClick={handleHomeClick}>
              <img src={LogoIcon} alt="GOREON 아이콘" className="header__logo-icon" />
              <img src={LogoFull} alt="GOREON 로고" className="header__logo-full" />
            </Link>
          </h1>
        ) : (
          <button
            type="button"
            className="header__mobile-back"
            aria-label="뒤로 가기"
            onClick={handleBack}
          >
            <img src={Prev} alt="" />
          </button>
        )}

        <h1 className="header__logo header__logo--desktop">
          <Link to="/" aria-label="GOREON 홈" onClick={handleHomeClick}>
            <img src={LogoIcon} alt="GOREON 아이콘" className="header__logo-icon" />
            <img src={LogoFull} alt="GOREON 로고" className="header__logo-full" />
          </Link>
        </h1>

        <div className="header__right">
          <div className="header__icons">
            <div
              ref={desktopSearchRef}
              className={`header__search ${isSearchOpen ? "is-open" : ""}`}
              onMouseEnter={openSearchLayer}
              onMouseLeave={closeSearchLayer}
            >
              <button
                type="button"
                className="header__icon-btn header__icon-btn--search"
                style={DESKTOP_SEARCH_ICON_STYLE}
                aria-label="검색"
                aria-expanded={isSearchOpen}
                onClick={toggleSearchLayer}
              >
                <img src={Search} alt="" />
              </button>

              <div
                className="header__search-panel"
                onMouseEnter={openSearchLayer}
                onMouseLeave={closeSearchLayer}
              >
                <div className="header__search-sheet">
                  <HeaderSearchForm
                    searchQuery={searchQuery}
                    onQueryChange={setSearchQuery}
                    onSubmit={handleSearchSubmit}
                    onSuggestionClick={submitSearch}
                    onFocus={() => setIsSearchOpen(true)}
                  />
                </div>
              </div>
            </div>

            {headerIcons.map((icon) => (
              <button
                type="button"
                className="header__icon-btn header__icon-btn--action"
                key={icon.key}
                style={{
                  "--icon-width": `${icon.width}px`,
                  "--icon-height": `${icon.height}px`,
                }}
                aria-label={icon.alt}
                onClick={() => navigate(icon.to)}
              >
                <img src={icon.src} alt="" />
              </button>
            ))}
          </div>

          <div className="header__auth">
            {isLoggedIn ? (
              <button type="button" onClick={handleLogout}>
                로그아웃
              </button>
            ) : (
              <>
                <button type="button" onClick={() => navigate("/login")}>
                  로그인
                </button>
                <button type="button" onClick={() => navigate("/register")}>
                  회원가입
                </button>
              </>
            )}
          </div>
        </div>

        <button
          type="button"
          className="header__mobile-user"
          aria-label="마이페이지"
          onClick={() => navigate(isLoggedIn ? "/mypage" : "/login")}
        >
          <img src={User} alt="" />
        </button>
      </div>

      <nav className="header__nav" aria-label="메인 메뉴">
        <ul className="gnb" onMouseLeave={clearDesktopHover}>
          {DESKTOP_NAV_ITEMS.map((item) => {
            const isOpen = visibleDesktopMenu === item.key;

            if (!item.sections) {
              return (
                <li
                  className={`gnb__item ${isOpen ? "is-open" : ""}`}
                  key={item.key}
                  onMouseEnter={() => openDesktopMenu(item.key)}
                >
                  <Link to={item.to} className="gnb__link">
                    {item.label}
                  </Link>
                </li>
              );
            }

            const listItemClassName =
              item.variant === "brand"
                ? "dropdown__list-item dropdown__brand-item"
                : "dropdown__list-item";
            const innerClassName =
              item.variant === "brand"
                ? "dropdown__inner dropdown__inner--brand"
                : "dropdown__inner dropdown__inner--category";

            return (
              <li
                className={`gnb__item ${isOpen ? "is-open" : ""}`}
                key={item.key}
                onMouseEnter={() => openDesktopMenu(item.key)}
              >
                <button
                  type="button"
                  className="gnb__button"
                  onClick={() => toggleDesktopMenu(item.key)}
                >
                  {item.label}
                </button>

                <div className="dropdown">
                  <div className="dropdown__panel">
                    <div className={innerClassName}>
                      {item.sections.map((section) => (
                        <div className="dropdown__column" key={section.key}>
                          <div className="dropdown__title">{section.title}</div>
                          <ul className="dropdown__list">
                            {section.items.map((menuItem) => (
                              <li className={listItemClassName} key={menuItem.type}>
                                <Link to={`/list?type=${menuItem.type}`}>
                                  {item.variant === "brand" ? (
                                    <BrandMenuLabel
                                      item={menuItem}
                                      iconClassName="brand-menu__icon--desktop"
                                    />
                                  ) : (
                                    menuItem.label
                                  )}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>

      <div
        className={`header__search-backdrop ${isSearchOpen ? "is-open" : ""}`}
        onClick={closeSearch}
      />

      <div className={`header__search header__search--mobile ${isSearchOpen ? "is-open" : ""}`}>
        <div className="header__search-panel">
          <div className="header__search-sheet">
            <HeaderSearchForm
              searchQuery={searchQuery}
              onQueryChange={setSearchQuery}
              onSubmit={handleSearchSubmit}
              onSuggestionClick={submitSearch}
              onFocus={() => setIsSearchOpen(true)}
            />
          </div>
        </div>
      </div>

      <div className={`mobile-menu ${isMobileMenuOpen ? "is-open" : ""}`}>
        <div className="mobile-menu__tabs" role="tablist" aria-label="모바일 메뉴">
          {MOBILE_NAV_TABS.map((tab) => (
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
          {activeMobileSections ? (
            activeMobileSections.map((section) => (
              <section className="mobile-menu__section" key={section.key}>
                <button
                  type="button"
                  className="mobile-menu__section-button"
                  onClick={() => toggleMobileSection(activeMobileTab, section.key)}
                  aria-expanded={expandedMobileMenus[activeMobileTab][section.key]}
                >
                  <span>{section.title}</span>
                  <img
                    src={ChevronDown}
                    alt=""
                    className={`mobile-menu__chevron ${
                      expandedMobileMenus[activeMobileTab][section.key] ? "is-open" : ""
                    }`}
                  />
                </button>

                {expandedMobileMenus[activeMobileTab][section.key] && (
                  <ul
                    className={`mobile-menu__list ${isBrandTab ? "mobile-menu__list--brand" : ""}`}
                  >
                    {section.items.map((item) => (
                      <li key={item.type} className="mobile-menu__list-item">
                        <Link to={`/list?type=${item.type}`} onClick={handleMobileMenuLinkClick}>
                          {isBrandTab ? (
                            <BrandMenuLabel item={item} iconClassName="brand-menu__icon--mobile" />
                          ) : (
                            item.label
                          )}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            ))
          ) : (
            <div className="mobile-menu__cta">
              <p className="mobile-menu__cta-title">PC 조립</p>
              <p className="mobile-menu__cta-text">
                원하는 사양과 예산에 맞는 조립 PC 페이지로 바로 이동할 수 있어요.
              </p>
              <Link
                to="/pc-assembly"
                className="mobile-menu__cta-link"
                onClick={handleMobileMenuLinkClick}
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
