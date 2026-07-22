import React, { type ReactNode } from "react";
export interface PageProps {
    title: ReactNode;
    subtitle?: ReactNode;
    actionButton?: ReactNode;
    filterContent?: ReactNode;
    children: ReactNode;
    className?: string;
}
export declare const Page: React.FC<PageProps>;
