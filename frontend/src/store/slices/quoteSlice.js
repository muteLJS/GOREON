/* -------------------------------------------------------------------------- */
/* [상태관리] PC 견적 상태 (quoteSlice.js)                                    */
/* PC 조립 페이지에서 담은 부품 목록을 관리합니다.                            */
/* -------------------------------------------------------------------------- */

import { createSlice } from "@reduxjs/toolkit";

const quoteSlice = createSlice({
  name: "quote",
  initialState: {
    items: [],
  },
  reducers: {
    addQuoteItem: (state, action) => {
      const nextItem = action.payload;
      const nextQuantity = Number(nextItem.quantity) || 1;
      const existing = state.items.find((item) => item.id === nextItem.id);

      if (existing) {
        existing.quantity += nextQuantity;
      } else {
        state.items.push({ ...nextItem, quantity: nextQuantity });
      }
    },

    updateQuoteItemQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      const nextQuantity = Number(quantity) || 1;
      const item = state.items.find((quoteItem) => quoteItem.id === id);

      if (item) {
        item.quantity = Math.max(1, nextQuantity);
      }
    },

    removeQuoteItems: (state, action) => {
      state.items = state.items.filter((item) => !action.payload.includes(item.id));
    },

    clearQuoteItems: (state) => {
      state.items = [];
    },
  },
});

export const { addQuoteItem, updateQuoteItemQuantity, removeQuoteItems, clearQuoteItems } =
  quoteSlice.actions;
export default quoteSlice.reducer;
