import type React from "react";

export type PaginatorInfo = {
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
};

export type ColumnDef = {
  headerName?: string;
  field?: string;
  cellRenderer?: React.ComponentType<any>;
  cellRendererParams?: any;
  children?: ColumnDef[];
  flex?: number;
  minWidth?: number;
  [key: string]: any;
};

export type GridProps = {
  rowData: any[];
  columnDefs: ColumnDef[];
  loading?: boolean;
  themeMode?: "auto" | "light" | "dark";
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
  mobileCardRenderer?: (props: { data: any; index: number }) => React.ReactNode;
};

export type PaginationProps = {
  paginatorInfo?: PaginatorInfo;
  paginationPageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export declare const Grid: React.FC<GridProps>;
export default Grid;

export declare const Pagination: React.FC<PaginationProps>;

export declare const gridWrapperClass: string;
export declare const gridContainerClass: string;
export declare const paginationContainerClass: string;
export declare const paginationInfoClass: string;
export declare const paginationControlsClass: string;
export declare const pageSizeSelectorClass: string;
export declare const pageSizeSelectClass: string;
export declare const paginationButtonClass: string;
export declare const pageInfoClass: string;
