interface Props {
  currentPage: number;
  totalPages: number;
  itemsPerPage: number;
  totalItems: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  itemsPerPage,
  totalItems,
  onPageChange,
}: Props) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  const getPages = () => {
    let start = currentPage - 1;
    let end = currentPage + 1;

    if (currentPage === 1) {
      start = 1;
      end = Math.min(3, totalPages);
    } else if (currentPage === 2) {
      start = 1;
      end = Math.min(3, totalPages);
    } else if (currentPage === totalPages) {
      start = Math.max(totalPages - 2, 1);
      end = totalPages;
    } else if (currentPage === totalPages - 1) {
      start = Math.max(totalPages - 2, 1);
      end = totalPages;
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };

  const pagesToShow = getPages();

  return (
    <div className="mt-6 flex flex-col items-center text-white">
      <p className="mb-3 text-sm">
        Showing {startItem}-{endItem} of {totalItems} items
      </p>

      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          ≪
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-2 py-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          &lt;
        </button>

        {pagesToShow.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded-full font-semibold transition-colors ${
              page === currentPage
                ? "bg-gray-500 text-white"
                : "bg-gray-700 text-white hover:bg-gray-600"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          &gt;
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-2 py-1 rounded-full bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
        >
          ≫
        </button>
      </div>

      <p className="mt-2 text-sm">
        Page {currentPage} of {totalPages}
      </p>
    </div>
  );
}