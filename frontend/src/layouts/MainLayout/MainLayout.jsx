import "./MainLayout.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FloatingChatWidget from "../../components/chat/FloatingChatWidget";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <>
      <Header />
      <div className="main-layout">
        <main className="main-layout__inner">
          <Outlet />
        </main>
      </div>
      <Footer />
      <FloatingChatWidget />
    </>
  );
}

export default MainLayout;
