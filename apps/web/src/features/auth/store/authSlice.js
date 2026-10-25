import { createSlice } from "@reduxjs/toolkit";

function readSavedUser() {
  try {
    return JSON.parse(localStorage.getItem("authUser")) ?? null;
  } catch {
    return null;
  }
}

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: readSavedUser(),
    accessToken: localStorage.getItem("accessToken"),
  },
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
    },
    clearCredentials(state) {
      state.user = null;
      state.accessToken = null;
    },
  },
});

export const { setCredentials, clearCredentials } = authSlice.actions;
export default authSlice.reducer;
