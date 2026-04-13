import "./Footer.scss";

import FacebookIcon from "assets/footer/pc/facebook.svg";
import YoutubeIcon from "assets/footer/pc/youtube.svg";
import InstagramIcon from "assets/footer/pc/instagram.svg";
import ArrowRightIcon from "assets/footer/pc/arrow-right.svg";
import FooterLogoIcon from "assets/logo/logo/icon.svg";

import HomeIcon from "assets/footer/mobile/home.svg";
import SearchIcon from "assets/footer/mobile/search.svg";
import CartIcon from "assets/footer/mobile/cart.svg";
import HamburgerIcon from "assets/footer/mobile/hamburger.svg";

function Footer() {
  const desktopColumns = [
    {
      title: "서비스 정보",
      items: ["AI 추천", "제품비교", "카테고리 탐색"],
    },
    {
      title: "고객 지원",
      items: ["FAQ", "문의하기", "이용 가이드"],
    },
    {
      title: "정책 / 법적 정보",
      items: ["이용약관", "개인정보 처리방침", "쿠키 정책"],
    },
    {
      title: "회사정보",
      items: ["회사명", "대표자", "사업자 번호", "이메일"],
    },
  ];

  const socialIcons = [
    { id: 1, name: "facebook", src: FacebookIcon, link: "/" },
    { id: 2, name: "youtube", src: YoutubeIcon, link: "/" },
    { id: 3, name: "instagram", src: InstagramIcon, link: "/" },
  ];

  const mobileQuickLinks = [
    { id: 1, name: "home", src: HomeIcon, link: "/" },
    { id: 2, name: "search", src: SearchIcon, link: "/search" },
    { id: 3, name: "cart", src: CartIcon, link: "/cart" },
    { id: 4, name: "menu", src: HamburgerIcon, link: "/category" },
  ];

  return (
    <footer className="footer">
      <div className="footer__box1">
        <div className="top-1">
          <div className="footer__policy">
            <p href="/">정책</p>
            <span>/</span>
            <p href="/">법적 정보</p>
          </div>
        </div>
      </div>

      <div className="footer__mobile">
        <div className="footer__mobile-section">
          <p className="footer__title">정책 / 법적 정보</p>
          <div className="footer__mobile-inline-links">
            <p>이용약관</p>
            <p>개인정보 처리방침</p>
            <p>쿠키 정책</p>
          </div>
        </div>

        <div className="footer__mobile-section">
          <p className="footer__title">회사정보</p>
          <div className="footer__mobile-company">
            <p>회사명 : GOREON</p>
            <p>대표자 : GOREON</p>
            <p>사업자 번호 : 02-0000-001</p>
            <p>이메일 : abcd123@gmail.com</p>
          </div>
        </div>

        <a href="/" className="footer__support footer__support--mobile">
          <strong className="footer__support-number">1577-1577</strong>
          <div className="footer__support-link">
            <span>고객센터 바로가기</span>
            <img src={ArrowRightIcon} alt="고객센터 바로가기" />
          </div>
        </a>

        <div className="copyright">
          <p className="footer__copyright">COPYRIGHT © GOREON. ALL RIGHTS RESERVED.</p>
          <p className="footer__notice">본 플랫폼은 상품중개 역할만을 지원합니다.</p>
        </div>

        <div className="footer__social">
          {socialIcons.map((icon) => (
            <a href={icon.link} key={icon.id} className="footer__social-link">
              <img src={icon.src} alt={icon.name} />
            </a>
          ))}
        </div>
      </div>

      <div className="footer__mobile-nav">
        {mobileQuickLinks.map((item) => (
          <a href={item.link} key={item.id} className="footer__mobile-link" aria-label={item.name}>
            <img src={item.src} alt={item.name} />
          </a>
        ))}
      </div>
    </footer>
  );
}

export default Footer;
