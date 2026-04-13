/* -------------------------------------------------------------------------- */
/* [컴포넌트] 푸터 (Footer)                                                   */
/* 푸터: 전역 하단 정보 영역 (회사 정보, 이용약관, 고객센터)                  */
/* -------------------------------------------------------------------------- */

import "./Footer.scss";

import LogoIcon from "assets/img/logo/icon.svg";
import FacebookIcon from "assets/footer/facebook.svg";
import YoutubeIcon from "assets/footer/youtube.svg";
import InstagramIcon from "assets/footer/instagram.svg";
import ArrowRightIcon from "assets/footer/arrow-right.svg";

function Footer() {
  const footerMenus = [
    {
      id: 1,
      title: "서비스 정보",
      items: ["AI 추천", "제품비교", "카테고리 탐색"],
    },
    {
      id: 2,
      title: "고객 지원",
      items: ["FAQ", "문의하기", "이용 가이드"],
    },
    {
      id: 3,
      title: "정책 / 법적 정보",
      items: ["이용약관", "개인정보 처리방침", "쿠키 정책"],
    },
    {
      id: 4,
      title: "회사정보",
      items: ["회사명", "대표자", "사업자 번호", "이메일"],
    },
  ];

  const socialIcons = [
    { id: 1, name: "facebook", src: FacebookIcon, link: "/" },
    { id: 2, name: "youtube", src: YoutubeIcon, link: "/" },
    { id: 3, name: "instagram", src: InstagramIcon, link: "/" },
  ];

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__top">
          <div className="footer__menu-wrap">
            {footerMenus.map((menu) => (
              <div className="footer__menu" key={menu.id}>
                <h3 className="footer__title">{menu.title}</h3>
                <ul className="footer__list">
                  {menu.items.map((item, index) => (
                    <li className="footer__item" key={index}>
                      <a href="/">{item}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}

            <div className="footer__message">
              <h3 className="footer__title">브랜드 메시지</h3>
              <p>
                조건만 입력하세요.
                <br />
                가장 적합한 선택을 찾아드립니다.
              </p>
            </div>
          </div>

          <div className="footer__cs">
            <strong className="footer__cs-number">1577-1577</strong>
            <a href="/" className="footer__cs-link">
              고객센터 바로가기
              <img src={ArrowRightIcon} alt="arrow right" />
            </a>
          </div>
        </div>

        <div className="footer__divider"></div>

        <div className="footer__bottom">
          <div className="footer__copyright">
            <img src={LogoIcon} alt="GOREON 아이콘" />
            <div>
              <p>COPYRIGHT © GOREON. ALL RIGHTS RESERVED.</p>
              <p>본 프로젝트는 포트폴리오용으로 제작된 사이트입니다.</p>
            </div>
          </div>

          <div className="footer__social">
            {socialIcons.map((icon) => (
              <a href={icon.link} key={icon.id} className="footer__social-link">
                <img src={icon.src} alt={icon.name} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
