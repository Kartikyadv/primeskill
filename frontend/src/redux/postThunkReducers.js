import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../config/axiosConfig";
import { BACKENDURL } from "../config/data";

// Async thunk to fetch posts
export const fetchPosts = createAsyncThunk("posts/fetchPosts", async () => {
  const response = await axiosInstance.get(BACKENDURL + "api/post/");
  return response.data;
});

// Async thunk to create a post
export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData) => {
    const response = await axiosInstance.post(
      BACKENDURL + "api/post/",
      postData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  }
);

// Async thunk to like a post
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (postId, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.put(
        BACKENDURL + `api/post/${postId}/like`
      );
      return response.data.post;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Async thunk to delete a post
export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId) => {
    const response = await axiosInstance.delete(
      BACKENDURL + `api/post/${postId}`
    );
    return postId;
  }
);

// Async thunk to edit a post
export const editPost = createAsyncThunk(
  "posts/editPost",
  async ({ postId, text }) => {
    const response = await axiosInstance.put(
      BACKENDURL + `api/post/${postId}`,
      { text }
    );
    return response.data.post;
  }
);

// Async thunk to add a comment
export const fetchComments = createAsyncThunk(
  "posts/fetchComments",
  async (postid) => {
    const response = await axiosInstance.get(
      `${BACKENDURL}api/post/${postid}/comments`
    );
    return { postid, comment: response.data.postcomments };
  }
);

// Async thunk to add a comment
export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postid, comment, parentid }) => {
    const response = await axiosInstance.post(
      `${BACKENDURL}api/post/postcomment`,
      { postid, comment, parentid }
    );
    return { postid, comment: response.data.comment };
  }
);

// Async thunk to delete a comment
export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ _id, postid }) => {
    const response = await axiosInstance.delete(
      `${BACKENDURL}api/post/${postid}/comment/${_id}`
    );
    return response.data;
  }
);

// Async thunk to like a comment
export const likeComment = createAsyncThunk(
  "posts/likeComment",
  async ({ _id, postid }) => {
    const response = await axiosInstance.put(
      `${BACKENDURL}api/post/${_id}/likecomment`
    );
    return { data: response.data, postid };
  }
);

// Async thunk to add a comment
export const fetchReplies = createAsyncThunk(
  "posts/fetchReplies",
  async ({ _id, postid }) => {
    const response = await axiosInstance.get(
      `${BACKENDURL}api/post/${postid}/comments/${_id}`
    );
    return { postid, commentid: _id, replies: response.data.replies };
  }
);