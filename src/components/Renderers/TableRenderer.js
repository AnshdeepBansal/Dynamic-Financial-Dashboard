'use client';

import { useState, useMemo } from 'react';
import { getValueByPath } from '@/lib/extractJsonPaths';

export default function TableRenderer({ data, selectedFields, apiType }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  if (!data) {
    return (
      <div className="p-4 text-center text-gray-400">
        Loading data...
      </div>
    );
  }

  if (data.error) {
    return (
      <div className="p-4 text-center text-red-400">
        {data.error}
      </div>
    );
  }

  // Get the array path from selectedFields (first array field)
  const arrayPath = selectedFields && selectedFields.length > 0 ? selectedFields[0] : null;
  
  // Extract the array data
  let tableData = null;
  if (arrayPath) {
    const arrayValue = getValueByPath(data, arrayPath);
    if (Array.isArray(arrayValue) && arrayValue.length > 0) {
      tableData = arrayValue;
    } else if (arrayValue !== undefined && !Array.isArray(arrayValue)) {
      // Path exists but is not an array
      return (
        <div className="p-4 text-center text-gray-400">
          <div className="mb-2 text-lg font-semibold">Invalid array path</div>
          <div className="text-sm">
            The selected path "{arrayPath}" does not point to an array. Found: {typeof arrayValue}
          </div>
        </div>
      );
    } else if (arrayValue === undefined) {
      // Path doesn't exist
      return (
        <div className="p-4 text-center text-gray-400">
          <div className="mb-2 text-lg font-semibold">Array path not found</div>
          <div className="text-sm">
            Could not find array at path: "{arrayPath}". The data structure may have changed or the path is incorrect.
          </div>
          <div className="mt-2 text-xs text-gray-500">
            Available top-level keys: {data && typeof data === 'object' ? Object.keys(data).join(', ') : 'none'}
          </div>
        </div>
      );
    }
  } else {
    // Fallback: try to find any array in the data
    if (Array.isArray(data)) {
      tableData = data;
    } else if (data.data && Array.isArray(data.data)) {
      tableData = data.data;
    } else {
      // Search for first array in the object
      for (const key in data) {
        if (Array.isArray(data[key]) && data[key].length > 0) {
          tableData = data[key];
          break;
        }
      }
    }
  }

  // If no array found, show error message
  if (!tableData || !Array.isArray(tableData) || tableData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-400">
        <div className="mb-2 text-lg font-semibold">This data cannot be mapped as a table</div>
        <div className="text-sm">
          No array found in the API response. Please select an array field in the widget configuration.
        </div>
      </div>
    );
  }

  // Get all unique keys from the array items to create columns
  const columns = useMemo(() => {
    const allKeys = new Set();
    tableData.forEach((item) => {
      if (item && typeof item === 'object') {
        Object.keys(item).forEach((key) => allKeys.add(key));
      }
    });
    return Array.from(allKeys);
  }, [tableData]);

  // Filter and sort data
  const processedData = useMemo(() => {
    let filtered = [...tableData];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((item) => {
        if (!item || typeof item !== 'object') return false;
        return Object.values(item).some((value) => {
          const strValue = value != null ? String(value).toLowerCase() : '';
          return strValue.includes(query);
        });
      });
    }

    // Apply sorting
    if (sortConfig.key) {
      filtered.sort((a, b) => {
        const aVal = a?.[sortConfig.key];
        const bVal = b?.[sortConfig.key];
        
        // Handle null/undefined
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        // Try numeric comparison first
        const aNum = Number(aVal);
        const bNum = Number(bVal);
        if (!isNaN(aNum) && !isNaN(bNum)) {
          return sortConfig.direction === 'asc' ? aNum - bNum : bNum - aNum;
        }

        // String comparison
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        if (sortConfig.direction === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [tableData, searchQuery, sortConfig]);

  const handleSort = (columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        // Toggle direction if same column
        return {
          key: columnKey,
          direction: prev.direction === 'asc' ? 'desc' : 'asc',
        };
      } else {
        // New column, start with ascending
        return {
          key: columnKey,
          direction: 'asc',
        };
      }
    });
  };

  const formatValue = (value) => {
    if (value == null) return 'N/A';
    if (typeof value === 'object') return JSON.stringify(value);
    if (typeof value === 'number') {
      // Format large numbers with commas
      if (value > 1000) {
        return value.toLocaleString();
      }
      // Format decimals
      if (value % 1 !== 0) {
        return value.toFixed(4);
      }
      return value.toString();
    }
    return String(value);
  };

  return (
    <div className="p-4">
      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search table..."
          className="w-full rounded-lg bg-gray-700 px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-gray-700">
              {columns.map((column) => (
                <th
                  key={column}
                  onClick={() => handleSort(column)}
                  className="cursor-pointer select-none px-4 py-2 text-gray-400 hover:bg-gray-800 transition-colors"
                  title="Click to sort"
                >
                  <div className="flex items-center gap-2">
                    <span>{column}</span>
                    {sortConfig.key === column && (
                      <span className="text-green-500">
                        {sortConfig.direction === 'asc' ? '↑' : '↓'}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-400">
                  No data found
                </td>
              </tr>
            ) : (
              processedData.map((item, index) => (
                <tr
                  key={index}
                  className="border-b border-gray-800 hover:bg-gray-800 transition-colors"
                >
                  {columns.map((column) => (
                    <td key={column} className="px-4 py-2 text-gray-300">
                      {formatValue(item[column])}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="mt-2 text-right text-xs text-gray-400">
        Showing {processedData.length} of {tableData.length} items
        {arrayPath && (
          <span className="ml-2 text-gray-500">(from: {arrayPath})</span>
        )}
      </div>
    </div>
  );
}
