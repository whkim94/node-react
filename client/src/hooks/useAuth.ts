import { useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import { useDispatch } from 'react-redux';
import { login as loginAction, logout as logoutAction } from '../store/slices/authSlice';

export const useLogin = () => {
  const dispatch = useDispatch();
  
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Update Redux state
      dispatch(loginAction.fulfilled(data, '', { email: '', password: '' }));
    },
    onError: (error) => {
      let errorMessage = 'Login failed';
      if (axios.isAxiosError(error) && error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }
      return errorMessage;
    },
  });
};

export const useLogout = () => {
  const dispatch = useDispatch();
  
  return () => {
    dispatch(logoutAction());
  };
}; 