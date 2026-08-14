import React from "react";
import Pagination from "./Pagination";
import SkeletonLoader from "./SkeletonLoader";
import { DefaultMobileCard } from "./DefaultMobileCard";
import type { GridProps } from "./Grid.types";
import { useGrid } from "./Grid.hook";
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
  gridResponsiveStyles,
} from "./Grid.styles";

export const Grid: React.FC<GridProps> = (props) => {
  const {
    loading,
    paginationPageSize,
    groupBy,
    expandableRowRenderer,
    containerClassName,
    mobileCardRenderer,
    flatCols,
    headerRows,
    hasExpand,
    expandedRows,
    toggleRow,
    expandedGroups,
    toggleGroup,
    activeRows,
    activeGroups,
    renderCell,
    resolvedPaginatorInfo,
    handlePageChange,
    handlePageSizeChange,
    themeStyle,
  } = useGrid(props);

  const renderCard = (row: any, index: number) => {
    if (mobileCardRenderer) {
      return mobileCardRenderer({ data: row, index });
    }
    return (
      <DefaultMobileCard
        data={row}
        flatCols={flatCols}
        index={index}
        renderCell={renderCell}
      />
    );
  };

  const renderRow = (row: any, index: number) => {
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
              {React.createElement(expandableRowRenderer!, { data: row })}
            </td>
          </tr>
        )}
      </React.Fragment>
    );
  };

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

  return (
    <div className={gridWrapperClass}>
      <style>{gridResponsiveStyles}</style>

      {/* Desktop Table View */}
      <div
        className={`${gridContainerClass} ${containerClassName || ""} bfme-grid-desktop`}
        style={themeStyle}
      >
        <table className={tableClass}>
          <thead className={theadClass}>
            {headerRows.map((row, rIdx) => (
              <tr key={rIdx} className="border-b border-border-color">
                {row.map((col, cIdx) => {
                  if (col.isExpandPlaceholder) {
                    return (
                      <th
                        key="expand-placeholder"
                        rowSpan={col.rowSpan}
                        colSpan={col.colSpan}
                        className={expandCellClass}
                      />
                    );
                  }
                  return (
                    <th
                      key={col.field ? `${col.field}-${cIdx}` : cIdx}
                      rowSpan={col.rowSpan}
                      colSpan={col.colSpan}
                      className={thClass}
                      style={col.cellStyle || {}}
                    >
                      {col.headerName || ""}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody className={tbodyClass}>
            {loading
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
              : activeRows.map((row, index) => renderRow(row, index))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="bfme-grid-mobile flex-col gap-3 mt-2">
        {loading ? (
          <SkeletonLoader showFilters={false} rowCount={4} className="bfme-grid-mobile" />
        ) : groupBy && activeGroups ? (
          Object.keys(activeGroups).map((groupKey) => {
            const isGroupOpen = expandedGroups.has(groupKey);
            const groupItems = activeGroups[groupKey];
            return (
              <React.Fragment key={groupKey}>
                <div
                  className="px-4 py-2 bg-white/5 font-bold rounded-lg text-sm text-text-primary cursor-pointer flex justify-between items-center"
                  onClick={() => toggleGroup(groupKey)}
                >
                  <span>{`${groupBy.charAt(0).toUpperCase() + groupBy.slice(1)}: ${groupKey} (${groupItems.length})`}</span>
                  <i className={`fa-solid ${isGroupOpen ? "fa-chevron-down" : "fa-chevron-right"} text-xs text-text-muted`} />
                </div>
                {isGroupOpen && (
                  <div className="flex flex-col gap-3 mt-2">
                    {groupItems.map(({ row, index }) => (
                      <React.Fragment key={row.id || row.expense_id || String(index)}>
                        {renderCard(row, index)}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </React.Fragment>
            );
          })
        ) : (
          activeRows.map((row, index) => (
            <React.Fragment key={row.id || row.expense_id || String(index)}>
              {renderCard(row, index)}
            </React.Fragment>
          ))
        )}
      </div>

      {/* Pagination */}
      {!loading && resolvedPaginatorInfo && (
        <Pagination
          paginatorInfo={resolvedPaginatorInfo}
          paginationPageSize={paginationPageSize}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
        />
      )}
    </div>
  );
};

export default Grid;
