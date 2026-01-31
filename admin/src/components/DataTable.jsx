import { useState } from 'react';
import './DataTable.css';
import StatusBadge from './StatusBadge';

const DataTable = ({ 
  data, 
  columns, 
  onRowClick, 
  actions,
  searchable = true,
  pagination = true,
  pageSize = 10
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter data based on search term
  const filteredData = searchable && searchTerm
    ? data.filter(row => 
        columns.some(col => {
          const value = col.accessor ? col.accessor(row) : row[col.key];
          return value?.toString().toLowerCase().includes(searchTerm.toLowerCase());
        })
      )
    : data;

  // Pagination
  const totalPages = pagination ? Math.ceil(filteredData.length / pageSize) : 1;
  const startIndex = pagination ? (currentPage - 1) * pageSize : 0;
  const endIndex = pagination ? startIndex + pageSize : filteredData.length;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderCell = (row, column) => {
    if (column.render) {
      return column.render(row);
    }
    
    const value = column.accessor ? column.accessor(row) : row[column.key];
    
    if (column.type === 'status') {
      return <StatusBadge status={value} type={column.statusType} />;
    }
    
    if (column.type === 'currency') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 2
      }).format(value || 0);
    }
    
    if (column.type === 'date') {
      if (!value) return '-';
      return new Date(value).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    }
    
    return value ?? '-';
  };

  return (
    <div className="data-table-container">
      {searchable && (
        <div className="data-table-search">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="data-table-search-input"
          />
        </div>
      )}
      
      <div className="data-table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th key={idx} style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
              {actions && <th style={{ width: '100px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="data-table-empty">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr 
                  key={row.id || rowIdx} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'data-table-row-clickable' : ''}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx}>
                      {renderCell(row, col)}
                    </td>
                  ))}
                  {actions && (
                    <td className="data-table-actions">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && (
        <div className="data-table-pagination">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="data-table-pagination-btn"
          >
            Previous
          </button>
          <span className="data-table-pagination-info">
            Page {currentPage} of {totalPages} ({filteredData.length} records)
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="data-table-pagination-btn"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
