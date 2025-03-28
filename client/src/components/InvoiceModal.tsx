import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { clearSelectedInvoice } from '../store/slices/invoiceSlice';
import { Invoice } from '../types';

interface InvoiceModalProps {
  isOpen: boolean;
  invoice: Invoice | null | undefined;
  onClose: () => void;
}

const InvoiceModal = ({ isOpen, onClose, invoice }: InvoiceModalProps) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleClose = () => {
    onClose();
    dispatch(clearSelectedInvoice());
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Invoice Details</h2>
          <button 
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {!invoice ? (
          <div className="text-center py-4">Loading invoice details...</div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">Vendor:</span>
              <span>{invoice.vendorName}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Amount:</span>
              <span>${invoice.amount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Due Date:</span>
              <span>{new Date(invoice.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Status:</span>
              <span className={invoice.paid ? 'text-green-600' : 'text-red-600'}>
                {invoice.paid ? 'Paid' : 'Unpaid'}
              </span>
            </div>
            <div>
              <span className="font-medium">Description:</span>
              <p className="mt-1 text-gray-700">{invoice.description}</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          <button
            onClick={handleClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default InvoiceModal; 