import styles from "./MainLayout.module.scss";
import { registerModuleStyles } from "styles/registerModuleStyles";
import Header from "components/Header/Header";
import Footer from "components/Footer/Footer";
import { Outlet } from "react-router-dom";

registerModuleStyles(styles);

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
    </>
  );
}

export default MainLayout;
