/* -------------------------------------------------------------------------- */
/* [컴포넌트] 헤더 (Header)                                                   */
/* 헤더: 전역 상단 네비게이션바 (로고, 메뉴, 검색창, 마이페이지 링크)         */
/* -------------------------------------------------------------------------- */

import "./Header.scss";
import { Link } from "react-router-dom";

import Logo from "assets/img/logo/logo.svg";
import Cart from "assets/header/header-icons/cart.svg";
import Like from "assets/header/header-icons/like.svg";
import Search from "assets/header/header-icons/search.svg";
import User from "assets/header/header-icons/user.svg";

import Apple from "assets/header/nav/Apple.svg";
import Samsung from "assets/header/nav/Samsung.svg";
import Lg from "assets/header/nav/LG.svg";
import Hp from "assets/header/nav/Hp.svg";
import Lenovo from "assets/header/nav/Lenovo.svg";
import Dell from "assets/header/nav/Dell.svg";
import Msi from "assets/header/nav/Msi.svg";
import Asus from "assets/header/nav/Asus.svg";
import Acer from "assets/header/nav/Acer.svg";

function Header() {
  const headerIcons = [
    { id: 1, src: Search, alt: "search" },
    { id: 2, src: Cart, alt: "cart" },
    { id: 3, src: Like, alt: "like" },
    { id: 4, src: User, alt: "user" },
  ];

  const categoryMenu = [
    {
      id: 1,
      title: "PC",
      items: ["노트북", "데스크탑", "모니터", "키보드", "마우스", "PC 주변기기", "PC 부품"],
    },
    {
      id: 2,
      title: "모바일",
      items: ["스마트폰"],
    },
    {
      id: 3,
      title: "태블릿",
      items: ["태블릿", "데스크탑", "모니터", "키보드", "마우스", "PC 주변기기", "PC 부품"],
    },
    {
      id: 4,
      title: "스마트 액세서리",
      items: ["무선 이어폰", "스마트워치", "스마트링", "보조배터리"],
    },
  ];

  const brandMenu = [
    {
      id: 1,
      title: "프리미엄",
      items: [
        { id: 1, name: "애플", logo: Apple, alt: "apple" },
        { id: 2, name: "삼성", logo: Samsung, alt: "samsung" },
        { id: 3, name: "LG", logo: Lg, alt: "lg" },
      ],
    },
    {
      id: 2,
      title: "가성비 / 일반",
      items: [
        { id: 1, name: "HP", logo: Hp, alt: "hp" },
        { id: 2, name: "레노버", logo: Lenovo, alt: "lenovo" },
        { id: 3, name: "델", logo: Dell, alt: "dell" },
      ],
    },
    {
      id: 3,
      title: "게이밍 / 특화",
      items: [
        { id: 1, name: "MSI", logo: Msi, alt: "msi" },
        { id: 2, name: "ASUS", logo: Asus, alt: "asus" },
        { id: 3, name: "Acer", logo: Acer, alt: "acer" },
      ],
    },
  ];

  return (
    <header className="header">
      <div className="header__top">
        <h1 className="header__logo">
          <Link to="/">
            <img src={Logo} alt="GOREON 로고" />
          </Link>
        </h1>

        <div className="header__right">
          <div className="header__icons">
            {headerIcons.map((icon) => (
              <button type="button" className="header__icon-btn" key={icon.id}>
                <img src={icon.src} alt={icon.alt} />
              </button>
            ))}
          </div>

          <div className="header__auth">
            <button type="button">로그아웃</button>
            <button type="button">로그인</button>
          </div>
        </div>
      </div>

      <nav className="header__nav">
        <ul className="gnb">
          <li className="gnb__item">
            <button type="button" className="gnb__button is-active">
              품목별
            </button>

            <div className="dropdown">
              <div className="dropdown__inner">
                {categoryMenu.map((category) => (
                  <div className="dropdown__column" key={category.id}>
                    <div className="dropdown__title">{category.title}</div>
                    <ul className="dropdown__list">
                      {category.items.map((item) => (
                        <li className="dropdown__list-item" key={item}>
                          <Link to="/">{item}</Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </li>

          <li className="gnb__item">
            <button type="button" className="gnb__button">
              브랜드별
            </button>

            <div className="dropdown">
              <div className="dropdown__inner dropdown__inner--brand">
                {brandMenu.map((group) => (
                  <div className="dropdown__column" key={group.id}>
                    <div className="dropdown__title">{group.title}</div>
                    <ul className="dropdown__list">
                      {group.items.map((brand) => (
                        <li className="dropdown__list-item dropdown__brand-item" key={brand.id}>
                          <Link to="/">
                            <img src={brand.logo} alt={brand.alt} />
                            <span>{brand.name}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </li>

          <li className="gnb__item">
            <Link to="/" className="gnb__link">
              PC 조립
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;
