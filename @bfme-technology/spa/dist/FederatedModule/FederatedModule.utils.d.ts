import type { MfeType } from './FederatedModule.types';
export declare const loadedScripts: Set<string>;
export declare const loadedStylesheets: Set<string>;
export declare const initHostShareScopes: () => void;
export declare const loadScript: (url: string, mfeType: MfeType) => Promise<void>;
export declare const loadStylesheet: (url: string) => Promise<void>;
