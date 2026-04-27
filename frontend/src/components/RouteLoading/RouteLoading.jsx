import logoIcon from "@/assets/logo/logo/icon.svg";

import "./RouteLoading.scss";

export default function RouteLoading({ message = "페이지를 불러오는 중입니다..." }) {
  return (
    <main className="route-loading" aria-live="polite" aria-busy="true">
      <div className="route-loading__orb" />
      <div className="route-loading__logo-wrap">
        <img className="route-loading__logo" src={logoIcon} alt="" />
      </div>
      <div className="route-loading__dots" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>
      <p className="route-loading__message">{message}</p>
    </main>
  );
}
