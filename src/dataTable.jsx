import React from 'react';
import { useTable, usePagination, useGlobalFilter, useFilters, useSortBy } from 'react-table';
import { Table, Form, Button } from 'react-bootstrap';

// Global filter component for searching
const GlobalFilter = ({ globalFilter, setGlobalFilter }) => (
  <Form.Control
    type="text"
    value={globalFilter || ''}
    onChange={e => setGlobalFilter(e.target.value)}
    placeholder="Search..."
    className="mb-3"
  />
);

const DataTable = ({ columns, data, title }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    state: { pageIndex, pageSize, globalFilter },
    gotoPage,
    nextPage,
    previousPage,
    setGlobalFilter,
    state: { pageIndex: currentPage }
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <div className="mb-4">
      <h2>{title}</h2>
      <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
      <Table striped bordered hover {...getTableProps()}>
        <thead>
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map(column => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render('Header')}
                  <span>
                    {column.isSorted
                      ? column.isSortedDesc
                        ? ' 🔽'
                        : ' 🔼'
                      : ''}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map(cell => (
                  <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </Table>
      <div className="pagination-controls">
        <Button
          variant="secondary"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {'<<'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {'<'}
        </Button>
        <span>
          Page{' '}
          <strong>
            {currentPage + 1} of {pageOptions.length}
          </strong>{' '}
        </span>
        <Button
          variant="secondary"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {'>'}
        </Button>
        <Button
          variant="secondary"
          onClick={() => gotoPage(pageOptions.length - 1)}
          disabled={!canNextPage}
        >
          {'>>'}
        </Button>
      </div>
    </div>
  );
};

export default DataTable;
