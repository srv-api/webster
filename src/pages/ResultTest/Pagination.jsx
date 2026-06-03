// src/components/product/Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, setCurrentPage }) => {
  const pageBtn = {
    padding: "6px 10px",
    borderRadius: "3px",
    border: "1px solid #ccc",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "13px",
        gap: "6px",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
        disabled={currentPage === 1}
        style={pageBtn}
      >
        Prev
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => setCurrentPage(page)}
          style={{
            ...pageBtn,
            backgroundColor: page === currentPage ? "#000" : "#fff",
            color: page === currentPage ? "#fff" : "#000",
            border:
              page === currentPage ? "2px solid #000" : "1px solid #ccc",
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
        disabled={currentPage === totalPages}
        style={pageBtn}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
