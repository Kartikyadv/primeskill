// src/features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import { fetchUser } from "./userThunkReducers";

const userSlice = createSlice({
  name: "user",
  initialState: {
    token: Cookies.get("jwt") || null,
    user: {
      userid: Cookies.get("userid") || null,
      username: null,
    },
    userposts: [],
  },
  reducers: {
    setUser: (state, action) => {
      state.token = action.payload.token;
      state.user.userid = action.payload.userid;
      Cookies.set("jwt", action.payload.token);
      Cookies.set("userid", action.payload.userid);
    },
    logout: (state) => {
      state.token = null;
      state.user.userid = null;
      Cookies.remove("jwt");
      Cookies.remove("userid");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.fulfilled, (state, action) => {
      // console.log(action.payload);
      state.userposts = action.payload.user.posts;
    });
  },
});

export const { setUser, logout } = userSlice.actions;

export default userSlice.reducer;
