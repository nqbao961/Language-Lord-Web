import {
  forwardRef,
  Ref,
  useCallback,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import styles from './Table.module.scss';
import {
  useTable,
  usePagination,
  Column,
  useRowSelect,
  Row,
  useGroupBy,
  useExpanded,
  useGlobalFilter,
  useAsyncDebounce,
  useFilters,
  useSortBy,
  SortingRule,
} from 'react-table';
import { ReactComponent as ChevronIcon } from '../../assets/images/chevron.svg';
import { ReactComponent as CheckIcon } from '../../assets/images/check.svg';
import SimpleBar from 'simplebar-react';
import {
  getConditionalSelectHeaderCheckboxProps,
  isSameOrAfter,
  isSameOrBefore,
} from '../../services/utils';
import { useTranslation } from 'react-i18next';

type TableProps = {
  columns: Column[];
  data: any[];
  rowClick?: boolean;
  rowSelect?: boolean;
  rowSelectAtLast?: boolean;
  minWidth?: number | string | null;
  pageInput?: boolean;
  pageNumber?: number;
  pageCountNumber?: number;
  selectedRowIdsObj?: {
    [id: number]: boolean;
  };
  tbodyMaxHeight?: number;
  tableMaxHeight?: number | string;
  hiddenColumns?: string[];
  groupByColumns?: string[];
  filters?: string[];
  filterQuery?: string;
  manualQuery?: string;
  manualFilterSort?: any;
  columnsFilters?: { [key: string]: string | number | (string | number)[] };
  sortByRules?: SortingRule<object>[];
  handleSelectRow?: (
    selectedFlatRows: Row<object>[],
    selectedRowIds: Record<string, boolean>
  ) => void;
  onChangeRowLength?: (rowLength: number, rows: Row<object>[]) => void;
  fetchData?: (pageIndex: number) => void;
};

export function Table({
  columns,
  data,
  rowClick = false,
  rowSelect = false,
  rowSelectAtLast = false,
  minWidth,
  pageInput,
  pageNumber = 8,
  pageCountNumber,
  selectedRowIdsObj = {},
  tbodyMaxHeight,
  tableMaxHeight,
  hiddenColumns = [],
  groupByColumns = [],
  filters,
  filterQuery,
  manualQuery,
  manualFilterSort,
  columnsFilters,
  sortByRules = [],
  handleSelectRow = () => {},
  onChangeRowLength = () => {},
  fetchData,
}: TableProps) {
  const { t, i18n } = useTranslation();

  const searchQueryFilterFn = useCallback(
    (rows: Row[], ids: string[], query: string) => {
      if (filters && filters.length > 0) {
        return rows.filter(row => {
          return filters.reduce((preMatch, filter) => {
            return (
              preMatch ||
              row.values[filter]
                .toString()
                .toLowerCase()
                .includes(query.toLowerCase())
            );
          }, false);
        });
      }
      return rows;
    },
    [filters]
  );

  const filterTypes = useMemo(
    () => ({
      selectOptions: selectOptionsFilterFn,
      sameOrBefore: sameOrBeforeFilterFn,
      sameOrAfter: sameOrAfterFilterFn,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageCount,
    nextPage,
    previousPage,
    gotoPage,
    selectedFlatRows,
    toggleAllRowsExpanded,
    isAllRowsExpanded,
    rows,
    setFilter,
    setGlobalFilter,
    state: { pageIndex, selectedRowIds },
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
        pageSize: pageNumber || 8,
        selectedRowIds: selectedRowIdsObj,
        hiddenColumns: hiddenColumns,
        groupBy: groupByColumns,
        sortBy: sortByRules,
      },
      manualPagination: fetchData ? true : false,
      ...(pageCountNumber && { pageCount: pageCountNumber }),
      autoResetPage: fetchData ? false : true,
      filterTypes,
      globalFilter: searchQueryFilterFn,
    },
    useFilters,
    useGlobalFilter,
    useGroupBy,
    useSortBy,
    useExpanded,
    usePagination,
    useRowSelect,
    hooks => {
      const selectionColumn = {
        id: 'selection',
        Header: (props: any) => {
          const checkboxProps = getConditionalSelectHeaderCheckboxProps({
            headerProps: props,
            checkIfRowIsSelectable: row =>
              row.values['selectable'] !== undefined
                ? row.values['selectable']
                : true,
          });
          return (
            <div>
              <IndeterminateCheckbox {...checkboxProps} />
            </div>
          );
        },
        Cell: ({ row }: { row: Row }) => {
          return (
            <div>
              <IndeterminateCheckbox
                {...row.getToggleRowSelectedProps()}
                disabled={
                  row.values['selectable'] !== undefined
                    ? !row.values['selectable']
                    : false
                }
              />
            </div>
          );
        },
      };
      if (rowSelect) {
        hooks.visibleColumns.push(columns => [selectionColumn, ...columns]);
      }
      if (rowSelectAtLast) {
        hooks.visibleColumns.push(columns => [...columns, selectionColumn]);
      }
    }
  );

  const onChangePageInput = useAsyncDebounce((page: number) => {
    gotoPage(page);
  }, 500);

  // Handle server-side search, filter, sort, pagination
  const callGotoPage = useRef(false);

  const onManualQueryChange = useAsyncDebounce(() => {
    if (manualQuery !== '') {
      fetchData && fetchData(pageIndex);
    }
    callGotoPage.current = false;
  }, 500);

  const onFetchDataDebounced = useAsyncDebounce(() => {
    fetchData && fetchData(pageIndex);
  }, 100);

  useEffect(() => {
    if (manualQuery !== undefined) {
      callGotoPage.current = true;
      gotoPage(0);
      manualQuery !== '' ? onManualQueryChange() : onFetchDataDebounced();
    }
  }, [manualQuery]);

  useEffect(() => {
    if (manualFilterSort !== undefined) {
      gotoPage(0);
      onFetchDataDebounced();
    }
  }, [manualFilterSort]);

  useEffect(() => {
    if (!callGotoPage.current) {
      onFetchDataDebounced();
    }
    callGotoPage.current = false;
  }, [onFetchDataDebounced, pageIndex]);
  // End

  useEffect(() => {
    handleSelectRow(selectedFlatRows, selectedRowIds);
  }, [selectedFlatRows]);

  useEffect(() => {
    onChangeRowLength(rows.length, rows);

    if (groupByColumns.length > 0 && !isAllRowsExpanded && rows.length > 0) {
      toggleAllRowsExpanded(true);
    }
  }, [rows]);

  const onQueryChange = useAsyncDebounce(filterQuery => {
    setGlobalFilter(filterQuery || undefined);
  }, 200);

  useEffect(() => {
    onQueryChange(filterQuery);
  }, [filterQuery, setGlobalFilter]);

  useEffect(() => {
    if (columnsFilters) {
      for (const columnsFilter in columnsFilters) {
        setFilter(columnsFilter, columnsFilters[columnsFilter]);
      }
    }
  }, [columnsFilters]);

  const theadElement = (
    <thead>
      {headerGroups.map(headerGroup => (
        <tr {...headerGroup.getHeaderGroupProps()} className={styles.rowHead}>
          {headerGroup.headers.map(column => (
            <th {...column.getHeaderProps()}>{column.render('Header')}</th>
          ))}
        </tr>
      ))}
    </thead>
  );

  const tbodyElement = (
    <tbody {...getTableBodyProps()}>
      {page.map(row => {
        prepareRow(row);
        return (
          <tr
            {...row.getRowProps()}
            className={`${styles.rowBody} ${
              row.isGrouped ? styles.rowBodyGrouped : ''
            }`}
            onClick={() => {
              if (rowClick) {
                row.cells[row.cells.length - 1].value.props.onClick();
              }
            }}
          >
            {row.cells.map(cell => {
              return (
                <td {...cell.getCellProps()}>
                  {cell.isGrouped ? (
                    <div className={styles.dataCell}>
                      <>
                        <span {...row.getToggleRowExpandedProps()}>
                          {row.isExpanded ? '-' : '+'}
                        </span>{' '}
                        {cell.render('Cell')} ({row.subRows.length})
                      </>
                    </div>
                  ) : cell.isAggregated ? (
                    // If the cell is aggregated, use the Aggregated
                    // renderer for cell
                    <div className={styles.dataCell}>
                      {cell.render('Aggregated')}
                    </div>
                  ) : cell.isPlaceholder ? null : ( // For cells with repeated values, render null
                    // Otherwise, just render the regular cell
                    <div className={styles.dataCell}>{cell.render('Cell')}</div>
                  )}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );

  let tableElement: JSX.Element;

  if (tbodyMaxHeight) {
    tableElement = (
      <>
        <table
          {...getTableProps()}
          className={`${styles.table} ${styles.collapseBody}`}
          style={{ minWidth: minWidth || 'initial' }}
        >
          {theadElement}
          {tbodyElement}
        </table>
        <SimpleBar
          className={styles.scrollBody}
          style={{ maxHeight: tbodyMaxHeight }}
        >
          <table
            {...getTableProps()}
            className={`${styles.table} ${styles.collapseHead}`}
            style={{ minWidth: minWidth || 'initial' }}
          >
            {theadElement}
            {tbodyElement}
          </table>
        </SimpleBar>
      </>
    );
  } else {
    tableElement = (
      <table
        {...getTableProps()}
        className={styles.table}
        style={{ minWidth: minWidth || 'initial' }}
      >
        {theadElement}
        {tbodyElement}
      </table>
    );
  }

  return (
    <div className={styles.container}>
      {minWidth ? (
        tableMaxHeight ? (
          <SimpleBar
            className={styles.scrollBody}
            style={{ maxHeight: tableMaxHeight }}
          >
            {tableElement}
          </SimpleBar>
        ) : (
          <SimpleBar>{tableElement}</SimpleBar>
        )
      ) : (
        tableElement
      )}
      {data.length > 0 && (canNextPage || canPreviousPage) && (
        <div className={styles.paginationWrapper}>
          <div></div>
          <div className={styles.pagination}>
            <button
              style={{ visibility: canPreviousPage ? 'visible' : 'hidden' }}
              onClick={() => previousPage()}
              className={styles.backButton}
            >
              <ChevronIcon
                style={{
                  stroke: 'var(--primary)',
                }}
              />
            </button>
            <span>
              {t('table out of pages', {
                current: pageIndex + 1,
                total: pageCount,
              })}
            </span>
            <button
              style={{ visibility: canNextPage ? 'visible' : 'hidden' }}
              onClick={() => nextPage()}
              className={styles.nextButton}
            >
              <ChevronIcon
                style={{
                  stroke: 'var(--primary)',
                }}
              />
            </button>
          </div>
          <div>
            {pageInput && (
              <>
                {t('Go to page') + ':'}
                <input
                  type="number"
                  defaultValue={pageIndex + 1}
                  onChange={e => {
                    const page = e.target.value
                      ? Number(e.target.value) - 1
                      : 0;
                    onChangePageInput(page);
                  }}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const IndeterminateCheckbox = forwardRef(
  (
    {
      indeterminate,
      disabled = false,
      ...rest
    }: { indeterminate?: any; disabled?: boolean },
    ref: Ref<HTMLInputElement | null>
  ) => {
    const defaultRef = useRef<any>(null);

    return (
      <label
        className={styles.checkboxLabel}
        onClick={e => e.stopPropagation()}
      >
        <input
          className={styles.checkboxInput}
          type="checkbox"
          ref={defaultRef}
          disabled={disabled}
          {...rest}
        />
        <div
          className={`${styles.checkbox} ${
            disabled ? styles.disabledCheckbox : ''
          }`}
        >
          <CheckIcon
            className={styles.checkIcon}
            style={{ stroke: ' var(--background)' }}
          />
        </div>
      </label>
    );
  }
);

function selectOptionsFilterFn(
  rows: Row[],
  ids: string[],
  filterValue: string[]
) {
  return rows.filter(row =>
    filterValue.length > 0 ? filterValue.includes(row.values[ids[0]]) : true
  );
}

function sameOrBeforeFilterFn(
  rows: Row[],
  ids: string[],
  filterValue: string | Date
) {
  return rows.filter(row =>
    filterValue ? isSameOrBefore(row.values[ids[0]], filterValue, 'day') : true
  );
}

function sameOrAfterFilterFn(
  rows: Row[],
  ids: string[],
  filterValue: string | Date
) {
  return rows.filter(row =>
    filterValue ? isSameOrAfter(row.values[ids[0]], filterValue, 'day') : true
  );
}
