import { createSlice } from "@reduxjs/toolkit";
import {
  createConversation,
  deleteConversation,
  fetchConversations,
} from "./conversationThunkReducers";
import { deleteMessage, sendMessage } from "../message/messagesThunkReducers";

const conversationSlice = createSlice({
  name: "conversations",
  initialState: {
    conversations: [],
    status: "idle",
    error: null,
  },
  reducers: {
    updatedConversation: (state, action) => {
      const { conversationId, messageId } = action.payload;
      const conversation = state.conversations.find(
        (conv) => conv._id === conversationId
      );
      if (conversation) {
        conversation.lastMessageId = messageId;
      }
    },
    updatedConversationOnMessageDelete: (state, action) => {
      const { updatedconversation } = action.payload;
      const conversationIndex = state.conversations.findIndex(
        (conversation) => conversation._id === updatedconversation._id
      );
      if (conversationIndex !== -1) {
        state.conversations[conversationIndex] = updatedconversation;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchConversations.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchConversations.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.conversations = action.payload.conversations;
      })
      .addCase(deleteMessage.fulfilled, (state, action) => {
        let updatedConversation = action.payload.updatedConversation;
        const conversationIndex = state.conversations.findIndex(
          (conversation) => conversation._id === updatedConversation._id
        );
        if (conversationIndex !== -1) {
          state.conversations[conversationIndex].lastMessageId = updatedConversation.lastMessageId;
          state.conversations[conversationIndex].messages = updatedConversation.messages;
        }
      })
      .addCase(fetchConversations.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createConversation.fulfilled, (state, action) => {
        const existingIndex = state.conversations.findIndex(
          (conversation) => conversation._id === action.payload._id
        );

        if (existingIndex !== -1) {
          state.conversations.splice(existingIndex, 1);
        }
        state.conversations.unshift(action.payload);
      })
      .addCase(deleteConversation.fulfilled, (state, action) => {
        const existingIndex = state.conversations.findIndex(
          (conversation) => conversation._id === action.payload._id
        );
        if (existingIndex !== -1) {
          state.conversations.splice(existingIndex, 1);
      }
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { updatedConversation } = action.payload;
        const existingIndex = state.conversations.findIndex(
          (conversation) => conversation._id === updatedConversation._id
        );

        if (existingIndex !== -1) {
          state.conversations[existingIndex] = updatedConversation;
        } else {
          state.conversations.unshift(updatedConversation);
        }
      });
  },
});

export const {updatedConversation,updatedConversationOnMessageDelete} = conversationSlice.actions;

export default conversationSlice.reducer;
