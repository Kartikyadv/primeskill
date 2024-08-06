import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import { BACKENDURL } from "../../config/data";

export const fetchConversations = createAsyncThunk(
  "conversations/fetchConversations",
  async () => {
    const response = await axiosInstance.get(`${BACKENDURL}api/chat/conversations`);
    return response.data;
  }
);
export const fetchConversation = createAsyncThunk(
  "conversations/fetchConversations",
  async (conversationid) => {
    const response = await axiosInstance.get(`${BACKENDURL}api/chat/${conversationid}`);
    return response.data;
  }
);

export const createConversation = createAsyncThunk(
  "conversations/createConversation",
  async (userId) => {
    const response = await axiosInstance.post(`${BACKENDURL}api/chat/conversation`, { userId });
    return response.data.conversation;
  }
);

export const deleteConversation = createAsyncThunk(
  "conversations/deleteConversation",
  async (selectedConversationId) => {
    // console.log(selectedConversationId);
    const response = await axiosInstance.delete(`${BACKENDURL}api/chat/${selectedConversationId}`);
    return response.data.conversation;
  }
);
