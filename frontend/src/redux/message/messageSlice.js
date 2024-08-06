import { createSlice } from "@reduxjs/toolkit";
import { deleteMessage, fetchMessages, sendMessage } from "./messagesThunkReducers";
import { deleteConversation } from "../conversation/conversationThunkReducers";

const messageSlice = createSlice({
  name: "messages",
  initialState: {
    messages: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.messages = [];
    },
    addMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    removeMessage: (state, action) => {
      const {messagetobedeleted} = action.payload;
        const messageIndex = state.messages.findIndex(
          (message) => message?._id === messagetobedeleted?._id
        );
        if (messageIndex !== -1) {
          state.messages.splice(messageIndex, 1);
        }
    },
    updateMessage: (state, action) => {
      const {messagetobeUpdated} = action.payload;
        const messageIndex = state.messages.findIndex(
          (message) => message?._id === messagetobeUpdated?._id
        );
        if (messageIndex !== -1) {
          state.messages[messageIndex] = messagetobeUpdated;
        }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        state.messages = [];
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        let messagetobedeleted = action.payload.message;
        const messageIndex = state.messages.findIndex(
          (message) => message?._id === messagetobedeleted?._id
        );
        if (messageIndex !== -1) {
          state.messages.splice(messageIndex, 1);
        }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload.message);
      });
  },
});

export const { clearMessages, addMessage, removeMessage, updateMessage } = messageSlice.actions;

export default messageSlice.reducer;
