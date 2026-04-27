import "./MainLayout.scss";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import FloatingChatWidget from "../../components/chat/FloatingChatWidget";
import { Outlet, useLocation } from "react-router-dom";

function MainLayout() {
  const location = useLocation();
  const isMyPage = location.pathname === "/mypage";
  return (
    <>
      <Header />
      <div className={`main-layout ${isMyPage ? "my-page-layout" : ""}`}>
        <main className="main-layout__inner">
          <Outlet />
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
