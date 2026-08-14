import React from 'react';

export interface SkeletonLoaderProps {
  className?: string;
  showFilters?: boolean;
  columns?: string[];
  rowCount?: number;
}

const DEFAULT_COLUMNS = ['Date', 'Details', 'Type', 'Category', 'Credit', 'Debit', 'Tag', 'Actions'];

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  className = '',
  showFilters = true,
  columns = DEFAULT_COLUMNS,
  rowCount = 5,
}) => {
  const rows = Array.from({ length: rowCount }, (_, i) => i);
  const filters = [1, 2, 3, 4];
  const isCustomColumns = columns !== DEFAULT_COLUMNS;

  return (
    <div className={`w-full flex flex-col gap-4 animate-pulse ${className}`}>
      {/* Categories Filter Skeleton */}
      {showFilters && (
        <div className="flex flex-wrap gap-2 mb-2">
          {filters.map((i) => (
            <div key={i} className="h-8 w-24 rounded-lg bg-white/5 border border-border-color/30" />
          ))}
        </div>
      )}

      {/* Desktop Table Skeleton */}
      <div className="hidden sm:!block overflow-x-auto w-full">
        <div className="w-full border-b border-border-color pb-3 flex text-xs font-extrabold text-text-secondary uppercase tracking-wider">
          {isCustomColumns ? (
            columns.map((colName, idx) => (
              <div
                key={`${colName}-${idx}`}
                className="px-4"
                style={{ flex: idx === 0 ? "0 0 90px" : idx === 1 ? "1" : idx === 2 ? "2" : "3" }}
              >
                {colName}
              </div>
            ))
          ) : (
            <>
              <div className="w-[12%] px-4">Date</div>
              <div className="w-[28%] px-4">Details</div>
              <div className="w-[10%] px-4">Type</div>
              <div className="w-[10%] px-4">Category</div>
              <div className="w-[12%] px-4">Credit</div>
              <div className="w-[12%] px-4">Debit</div>
              <div className="w-[10%] px-4">Tag</div>
              <div className="w-[6%] px-4 text-right">Actions</div>
            </>
          )}
        </div>

        {rows.map((row) => (
          <div key={row} className="w-full py-4 border-b border-border-color/40 flex items-center">
            {isCustomColumns ? (
              columns.map((colName, idx) => (
                <div
                  key={`${colName}-${idx}`}
                  className="px-4"
                  style={{ flex: idx === 0 ? "0 0 90px" : idx === 1 ? "1" : idx === 2 ? "2" : "3" }}
                >
                  <div
                    className={`${idx % 2 === 0 ? 'h-4 bg-white/10 rounded-md' : 'h-4 bg-white/5 rounded-md'} ${
                      idx === 0 ? "w-12" : idx === 1 ? "w-3/4" : idx === 2 ? "w-4/5" : "w-11/12"
                    }`}
                  />
                </div>
              ))
            ) : (
              <>
                <div className="w-[12%] px-4"><div className="h-4 bg-white/5 rounded-md w-20" /></div>
                <div className="w-[28%] px-4 flex flex-col gap-1.5">
                  <div className="h-4 bg-white/10 rounded-md w-40" />
                  <div className="h-4 bg-white/5 rounded-md w-64" />
                </div>
                <div className="w-[10%] px-4"><div className="h-4 bg-white/10 rounded-md w-16" /></div>
                <div className="w-[10%] px-4"><div className="h-4 bg-white/5 rounded-md w-16" /></div>
                <div className="w-[12%] px-4"><div className="h-4 bg-white/5 rounded-md w-16" /></div>
                <div className="w-[12%] px-4"><div className="h-4 bg-white/5 rounded-md w-16" /></div>
                <div className="w-[10%] px-4"><div className="h-4 bg-white/5 rounded-md w-12" /></div>
                <div className="w-[6%] px-4 flex justify-end gap-3">
                  <div className="h-4 bg-white/5 rounded-md w-8" />
                  <div className="h-4 bg-white/5 rounded-md w-10" />
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Card Skeleton */}
      <div className="flex flex-col gap-3 sm:!hidden">
        {rows.map((card) => (
          <div key={card} className="p-4 rounded-2xl bg-bg-deep border border-border-color flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-2">
                <div className="h-4 bg-white/10 rounded-md w-32" />
                <div className="h-3 bg-white/5 rounded-md w-20" />
              </div>
              <div className="h-4 bg-white/10 rounded-md w-16" />
            </div>
            <div className="h-3 bg-white/5 rounded-md w-full" />
            <div className="flex justify-between items-center border-t border-border-color/60 pt-3">
              <div className="flex gap-2">
                <div className="h-4 bg-white/10 rounded-md w-14" />
                <div className="h-4 bg-white/5 rounded-md w-14" />
              </div>
              <div className="flex gap-3">
                <div className="h-4 bg-white/5 rounded-md w-8" />
                <div className="h-4 bg-white/5 rounded-md w-10" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;
