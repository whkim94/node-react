import { useQuery } from '@tanstack/react-query';
import api from '../utils/axiosConfig';

interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

// Fetch all invoices with pagination
export const useInvoices = (params: PaginationParams = {}) => {
  const { page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = params;
  
  return useQuery({
    queryKey: ['invoices', { page, limit, sortBy, order }],
    queryFn: async () => {
      const response = await api.get('/invoices', {
        params: { page, limit, sortBy, order }
      });
      return response.data;
    },
  });
};

// Fetch a single invoice by ID
export const useInvoice = (id: string | null) => {
  return useQuery({
    queryKey: ['invoice', id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    },
    enabled: !!id, // Only run the query if we have an ID
  });
};