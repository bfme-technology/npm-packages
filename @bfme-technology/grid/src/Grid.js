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

  const mergedContainerClassName =
    typeof containerClassName === "string" && containerClassName.trim().length
      ? `${gridContainerClass} ${agThemeClassName} ${containerClassName}`
      : `${gridContainerClass} ${agThemeClassName}`;

  return (
    <div className={gridWrapperClass}>
      <div className={mergedContainerClassName} style={containerStyle}>
        <AgGridReact {...gridProps} />
      </div>

      {paginatorInfo ? (
        <Pagination
          paginatorInfo={paginatorInfo}
          paginationPageSize={paginationPageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      ) : null}
    </div>
  );
};

export default Grid;
