// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// 기존 import 유지
import Main from "./pages/Main/Main";
import Search from "./pages/Search/Search";
import Login from "./pages/Login/Login";
import Cart from "./pages/Cart/Cart";
import Wishlist from "./pages/Wishlist/Wishlist";
import ProductDetail from "./pages/ProductDetail/ProductDetail";
import Payment from "./pages/Payment/Payment";
import MyPage from "./pages/MyPage/MyPage";
import Header from "./components/pc/Header/Header";
import Footer from "./components/pc/Footer/Footer";

// 🌟 새로 추가된 페이지 import
import Category from "./pages/Category/Category";
import PcAssembly from "./pages/PcAssembly/PcAssembly";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/search" element={<Search />} />

        <Route path="/category" element={<Category />} />
        <Route path="/pc-assembly" element={<PcAssembly />} />

        <Route path="/login" element={<Login />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/mypage" element={<MyPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
