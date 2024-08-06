import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import { BACKENDURL } from "../../config/data";

// Thunks for async operations
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (conversationId) => {
    const response = await axiosInstance.get(
      `${BACKENDURL}api/message/${conversationId}`
    );
    return response.data.messages;
  }
);

export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ selectedConversationId, newMessage }) => {
    const response = await axiosInstance.post(
      `${BACKENDURL}api/message/${selectedConversationId}`,
      { content: newMessage }
    );
    return response.data;
  }
);


export const deleteMessage = createAsyncThunk("messages/deleteMessage", async ({otherParticipantid,messageid,convoid}) => {
  const response = await axiosInstance.delete(`${BACKENDURL}api/message/${convoid}/${messageid}/${otherParticipantid}`);
  return response.data;
})


export const markMessageSeen = createAsyncThunk("messages/seen", async ({otherParticipantid,messageid,convoid}) => {
  const response = await axiosInstance.post(`${BACKENDURL}api/message/${convoid}/${messageid}/seen/${otherParticipantid}`);
  return response.data;
})