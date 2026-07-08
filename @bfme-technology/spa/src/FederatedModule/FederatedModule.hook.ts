import React, { useEffect, useRef, useState } from 'react';
import type { FederatedModuleProps, MfeStatus, MfeRouteConfig } from './FederatedModule.types';
import { loadScript, loadStylesheet, initHostShareScopes } from './FederatedModule.utils';

// Global mock register placeholder for custom-element
const registerMockAngularMfe = () => {
  if (!customElements.get('angular-investing-mfe')) {
    class MockAngularMfe extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `<div style="padding: 20px; border: 2px dashed #e11d48; border-radius: 8px;">
          <h3 style="color: #e11d48; margin-top: 0;">Angular Investing MFE (Mock)</h3>
          <p>The actual angular app failed to load or is not served. This is a mock fallback.</p>
        </div>`;
      }
    }
    customElements.define('angular-investing-mfe', MockAngularMfe);
  }
};

export const useMfeLoader = (props: FederatedModuleProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const customElementRef = useRef<HTMLElement>(null);
  const [status, setStatus] = useState<MfeStatus>('idle');
  const [FederatedComponent, setFederatedComponent] = useState<React.ComponentType<any> | null>(null);
  const [config, setConfig] = useState<MfeRouteConfig | null>(null);

  // 1. Resolve configuration
  useEffect(() => {
    let active = true;
    
    const resolveConfig = async () => {
      // If direct props are provided instead of mfeKey, use them
      if (!props.mfeKey && props.mfeType) {
        if (active) setConfig(props as MfeRouteConfig);
        return;
      }

      if (!props.mfeKey) {
        console.error('FederatedModule requires either an mfeKey or explicit mfeType config.');
        if (active) setStatus('error');
        return;
      }

      const mergeConfig = (fetched: any) => {
        // Only override things explicitly provided in props (excluding mfeKey and mfeProps which are handled separately)
        const explicitOverrides: any = {};
        if (props.mfeType) explicitOverrides.mfeType = props.mfeType;
        if (props.scope) explicitOverrides.scope = props.scope;
        if (props.module) explicitOverrides.module = props.module;
        if (props.scriptUrl) explicitOverrides.scriptUrl = props.scriptUrl;
        if (props.cssUrl) explicitOverrides.cssUrl = props.cssUrl;
        if (props.elementName) explicitOverrides.elementName = props.elementName;
        if (props.bootstrapFnName) explicitOverrides.bootstrapFnName = props.bootstrapFnName;
        if (props.unmountFnName) explicitOverrides.unmountFnName = props.unmountFnName;
        
        return { ...fetched, ...explicitOverrides, key: props.mfeKey };
      };

      // Check for localStorage overrides (e.g. from workbench)
      try {
        const overridesStr = localStorage.getItem('mfeOverrides');
        if (overridesStr) {
          const overrides = JSON.parse(overridesStr);
          if (overrides[props.mfeKey]) {
            console.log(`[FederatedModule] Using local override for ${props.mfeKey}`);
            if (active) setConfig(mergeConfig(overrides[props.mfeKey]));
            return;
          }
        }
      } catch (e) {
        console.warn('Failed to parse mfeOverrides from localStorage', e);
      }

      // Check global window object
      const win = window as any;
      if (win.federatedRoutes && Array.isArray(win.federatedRoutes)) {
        const route = win.federatedRoutes.find((r: MfeRouteConfig) => r.key === props.mfeKey);
        if (route) {
          if (active) setConfig(mergeConfig(route));
          return;
        }
      }

      // Fallback: fetch from server
      try {
        const res = await fetch('/federatedRoutes.json');
        if (res.ok) {
          const routes = await res.json();
          win.federatedRoutes = routes; // Cache globally
          const route = routes.find((r: MfeRouteConfig) => r.key === props.mfeKey);
          if (route) {
            if (active) setConfig(mergeConfig(route));
            return;
          }
        }
      } catch (e) {
        console.error('Failed to fetch /federatedRoutes.json', e);
      }

      console.error(`[FederatedModule] Could not resolve configuration for key: ${props.mfeKey}`);
      if (active) setStatus('error');
    };

    resolveConfig();

    return () => { active = false; };
  }, [props.mfeKey, props.mfeType]); // simplified dependencies

  // 2. Load and mount based on resolved config
  useEffect(() => {
    if (!config || status === 'error') return;

    let active = true;
    const currentContainer = containerRef.current;
    setStatus('loading');

    const initializeMfe = async () => {
      try {
        const { mfeType, scriptUrl, cssUrl, elementName, bootstrapFnName, scope, module: mfeModule } = config;

        initHostShareScopes();

        const bustedCssUrl = cssUrl ? `${cssUrl}${cssUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : undefined;
        const bustedScriptUrl = scriptUrl ? `${scriptUrl}${scriptUrl.includes('?') ? '&' : '?'}t=${Date.now()}` : undefined;

        if (bustedCssUrl) await loadStylesheet(bustedCssUrl);
        if (bustedScriptUrl && mfeType !== 'federated') {
          await loadScript(bustedScriptUrl, mfeType);
        }

        if (!active) return;

        if (mfeType === 'federated') {
          if (!scope || !mfeModule) throw new Error('Scope and Module are required for federated MFE.');
          
          let container;
          const win = window as any;
          if (win[scope]) {
            container = win[scope];
          } else if (bustedScriptUrl) {
            try {
              container = await import(/* @vite-ignore */ bustedScriptUrl);
            } catch (importErr) {
              console.error(`Failed to dynamically import federated MFE from "${bustedScriptUrl}":`, importErr);
            }
          }

          if (container) {
            const shareScopes = win.__webpack_share_scopes__ || {};
            const defaultScope = shareScopes.default || {};
            await container.init(defaultScope);
            
            const factory = await container.get(mfeModule);
            const Module = factory();
            setFederatedComponent(() => Module.default || Module);
            setStatus('success');
          } else {
            throw new Error(`Federation remote container "${scope}" not found.`);
          }
        } 
        else if (mfeType === 'custom-element') {
          if (!elementName) throw new Error('elementName is required for custom-element MFE.');
          if (elementName === 'angular-investing-mfe' && !bustedScriptUrl) {
            registerMockAngularMfe();
          }
          setStatus('success');
        } 
        else if (mfeType === 'global-bootstrap') {
          if (!bootstrapFnName) throw new Error('bootstrapFnName is required for global-bootstrap MFE.');
          const win = window as any;
          const bootstrapFn = win[bootstrapFnName];
          if (typeof bootstrapFn !== 'function') throw new Error(`Global bootstrap function "${bootstrapFnName}" not found.`);
          
          if (currentContainer) {
            bootstrapFn(currentContainer, props.mfeProps || {});
            setStatus('success');
          } else {
            throw new Error('Container element not ready for bootstrapping.');
          }
        }
      } catch (err) {
        console.error('FederatedModule loading error:', err);
        if (active) setStatus('error');
      }
    };

    initializeMfe();

    return () => {
      active = false;
      if (config.mfeType === 'global-bootstrap' && config.unmountFnName) {
        const win = window as any;
        const unmountFn = win[config.unmountFnName];
        if (typeof unmountFn === 'function' && currentContainer) {
          try { unmountFn(currentContainer); } catch (err) {}
        }
      }
    };
  }, [config]);

  // 3. Handle prop updates
  useEffect(() => {
    if (status !== 'success' || !config) return;

    if (config.mfeType === 'custom-element' && customElementRef.current) {
      const el = customElementRef.current as any;
      const mergedProps = { ...(config.mfeProps || {}), ...(props.mfeProps || {}) };
      Object.keys(mergedProps).forEach((key) => { el[key] = mergedProps[key]; });
    } 
    else if (config.mfeType === 'global-bootstrap' && config.bootstrapFnName) {
      const win = window as any;
      const bootstrapFn = win[config.bootstrapFnName];
      if (typeof bootstrapFn === 'function' && containerRef.current) {
        try { bootstrapFn(containerRef.current, props.mfeProps || {}); } catch (e) {}
      }
    }
  }, [props.mfeProps, status, config]);

  return { status, FederatedComponent, containerRef, customElementRef, config };
};
