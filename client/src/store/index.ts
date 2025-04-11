import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import invoiceUIReducer from './slices/invoiceSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    invoiceUI: invoiceUIReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;  