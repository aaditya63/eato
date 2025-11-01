import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { loginUser } from "./authThunk";

interface User {
  id: string;
  email: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isUserLoggedIn: boolean;
  loading: boolean;
  error: string | null;
  isAppReady: boolean;
}

const initialState: AuthState = {
  user: null,
  isUserLoggedIn: false,
  loading: false,
  error: null,
  isAppReady: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserFromStorage: (state) => {
      try {
        const userData = JSON.parse(
          localStorage.getItem("user") as string
        ) as { user: User } | null;

        if (userData?.user) {
          state.user = userData.user;
          state.isUserLoggedIn = true;
        }
      } catch (err) {
        console.error("Failed to parse localStorage user:", err);
      }

      state.isAppReady = true;
    },

    logoutUser: (state) => {
      state.user = null;
      state.isUserLoggedIn = false;
      localStorage.removeItem("user");
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user || null;
        state.isUserLoggedIn = true;

        localStorage.setItem(
          "user",
          JSON.stringify({
            user: action.payload.user,
          })
        );
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      });
  },
});

export const { logoutUser, setUserFromStorage } = authSlice.actions;
export default authSlice.reducer;
