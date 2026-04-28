import { Suspense } from "react";
import { Outlet } from "react-router-dom";

import RouteLoading from "../../components/RouteLoading/RouteLoading";
import FloatingChatWidget from "../../components/chat/FloatingChatWidget";
import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import "./MainLayout.scss";

function MainLayout() {
  return (
    <>
      <Header />
      <div className="main-layout">
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

export default MainLayout;
