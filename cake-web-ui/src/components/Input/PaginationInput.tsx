import { Button, Pagination } from "react-daisyui";
import React, { useState } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const PaginationInput: React.FC<PaginationProps> = ({
  totalPages,
  currentPage,
  onPageChange,
}) => {
  const [page, setPage] = useState(currentPage);

  const handleClick = (newPage: number) => {
    setPage(newPage);
    onPageChange(newPage);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    let startPage = Math.max(page - 2, 1);
    let endPage = Math.min(page + 2, totalPages);

    if (page <= 3) {
      endPage = Math.min(5, totalPages);
    } else if (page > totalPages - 3) {
      startPage = Math.max(totalPages - 4, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          onClick={() => handleClick(i)}
          className={`join-item ${page === i ? "btn-primary" : ""}`}
        >
          {i}
        </Button>,
      );
    }
    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center space-x-2">
      <Pagination>
        <Button
          onClick={() => handleClick(page - 1)}
          disabled={page === 1}
          className="join-item"
        >
          &lt;
        </Button>
        {renderPageNumbers()}
        <Button
          onClick={() => handleClick(page + 1)}
          disabled={page === totalPages}
          className="join-item"
        >
          &gt;
        </Button>
      </Pagination>
    </div>
  );
};

export default PaginationInput;
