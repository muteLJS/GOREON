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

      state.items = state.items.filter((item) => item.category !== nextItem.category);
      state.items.push(nextItem);
    },

    removeQuoteItems: (state, action) => {
      state.items = state.items.filter((item) => !action.payload.includes(item.id));
    },

    clearQuoteItems: (state) => {
      state.items = [];
    },
  },
});

export const { addQuoteItem, removeQuoteItems, clearQuoteItems } = quoteSlice.actions;
export default quoteSlice.reducer;
