import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define types for filter and sorting options
interface FilterOptions {
  searchTerm: string;
  status: 'all' | 'paid' | 'unpaid';
  dateRange: {
    start: string | null;
    end: string | null;
  };
}

interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

interface InvoiceUIState {
  selectedInvoiceIds: string[];
  filterOptions: FilterOptions;
  sortOptions: SortOptions;
  isModalOpen: boolean;
  currentInvoiceId: string | null;
}

const initialState: InvoiceUIState = {
  selectedInvoiceIds: [],
  filterOptions: {
    searchTerm: '',
    status: 'all',
    dateRange: {
      start: null,
      end: null,
    },
  },
  sortOptions: {
    field: 'createdAt',
    direction: 'desc',
  },
  isModalOpen: false,
  currentInvoiceId: null,
};

const invoiceSlice = createSlice({
  name: 'invoiceUI',
  initialState,
  reducers: {
    setSelectedInvoiceIds: (state, action: PayloadAction<string[]>) => {
      state.selectedInvoiceIds = action.payload;
    },
    toggleInvoiceSelection: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.selectedInvoiceIds.includes(id)) {
        state.selectedInvoiceIds = state.selectedInvoiceIds.filter(
          (invoiceId) => invoiceId !== id
        );
      } else {
        state.selectedInvoiceIds.push(id);
      }
    },
    clearSelectedInvoices: (state) => {
      state.selectedInvoiceIds = [];
    },
    updateFilterOptions: (state, action: PayloadAction<Partial<FilterOptions>>) => {
      state.filterOptions = { ...state.filterOptions, ...action.payload };
    },
    updateSortOptions: (state, action: PayloadAction<Partial<SortOptions>>) => {
      state.sortOptions = { ...state.sortOptions, ...action.payload };
    },
    resetFilters: (state) => {
      state.filterOptions = initialState.filterOptions;
    },
    openInvoiceModal: (state, action: PayloadAction<string | null>) => {
      state.isModalOpen = true;
      state.currentInvoiceId = action.payload;
    },
    closeInvoiceModal: (state) => {
      state.isModalOpen = false;
      state.currentInvoiceId = null;
    },
  },
});

export const {
  setSelectedInvoiceIds,
  toggleInvoiceSelection,
  clearSelectedInvoices,
  updateFilterOptions,
  updateSortOptions,
  resetFilters,
  openInvoiceModal,
  closeInvoiceModal,
} = invoiceSlice.actions;

export default invoiceSlice.reducer; 