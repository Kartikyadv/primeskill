import { createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../config/axiosConfig";
import { BACKENDURL } from "../../config/data";

// Async thunk to fetch user

export const fetchUser = createAsyncThunk("user/getUser", async (userid) => {
  const response = await axiosInstance.get(
    BACKENDURL + "api/user/getuserprofile/" + userid
  );
  // console.log(response);
  return response.data;
});
