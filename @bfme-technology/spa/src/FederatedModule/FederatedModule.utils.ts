import React from 'react';
import ReactDOM from 'react-dom';
import type { MfeType } from './FederatedModule.types';

// Keep track of loaded script/css resources globally to prevent duplicates
export const loadedScripts = new Set<string>();
export const loadedStylesheets = new Set<string>();
export const initHostShareScopes = () => {
  const win = window as any;
  
  win.React = React;
  win.ReactDOM = ReactDOM;

  if (!win.__webpack_share_scopes__) {
    win.__webpack_share_scopes__ = {};
  }
  if (!win.__webpack_share_scopes__.default) {
    win.__webpack_share_scopes__.default = {};
  }

  const defaultScope = win.__webpack_share_scopes__.default;

  const registerShare = (name: string, version: string, module: any) => {
    if (!defaultScope[name]) {
      defaultScope[name] = {
        [version]: {
          get: () => Promise.resolve(() => module),
          loaded: 1,
          from: '@bfme-technology/spa',
        },
      };
    }
  };

  registerShare('react', '19.2.6', React);
  registerShare('react-dom', '19.2.6', ReactDOM);
};

// Helper: Dynamically load a script
export const loadScript = (url: string, mfeType: MfeType): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has(url)) {
      resolve();
      return;
    }

    // Check if already in DOM
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      loadedScripts.add(url);
      resolve();
      return;
    }

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.type = mfeType === 'federated' ? 'module' : 'text/javascript';

    script.onload = () => {
      loadedScripts.add(url);
      resolve();
    };

    script.onerror = () => {
      reject(new Error(`Failed to load script: ${url}`));
    };

    document.body.appendChild(script);
  });
};

// Helper: Dynamically load a stylesheet
export const loadStylesheet = (url: string): Promise<void> => {
  return new Promise((resolve) => {
    if (loadedStylesheets.has(url)) {
      resolve();
      return;
    }

    const existingLink = document.querySelector(`link[href="${url}"]`);
    if (existingLink) {
      loadedStylesheets.add(url);
      resolve();
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = url;
    link.onload = () => {
      loadedStylesheets.add(url);
      resolve();
    };
    link.onerror = () => {
      console.warn(`Failed to load stylesheet: ${url}`);
      resolve();
    };

    document.head.appendChild(link);
  });
};
