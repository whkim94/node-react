import { useMutation } from '@tanstack/react-query';
import api from '../utils/axiosConfig';
import { useDispatch } from 'react-redux';
import { login, logout, setError } from '../store/slices/authSlice';
import { AxiosError } from 'axios';

interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// This hook handles authentication API call with React Query
export const useLogin = () => {
  const dispatch = useDispatch();
  
  return useMutation<AuthResponse, AxiosError, LoginCredentials>({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await api.post<AuthResponse>('/auth/login', credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // On successful API call, update Redux store for client state management
      dispatch(login(data));
    },
    onError: (error: AxiosError) => {
      let errorMessage = 'Login failed';
      if (error.response?.data && typeof error.response.data === 'object') {
        errorMessage = (error.response.data as any).message || errorMessage;
      }
      dispatch(setError(errorMessage));
      return errorMessage;
    },
  });
};

export const useRegister = () => {
  const dispatch = useDispatch();
  
  return useMutation<AuthResponse, AxiosError, { name: string; email: string; password: string }>({
    mutationFn: async (userData: { name: string; email: string; password: string }) => {
      const response = await api.post<AuthResponse>('/auth/register', userData);
      return response.data;
    },
    onSuccess: (data) => {
      // On successful registration, update Redux store for client state management
      dispatch(login(data));
    },
    onError: (error: AxiosError) => {
      let errorMessage = 'Registration failed';
      if (error.response?.data && typeof error.response.data === 'object') {
        errorMessage = (error.response.data as any).message || errorMessage;
      }
      dispatch(setError(errorMessage));
      return errorMessage;
    },
  });
};

// Simple hook to handle logout
export const useLogout = () => {
  const dispatch = useDispatch();
  
  return () => {
    dispatch(logout());
  };
}; 