export interface Invoice {
  id: string;
  vendorName: string;
  amount: number;
  dueDate: string;
  description: string;
  paid: boolean;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
} 