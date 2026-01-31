import { useState } from 'react';
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
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      {searchable && (
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="input-field max-w-md"
          />
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              {columns.map((col, idx) => (
                <th key={idx} className="table-header" style={{ width: col.width }}>
                  {col.header}
                </th>
              ))}
              {actions && <th className="table-header" style={{ width: '100px' }}>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-6 py-12 text-center text-gray-500 italic">
                  No data found
                </td>
              </tr>
            ) : (
              paginatedData.map((row, rowIdx) => (
                <tr 
                  key={row.id || rowIdx} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={`table-row ${onRowClick ? 'cursor-pointer' : ''}`}
                >
                  {columns.map((col, colIdx) => (
                    <td key={colIdx} className="table-cell">
                      {renderCell(row, col)}
                    </td>
                  ))}
                  {actions && (
                    <td className="table-cell text-right whitespace-nowrap">
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
        <div className="flex justify-between items-center p-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-600">
            Page {currentPage} of {totalPages} ({filteredData.length} records)
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default DataTable;
