import React from "react";
import type { DefaultMobileCardProps } from "./Grid.types";

export const DefaultMobileCard: React.FC<DefaultMobileCardProps> = ({
  data,
  flatCols,
  index,
  renderCell,
}) => {
  if (!flatCols || flatCols.length === 0) return null;

  const actionCol = flatCols.find(
    (col) =>
      col.field === "actions" ||
      col.field === "expense_id" ||
      (col.headerName && String(col.headerName).toLowerCase().includes("action"))
  );

  const dataCols = flatCols.filter((col) => col !== actionCol);

  const titleCol = dataCols[0];
  const secondaryCol = dataCols.length > 1 ? dataCols[1] : null;
  const remainingCols = dataCols.slice(2);

  return (
    <div className="p-4 rounded-2xl bg-bg-surface border border-border-color shadow-sm flex flex-col gap-3">
      {(titleCol || secondaryCol) && (
        <div className="flex justify-between items-start gap-2">
          {titleCol && (
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {titleCol.headerName}
              </span>
              <div className="font-bold text-sm text-text-primary mt-0.5">
                {renderCell(titleCol, data, index)}
              </div>
            </div>
          )}
          {secondaryCol && (
            <div className="flex flex-col items-end text-right">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                {secondaryCol.headerName}
              </span>
              <div className="font-bold text-sm text-text-primary mt-0.5">
                {renderCell(secondaryCol, data, index)}
              </div>
            </div>
          )}
        </div>
      )}

      {remainingCols.length > 0 && (
        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-color/60 text-xs">
          {remainingCols.map((col, idx) => {
            const cellVal = renderCell(col, data, index);
            if (cellVal === "" || cellVal === null || cellVal === undefined) return null;
            return (
              <div key={col.field ? `${col.field}-${idx}` : idx} className="flex flex-col gap-0.5">
                <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider">
                  {col.headerName}
                </span>
                <div className="font-medium text-text-primary truncate">
                  {cellVal}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {actionCol && (
        <div className="flex justify-end items-center pt-2.5 border-t border-border-color/60 text-xs">
          {renderCell(actionCol, data, index)}
        </div>
      )}
    </div>
  );
};
