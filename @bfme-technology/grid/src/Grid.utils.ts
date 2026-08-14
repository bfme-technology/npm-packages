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
    if (document.documentElement.classList.contains("dark")) {
      return "dark";
    }
  }
  return getSystemTheme();
};

export const getThemeCssVariables = (resolvedTheme: "light" | "dark"): Record<string, string> => {
  if (resolvedTheme === "dark") {
    return {
      "--bg-surface": "#1e293b",
      "--bg-deep": "#0f172a",
      "--bg-elevated": "#334155",
      "--border-color": "#475569",
      "--text-primary": "#f1f5f9",
      "--text-secondary": "#cbd5e1",
      "--text-muted": "#94a3b8",
      "--primary-accent": "#6366f1",
    };
  }
  return {
    "--bg-surface": "#ffffff",
    "--bg-deep": "#f8fafc",
    "--bg-elevated": "#f1f5f9",
    "--border-color": "#e2e8f0",
    "--text-primary": "#0f172a",
    "--text-secondary": "#475569",
    "--text-muted": "#64748b",
    "--primary-accent": "#4f46e5",
  };
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
