import { createSlice } from "@reduxjs/toolkit";

const RECENT_VIEWED_STORAGE_KEY = "recentViewedItems";
const MAX_RECENT_VIEWED = 10;

const loadRecentViewedItems = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedItems = window.localStorage.getItem(RECENT_VIEWED_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch {
    return [];
  }
};

const persistRecentViewedItems = (items) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(RECENT_VIEWED_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage 저장 실패 시에도 Redux 상태는 유지
  }
};

const initialState = {
  items: loadRecentViewedItems(),
};

const recentViewedSlice = createSlice({
  name: "recentViewed",
  initialState,
  reducers: {
    addRecentViewed: (state, action) => {
      const nextItem = action.payload;

      state.items = [nextItem, ...state.items.filter((item) => item.id !== nextItem.id)].slice(
        0,
        MAX_RECENT_VIEWED,
      );

      persistRecentViewedItems(state.items);
    },
    clearRecentViewed: (state) => {
      state.items = [];
      persistRecentViewedItems(state.items);
    },
  },
});

export const { addRecentViewed, clearRecentViewed } = recentViewedSlice.actions;
export default recentViewedSlice.reducer;
