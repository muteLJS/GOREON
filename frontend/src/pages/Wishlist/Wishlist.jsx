/* -------------------------------------------------------------------------- */
/* [페이지] 찜하기 (Wishlist)                                                 */
/* 찜하기: 하트를 누른 관심 상품 목록 모아보기                                */
/* -------------------------------------------------------------------------- */
import { useSelector } from "react-redux";
import "./Wishlist.scss";
import banner1 from "@/assets/banner/banner-1.jpg";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg";
import CartIconButton from "@/components/CartIconButton/CartIconButton";
import ProductCardVertical from "@/components/ProductCard/ProductCardVertical";
import WishlistIconButton from "@/components/WishlistIconButton/WishlistIconButton";
import { useEffect, useState } from "react";

const FilterMenuBox = ({ title }) => {
  return (
    <div className="side_menu_bottom">
      <div className="side_menu_bottom_filter_container">
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default function Wishlist() {
  const [wishlist, setWishlist] = useState([]);
  const wishlistLength = wishlist.length;

  const fetchWishlist = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist"));
    setWishlist(wishlist);
  };
  useEffect(() => {
    fetchWishlist();
  }, [wishlistLength]);

  return (
    <>
      <main className="list-wrap-wishlist">
        <section className="list-wrap-content">
          <section className="side_menu">
            <div className="side_menu_top">
              <h2>카테고리 분류</h2>
            </div>
            <div className="side_menu_bottom_container">
              <h3 className="title">전체상품</h3>
              <FilterMenuBox title={"노트북"} />
              <FilterMenuBox title={"모니터"} />
              <FilterMenuBox title={"이어폰"} />
            </div>
          </section>
          <section className="list-assembly">
            <section className="list-assembly__banner">
              <img src={banner1} alt="광고 배너 1" />
            </section>
            <section className="list-assembly__top">
              <h2 className="list-assembly__title">
                찜한 상품 <span>({productLength})</span>
              </h2>
              <div className="filter-container">
                <button className="filter-button">
                  전체 상품 <img src={ChevronDownIcon} alt="down" />
                </button>
              </div>
            </section>
            <section className="list-assembly__content">
              {wishlistItems.length > 0 ? (
                <div className="list-assembly__product-grid">
                  {wishlistItems.map((product) => (
                    <ProductCardVertical
                      key={product.id}
                      product={product}
                      action={
                        <div className="list-assembly__button-container">
                          <CartIconButton product={product} size="sm" />
                          <WishlistIconButton product={product} size="sm" />
                        </div>
                      }
                    />
                  ))}
                </div>
              ) : (
                <p className="list-assembly__state">찜한 상품이 없습니다.</p>
              )}
            </section>
          </section>
        </section>
      </main>
    </>
  );
}
