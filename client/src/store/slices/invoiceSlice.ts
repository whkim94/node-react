import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import api from '../../utils/axiosConfig';

interface Invoice {
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

interface InvoiceState {
  invoices: Invoice[];
  selectedInvoice: Invoice | null;
  loading: boolean;
  error: string | null;
}

const initialState: InvoiceState = {
  invoices: [],
  selectedInvoice: null,
  loading: false,
  error: null,
};

export const fetchInvoices = createAsyncThunk(
  'invoices/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/invoices');
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch invoices');
      }
      return rejectWithValue('Failed to fetch invoices');
    }
  }
);

export const fetchInvoiceById = createAsyncThunk(
  'invoices/fetchById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/invoices/${id}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || 'Failed to fetch invoice');
      }
      return rejectWithValue('Failed to fetch invoice');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoices',
  initialState,
  reducers: {
    clearSelectedInvoice: (state) => {
      state.selectedInvoice = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInvoices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoices.fulfilled, (state, action) => {
        state.loading = false;
        state.invoices = action.payload;
      })
      .addCase(fetchInvoices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInvoiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedInvoice = action.payload;
      })
      .addCase(fetchInvoiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearSelectedInvoice } = invoiceSlice.actions;
export default invoiceSlice.reducer; 