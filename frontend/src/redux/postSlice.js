import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchPosts,createPost,likePost,deletePost,editPost, addComment, deleteComment, likeComment, fetchComments, fetchReplies } from "./postThunkReducers";

const initialState = {
  posts: [],
  message: null,
  status: "idle",
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload.posts;
        state.message = action.payload.message;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload.post);
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.posts = state.posts.filter((post) => post._id !== action.payload);
      })
      .addCase(likePost.fulfilled, (state, action) => {
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id
        );
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(likePost.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload.message;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        const index = state.posts.findIndex((post) => post._id === action.payload._id);
        if (index !== -1) {
          state.posts[index] = action.payload;
        }
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        const postid = action.payload.postid;
        const comment = action.payload.comment;
        const post = state.posts.find((post) => post._id === postid);
        if (post) {
          post.comments = comment;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const { postid, comment } = action.payload;
        const post = state.posts.find((post) => post._id === postid);
        if (post) {
          post.comments.push(comment);
        }
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const { updatedpost } = action.payload;
        const postIndex = state.posts.findIndex((post) => post._id === updatedpost._id);
        if (postIndex !== -1) {
          state.posts[postIndex] = updatedpost;
        }
      })
      .addCase(fetchReplies.fulfilled, (state, action) => {
        const postid = action.payload.postid;
        const commentid = action.payload.commentid;
        const replies = action.payload.replies;
        const post = state.posts.find((post) => post._id === postid);
        if (post) {
          const comment = post.comments.find((comment) => comment._id === commentid);
          if(comment){
            comment.replies = replies
          }
        }
      });
      
  },
});

export default postsSlice.reducer;
