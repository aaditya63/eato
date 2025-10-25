import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface LoginBody {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

export const loginUser = createAsyncThunk<
  LoginResponse,
  LoginBody,
  { rejectValue: string }
>("auth/loginUser", async (body, { rejectWithValue }) => {
  try {
    const res = await axios.post<LoginResponse>(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
      body,
      { withCredentials: true }
    );

    if (res.data?.success) {
      return res.data;
    } else {
      return rejectWithValue(res.data?.message || "Login failed");
    }
  } catch (err: any) {
    if (axios.isAxiosError(err)) {
      const backendError = err.response?.data?.error;
      return rejectWithValue(backendError || "Login failed");
    }
    return rejectWithValue("Login failed");
  }
});
