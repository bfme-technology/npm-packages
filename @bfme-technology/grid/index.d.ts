import type React from "react";
import type {
  ColDef,
  GridOptions,
  GridReadyEvent,
  PaginationChangedEvent,
} from "ag-grid-community";

export type PaginatorInfo = {
  total: number;
  currentPage: number;
  lastPage: number;
  perPage: number;
};

export type GridProps<RowData = unknown> = {
  rowData: RowData[];
  columnDefs: ColDef<RowData>[];
  themeMode?: "auto" | "light" | "dark";
  defaultColDef?: ColDef<RowData>;
  gridOptions?: GridOptions<RowData>;
  pagination?: boolean;
  paginationPageSize?: number;
  suppressPaginationPanel?: boolean;
  onPaginationChanged?: (params: PaginationChangedEvent) => void;
  onGridReady?: (event: GridReadyEvent<RowData>) => void;
  paginatorInfo?: PaginatorInfo;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  containerClassName?: string;
  containerStyle?: React.CSSProperties;
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

export declare const createGridConfig: <RowData = unknown>(
  props: GridProps<RowData>,
) => GridProps<RowData> & {
  pagination: false;
  domLayout: "normal";
  suppressNoRowsOverlay: false;
  overlayNoRowsTemplate: string;
  defaultColDef: ColDef<RowData>;
};

export declare const gridWrapperClass: string;
export declare const gridContainerClass: string;
export declare const paginationContainerClass: string;
export declare const paginationInfoClass: string;
export declare const paginationControlsClass: string;
export declare const pageSizeSelectorClass: string;
export declare const pageSizeSelectClass: string;
export declare const paginationButtonClass: string;
export declare const pageInfoClass: string;
