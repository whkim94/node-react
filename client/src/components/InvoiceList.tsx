import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import InvoiceModal from './InvoiceModal';
import Pagination from './Pagination';
import { useInvoices, useInvoice } from '../hooks/useInvoices';
import { RootState } from '../store';
import { 
  setSelectedInvoiceIds, 
  clearSelectedInvoices, 
  toggleInvoiceSelection,
  updateSortOptions,
  openInvoiceModal,
  closeInvoiceModal
} from '../store/slices/invoiceSlice';

const InvoiceList = () => {
  const dispatch = useDispatch();
  
  // Get UI state from Redux
  const { 
    selectedInvoiceIds, 
    sortOptions, 
    isModalOpen, 
    currentInvoiceId 
  } = useSelector((state: RootState) => state.invoiceUI);
  
  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Fetch invoices with React Query
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

  const handleInvoiceClick = useCallback((id: string) => {
    dispatch(openInvoiceModal(id));
  }, [dispatch]);

  const handleCloseModal = useCallback(() => {
    dispatch(closeInvoiceModal());
  }, [dispatch]);

  const handleSelectAll = useCallback(() => {
    if (selectedInvoiceIds.length === invoices.length) {
      dispatch(clearSelectedInvoices());
    } else {
      dispatch(setSelectedInvoiceIds(invoices.map((invoice) => invoice.id)));
    }
  }, [dispatch, selectedInvoiceIds.length, invoices]);

  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    dispatch(toggleInvoiceSelection(id));
  }, [dispatch]);

  const handleSortByAmount = useCallback(() => {
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

  // Determine if "select all" is checked
  const selectAll = selectedInvoiceIds.length === invoices.length && invoices.length > 0;

  if (error) return <div className="text-center py-10 text-red-500">{String(error)}</div>;

  return (
    <div className="mx-0">
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
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
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No invoices found
                    </td>
                  </tr>
                ) : (
                  invoices.map((invoice) => (
                    <tr 
                      key={invoice.id}
                      onClick={() => handleInvoiceClick(invoice.id)}
                      className="hover:bg-gray-100 cursor-pointer"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedInvoiceIds.includes(invoice.id)}
                            onChange={(e) => handleCheckboxChange(e, invoice.id)}
                            onClick={(e) => e.stopPropagation()}
                          />
                          <span className="ml-2">
                            {new Date(invoice.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {invoice.vendorName}
                      </td>
                      <td className="px-6 py-4 truncate max-w-xs">
                        {invoice.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {new Date(invoice.dueDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        ${invoice.amount.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          invoice.paid
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}>
                          {invoice.paid ? "Paid" : "Unpaid"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
            
            <div className="px-4 py-3 border-t border-gray-200">
              <Pagination 
                currentPage={paginationMeta.page}
                totalPages={paginationMeta.totalPages}
                onPageChange={handlePageChange}
                totalItems={paginationMeta.total}
                itemsPerPage={paginationMeta.limit}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </div>
          </>
        )}
      </div>
      
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