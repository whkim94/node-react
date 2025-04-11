import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SortOptions {
  field: string;
  direction: 'asc' | 'desc';
}

interface InvoiceUIState {
  selectedInvoiceIds: string[];
  sortOptions: SortOptions;
  isModalOpen: boolean;
  currentInvoiceId: string | null;
}

const initialState: InvoiceUIState = {
  selectedInvoiceIds: [],
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
    updateSortOptions: (state, action: PayloadAction<Partial<SortOptions>>) => {
      state.sortOptions = { ...state.sortOptions, ...action.payload };
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
  updateSortOptions,
  openInvoiceModal,
  closeInvoiceModal,
} = invoiceSlice.actions;

export default invoiceSlice.reducer; 