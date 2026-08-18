import React from "react";

export type ThemeMode = "auto" | "light" | "dark";

export interface ColumnDef {
  field?: string;
  headerName?: string;
  cellRenderer?: React.ComponentType<any> | ((params: any) => any);
  cellRendererParams?: Record<string, any>;
  cellStyle?: React.CSSProperties;
  children?: ColumnDef[];
  colSpan?: number;
  rowSpan?: number;
  isExpandPlaceholder?: boolean;
}

export interface PaginatorInfo {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
}

export interface GridProps {
  rowData?: any[];
  columnDefs?: ColumnDef[];
  loading?: boolean;
  pagination?: boolean;
  paginate?: boolean;
  paginationPageSize?: number;
  paginatorInfo?: PaginatorInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  groupBy?: string;
  expandableRowRenderer?: React.ComponentType<{ data: any }>;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
  themeMode?: ThemeMode;
  mobileCardRenderer?: (params: { data: any; index: number }) => React.ReactNode;
}

export interface DefaultMobileCardProps {
  data: any;
  flatCols: ColumnDef[];
  index: number;
  renderCell: (col: ColumnDef, row: any, index: number) => any;
}
