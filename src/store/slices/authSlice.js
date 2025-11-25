import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // Always start with null, let auth/me API populate it
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      // Remove localStorage operations - handle in API layer
    },
    logout: (state) => {
      state.user = null;
      // Remove localStorage operations - handle in API layer
    },
  },
});

export const { logout, setUser } = authSlice.actions;

export default authSlice.reducer;
