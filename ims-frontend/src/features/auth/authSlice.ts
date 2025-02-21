import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface AuthState {
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  loading: false,
  error: null,
};

// Login User
export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      const response = await axios.post(
        "https://localhost:7191/api/auth/login",
        data
      );
      localStorage.setItem("token", response.data.token);
      return response.data.token;
    } catch (error) {
      return thunkAPI.rejectWithValue("Invalid credentials");
    }
  }
);

// Signup User
export const signupUser = createAsyncThunk(
  "auth/signup",
  async (data: { email: string; password: string }, thunkAPI) => {
    try {
      await axios.post("http://localhost:7191/api/auth/register", data);
      return "User registered successfully!";
    } catch (error) {
      return thunkAPI.rejectWithValue("Signup failed");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.fulfilled, (state, action) => {
        state.token = action.payload;
        state.loading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      })
      .addCase(signupUser.rejected, (state, action) => {
        state.error = action.payload as string;
        state.loading = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
