// src/features/call/callSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isCalling: false,
  isCallAccepted: false,
  callIncoming: false,
  caller: {
    name: null,
    avatar: null,
  },
};

const callSlice = createSlice({
  name: 'call',
  initialState,
  reducers: {
    receiveCall(state, action) {
      state.callIncoming = true;
      state.caller = action.payload;
    },
    acceptCall(state) {
      state.isCallAccepted = true;
    },
    rejectCall(state) {
      state.isCalling = false;
      state.isCallAccepted = false;
      state.caller = {};
    },
    endCall(state) {
      state.isCalling = false;
      state.isCallAccepted = false;
      state.callIncoming = false;
      state.caller = {};
    },
  },
});

export const { receiveCall, acceptCall, rejectCall, endCall } = callSlice.actions;
export default callSlice.reducer;
