import PropTypes from "prop-types";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = [];
    const showEllipsis = totalPages > 7;

    if (!showEllipsis) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-4 my-8">
      <button
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`
              min-w-[2.5rem] h-10 flex items-center justify-center rounded-md text-sm font-medium
              ${
                page === "..."
                  ? "cursor-default border-none"
                  : "border border-gray-300"
              }
              ${
                page === currentPage
                  ? "bg-blue-500 text-white border-blue-500 hover:bg-blue-600"
                  : page !== "..."
                  ? "bg-white text-gray-700 hover:bg-gray-50"
                  : "bg-transparent"
              }
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            onClick={() => page !== "..." && onPageChange(page)}
            disabled={page === "..." || page === currentPage}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
