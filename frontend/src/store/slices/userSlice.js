/* -------------------------------------------------------------------------- */
/* [상태관리] 유저 상태 (userSlice.js)                                        */
/* 로그인 여부, 유저 정보, 인증 토큰 등 회원 관련 전역 상태를 관리합니다.     */
/* -------------------------------------------------------------------------- */

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  userInfo: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.userInfo = null;
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
