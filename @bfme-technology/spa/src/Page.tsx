import React, { type ReactNode } from "react";
import { Breadcrumb } from "./Breadcrumb";

export interface PageProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actionButton?: ReactNode;
  filterContent?: ReactNode;
  children: ReactNode;
  className?: string;
}

export const Page: React.FC<PageProps> = ({
  title,
  subtitle,
  actionButton,
  filterContent,
  children,
  className = "",
}) => {
  return (
    <div className={`glass-panel p-4 md:p-6 min-h-100 flex flex-col gap-6 font-body text-text-primary ${className}`}>
      <Breadcrumb />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex flex-col">
          <h2 className="text-lg md:text-xl font-bold tracking-wide flex items-center gap-2">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs text-text-secondary mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-4 mt-4 sm:mt-0">
          {filterContent}
          {actionButton}
        </div>
      </div>

      <div className="flex-grow flex flex-col gap-4 overflow-y-auto">
        {children}
      </div>
    </div>
  );
};
