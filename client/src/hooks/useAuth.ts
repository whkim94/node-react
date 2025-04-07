import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useDispatch } from 'react-redux';
import { login, logout, setError } from '../store/slices/authSlice';

// This hook handles the API call with React Query
export const useLogin = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // On successful API call, update Redux store for client state management
      dispatch(login(data));
    },
    onError: (error) => {
      let errorMessage = 'Login failed';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      dispatch(setError(errorMessage));
      return errorMessage;
    },
  });
};

export const useRegister = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (userData: { name: string; email: string; password: string }) => {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      return response.data;
    },
    onSuccess: (data) => {
      // On successful registration, update Redux store for client state management
      dispatch(login(data));
    },
    onError: (error) => {
      let errorMessage = 'Registration failed';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      dispatch(setError(errorMessage));
      return errorMessage;
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  
  return () => {
    dispatch(logout());
  };
}; 