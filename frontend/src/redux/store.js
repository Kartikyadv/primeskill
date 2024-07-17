// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import postsReducer from './postSlice.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
  },
});

export default store;
