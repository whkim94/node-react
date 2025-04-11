import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, AuthResponse } from '../../types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('token'),
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  isAuthenticated: !!localStorage.getItem('token'),
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login: (state, action: PayloadAction<AuthResponse>) => {
      state.token = action.payload.access_token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.error = null;
      
      // Store auth data in localStorage
      localStorage.setItem('token', action.payload.access_token);
      localStorage.setItem('user', JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      
      // Clear auth data from localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  }
});

export const { login, logout, setError, clearError } = authSlice.actions;
export default authSlice.reducer; 