// src/focusAreaLoadElement.tsx
import React, { Profiler, useCallback, useEffect, useMemo, useRef, useState } from "react";
var parseThreshold = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};
var getPerformanceLevel = (mountDurationMs, thresholdConfig) => {
  if (mountDurationMs === null) return "measuring";
  if (mountDurationMs < thresholdConfig.warningMs) return "good";
  if (mountDurationMs < thresholdConfig.slowMs) return "warning";
  return "slow";
};
var getPerformanceLabel = (performanceLevel) => {
  if (performanceLevel === "good") return "Good";
  if (performanceLevel === "warning") return "Warning";
  if (performanceLevel === "slow") return "Slow";
  return "Measuring";
};
var tones = {
  good: {
    badge: { border: "1px solid #6ee7b7", background: "#d1fae5", color: "#065f46" },
    tooltip: { border: "1px solid #6ee7b7", background: "#ecfdf5", color: "#064e3b" }
  },
  warning: {
    badge: { border: "1px solid #fcd34d", background: "#fef3c7", color: "#92400e" },
    tooltip: { border: "1px solid #fcd34d", background: "#fffbeb", color: "#78350f" }
  },
  slow: {
    badge: { border: "1px solid #fda4af", background: "#ffe4e6", color: "#9f1239" },
    tooltip: { border: "1px solid #fda4af", background: "#fff1f2", color: "#881337" }
  },
  measuring: {
    badge: { border: "1px solid #a5b4fc", background: "#e0e7ff", color: "#3730a3" },
    tooltip: { border: "1px solid #cbd5e1", background: "#ffffff", color: "#334155" }
  }
};
var styles = {
  container: { position: "relative" },
  overlay: { position: "absolute", right: "0.5rem", top: "0.5rem", zIndex: 70 },
  badge: {
    height: "1.25rem",
    minWidth: "1.25rem",
    borderRadius: "9999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 0.375rem",
    fontSize: "10px",
    fontWeight: 600,
    lineHeight: 1,
    cursor: "default"
  },
  tooltip: {
    position: "absolute",
    right: 0,
    top: "1.5rem",
    width: "18rem",
    maxWidth: "18rem",
    borderRadius: "0.375rem",
    padding: "0.25rem 0.5rem",
    fontSize: "11px",
    fontWeight: 500,
    boxShadow: "0 1px 2px rgba(0,0,0,0.08)",
    display: "none",
    whiteSpace: "normal",
    overflowWrap: "anywhere",
    wordBreak: "break-word",
    lineHeight: 1.35
  }
};
var FocusAreaLoadElement = ({ areaName, children }) => {
  const [mountDurationMs, setMountDurationMs] = useState(null);
  const [isHovering, setIsHovering] = useState(false);
  const hasCapturedMount = useRef(false);
  const mountStartRef = useRef(
    typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now()
  );
  const isFalEnabled = useMemo(() => {
    if (typeof window === "undefined") return false;
    const searchParams = new URLSearchParams(window.location.search);
    const hashQuery = window.location.hash.includes("?") ? window.location.hash.slice(window.location.hash.indexOf("?")) : "";
    const hashParams = new URLSearchParams(hashQuery);
    const getParamValue = (key) => {
      if (searchParams.has(key)) {
        return searchParams.get(key);
      }
      if (hashParams.has(key)) {
        return hashParams.get(key);
      }
      return null;
    };
    const hasParam = (key) => searchParams.has(key) || hashParams.has(key);
    const showFalParam = (getParamValue("showfal") ?? getParamValue("showFAL") ?? getParamValue("showFal") ?? "").trim().toLowerCase();
    const hasFlag = hasParam("showfal") || hasParam("showFAL") || hasParam("showFal");
    return hasFlag && ["", "1", "true", "yes", "on"].includes(showFalParam);
  }, []);
  useEffect(() => {
    if (!isFalEnabled || hasCapturedMount.current) {
      return;
    }
    const resolveNow = () => typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() : Date.now();
    const finalizeDuration = () => {
      if (hasCapturedMount.current) {
        return;
      }
      const duration = Math.max(0, resolveNow() - mountStartRef.current);
      hasCapturedMount.current = true;
      setMountDurationMs(Number(duration.toFixed(2)));
    };
    const rafId = typeof requestAnimationFrame === "function" ? requestAnimationFrame(finalizeDuration) : null;
    const timeoutId = setTimeout(finalizeDuration, 120);
    return () => {
      if (rafId !== null && typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(rafId);
      }
      clearTimeout(timeoutId);
    };
  }, [isFalEnabled]);
  const thresholdConfig = useMemo(() => {
    const env = typeof process !== "undefined" ? process.env : void 0;
    const warningMs = parseThreshold(env?.VITE_FAL_WARNING_MS, 16);
    const slowMsRaw = parseThreshold(env?.VITE_FAL_SLOW_MS, 50);
    return { warningMs, slowMs: slowMsRaw > warningMs ? slowMsRaw : warningMs + 1 };
  }, []);
  const onRender = useCallback(
    (id, phase, actualDuration, baseDuration, startTime, commitTime) => {
      if (!isFalEnabled) return;
      if (phase === "mount") {
        hasCapturedMount.current = true;
        setMountDurationMs(Number(actualDuration.toFixed(2)));
      }
      console.info("[BusinessPage][Performance]", {
        focusArea: id,
        phase,
        actualDurationMs: Number(actualDuration.toFixed(2)),
        baseDurationMs: Number(baseDuration.toFixed(2)),
        startTimeMs: Number(startTime.toFixed(2)),
        commitTimeMs: Number(commitTime.toFixed(2))
      });
    },
    [isFalEnabled]
  );
  const currentElapsedMs = typeof performance !== "undefined" && typeof performance.now === "function" ? performance.now() - mountStartRef.current : Date.now() - mountStartRef.current;
  const effectiveDurationMs = mountDurationMs ?? Math.max(0, Number(currentElapsedMs.toFixed(2)));
  const tooltipLabel = `${areaName} load: ${effectiveDurationMs.toFixed(2)} ms`;
  const performanceLevel = getPerformanceLevel(effectiveDurationMs, thresholdConfig);
  const performanceLabel = getPerformanceLabel(performanceLevel);
  const tooltipWithThresholds = `${tooltipLabel} \xB7 ${performanceLabel} (good < ${thresholdConfig.warningMs}ms, slow \u2265 ${thresholdConfig.slowMs}ms)`;
  const mountDurationLabel = `${effectiveDurationMs.toFixed(0)}ms`;
  const tone = tones[performanceLevel];
  return React.createElement(
    "div",
    { style: styles.container },
    isFalEnabled ? React.createElement(
      "div",
      { style: styles.overlay },
      React.createElement(
        "div",
        {
          onMouseEnter: () => setIsHovering(true),
          onMouseLeave: () => setIsHovering(false),
          onFocus: () => setIsHovering(true),
          onBlur: () => setIsHovering(false)
        },
        React.createElement(
          "span",
          {
            "aria-label": tooltipLabel,
            title: tooltipLabel,
            tabIndex: 0,
            style: { ...styles.badge, ...tone.badge }
          },
          mountDurationLabel
        ),
        React.createElement(
          "div",
          {
            style: {
              ...styles.tooltip,
              ...tone.tooltip,
              display: isHovering ? "block" : "none"
            }
          },
          tooltipWithThresholds
        )
      )
    ) : null,
    React.createElement(Profiler, { id: areaName, onRender }, children)
  );
};
var focusAreaLoadElement_default = FocusAreaLoadElement;

// src/FederatedModule/FederatedModule.hook.ts
import { useEffect as useEffect2, useRef as useRef2, useState as useState2 } from "react";

// src/FederatedModule/FederatedModule.utils.ts
import React2 from "react";
import ReactDOM from "react-dom";
var loadedScripts = /* @__PURE__ */ new Set();
var loadedStylesheets = /* @__PURE__ */ new Set();
var initHostShareScopes = () => {
  const win = window;
  win.React = React2;
  win.ReactDOM = ReactDOM;
  if (!win.__webpack_share_scopes__) {
    win.__webpack_share_scopes__ = {};
  }
  if (!win.__webpack_share_scopes__.default) {
    win.__webpack_share_scopes__.default = {};
  }
  const defaultScope = win.__webpack_share_scopes__.default;
  const registerShare = (name, version, module) => {
    if (!defaultScope[name]) {
      defaultScope[name] = {
        [version]: {
          get: () => Promise.resolve(() => module),
          loaded: 1,
          from: "@bfme-technology/spa"
        }
      };
    }
  };
  registerShare("react", "19.2.6", React2);
  registerShare("react-dom", "19.2.6", ReactDOM);
};
var loadScript = (url, mfeType) => {
  return new Promise((resolve, reject) => {
    if (loadedScripts.has(url)) {
      resolve();
      return;
    }
    const existingScript = document.querySelector(`script[src="${url}"]`);
    if (existingScript) {
      loadedScripts.add(url);
      resolve();
      return;
    }
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.type = mfeType === "federated" ? "module" : "text/javascript";
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
var loadStylesheet = (url) => {
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
    const link = document.createElement("link");
    link.rel = "stylesheet";
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

// src/FederatedModule/FederatedModule.hook.ts
var registerMockAngularMfe = () => {
  if (!customElements.get("angular-investing-mfe")) {
    class MockAngularMfe extends HTMLElement {
      connectedCallback() {
        this.innerHTML = `<div style="padding: 20px; border: 2px dashed #e11d48; border-radius: 8px;">
          <h3 style="color: #e11d48; margin-top: 0;">Angular Investing MFE (Mock)</h3>
          <p>The actual angular app failed to load or is not served. This is a mock fallback.</p>
        </div>`;
      }
    }
    customElements.define("angular-investing-mfe", MockAngularMfe);
  }
};
var useMfeLoader = (props) => {
  const containerRef = useRef2(null);
  const customElementRef = useRef2(null);
  const [status, setStatus] = useState2("idle");
  const [FederatedComponent, setFederatedComponent] = useState2(null);
  const [config, setConfig] = useState2(null);
  useEffect2(() => {
    let active = true;
    const resolveConfig = async () => {
      if (!props.mfeKey && props.mfeType) {
        if (active) setConfig(props);
        return;
      }
      if (!props.mfeKey) {
        console.error("FederatedModule requires either an mfeKey or explicit mfeType config.");
        if (active) setStatus("error");
        return;
      }
      const mergeConfig = (fetched) => {
        const explicitOverrides = {};
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
      try {
        const overridesStr = localStorage.getItem("mfeOverrides");
        if (overridesStr) {
          const overrides = JSON.parse(overridesStr);
          if (overrides[props.mfeKey]) {
            console.log(`[FederatedModule] Using local override for ${props.mfeKey}`);
            if (active) setConfig(mergeConfig(overrides[props.mfeKey]));
            return;
          }
        }
      } catch (e) {
        console.warn("Failed to parse mfeOverrides from localStorage", e);
      }
      const win = window;
      if (win.federatedRoutes && Array.isArray(win.federatedRoutes)) {
        const route = win.federatedRoutes.find((r) => r.key === props.mfeKey);
        if (route) {
          if (active) setConfig(mergeConfig(route));
          return;
        }
      }
      try {
        const res = await fetch("/federatedRoutes.json");
        if (res.ok) {
          const routes = await res.json();
          win.federatedRoutes = routes;
          const route = routes.find((r) => r.key === props.mfeKey);
          if (route) {
            if (active) setConfig(mergeConfig(route));
            return;
          }
        }
      } catch (e) {
        console.error("Failed to fetch /federatedRoutes.json", e);
      }
      console.error(`[FederatedModule] Could not resolve configuration for key: ${props.mfeKey}`);
      if (active) setStatus("error");
    };
    resolveConfig();
    return () => {
      active = false;
    };
  }, [props.mfeKey, props.mfeType]);
  useEffect2(() => {
    if (!config || status === "error") return;
    let active = true;
    const currentContainer = containerRef.current;
    setStatus("loading");
    const initializeMfe = async () => {
      try {
        const { mfeType, scriptUrl, cssUrl, elementName, bootstrapFnName, scope, module: mfeModule } = config;
        initHostShareScopes();
        const bustedCssUrl = cssUrl ? `${cssUrl}${cssUrl.includes("?") ? "&" : "?"}t=${Date.now()}` : void 0;
        const bustedScriptUrl = scriptUrl ? `${scriptUrl}${scriptUrl.includes("?") ? "&" : "?"}t=${Date.now()}` : void 0;
        if (bustedCssUrl) await loadStylesheet(bustedCssUrl);
        if (bustedScriptUrl && mfeType !== "federated") {
          await loadScript(bustedScriptUrl, mfeType);
        }
        if (!active) return;
        if (mfeType === "federated") {
          if (!scope || !mfeModule) throw new Error("Scope and Module are required for federated MFE.");
          let container;
          const win = window;
          if (win[scope]) {
            container = win[scope];
          } else if (bustedScriptUrl) {
            try {
              container = await import(
                /* @vite-ignore */
                bustedScriptUrl
              );
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
            setStatus("success");
          } else {
            throw new Error(`Federation remote container "${scope}" not found.`);
          }
        } else if (mfeType === "custom-element") {
          if (!elementName) throw new Error("elementName is required for custom-element MFE.");
          if (elementName === "angular-investing-mfe" && !bustedScriptUrl) {
            registerMockAngularMfe();
          }
          setStatus("success");
        } else if (mfeType === "global-bootstrap") {
          if (!bootstrapFnName) throw new Error("bootstrapFnName is required for global-bootstrap MFE.");
          const win = window;
          const bootstrapFn = win[bootstrapFnName];
          if (typeof bootstrapFn !== "function") throw new Error(`Global bootstrap function "${bootstrapFnName}" not found.`);
          if (currentContainer) {
            bootstrapFn(currentContainer, props.mfeProps || {});
            setStatus("success");
          } else {
            throw new Error("Container element not ready for bootstrapping.");
          }
        }
      } catch (err) {
        console.error("FederatedModule loading error:", err);
        if (active) setStatus("error");
      }
    };
    initializeMfe();
    return () => {
      active = false;
      if (config.mfeType === "global-bootstrap" && config.unmountFnName) {
        const win = window;
        const unmountFn = win[config.unmountFnName];
        if (typeof unmountFn === "function" && currentContainer) {
          try {
            unmountFn(currentContainer);
          } catch (err) {
          }
        }
      }
    };
  }, [config]);
  useEffect2(() => {
    if (status !== "success" || !config) return;
    if (config.mfeType === "custom-element" && customElementRef.current) {
      const el = customElementRef.current;
      const mergedProps = { ...config.mfeProps || {}, ...props.mfeProps || {} };
      Object.keys(mergedProps).forEach((key) => {
        el[key] = mergedProps[key];
      });
    } else if (config.mfeType === "global-bootstrap" && config.bootstrapFnName) {
      const win = window;
      const bootstrapFn = win[config.bootstrapFnName];
      if (typeof bootstrapFn === "function" && containerRef.current) {
        try {
          bootstrapFn(containerRef.current, props.mfeProps || {});
        } catch (e) {
        }
      }
    }
  }, [props.mfeProps, status, config]);
  return { status, FederatedComponent, containerRef, customElementRef, config };
};

// src/FederatedModule/FederatedModule.styles.ts
var spinnerStyle = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px",
    margin: "20px 0",
    minHeight: "200px",
    width: "100%"
  },
  spinner: {
    width: "36px",
    height: "36px",
    borderRadius: "50%",
    border: "3px solid rgba(255, 255, 255, 0.1)",
    borderTopColor: "#0df",
    animation: "spin 1s linear infinite"
  }
};
var errorStyle = {
  container: {
    padding: "24px",
    borderLeft: "4px solid #ef4444",
    margin: "20px 0",
    width: "100%"
  }
};
var injectKeyframes = () => {
  if (typeof document !== "undefined") {
    const styleId = "mfe-container-spinner-css";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.appendChild(
        document.createTextNode(`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `)
      );
      document.head.appendChild(style);
    }
  }
};

// src/FederatedModule/FederatedModule.tsx
import { Fragment, jsx, jsxs } from "react/jsx-runtime";
injectKeyframes();
var FederatedModule = (props) => {
  const {
    mfeProps = {},
    loadingFallback,
    errorFallback
  } = props;
  const { status, FederatedComponent, containerRef, customElementRef, config } = useMfeLoader(props);
  const defaultLoading = /* @__PURE__ */ jsxs("div", { style: spinnerStyle.container, className: "glass-panel", children: [
    /* @__PURE__ */ jsx("div", { style: spinnerStyle.spinner }),
    /* @__PURE__ */ jsx("p", { style: { marginTop: "12px", color: "#94a3b8" }, children: "Loading micro frontend..." })
  ] });
  const defaultError = /* @__PURE__ */ jsxs("div", { style: errorStyle.container, className: "glass-panel", children: [
    /* @__PURE__ */ jsx("h4", { style: { color: "#ef4444", marginBottom: "8px" }, children: "Micro Frontend Error" }),
    /* @__PURE__ */ jsx("p", { style: { color: "#94a3b8", fontSize: "14px" }, children: "Failed to load or initialize the requested MFE. Please check connectivity or configurations." })
  ] });
  if (status === "loading") {
    return /* @__PURE__ */ jsx(Fragment, { children: loadingFallback || defaultLoading });
  }
  if (status === "error") {
    return /* @__PURE__ */ jsx(Fragment, { children: errorFallback || defaultError });
  }
  if (!config) {
    return null;
  }
  if (config.mfeType === "global-bootstrap") {
    return /* @__PURE__ */ jsx("div", { style: { width: "100%", height: "100%" }, children: /* @__PURE__ */ jsx("div", { ref: containerRef, style: { display: status === "success" ? "block" : "none", width: "100%", height: "100%" } }) });
  }
  if (status === "success") {
    const finalProps = { ...config.mfeProps || {}, ...mfeProps || {} };
    if (config.mfeType === "federated" && FederatedComponent) {
      return /* @__PURE__ */ jsx(FederatedComponent, { ...finalProps });
    }
    if (config.mfeType === "custom-element" && config.elementName) {
      const TagName = config.elementName;
      return /* @__PURE__ */ jsx("div", { ref: containerRef, children: /* @__PURE__ */ jsx(TagName, { ref: customElementRef, ...finalProps }) });
    }
  }
  return null;
};
var FederatedModule_default = FederatedModule;
export {
  FederatedModule_default as FederatedModule,
  focusAreaLoadElement_default as FocusAreaLoadElement
};
//# sourceMappingURL=index.js.map