import { createSlice } from "@reduxjs/toolkit";

const AI_RECOMMENDATION_HISTORY_STORAGE_KEY = "aiRecommendationHistoryItems";
const MAX_AI_RECOMMENDATION_HISTORY = 10;

const loadAiRecommendationHistoryItems = () => {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedItems = window.localStorage.getItem(AI_RECOMMENDATION_HISTORY_STORAGE_KEY);
    return storedItems ? JSON.parse(storedItems) : [];
  } catch {
    return [];
  }
};

const persistAiRecommendationHistoryItems = (items) => {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(AI_RECOMMENDATION_HISTORY_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // localStorage 저장 실패 시에도 Redux 상태는 유지
  }
};

const initialState = {
  items: loadAiRecommendationHistoryItems(),
};

const aiRecommendationHistorySlice = createSlice({
  name: "aiRecommendationHistory",
  initialState,
  reducers: {
    addAiRecommendationHistory: (state, action) => {
      const nextItem = action.payload;

      state.items = [nextItem, ...state.items].slice(0, MAX_AI_RECOMMENDATION_HISTORY);
      persistAiRecommendationHistoryItems(state.items);
    },
    clearAiRecommendationHistory: (state) => {
      state.items = [];
      persistAiRecommendationHistoryItems(state.items);
    },
  },
});

export const { addAiRecommendationHistory, clearAiRecommendationHistory } =
  aiRecommendationHistorySlice.actions;
export default aiRecommendationHistorySlice.reducer;
