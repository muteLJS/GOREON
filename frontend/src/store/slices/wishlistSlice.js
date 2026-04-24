/* -------------------------------------------------------------------------- */
/* [상태관리] 찜하기 상태 (wishlistSlice.js)                                  */
/* 유저가 찜(하트)한 관심 상품 목록의 추가/삭제 상태를 관리합니다.            */
/* -------------------------------------------------------------------------- */

import { createSlice } from "@reduxjs/toolkit";
import { getProductObjectId } from "@/utils/productIdentity";

const WISHLIST_STORAGE_KEY = "wishlistItems";

const loadWishlistItems = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedItems = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch {
    return [];
  }
};

const persistWishlistItems = (items) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Ignore localStorage write failures and keep in-memory state working.
  }
};

const initialState = {
  items: loadWishlistItems(),
};

const getWishlistProductId = (item) => getProductObjectId(item);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    addToWishlist: (state, action) => {
      const nextProductId = getWishlistProductId(action.payload);
      const existing = state.items.find((item) => getWishlistProductId(item) === nextProductId);
      if (!existing) {
        state.items.push(action.payload);
        persistWishlistItems(state.items);
      }
    },
    removeFromWishlist: (state, action) => {
      const targetProductId = getProductObjectId(action.payload);
      state.items = state.items.filter((item) => getWishlistProductId(item) !== targetProductId);
      persistWishlistItems(state.items);
    },
  },
});

export const { addToWishlist, removeFromWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
