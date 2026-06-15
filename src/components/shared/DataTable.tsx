import React, { useState, useMemo } from 'react';
import { ArrowUpDown, Search, Filter, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import { clsx } from 'clsx';
import { Pagination } from './Pagination';

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  filterable?: boolean;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  onRowClick?: (row: any) => void;
  className?: string;
  hasPagination?: boolean;
}

export function DataTable({ columns, data, onRowClick, className, hasPagination = true }: DataTableProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [filters, setFilters] = useState<{ [key: string]: string }>({});
  const [dateFilter, setDateFilter] = useState({ month: '', year: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const filteredData = useMemo(() => {
    return data.filter(row => {
      // General Column Filters
      const matchesFilters = Object.entries(filters).every(([key, value]) => {
        if (!value) return true;
        const rowValue = row[key];
        return String(rowValue ?? '').toLowerCase().includes(String(value).toLowerCase());
      });

      // Date Filters (Month/Year)
      const matchesDate = () => {
        if (!dateFilter.month && !dateFilter.year) return true;
        const date = new Date(row.date || row.timestamp || row.createdAt);
        if (isNaN(date.getTime())) return true; // Skip if no valid date field

        const matchesMonth = dateFilter.month ? (date.getMonth() + 1) === parseInt(dateFilter.month) : true;
        const matchesYear = dateFilter.year ? date.getFullYear() === parseInt(dateFilter.year) : true;
        return matchesMonth && matchesYear;
      };

      return matchesFilters && matchesDate();
    }).sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [data, filters, dateFilter, sortConfig]);

  const paginatedData = useMemo(() => {
    if (!hasPagination) return filteredData;
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize, hasPagination]);

  // Reset to first page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters, dateFilter, sortConfig]);

  return (
    <div className={clsx("sys-table-card w-full flex flex-col", className)}>
      {/* Date Filter Bar */}
      <div className="p-4 bg-white border-b border-slate-200 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-slate-400" />
          <span className="text-[10px] font-black text-primary uppercase tracking-widest">Filter by Date:</span>
        </div>
        <select 
          value={dateFilter.month}
          onChange={(e) => setDateFilter(prev => ({ ...prev, month: e.target.value }))}
          className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="">All Months</option>
          {Array.from({ length: 12 }, (_, i) => (
            <option key={i + 1} value={i + 1}>
              {new Date(0, i).toLocaleString('en-US', { month: 'long' })}
            </option>
          ))}
        </select>
        <select 
          value={dateFilter.year}
          onChange={(e) => setDateFilter(prev => ({ ...prev, year: e.target.value }))}
          className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider focus:ring-1 focus:ring-primary outline-none"
        >
          <option value="">All Years</option>
          {[2024, 2025, 2026].map(y => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
        {(dateFilter.month || dateFilter.year) && (
          <button 
            onClick={() => setDateFilter({ month: '', year: '' })}
            className="text-[9px] font-black text-accent uppercase tracking-widest hover:underline"
          >
            Clear Date
          </button>
        )}
      </div>

      <div className="overflow-x-auto custom-scrollbar flex-1">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#212c46] text-white">
            <tr className="border-b-2 border-[#b7a159] sticky top-0 z-10">
              {columns.map((col) => (
                <th key={col.key} className="px-4 py-4 font-black uppercase tracking-widest text-[12px] whitespace-nowrap">
                  <div className="flex flex-col gap-2">
                    <div 
                      className={clsx(
                        "flex items-center gap-2",
                        col.sortable && "cursor-pointer hover:text-[#d1a45f] transition-colors"
                      )}
                      onClick={() => col.sortable && handleSort(col.key)}
                    >
                      {col.label}
                      {col.sortable && (
                        <span className="text-white/50">
                          {sortConfig?.key === col.key ? (
                            sortConfig.direction === 'asc' ? <ChevronUp size={14} className="text-[#d1a45f]" /> : <ChevronDown size={14} className="text-[#d1a45f]" />
                          ) : <ArrowUpDown size={14} className="hover:text-[#d1a45f]" />}
                        </span>
                      )}
                    </div>
                    {col.filterable && (
                      <div className="relative mt-2">
                        <Search size={12} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[#7a8b95]" />
                        <input 
                          type="text"
                          placeholder="Search..."
                          value={filters[col.key] || ''}
                          onChange={(e) => setFilters(prev => ({ ...prev, [col.key]: e.target.value }))}
                          className="w-full bg-white/10 border border-[#414757] rounded-lg pl-7 pr-2 py-1.5 text-[11px] font-bold text-white placeholder:text-[#7a8b95] focus:border-[#d1a45f] focus:outline-none transition-all focus:bg-white/20"
                        />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white text-[12px]">
            {paginatedData.length > 0 ? (
              paginatedData.map((row, i) => (
                <tr 
                  key={i} 
                  onClick={() => onRowClick?.(row)}
                  className={clsx(
                    "hover:bg-[#f8f9fa] transition-colors",
                    onRowClick && "cursor-pointer"
                  )}
                >
                  {columns.map((col) => (
                    <td key={col.key} className="px-4 py-2.5 font-bold text-[#202c38]">
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-[#7a8b95]">
                  <div className="flex flex-col items-center gap-2">
                    <Filter size={32} className="opacity-20 mx-auto" />
                    <p className="text-[12px] font-black uppercase tracking-widest">No matching data found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {hasPagination && filteredData.length > 0 && (
        <div className="py-3 px-6 bg-[#F0EAE1]/80 border-t-[1.5px] border-slate-200 flex justify-between items-center shrink-0 w-full mt-auto">
          <Pagination 
            currentPage={currentPage}
            totalCount={filteredData.length}
            pageSize={pageSize}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
            className="w-full justify-between !border-none !p-0 !bg-transparent"
          />
        </div>
      )}
    </div>
  );
}
