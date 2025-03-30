import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import httpClient from "../shared/axios";
import { CAR_COMPARISON_TOKEN } from "../shared/types";

const initialState = {
  isLoading: false,
  user: null,
  token: localStorage.getItem(CAR_COMPARISON_TOKEN)
    ? localStorage.getItem(CAR_COMPARISON_TOKEN)
    : "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = "";
      localStorage.removeItem(CAR_COMPARISON_TOKEN);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(handleLogin.pending, (state) => {
        state.token = "";
        localStorage.removeItem(CAR_COMPARISON_TOKEN);
        state.isLoading = true;
      })
      .addCase(handleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access_token;
        localStorage.setItem(CAR_COMPARISON_TOKEN, state.token);
        window.location.href = "/admin";
      })
      .addCase(handleLogin.rejected, (state) => {
        state.isLoading = false;
        state.token = "";
        localStorage.removeItem(CAR_COMPARISON_TOKEN);
        toast.error("Bad Request");
      })
      .addCase(handleRegister.pending, (state) => {
        state.token = "";
        localStorage.removeItem(CAR_COMPARISON_TOKEN);
        state.isLoading = true;
      })
      .addCase(handleRegister.fulfilled, (state, action) => {
        state.isLoading = false;
        state.token = action.payload.access_token;
        localStorage.setItem(CAR_COMPARISON_TOKEN, state.token);
        window.location.href = "/";
      })
      .addCase(handleRegister.rejected, (state) => {
        state.isLoading = false;
        state.token = "";
        localStorage.removeItem(CAR_COMPARISON_TOKEN);
        toast.error("Bad Request");
      });
  },
});

export const handleLogin = createAsyncThunk(
  "auth/login",
  async ({ phoneNumber, password }) => {
    if (!phoneNumber || !password) {
      throw new Error("Invalid phone number or password");
    }
    const response = await httpClient.post("/api/v1/auth/authenticate", {
      phoneNumber,
      password,
    });
    return response.data;
  }
);

export const handleRegister = createAsyncThunk(
  "auth/register",
  async ({ fullName, phoneNumber, password }) => {
    if (!phoneNumber || !password || !fullName) {
      throw new Error("Bad request");
    }
    const response = await httpClient.post("/api/v1/auth/register", {
      firstname: fullName,
      phoneNumber,
      password,
      role: "USER",
    });
    return response.data;
  }
);

export const { logout } = authSlice.actions;

export default authSlice.reducer;
