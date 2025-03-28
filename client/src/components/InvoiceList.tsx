import { useState, useCallback, useMemo } from 'react';
import { z } from 'zod';
import InvoiceModal from './InvoiceModal';
import Pagination from './Pagination';
import { useInvoices, useInvoice } from '../hooks/useInvoices';
import { Invoice } from '../types';

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

// Example function to validate invoices
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);
  
  // Pagination state
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
    sortBy: sortOrder ? 'amount' : 'createdAt',
    order: sortOrder || 'desc'
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
  const { data: selectedInvoice } = useInvoice(selectedInvoiceId);

  // Memoize validated invoices to prevent unnecessary recalculations
  const validatedInvoices = useMemo(() => {
    return validateInvoices(invoices);
  }, [invoices]);

  // Memoize sorted invoices to prevent unnecessary recalculations
  const sortedInvoices = useMemo(() => {
    if (!sortOrder) return validatedInvoices;
    
    return [...validatedInvoices].sort((a, b) => {
      return sortOrder === 'asc' ? a.amount - b.amount : b.amount - a.amount;
    });
  }, [validatedInvoices, sortOrder]);

  const handleInvoiceClick = useCallback((id: string) => {
    setSelectedInvoiceId(id);
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedInvoiceId(null);
  }, []);

  const handleSelectAll = useCallback(() => {
    if (selectAll) {
      setSelectedInvoices([]);
    } else {
      setSelectedInvoices(validatedInvoices.map((invoice) => invoice.id));
    }
    setSelectAll(!selectAll);
  }, [selectAll, validatedInvoices]);

  const handleCheckboxChange = useCallback((e: React.MouseEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    setSelectedInvoices((prev) =>
      prev.includes(id) ? prev.filter((invoiceId) => invoiceId !== id) : [...prev, id]
    );
  }, []);

  const handleSortByAmount = useCallback(() => {
    setSortOrder((prevOrder) => {
      if (prevOrder === 'asc') return 'desc';
      if (prevOrder === 'desc') return null;
      return 'asc';
    });
  }, []);
  
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);
  
  const handleItemsPerPageChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to first page when changing items per page
  }, []);

  if (error) return <div className="text-center py-10 text-red-500">{error ? String(error) : 'An error occurred'}</div>;

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
                        {sortOrder === 'asc' ? '▲' : sortOrder === 'desc' ? '▼' : '↕'}
                      </span>
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-white border tracking-wider w-36">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {sortedInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  sortedInvoices.map((invoice) => (
                    <tr 
                      key={invoice.id} 
                      onClick={() => handleInvoiceClick(invoice.id)}
                      className="hover:bg-gray-50 cursor-pointer"
                    >
                      <td className="px-4 py-4 whitespace-nowrap border">
                        <input
                          type="checkbox"
                          checked={selectedInvoices.includes(invoice.id)}
                          onClick={(e) => handleCheckboxChange(e, invoice.id)}
                          onChange={() => {}} // Add empty onChange to prevent React warning
                        />
                        <span className="ml-2 text-sm">{new Date(invoice.createdAt).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="text-sm font-medium text-gray-900">{invoice.vendorName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="text-sm text-gray-900">{invoice.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <div className="text-sm text-gray-900">{new Date(invoice.dueDate).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}</div>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap border">
                        <div className="text-sm text-gray-900 italic">
                          {invoice.amount === 0 ? '' : `$ ${invoice.amount.toFixed(2)}`}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap border">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.paid ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {invoice.paid ? 'Paid' : 'Open'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="flex justify-between items-center px-6 py-4 bg-gray-50">
              <div className="flex items-center">
                <span className="text-sm text-gray-600">Show</span>
                <select
                  className="mx-2 border rounded px-2 py-1 text-sm"
                  value={itemsPerPage}
                  onChange={handleItemsPerPageChange}
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </select>
                <span className="text-sm text-gray-600">entries</span>
              </div>
              
              <Pagination
                currentPage={paginationMeta.page}
                totalPages={paginationMeta.totalPages}
                onPageChange={handlePageChange}
                hasNextPage={paginationMeta.hasNextPage}
                hasPreviousPage={paginationMeta.hasPreviousPage}
              />
              
              <div className="text-sm text-gray-600">
                Showing {paginationMeta.total > 0 ? (paginationMeta.page - 1) * paginationMeta.limit + 1 : 0} to {Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total)} of {paginationMeta.total} entries
              </div>
            </div>
          </>
        )}
      </div>
      <InvoiceModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        invoice={selectedInvoice} 
      />
    </div>
  );
};

export default InvoiceList;