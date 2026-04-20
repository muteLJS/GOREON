/* -------------------------------------------------------------------------- */
/* [상태관리] 장바구니 상태 (cartSlice.js)                                    */
/* 장바구니 상품 목록의 추가/삭제/수량 변경 상태를 관리합니다.                */
/* -------------------------------------------------------------------------- */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const nextQuantity = Number(action.payload.quantity) || 1;
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        existing.quantity += nextQuantity;
      } else {
        state.items.push({ ...action.payload, quantity: nextQuantity });
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    removeCartItems: (state, action) => {
      const removeIds = new Set(action.payload);
      state.items = state.items.filter((item) => !removeIds.has(item.id));
    },
    updateCartQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const nextQuantity = Number(quantity) || 0;

      if (nextQuantity < 1) {
        state.items = state.items.filter((item) => item.id !== id);
        return;
      }

      const item = state.items.find((cartItem) => cartItem.id === id);
      if (item) {
        item.quantity = nextQuantity;
      }
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, removeCartItems, updateCartQuantity, clearCart } =
  cartSlice.actions;
export default cartSlice.reducer;
