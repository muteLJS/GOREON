/* -------------------------------------------------------------------------- */
/* [상태관리] 유저 상태 (userSlice.js)                                        */
/* 로그인 여부와 유저 정보를 관리합니다. 인증 토큰은 httpOnly 쿠키로만 보관합니다. */
/* -------------------------------------------------------------------------- */

import { createSlice } from "@reduxjs/toolkit";

const persistedUser = localStorage.getItem("userInfo");

const parsePersistedUser = () => {
  if (!persistedUser) {
    return null;
  }

  try {
    return JSON.parse(persistedUser);
  } catch {
    localStorage.removeItem("userInfo");
    return null;
  }
};

const initialUser = parsePersistedUser();

const initialState = {
  authChecked: false,
  isLoggedIn: false,
  token: null,
  userInfo: initialUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.authChecked = true;
      state.isLoggedIn = true;
      state.userInfo = action.payload.user;
      state.token = null;
    },
    logout: (state) => {
      state.authChecked = true;
      state.isLoggedIn = false;
      state.userInfo = null;
      state.token = null;
      localStorage.removeItem("userInfo");
    },
    updateUserInfo: (state, action) => {
      state.authChecked = true;
      state.userInfo = action.payload;
      localStorage.setItem("userInfo", JSON.stringify(action.payload));
    },
    completeAuthCheck: (state) => {
      state.authChecked = true;
    },
  },
});

export const { login, logout, updateUserInfo, completeAuthCheck } = userSlice.actions;
export default userSlice.reducer;
