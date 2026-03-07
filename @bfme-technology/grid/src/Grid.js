import React, { useEffect, useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { createGridConfig } from "./gridConfig.js";
import Pagination from "./Pagination.js";
import { gridContainerClass, gridWrapperClass } from "./styles.js";

import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

const getSystemTheme = () => {
  if (typeof window === "undefined") return "light";

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const getResolvedTheme = (themeMode) => {
  if (themeMode === "light" || themeMode === "dark") {
    return themeMode;
  }

  if (typeof document !== "undefined") {
    const rootHasDarkClass = document.documentElement.classList.contains("dark");
    if (rootHasDarkClass) {
      return "dark";
    }
  }

  return getSystemTheme();
};

const stripAgThemeClasses = (value) =>
  typeof value === "string"
    ? value.replace(/\bag-theme-[^\s]+\b/g, "").replace(/\s+/g, " ").trim()
    : "";

const getThemeCssVariables = (resolvedTheme) => {
  if (resolvedTheme !== "dark") {
    return {
      "--ag-background-color": "#ffffff",
      "--ag-foreground-color": "#0f172a",
      "--ag-header-background-color": "#f8fafc",
      "--ag-header-foreground-color": "#0f172a",
      "--ag-odd-row-background-color": "#ffffff",
      "--ag-border-color": "#e2e8f0",
      "--ag-row-border-color": "#e2e8f0",
      "--ag-selected-row-background-color": "rgba(99, 102, 241, 0.12)",
      "--ag-hover-color": "rgba(99, 102, 241, 0.08)",
      "--ag-input-border-color": "#cbd5e1",
    };
  }

  return {
    "--ag-background-color": "#0f172a",
    "--ag-foreground-color": "#e2e8f0",
    "--ag-header-background-color": "#1e293b",
    "--ag-header-foreground-color": "#f1f5f9",
    "--ag-odd-row-background-color": "#111827",
    "--ag-border-color": "#334155",
    "--ag-row-border-color": "#334155",
    "--ag-selected-row-background-color": "rgba(99, 102, 241, 0.22)",
    "--ag-hover-color": "rgba(148, 163, 184, 0.12)",
    "--ag-input-border-color": "#475569",
  };
};

const Grid = (props) => {
  const {
    paginatorInfo,
    onPageChange,
    onPageSizeChange,
    paginationPageSize,
    containerClassName,
    containerStyle,
    themeMode = "auto",
  } = props;

  const [resolvedTheme, setResolvedTheme] = useState(() =>
    getResolvedTheme(themeMode),
  );

  useEffect(() => {
    setResolvedTheme(getResolvedTheme(themeMode));

    if (themeMode !== "auto" || typeof window === "undefined") {
      return;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleThemeChange = () => setResolvedTheme(getResolvedTheme("auto"));

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleThemeChange);
    } else if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleThemeChange);
    }

    let observer;
    if (typeof MutationObserver !== "undefined" && typeof document !== "undefined") {
      observer = new MutationObserver(handleThemeChange);
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
    }

    return () => {
      if (typeof mediaQuery.removeEventListener === "function") {
        mediaQuery.removeEventListener("change", handleThemeChange);
      } else if (typeof mediaQuery.removeListener === "function") {
        mediaQuery.removeListener(handleThemeChange);
      }

      if (observer) {
        observer.disconnect();
      }
    };
  }, [themeMode]);

  const gridProps = createGridConfig({
    ...props,
    rowData: Array.isArray(props?.rowData) ? props.rowData : [],
  });

  const agThemeClassName = useMemo(
    () => (resolvedTheme === "dark" ? "ag-theme-alpine-dark" : "ag-theme-alpine"),
    [resolvedTheme],
  );

  const sanitizedContainerClassName = stripAgThemeClasses(containerClassName);

  const mergedContainerClassName = sanitizedContainerClassName
    ? `${gridContainerClass} ${agThemeClassName} ${sanitizedContainerClassName}`
    : `${gridContainerClass} ${agThemeClassName}`;

  const mergedContainerStyle = {
    ...getThemeCssVariables(resolvedTheme),
    ...(containerStyle || {}),
  };

  return React.createElement(
    "div",
    { className: gridWrapperClass },
    React.createElement(
      "div",
      { className: mergedContainerClassName, style: mergedContainerStyle },
      React.createElement(AgGridReact, { ...gridProps }),
    ),
    paginatorInfo
      ? React.createElement(Pagination, {
          paginatorInfo,
          paginationPageSize,
          onPageChange,
          onPageSizeChange,
        })
      : null,
  );
};

export default Grid;
