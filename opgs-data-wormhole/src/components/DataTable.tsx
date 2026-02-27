import React, { useMemo, useState } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  flexRender,
  createColumnHelper,
  type SortingState,
} from '@tanstack/react-table';
import type { SiteRecord } from '../types';

interface DataTableProps {
  data: SiteRecord[];
  yearFilter: string;
  regionFilter: string;
  searchFilter: string;
  onYearChange: (v: string) => void;
  onRegionChange: (v: string) => void;
  onSearchChange: (v: string) => void;
  years: number[];
  regions: string[];
}

const columnHelper = createColumnHelper<SiteRecord>();

export const DataTable: React.FC<DataTableProps> = ({
  data,
  yearFilter,
  regionFilter,
  searchFilter,
  onYearChange,
  onRegionChange,
  onSearchChange,
  years,
  regions,
}) => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const columns = useMemo(
    () => [
      columnHelper.accessor('Site', {
        header: 'Site',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('Region', {
        header: 'Region / Province',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('Year', {
        header: 'Year',
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor('Users', {
        header: 'Users',
        cell: (info) => info.getValue().toLocaleString(),
      }),
      columnHelper.accessor('Trainings', {
        header: 'Trainings',
        cell: (info) => info.getValue().toLocaleString(),
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 15 } },
  });

  return (
    <div className="table-card">
      <div className="table-header">
        <h2 className="chart-title" style={{ margin: 0 }}>
          Site Data
        </h2>
        <div className="table-filters">
          <input
            className="filter-input"
            type="text"
            placeholder="Search site or region..."
            value={searchFilter}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          <select
            className="filter-select"
            value={yearFilter}
            onChange={(e) => onYearChange(e.target.value)}
          >
            <option value="">All Years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
          <select
            className="filter-select"
            value={regionFilter}
            onChange={(e) => onRegionChange(e.target.value)}
          >
            <option value="">All Regions</option>
            {regions.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={header.column.getToggleSortingHandler()}
                    style={{ cursor: 'pointer', userSelect: 'none' }}
                  >
                    {flexRender(header.column.columnDef.header, header.getContext())}
                    {header.column.getIsSorted() === 'asc'
                      ? ' ▲'
                      : header.column.getIsSorted() === 'desc'
                      ? ' ▼'
                      : ' ⇅'}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  No data matches current filters.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row, i) => (
                <tr key={row.id} className={i % 2 === 0 ? 'row-even' : 'row-odd'}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="page-btn"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
        >
          «
        </button>
        <button
          className="page-btn"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          ‹
        </button>
        <span className="page-info">
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()} &nbsp;|&nbsp;{' '}
          {data.length} records
        </span>
        <button
          className="page-btn"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          ›
        </button>
        <button
          className="page-btn"
          onClick={() => table.setPageIndex(table.getPageCount() - 1)}
          disabled={!table.getCanNextPage()}
        >
          »
        </button>
      </div>
    </div>
  );
};
