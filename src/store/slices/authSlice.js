import { createSlice } from "@reduxjs/toolkit";

const getInitialUser = () => {
  if (typeof window !== "undefined") {
    try {
      const storedUserData = localStorage.getItem("user");
      if (
        storedUserData &&
        storedUserData !== "undefined" &&
        storedUserData !== "null"
      ) {
        const parsedUser = JSON.parse(storedUserData);
        if (parsedUser && typeof parsedUser === "object") {
          return parsedUser;
        }
      }
    } catch (error) {
      console.error("Error parsing initial user data:", error);
      // Clear invalid data
      localStorage.removeItem("user");
    }
  }
  return null;
};

const initialState = {
  user: getInitialUser(),
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
