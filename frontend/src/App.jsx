import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";

import MainLayout from "./layouts/MainLayout/MainLayout";
import Main from "./pages/Main/Main";
import Search from "./pages/Search/Search";
import Login from "./pages/Login/Login";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Payment from "./pages/Payment/Payment";
import MyPage from "./pages/MyPage/MyPage";
import Category from "./pages/Category/Category";
import PcAssembly from "./pages/PcAssembly/PcAssembly";
import PcAssemblyQuote from "./pages/PcAssemblyQuote/PcAssemblyQuote";
import Register from "./pages/Register/Register";
import List from "./pages/List/List";
import OrderHistory from "./pages/OrderHistory/OrderHistory";
import SocialLoginCallback from "./pages/SocialLoginCallback/SocialLoginCallback";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import { logout } from "./store/slices/userSlice";

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const handleAuthLogout = () => {
      dispatch(logout());
    };

    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, [dispatch]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Main />} />
          <Route path="/search" element={<Search />} />
          <Route path="/category" element={<Category />} />
          <Route path="/pc-assembly" element={<PcAssembly />} />
          <Route path="/pc-assembly-quote" element={<PcAssemblyQuote />} />
          <Route path="/login" element={<Login />} />
          <Route path="/auth/social/callback" element={<SocialLoginCallback />} />
          <Route path="/register" element={<Register />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/payment" element={<Payment />} />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
          <Route path="/list" element={<List />} />
          <Route
            path="/order-history"
            element={
              <ProtectedRoute>
                <OrderHistory />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </>
  );
}

export default App;
