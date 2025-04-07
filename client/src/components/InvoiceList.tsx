import { useCallback, useMemo, useState } from 'react';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceModal from './InvoiceModal';
import Pagination from './Pagination';
import { useInvoices, useInvoice } from '../hooks/useInvoices';
import { Invoice } from '../types';
import { RootState } from '../store';
import { 
  setSelectedInvoiceIds, 
  clearSelectedInvoices, 
  toggleInvoiceSelection,
  updateSortOptions,
  openInvoiceModal,
  closeInvoiceModal
} from '../store/slices/invoiceSlice';

// Define a schema for invoice validation
const invoiceSchema = z.object({
  id: z.string(),
  createdAt: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  vendorName: z.string().min(1, "Vendor name is required"),
  description: z.string().min(1, "Description is required"),
  dueDate: z.string().refine((date) => !isNaN(Date.parse(date)), "Invalid date"),
  amount: z.number().nonnegative("Amount must be non-negative"),
  paid: z.boolean(),
});

// Function to validate invoices
const validateInvoices = (invoices: Invoice[]) => {
  return invoices.map((invoice) => {
    // Create a copy with absolute value for amount
    const processedInvoice = {
      ...invoice,
      amount: Math.max(0, invoice.amount) // Ensures amount is at least 0
    };
    
    try {
      invoiceSchema.parse(processedInvoice);
      return { ...processedInvoice, isValid: true };
    } catch (e) {
      const error = e as z.ZodError;
      console.error(error.errors);
      return { ...processedInvoice, isValid: false };
    }
  });
};

const InvoiceList = () => {
  const dispatch = useDispatch();
  
  // Get UI state from Redux
  const { 
    selectedInvoiceIds, 
    sortOptions, 
    isModalOpen, 
    currentInvoiceId 
  } = useSelector((state: RootState) => state.invoiceUI);
  
  // Local state for pagination (could be moved to Redux if needed across components)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch invoices with React Query and pagination
  const { 
    data: invoicesResponse, 
    isLoading, 
    error 
  } = useInvoices({
    page: currentPage,
    limit: itemsPerPage,
    sortBy: sortOptions.field,
    order: sortOptions.direction
  });
  
  // Extract data and pagination metadata
  const invoices = useMemo(() => {
    return invoicesResponse?.data || [];
  }, [invoicesResponse?.data]);
  
  const paginationMeta = invoicesResponse?.meta || {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 1,
    hasNextPage: false,
    hasPreviousPage: false,
  };
  
  // Fetch selected invoice details
  const { data: selectedInvoice } = useInvoice(currentInvoiceId);

  // Memoize validated invoices to prevent unnecessary recalculations
  const validatedInvoices = useMemo(() => {
    return validateInvoices(invoices);
  }, [invoices]);

  const handleInvoiceClick = useCallback((id: string) => {
    dispatch(openInvoiceModal(id));
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeInvoiceModal());
  }, [dispatch]);

  const handleSelectAll = useCallback(() => {
    if (selectedInvoiceIds.length === validatedInvoices.length) {
      dispatch(clearSelectedInvoices());
    } else {
      dispatch(setSelectedInvoiceIds(validatedInvoices.map((invoice) => invoice.id)));
    }
  }, [dispatch, selectedInvoiceIds.length, validatedInvoices]);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    dispatch(toggleInvoiceSelection(id));
  }, [dispatch]);

  const handleSortByAmount = useCallback(() => {
    // Toggle sorting: asc -> desc -> none -> asc
    if (sortOptions.field !== 'amount') {
      dispatch(updateSortOptions({ field: 'amount', direction: 'asc' }));
    } else if (sortOptions.direction === 'asc') {
      dispatch(updateSortOptions({ direction: 'desc' }));
    } else {
      dispatch(updateSortOptions({ field: 'createdAt', direction: 'desc' }));
    }
  }, [dispatch, sortOptions]);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  }, []);

  if (error) return <div className="text-center py-10 text-red-500">{error ? String(error) : 'An error occurred'}</div>;

  // Determine if "select all" is checked
  const selectAll = selectedInvoiceIds.length === validatedInvoices.length && validatedInvoices.length > 0;

  return (
    <div className="mx-0">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center py-4">
            Error loading invoices: {error ? String(error) : 'Unknown error'}
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-indigo-300">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-white border tracking-wider w-32">
                    <input
                      type="checkbox"
                      checked={selectAll}
                      onChange={handleSelectAll}
                    />
                    <span className="ml-2">Date</span>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white border tracking-wider w-56">
                    Payee
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white border tracking-wider w-56">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white border tracking-wider w-32">
                    Due Date
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-white border tracking-wider w-36 cursor-pointer"
                    onClick={handleSortByAmount}
                  >
                    <div className="flex justify-between items-center">
                      <span>Amount</span>
                      <span>
                        {sortOptions.field === 'amount' 
                          ? (sortOptions.direction === 'asc' ? '▲' : '▼') 
                          : '↕'}
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white border tracking-wider w-36">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {validatedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  validatedInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      onClick={() => handleInvoiceClick(invoice.id)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedInvoiceIds.includes(invoice.id)}
                            onChange={(e) => handleCheckboxChange(e, invoice.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          {new Date(invoice.createdAt).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">{invoice.vendorName}</td>
                      <td className="px-6 py-4 truncate max-w-xs">{invoice.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            invoice.paid
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {invoice.paid ? 'Paid' : 'Unpaid'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            {/* Pagination component */}
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={!paginationMeta.hasPreviousPage}
                  className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    paginationMeta.hasPreviousPage
                      ? 'bg-white text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={!paginationMeta.hasNextPage}
                  className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
                    paginationMeta.hasNextPage
                      ? 'bg-white text-gray-700 hover:bg-gray-50'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(currentPage * itemsPerPage, paginationMeta.total)}
                    </span>{' '}
                    of <span className="font-medium">{paginationMeta.total}</span> results
                  </p>
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={paginationMeta.totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </>
        )}
      </div>
      
      {/* Item per page selection */}
      <div className="mt-4 flex justify-end">
        <label htmlFor="itemsPerPage" className="mr-2 text-sm text-gray-700 flex items-center">
          Items per page:
        </label>
        <select
          id="itemsPerPage"
          className="border border-gray-300 rounded-md py-1 pl-2 pr-8 text-sm"
          value={itemsPerPage}
          onChange={handleItemsPerPageChange}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
      
      {/* Invoice detail modal */}
      {isModalOpen && (
        <InvoiceModal
          invoice={selectedInvoice}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default InvoiceList;