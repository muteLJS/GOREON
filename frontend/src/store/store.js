/* -------------------------------------------------------------------------- */
/* [스토어] Redux 중앙 저장소 (store.js)                                      */
/* 프로젝트 전체의 전역 상태(Slice)들을 하나로 모아 관리하는 최상위 스토어입니다. */
/* -------------------------------------------------------------------------- */

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import quoteReducer from "./slices/quoteSlice";
import recentViewedReducer from "./slices/recentViewed";
import aiRecommendationHistoryReducer from "./slices/aiRecommendationHistory";

const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
    quote: quoteReducer,
    recentViewed: recentViewedReducer,
    aiRecommendationHistory: aiRecommendationHistoryReducer,
  },
});

export default store;
