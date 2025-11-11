import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth/authSlice";
import cartReducer from "./cart/cartSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // enables Redux dev tools in dev mode
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;