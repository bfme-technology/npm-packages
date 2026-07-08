import type React from 'react';
export type MfeType = 'federated' | 'custom-element' | 'global-bootstrap';
export type MfeStatus = 'idle' | 'loading' | 'success' | 'error';
export interface MfeRouteConfig {
    key: string;
    name?: string;
    path?: string;
    mfeType: MfeType;
    scriptUrl?: string;
    cssUrl?: string;
    elementName?: string;
    bootstrapFnName?: string;
    unmountFnName?: string;
    mfeProps?: Record<string, any>;
    scope?: string;
    module?: string;
}
export interface FederatedModuleProps {
    mfeKey?: string;
    mfeType?: MfeType;
    scriptUrl?: string;
    cssUrl?: string;
    elementName?: string;
    bootstrapFnName?: string;
    unmountFnName?: string;
    mfeProps?: Record<string, any>;
    scope?: string;
    module?: string;
    loadingFallback?: React.ReactNode;
    errorFallback?: React.ReactNode;
}
