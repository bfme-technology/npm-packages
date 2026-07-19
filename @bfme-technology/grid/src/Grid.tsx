import React, { useMemo, useState, useEffect } from "react";
import Pagination from "./Pagination";
import {
  gridWrapperClass,
  gridContainerClass,
  tableClass,
  theadClass,
  thClass,
  tbodyClass,
  trClass,
  tdClass,
  groupHeaderRowClass,
  groupHeaderCellClass,
  expandCellClass,
  expandButtonClass,
  expandableRowClass,
  expandableRowCellClass,
} from "./styles";

// Helper to determine the theme mode
const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

const getResolvedTheme = (themeMode) => {
  if (themeMode === "light" || themeMode === "dark") {
    return themeMode;
  }
  if (typeof document !== "undefined") {
    if (document.documentElement.classList.contains("dark")) {
      return "dark";
    }
  }
  return getSystemTheme();
};

const getThemeCssVariables = (resolvedTheme) => {
  if (resolvedTheme === "dark") {
    return {
      "--bg-surface": "#1e293b",
      "--bg-deep": "#0f172a",
      "--bg-elevated": "#334155",
      "--border-color": "#475569",
      "--text-primary": "#f1f5f9",
      "--text-secondary": "#cbd5e1",
      "--text-muted": "#94a3b8",
      "--primary-accent": "#6366f1",
    };
  }
  return {
    "--bg-surface": "#ffffff",
    "--bg-deep": "#f8fafc",
    "--bg-elevated": "#f1f5f9",
    "--border-color": "#e2e8f0",
    "--text-primary": "#0f172a",
    "--text-secondary": "#475569",
    "--text-muted": "#64748b",
    "--primary-accent": "#4f46e5",
  };
};

const Grid = (props) => {
  const {
    rowData = [],
    columnDefs = [],
    loading = false,
    pagination = true,
    paginate = true,
    paginationPageSize = 10,
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

  const isPaginationEnabled = pagination && paginate;

  const [resolvedTheme, setResolvedTheme] = useState(() => getResolvedTheme(themeMode));

  // Sync theme
  useEffect(() => {
    setResolvedTheme(getResolvedTheme(themeMode));
    if (themeMode !== "auto" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => setResolvedTheme(getResolvedTheme("auto"));

    mediaQuery.addEventListener("change", handleThemeChange);

    let observer;
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
    const flatList = [];
    const rows = [[], []];
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
  const [expandedRows, setExpandedRows] = useState(new Set());
  const toggleRow = (rowId) => {
    setExpandedRows((prev) => {
      const next = new Set(prev);
      if (next.has(rowId)) next.delete(rowId);
      else next.add(rowId);
      return next;
    });
  };

  // Row grouping state
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const toggleGroup = (groupKey) => {
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
    const g = {};
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
      allGroupKeys.forEach(k => {
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
    
    // Paginate grouped rows
    const start = (localPage - 1) * paginationPageSize;
    const end = start + paginationPageSize;
    const slicedRowData = rowData.slice(start, end);

    const g: any = {};
    slicedRowData.forEach((row, index) => {
      const val = row[groupBy] !== undefined && row[groupBy] !== null ? String(row[groupBy]) : "None";
      if (!g[val]) g[val] = [];
      g[val].push({ row, index: start + index });
    });
    return g;
  }, [rowData, groups, groupBy, isPaginationEnabled, paginationPageSize, localPage, isServerSide]);

  // Handle cell rendering
  const renderCell = (col, row, index) => {
    const value = row[col.field];
    if (col.cellRenderer) {
      const CellRenderer = col.cellRenderer;
      if (typeof CellRenderer === "function") {
        return CellRenderer({
          value,
          data: row,
          node: { id: index },
          ...(col.cellRendererParams || {}),
        });
      }
    }
    return value !== undefined && value !== null ? String(value) : "";
  };

  // Build pagination props
  const resolvedPaginatorInfo = useMemo(() => {
    if (isServerSide) return paginatorInfo;
    if (!isPaginationEnabled) return null;
    return {
      currentPage: localPage,
      lastPage: Math.ceil(rowData.length / paginationPageSize) || 1,
      total: rowData.length,
      perPage: paginationPageSize,
    };
  }, [rowData, isPaginationEnabled, paginationPageSize, localPage, isServerSide, paginatorInfo]);

  const handlePageChange = (page) => {
    if (isServerSide) {
      if (onPageChange) onPageChange(page);
    } else {
      setLocalPage(page);
    }
  };

  const handlePageSizeChange = (pageSize) => {
    if (isServerSide) {
      if (onPageSizeChange) onPageSizeChange(pageSize);
    } else {
      // Adjust page if necessary
      setLocalPage(1);
    }
  };

  const themeStyle = {
    ...getThemeCssVariables(resolvedTheme),
    ...(containerStyle || {}),
  };

  // Render individual data row
  const renderRow = (row, index) => {
    const rowId = row.id || row.expense_id || String(index);
    const isExpanded = expandedRows.has(rowId);

    return (
      <React.Fragment key={rowId}>
        <tr className={trClass}>
          {hasExpand && (
            <td className={expandCellClass}>
              <button
                type="button"
                className={expandButtonClass}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleRow(rowId);
                }}
              >
                <i className={`fa-solid ${isExpanded ? "fa-chevron-down" : "fa-chevron-right"} text-xs`} />
              </button>
            </td>
          )}
          {flatCols.map((col, cIdx) => (
            <td
              key={col.field ? `${col.field}-${cIdx}` : cIdx}
              className={tdClass}
              style={col.cellStyle || {}}
            >
              {renderCell(col, row, index)}
            </td>
          ))}
        </tr>
        {hasExpand && isExpanded && (
          <tr className={expandableRowClass}>
            <td colSpan={flatCols.length + 1} className={expandableRowCellClass}>
              {React.createElement(expandableRowRenderer, { data: row })}
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

  // Render loading skeleton rows
  const renderSkeletonRows = () => {
    const rowCount = Math.min(paginationPageSize || 5, 5);
    const skeletonRows = [];
    for (let rIdx = 0; rIdx < rowCount; rIdx++) {
      skeletonRows.push(
        <tr key={`skeleton-row-${rIdx}`} className={trClass}>
          {hasExpand && (
            <td className={expandCellClass}>
              <div className="h-4 w-4 bg-border-color/40 rounded animate-pulse mx-auto" />
            </td>
          )}
          {flatCols.map((col, cIdx) => {
            const widthClass = cIdx % 3 === 0 ? "w-2/3" : cIdx % 3 === 1 ? "w-11/12" : "w-1/2";
            return (
              <td key={`skeleton-cell-${rIdx}-${cIdx}`} className={tdClass}>
                <div className={`h-4 ${widthClass} bg-border-color/30 rounded animate-pulse`} />
              </td>
            );
          })}
        </tr>
      );
    }
    return skeletonRows;
  };

  return React.createElement(
    "div",
    { className: gridWrapperClass },
    React.createElement(
      "div",
      {
        className: `${gridContainerClass} ${containerClassName || ""} ${mobileCardRenderer ? "hidden sm:block" : ""}`,
        style: themeStyle,
      },
      React.createElement(
        "table",
        { className: tableClass },
        React.createElement(
          "thead",
          { className: theadClass },
          headerRows.map((row, rIdx) =>
            React.createElement(
              "tr",
              { key: rIdx, className: "border-b border-border-color" },
              row.map((col, cIdx) => {
                if (col.isExpandPlaceholder) {
                  return React.createElement("th", {
                    key: "expand-placeholder",
                    rowSpan: col.rowSpan,
                    colSpan: col.colSpan,
                    className: expandCellClass,
                  });
                }
                return React.createElement(
                  "th",
                  {
                    key: col.field ? `${col.field}-${cIdx}` : cIdx,
                    rowSpan: col.rowSpan,
                    colSpan: col.colSpan,
                    className: thClass,
                    style: col.cellStyle || {},
                  },
                  col.headerName || ""
                );
              })
            )
          )
        ),
        React.createElement(
          "tbody",
          { className: tbodyClass },
          loading
            ? renderSkeletonRows()
            : groupBy && activeGroups
            ? Object.keys(activeGroups).map((groupKey) => {
                const isGroupOpen = expandedGroups.has(groupKey);
                const groupItems = activeGroups[groupKey];
                return (
                  <React.Fragment key={groupKey}>
                    <tr
                      className={groupHeaderRowClass}
                      onClick={() => toggleGroup(groupKey)}
                    >
                      <td colSpan={flatCols.length + (hasExpand ? 1 : 0)} className={groupHeaderCellClass}>
                        <i className={`fa-solid ${isGroupOpen ? "fa-chevron-down" : "fa-chevron-right"} mr-2 text-xs`} />
                        <span>{`${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}: `}</span>
                        <span className="text-text-primary">{groupKey}</span>
                        <span className="ml-2 text-text-muted font-medium">{`(${groupItems.length} items)`}</span>
                      </td>
                    </tr>
                    {isGroupOpen && groupItems.map(({ row, index }) => renderRow(row, index))}
                  </React.Fragment>
                );
              })
          : activeRows.map((row, index) => renderRow(row, index))
        )
      )
    ),
    mobileCardRenderer && React.createElement(
      "div",
      { className: "block sm:hidden flex flex-col gap-3 mt-2" },
      loading
        ? React.createElement("div", { className: "text-center text-text-muted text-xs py-4" }, "Loading...")
        : groupBy && activeGroups
        ? Object.keys(activeGroups).map((groupKey) => {
            const isGroupOpen = expandedGroups.has(groupKey);
            const groupItems = activeGroups[groupKey];
            return React.createElement(
              React.Fragment,
              { key: groupKey },
              React.createElement(
                "div",
                {
                  className: "px-4 py-2 bg-white/5 font-bold rounded-lg text-sm text-text-primary cursor-pointer flex justify-between items-center",
                  onClick: () => toggleGroup(groupKey),
                },
                React.createElement("span", null, `${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}: ${groupKey} (${groupItems.length})`),
                React.createElement("i", { className: `fa-solid ${isGroupOpen ? "fa-chevron-down" : "fa-chevron-right"} text-xs text-text-muted` })
              ),
              isGroupOpen && React.createElement(
                "div",
                { className: "flex flex-col gap-3 mt-2" },
                groupItems.map(({ row, index }) => React.createElement(React.Fragment, { key: row.id || row.expense_id || String(index) }, mobileCardRenderer({ data: row, index })))
              )
            );
          })
        : activeRows.map((row, index) => React.createElement(
            React.Fragment,
            { key: row.id || row.expense_id || String(index) },
            mobileCardRenderer({ data: row, index })
          ))
    ),
    !loading && resolvedPaginatorInfo &&
      React.createElement(Pagination, {
        paginatorInfo: resolvedPaginatorInfo,
        paginationPageSize: paginationPageSize,
        onPageChange: handlePageChange,
        onPageSizeChange: handlePageSizeChange,
      })
  );
};

export default Grid;
