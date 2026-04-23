import { createSlice } from "@reduxjs/toolkit";

const RECENT_VIEWED_STORAGE_KEY = "recentViewedItems";
const MAX_RECENT_VIEWED = 10;

const getRecentViewedItemKey = (item) => {
  const candidates = [item?.productId, item?.id, item?._id];

  for (const candidate of candidates) {
    const normalized = String(candidate ?? "").trim();

    if (normalized && normalized !== "NaN" && normalized !== "undefined" && normalized !== "null") {
      return normalized;
    }
  }

  return "";
};

const normalizeRecentViewedItem = (item) => {
  const key = getRecentViewedItemKey(item);

  if (!key) {
    return null;
  }

  return {
    ...item,
    id: key,
    productId: key,
  };
};

const dedupeRecentViewedItems = (items) => {
  const seenKeys = new Set();

  return items
    .map(normalizeRecentViewedItem)
    .filter((item) => {
      if (!item) {
        return false;
      }

      const key = getRecentViewedItemKey(item);

      if (seenKeys.has(key)) {
        return false;
      }

      seenKeys.add(key);
      return true;
    })
    .slice(0, MAX_RECENT_VIEWED);
};

const loadRecentViewedItems = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedItems = window.localStorage.getItem(RECENT_VIEWED_STORAGE_KEY);
    return storedItems ? dedupeRecentViewedItems(JSON.parse(storedItems)) : [];
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
      const nextItem = normalizeRecentViewedItem(action.payload);

      if (!nextItem) {
        return;
      }

      const nextKey = getRecentViewedItemKey(nextItem);

      state.items = [nextItem, ...state.items.filter((item) => getRecentViewedItemKey(item) !== nextKey)]
        .slice(0, MAX_RECENT_VIEWED);

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
