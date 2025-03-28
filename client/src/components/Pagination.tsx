import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPreviousPage,
}) => {
  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      // Calculate start and end of page range
      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);
      
      // Adjust if at the beginning or end
      if (currentPage <= 2) {
        end = Math.min(totalPages - 1, maxPagesToShow - 1);
      } else if (currentPage >= totalPages - 1) {
        start = Math.max(2, totalPages - maxPagesToShow + 2);
      }
      
      // Add ellipsis if needed
      if (start > 2) {
        pages.push('...');
      }
      
      // Add middle pages
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      // Add ellipsis if needed
      if (end < totalPages - 1) {
        pages.push('...');
      }
      
      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-center my-2 space-x-1">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPreviousPage}
        className={`px-3 py-1 rounded-md ${
          hasPreviousPage
            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Previous
      </button>
      
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={typeof page !== 'number'}
          className={`px-3 py-1 rounded-md ${
            page === currentPage
              ? 'bg-indigo-600 text-white'
              : typeof page === 'number'
              ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
              : 'bg-white text-gray-500'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage}
        className={`px-3 py-1 rounded-md ${
          hasNextPage
            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200'
            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
        }`}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination; 