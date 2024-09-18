// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import userReducer from './user/userSlice.js';
import postsReducer from './post/postSlice.js';
import conversationReducer from './conversation/conversationSlice.js';
import messageReducer from './message/messageSlice.js';
import callReducer from './call/callSlice.js';

const store = configureStore({
  reducer: {
    user: userReducer,
    posts: postsReducer,
    conversations: conversationReducer,
    messages: messageReducer,
    call: callReducer,
  },
});

export default store;
