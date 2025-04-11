import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { API_BASE_URL } from '../config/api';

// Create a typed axios instance with default config
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Optional: add request logging in development
    if (import.meta.env.DEV) {
      console.log(`Request: ${config.method?.toUpperCase()} ${config.url}`, config);
    }
    
    return config;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Optional: add error logging in development
    if (import.meta.env.DEV) {
      console.error('Request Error:', error);
    }
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle token expiration and logging
api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // Optional: add response logging in development
    if (import.meta.env.DEV) {
      console.log(`Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, response.data);
    }
    return response;
  },
  (error: AxiosError): Promise<AxiosError> => {
    // Handle 401 Unauthorized errors (token expired)
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, clear token and redirect to login
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    
    // Optional: add error response logging in development
    if (import.meta.env.DEV) {
      console.error('Response Error:', error.response?.status, error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api; 