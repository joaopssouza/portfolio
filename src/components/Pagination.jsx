import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];

  // Cria um array com o número de páginas
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  // Não renderiza nada se houver apenas uma página
  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="pagination">
      <ul>
        {pageNumbers.map(number => (
          <li key={number} className={currentPage === number ? 'active' : ''}>
            <button onClick={() => onPageChange(number)}>
              {number}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;