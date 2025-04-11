import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import api from '../utils/axiosConfig';
import { Invoice, PaginatedResponse } from '../types';

interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Fetch all invoices with pagination
export const useInvoices = (
  params: PaginationParams = {},
  options?: Omit<UseQueryOptions<PaginatedResponse<Invoice>, AxiosError>, 'queryKey' | 'queryFn'>
) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = params;
  
  return useQuery<PaginatedResponse<Invoice>, AxiosError>({
    queryKey: ['invoices', { page, limit, sortBy, order }],
    queryFn: async () => {
      const response = await api.get<PaginatedResponse<Invoice>>('/invoices', {
        params: { page, limit, sortBy, order }
      });
      return response.data;
    },
    ...options
  });
};

// Fetch a single invoice by ID
export const useInvoice = (
  id: string | null,
  options?: Omit<UseQueryOptions<Invoice | null, AxiosError>, 'queryKey' | 'queryFn' | 'enabled'>
) => {
  return useQuery<Invoice | null, AxiosError>({
    queryKey: ['invoice', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get<Invoice>(`/invoices/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if we have an ID
    ...options
  });
};