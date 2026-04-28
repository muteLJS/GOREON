import "./MainLayout.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FloatingChatWidget from "../../components/chat/FloatingChatWidget";
import { Outlet, useLocation } from "react-router-dom";
import { Suspense } from "react";

import RouteLoading from "../../components/RouteLoading/RouteLoading";

import "./MainLayout.scss";

function MainLayout() {
  const location = useLocation();
  const isMyPage = location.pathname === "/mypage";
  return (
    <>
      <Header />
      <div className={`main-layout ${isMyPage ? "my-page-layout" : ""}`}>
        <main className="main-layout__inner">
          <Suspense fallback={<RouteLoading message="페이지를 불러오는 중입니다..." />}>
            <Outlet />
          </Suspense>
        </main>
      </div>
      <Footer />
      <FloatingChatWidget />
    </>
  );
}
// function MainLayout() {
//   const location = useLocation();
//   const isMyPage = location.pathname === "/mypage";
//   return (
//     <>
//       <Header />
//       <div className="main-layout">
//         <main className="main-layout__inner">
//           <Outlet />
//         </main>
//       </div>
//       <Footer />
//       <FloatingChatWidget />
//     </>
//   );
// }

export default MainLayout;
