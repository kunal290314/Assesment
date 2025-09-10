import React from 'react';

const PaginationButton = ({ children, onClick, disabled }) => {
  return (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};

export default PaginationButton;
