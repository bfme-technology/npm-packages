import React, { useMemo, useState, useEffect } from "react";
import type { GridProps, ColumnDef, PaginatorInfo } from "./Grid.types";
import { getResolvedTheme, getThemeCssVariables, renderCell } from "./Grid.utils";

export const useGrid = (props: GridProps) => {
  const {
    rowData = [],
    columnDefs = [],
    loading = false,
    pagination = true,
    paginate = true,
    paginatorInfo,
    onPageChange,
    onPageSizeChange,
    groupBy,
    expandableRowRenderer,
    containerClassName,
    containerStyle,
    themeMode = "auto",
    mobileCardRenderer,
  } = props;
  
  const paginationPageSize = props.paginationPageSize ?? (paginatorInfo?.perPage || 10);

  const isPaginationEnabled = pagination && paginate;

  const [resolvedTheme, setResolvedTheme] = useState(() => getResolvedTheme(themeMode));

  // Sync theme
  useEffect(() => {
    setResolvedTheme(getResolvedTheme(themeMode));
    if (themeMode !== "auto" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => setResolvedTheme(getResolvedTheme("auto"));

    mediaQuery.addEventListener("change", handleThemeChange);

    let observer: MutationObserver | undefined;
    if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
      observer = new MutationObserver(handleThemeChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      mediaQuery.removeEventListener("change", handleThemeChange);
      if (observer) observer.disconnect();
    };
  }, [themeMode]);

  // Local pagination state if not controlled externally
  const [localPage, setLocalPage] = useState(1);
  const isServerSide = !!paginatorInfo;

  // Process columns: handle hierarchical column groups
  const hasExpand = !!expandableRowRenderer;
  const { flatCols, headerRows, hasGroups } = useMemo(() => {
    const flatList: ColumnDef[] = [];
    const rows: ColumnDef[][] = [[], []];
    let hasColGroups = false;

    columnDefs.forEach((col) => {
      if (col.children && col.children.length > 0) {
        hasColGroups = true;
      }
    });

    if (hasExpand) {
      rows[0].push({
        headerName: "",
        isExpandPlaceholder: true,
        colSpan: 1,
        rowSpan: hasColGroups ? 2 : 1,
      });
    }

    columnDefs.forEach((col) => {
      if (col.children && col.children.length > 0) {
        rows[0].push({
          headerName: col.headerName || "",
          colSpan: col.children.length,
          rowSpan: 1,
        });
        col.children.forEach((child) => {
          rows[1].push(child);
          flatList.push(child);
        });
      } else {
        rows[0].push({
          ...col,
          colSpan: 1,
          rowSpan: hasColGroups ? 2 : 1,
        });
        flatList.push(col);
      }
    });

    return {
      flatCols: flatList,
      headerRows: hasColGroups ? rows : [rows[0]],
      hasGroups: hasColGroups,
    };
  }, [columnDefs, hasExpand]);

  // Expandable row state
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const toggleRow = (rowId: string) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  // Row grouping state
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const toggleGroup = (groupKey: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupKey)) next.delete(groupKey);
      else next.add(groupKey);
      return next;
    });
  };

  // Grouped row data computation
  const groups = useMemo(() => {
    if (!groupBy) return null;
    const g: Record<string, { row: any; index: number }[]> = {};
    rowData.forEach((row, index) => {
      const val = row[groupBy] !== undefined && row[groupBy] !== null ? String(row[groupBy]) : "None";
      if (!g[val]) {
        g[val] = [];
      }
      g[val].push({ row, index });
    });
    // Expand groups by default
    const allGroupKeys = Object.keys(g);
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      allGroupKeys.forEach((k) => {
        if (prev.size === 0) next.add(k);
      });
      return next;
    });
    return g;
  }, [rowData, groupBy]);

  // Determine current active page rows for client-side pagination
  const activeRows = useMemo(() => {
    if (isServerSide || !isPaginationEnabled) return rowData;
    const start = (localPage - 1) * paginationPageSize;
    return rowData.slice(start, start + paginationPageSize);
  }, [rowData, isPaginationEnabled, paginationPageSize, localPage, isServerSide]);

  // Active groups if client-side paginated
  const activeGroups = useMemo(() => {
    if (!groupBy || !groups) return null;
    if (isServerSide || !isPaginationEnabled) return groups;

    const start = (localPage - 1) * paginationPageSize;
    const end = start + paginationPageSize;
    const slicedRowData = rowData.slice(start, end);

    const g: Record<string, { row: any; index: number }[]> = {};
    slicedRowData.forEach((row, index) => {
      const val = row[groupBy] !== undefined && row[groupBy] !== null ? String(row[groupBy]) : "None";
      if (!g[val]) g[val] = [];
      g[val].push({ row, index: start + index });
    });
    return g;
  }, [rowData, groups, groupBy, isPaginationEnabled, paginationPageSize, localPage, isServerSide]);

  // Build pagination props
  const resolvedPaginatorInfo = useMemo<PaginatorInfo | null>(() => {
    if (isServerSide) return paginatorInfo || null;
    if (!isPaginationEnabled) return null;
    return {
      currentPage: localPage,
      lastPage: Math.ceil(rowData.length / paginationPageSize) || 1,
      total: rowData.length,
      perPage: paginationPageSize,
    };
  }, [rowData, isPaginationEnabled, paginationPageSize, localPage, isServerSide, paginatorInfo]);

  const handlePageChange = (page: number) => {
    if (isServerSide) {
      if (onPageChange) onPageChange(page);
    } else {
      setLocalPage(page);
    }
  };

  const handlePageSizeChange = (pageSize: number) => {
    if (isServerSide) {
      if (onPageSizeChange) onPageSizeChange(pageSize);
    } else {
      setLocalPage(1);
    }
  };

  const themeStyle = {
    ...getThemeCssVariables(resolvedTheme),
    ...(containerStyle || {}),
  };

  return {
    rowData,
    columnDefs,
    loading,
    paginationPageSize,
    groupBy,
    expandableRowRenderer,
    containerClassName,
    mobileCardRenderer,
    flatCols,
    headerRows,
    hasGroups,
    hasExpand,
    expandedRows,
    toggleRow,
    expandedGroups,
    toggleGroup,
    groups,
    activeRows,
    activeGroups,
    renderCell,
    resolvedPaginatorInfo,
    handlePageChange,
    handlePageSizeChange,
    themeStyle,
  };
};
