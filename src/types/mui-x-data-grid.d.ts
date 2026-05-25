declare module '@mui/x-data-grid' {
  import * as React from 'react';

  export interface GridColDef {
    field: string;
    headerName?: string;
    description?: string;
    width?: number | string;
    minWidth?: number | string;
    flex?: number;
    sortable?: boolean;
    sortable?: boolean;
    resizable?: boolean;
    suppressMenu?: boolean;
    suppressMovable?: boolean;
    valueGetter?: (params: any) => any;
    valueSetter?: (params: any) => boolean | void | Promise<boolean | void>;
    valueFormatter?: (params: any) => string;
    valueParser?: (params: any) => any;
    type?: string | any;
    align?: 'left' | 'right' | 'center' | 'justify';
    headerAlign?: 'left' | 'right' | 'center' | 'justify';
    hideable?: boolean;
    initialWidth?: number;
    pinned?: 'left' | 'right';
  }

  export interface GridRowsProp<T = any> {
    [id: string]: T;
  }

  export interface GridApiRef {
    /** @ignore - do not document. */
    current: {
      /** Get all row ids. */
      getAllRowIds: () => string[];
      /** Get row matching the id. */
      getRow: (id: string) => any;
      /** Get rows matching the ids. */
      getRows: (ids: string[]) => any[];
      /** Set rows. */
      setRows: (rows: any[]) => void;
      /** Set row matching the id. */
      setRow: (id: string, row: any) => void;
      /** Delete row matching the id. */
      deleteRow: (id: string) => void;
      /** Set filter model. */
      setFilterModel: (model: any) => void;
      /** Set sort model. */
      setSortModel: (model: any) => void;
      /** Set pagination model. */
      setPaginationModel: (model: { page: number; pageSize: number }) => void;
    };
  }

  export interface GridProps<T = any> {
    /** The rows to display in the grid. */
    rows: T[] | GridRowsProp<T>;
    /** The column definitions. */
    columns: GridColDef[];
    /** Enable or disable column menu. */
    disableColumnMenu?: boolean;
    /** Enable or disable column selector in the column menu. */
    disableColumnSelector?: boolean;
    /** Enable or disable row selection. */
    disableSelectionOnClick?: boolean;
    /** Enable or disable virtualization. */
    disableVirtualization?: boolean;
    /** If true, the grid will have a checkbox column for selection. */
    checkboxSelection?: boolean;
    /** If true, clicking a row will not select it. */
    disableSelectionOnClick?: boolean;
    /** Callback fired when the page changes. */
    onPageChange?: (newPage: number, pageSize: number) => void;
    /** Callback fired when the page size changes. */
    onPageSizeChange?: (newPageSize: number) => void;
    /** Page size options for the pagination menu. */
    pageSizeOptions?: number[];
    /** Zero-based index of the current page. */
    page?: number;
    /** Number of rows to display per page. */
    pageSize?: number;
    /** If true, the pagination is disabled. */
    disablePagination?: boolean;
    /** If true, the grid density is compact. */
    density?: 'compact' | 'standard' | 'comfortable';
    /** If true, the grid borders are visible. */
    showRowBorder?: boolean;
    /** If true, the column borders are visible. */
    showColumnBorder?: boolean;
    /** Callback fired when rows are selected. */
    onSelectionModelChange?: (ids: string[]) => void;
    /** Callback fired when columns are resized. */
    onColumnResize?: (params: { field: string; newSize: number; finalSize: number }) => void;
    /** Callback fired when a column is sorted. */
    onSortModelChange?: (sortModel: any) => void;
    /** Callback fired when filter model changes. */
    onFilterModelChange?: (filterModel: any) => void;
  }

  export const DataGrid: React.ComponentType<GridProps>;
}