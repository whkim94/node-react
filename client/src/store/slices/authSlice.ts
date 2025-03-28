import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/login`, credentials);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Login failed');
      }
      return rejectWithValue('Login failed');
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData: { name: string; email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/auth/register`, userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Registration failed');
      }
      return rejectWithValue('Registration failed');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.access_token;
        state.isAuthenticated = true;
        localStorage.setItem('token', action.payload.access_token);
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer; 