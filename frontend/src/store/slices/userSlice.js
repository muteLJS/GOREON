/* -------------------------------------------------------------------------- */
/* [상태관리] 유저 상태 (userSlice.js)                                        */
/* 로그인 여부, 유저 정보, 인증 토큰 등 회원 관련 전역 상태를 관리합니다.     */
/* -------------------------------------------------------------------------- */

import { createSlice } from "@reduxjs/toolkit";

const persistedToken = localStorage.getItem("authToken");
const persistedUser = localStorage.getItem("userInfo");

const initialState = {
  isLoggedIn: Boolean(persistedToken),
  token: persistedToken || null,
  userInfo: persistedUser ? JSON.parse(persistedUser) : null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload.user;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userInfo");
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
