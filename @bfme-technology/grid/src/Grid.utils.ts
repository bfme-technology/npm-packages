import type { ColumnDef, ThemeMode } from "./Grid.types";

export const getSystemTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
};

export const getResolvedTheme = (themeMode?: ThemeMode): "light" | "dark" => {
  if (themeMode === "light" || themeMode === "dark") {
    return themeMode;
  }
  if (typeof document !== "undefined") {
    if (
      document.documentElement.classList.contains("dark") ||
      document.documentElement.getAttribute("data-theme") === "dark"
    ) {
      return "dark";
    }
  }
  return getSystemTheme();
};

export const getThemeCssVariables = (resolvedTheme: "light" | "dark"): Record<string, string> => {
  // Let the host application provide these CSS variables globally
  return {};
};

export const renderCell = (col: ColumnDef, row: any, index: number): any => {
  if (!col) return "";
  const value = row ? row[col.field || ""] : undefined;
  if (col.cellRenderer) {
    const CellRenderer = col.cellRenderer;
    if (typeof CellRenderer === "function") {
      return CellRenderer({
        value,
        data: row,
        node: { id: index },
        ...(col.cellRendererParams || {}),
      });
    }
  }
  return value !== undefined && value !== null ? String(value) : "";
};
