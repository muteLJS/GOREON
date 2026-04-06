/* -------------------------------------------------------------------------- */
/* [상태관리] 찜하기 상태 (wishlistSlice.js)                                  */
/* 유저가 찜(하트)한 관심 상품 목록의 추가/삭제 상태를 관리합니다.            */
/* -------------------------------------------------------------------------- */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const existing = state.items.find(
        (item) => item.id === action.payload.id,
      );
      if (!existing) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
