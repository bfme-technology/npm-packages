import React from 'react';
import type { FederatedModuleProps } from './FederatedModule.types';
import { useMfeLoader } from './FederatedModule.hook';
import { spinnerStyle, errorStyle, injectKeyframes } from './FederatedModule.styles';

// Inject keyframe animations for the loader
injectKeyframes();

export const FederatedModule: React.FC<FederatedModuleProps> = (props) => {
  const {
    
    
    mfeProps = {},
    loadingFallback,
    errorFallback,
  } = props;

  const { status, FederatedComponent, containerRef, customElementRef, config } = useMfeLoader(props);

  // Default Loading View
  const defaultLoading = (
    <div style={spinnerStyle.container} className="glass-panel">
      <div style={spinnerStyle.spinner}></div>
      <p style={{ marginTop: '12px', color: '#94a3b8' }}>Loading micro frontend...</p>
    </div>
  );

  // Default Error View
  const defaultError = (
    <div style={errorStyle.container} className="glass-panel">
      <h4 style={{ color: '#ef4444', marginBottom: '8px' }}>Micro Frontend Error</h4>
      <p style={{ color: '#94a3b8', fontSize: '14px' }}>
        Failed to load or initialize the requested MFE. Please check connectivity or configurations.
      </p>
    </div>
  );

  // Status checks first (before config check, as config is fetched async if mfeKey is used)
  if (status === 'loading') {
    return <>{loadingFallback || defaultLoading}</>;
  }

  if (status === 'error') {
    return <>{errorFallback || defaultError}</>;
  }

  // If no config is resolved yet but status is idle, we can render nothing or loading
  if (!config) {
    return null;
  }

  if (config.mfeType === 'global-bootstrap') {
    return (
      <div style={{ width: '100%', height: '100%' }}>
        <div ref={containerRef} style={{ display: status === 'success' ? 'block' : 'none', width: '100%', height: '100%' }} />
      </div>
    );
  }

  if (status === 'success') {
    const finalProps = { ...(config.mfeProps || {}), ...(mfeProps || {}) };

    if (config.mfeType === 'federated' && FederatedComponent) {
      return <FederatedComponent {...finalProps} />;
    }

    if (config.mfeType === 'custom-element' && config.elementName) {
      const TagName = config.elementName as any;
      return (
        <div ref={containerRef}>
          <TagName ref={customElementRef} {...finalProps} />
        </div>
      );
    }
  }

  return null;
};
export default FederatedModule;
