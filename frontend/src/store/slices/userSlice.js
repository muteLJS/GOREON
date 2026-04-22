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
  isLoggedIn: Boolean(initialUser),
  token: null,
  userInfo: initialUser,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.userInfo = action.payload.user;
      state.token = null;
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
