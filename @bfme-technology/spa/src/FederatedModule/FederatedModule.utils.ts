import React from 'react';
import ReactDOM from 'react-dom';
import type { MfeType } from './FederatedModule.types';

// Keep track of loaded script/css resources globally to prevent duplicates
export const loadedScripts = new Set<string>();
export const loadedStylesheets = new Set<string>();
const pendingScripts = new Map<string, Promise<void>>();
const pendingStylesheets = new Map<string, Promise<void>>();

export const registerShare = (name: string, version: string, module: any, from = '@bfme-technology/spa') => {
  const win = window as any;
  if (!win.__webpack_share_scopes__) {
    win.__webpack_share_scopes__ = {};
  }
  if (!win.__webpack_share_scopes__.default) {
    win.__webpack_share_scopes__.default = {};
  }

  const defaultScope = win.__webpack_share_scopes__.default;

  if (!defaultScope[name]) {
    defaultScope[name] = {
      [version]: {
        get: () => Promise.resolve(() => module),
        loaded: 1,
        from,
      },
    };
  }
};

export const initHostShareScopes = () => {
  const win = window as any;
  
  win.React = React;
  win.ReactDOM = ReactDOM;

  registerShare('react', '19.2.6', React);
  registerShare('react-dom', '19.2.6', ReactDOM);
};

// Helper: Dynamically load a script
export const loadScript = (url: string, mfeType: MfeType): Promise<void> => {
  if (loadedScripts.has(url)) return Promise.resolve();
  if (pendingScripts.has(url)) return pendingScripts.get(url)!;

  const existingScript = document.querySelector(`script[src="${url}"]`);
  if (existingScript) {
    loadedScripts.add(url);
    return Promise.resolve();
  }

  const loadPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.type = mfeType === 'federated' ? 'module' : 'text/javascript';

    script.onload = () => {
      loadedScripts.add(url);
      pendingScripts.delete(url);
      resolve();
    };

    script.onerror = () => {
      pendingScripts.delete(url);
      reject(new Error(`Failed to load script: ${url}`));
    };

    document.body.appendChild(script);
  });

  pendingScripts.set(url, loadPromise);
  return loadPromise;
};

// Helper: Dynamically load a stylesheet
export const loadStylesheet = (url: string): Promise<void> => {
  if (loadedStylesheets.has(url)) return Promise.resolve();
  if (pendingStylesheets.has(url)) return pendingStylesheets.get(url)!;

  const existingLink = document.querySelector(`link[href="${url}"]`);
  if (existingLink) {
    loadedStylesheets.add(url);
    return Promise.resolve();
  }

  const loadPromise = new Promise<void>((resolve) => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => {
      loadedStylesheets.add(url);
      pendingStylesheets.delete(url);
      resolve();
    };
    link.onerror = () => {
      console.warn(`Failed to load stylesheet: ${url}`);
      pendingStylesheets.delete(url);
      resolve();
    };

    document.head.appendChild(link);
  });

  pendingStylesheets.set(url, loadPromise);
  return loadPromise;
};
