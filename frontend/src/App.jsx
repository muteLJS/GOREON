import React, { Suspense, lazy, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop/ScrollToTop";
import MainLayout from "./layouts/MainLayout/MainLayout";
import { logout } from "./store/slices/userSlice";

const Main = lazy(() => import("./pages/Main/Main"));
const Search = lazy(() => import("./pages/Search/Search"));
const Login = lazy(() => import("./pages/Login/Login"));
const Cart = lazy(() => import("./pages/Cart/Cart"));
const Wishlist = lazy(() => import("./pages/Wishlist/Wishlist"));
const ProductDetail = lazy(() => import("./pages/ProductDetail/ProductDetail"));
const Payment = lazy(() => import("./pages/Payment/Payment"));
const MyPage = lazy(() => import("./pages/MyPage/MyPage"));
const Category = lazy(() => import("./pages/Category/Category"));
const PcAssembly = lazy(() => import("./pages/PcAssembly/PcAssembly"));
const PcAssemblyQuote = lazy(() => import("./pages/PcAssemblyQuote/PcAssemblyQuote"));
const Register = lazy(() => import("./pages/Register/Register"));
const List = lazy(() => import("./pages/List/List"));
const OrderHistory = lazy(() => import("./pages/OrderHistory/OrderHistory"));
const SocialLoginCallback = lazy(() => import("./pages/SocialLoginCallback/SocialLoginCallback"));

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
      <Suspense fallback={<main className="route-loading">페이지를 불러오는 중입니다...</main>}>
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
      </Suspense>
    </>
  );
}

export default App;
