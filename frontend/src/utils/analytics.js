const GA_ID = import.meta.env.VITE_GA_ID;

// 🔹 페이지뷰
export const trackPageView = (path) => {
  if (!window.gtag || !GA_ID) return;

  window.gtag("config", GA_ID, {
    page_path: path,
  });
};

// 🔹 공용 이벤트 함수
export const trackEvent = ({ action, category, label, value }) => {
  if (!window.gtag || !GA_ID) return;

  window.gtag("event", action, {
    event_category: category,
    event_label: label,
    value,
  });
};

// 🔹 찜 클릭
export const trackWishlist = (productName) => {
  trackEvent({
    action: "click_wishlist",
    category: "engagement",
    label: productName,
  });
};

// 🔹 장바구니 클릭
export const trackAddToCart = (productName) => {
  trackEvent({
    action: "add_to_cart",
    category: "ecommerce",
    label: productName,
  });
};

// 🔹 상품 상세 조회
export const trackViewProduct = (productName) => {
  trackEvent({
    action: "view_product",
    category: "ecommerce",
    label: productName,
  });
};
