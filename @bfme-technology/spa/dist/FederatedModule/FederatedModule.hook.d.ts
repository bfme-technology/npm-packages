import React from 'react';
import type { FederatedModuleProps, MfeStatus, MfeRouteConfig } from './FederatedModule.types';
export declare const useMfeLoader: (props: FederatedModuleProps) => {
    status: MfeStatus;
    FederatedComponent: React.ComponentType<any> | null;
    containerRef: React.RefObject<HTMLDivElement | null>;
    customElementRef: React.RefObject<HTMLElement | null>;
    config: MfeRouteConfig | null;
};
