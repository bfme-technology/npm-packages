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
  cellRenderer?: React.ComponentType<any> | ((params: any) => any);
  cellRendererParams?: any;
  cellStyle?: React.CSSProperties;
  children?: ColumnDef[];
  colSpan?: number;
  rowSpan?: number;
  isExpandPlaceholder?: boolean;
  flex?: number;
  minWidth?: number;
  [key: string]: any;
};

export type GridProps = {
  rowData?: any[];
  columnDefs?: ColumnDef[];
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

export type DefaultMobileCardProps = {
  data: any;
  flatCols: ColumnDef[];
  index: number;
  renderCell: (col: ColumnDef, row: any, index: number) => any;
};

export type PaginationProps = {
  paginatorInfo?: PaginatorInfo;
  paginationPageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
};

export declare const Grid: React.FC<GridProps>;
export default Grid;

export declare const DefaultMobileCard: React.FC<DefaultMobileCardProps>;
export declare const Pagination: React.FC<PaginationProps>;

export type SkeletonLoaderProps = {
  className?: string;
  showFilters?: boolean;
  columns?: string[];
  rowCount?: number;
};

export declare const SkeletonLoader: React.FC<SkeletonLoaderProps>;
export declare const useGrid: (props: GridProps) => any;

export declare const gridWrapperClass: string;
export declare const gridContainerClass: string;
export declare const paginationContainerClass: string;
export declare const paginationInfoClass: string;
export declare const paginationControlsClass: string;
export declare const pageSizeSelectorClass: string;
export declare const pageSizeSelectClass: string;
export declare const paginationButtonClass: string;
export declare const pageInfoClass: string;
export declare const gridResponsiveStyles: string;
