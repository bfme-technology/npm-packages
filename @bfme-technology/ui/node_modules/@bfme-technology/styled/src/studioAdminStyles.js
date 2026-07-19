export const layoutWrapperClass =
  "flex h-screen overflow-hidden bg-gray-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100";

export const getSidebarClass = ({ isCollapsed, isOpen }) =>
  [
    "fixed left-0 top-0 z-[1000] flex min-h-screen flex-col border-r border-slate-800 bg-slate-900 transition-all duration-300 md:relative",
    isCollapsed ? "md:w-20" : "md:w-[260px]",
    "w-[260px]",
    isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
  ].join(" ");

export const logoAdminClass = "h-auto max-w-[150px] transition-opacity duration-200";

export const navClass = "flex-1 p-4";

export const getLayoutNavLinkClass = ({ isActive }) =>
  [
    "mb-2 flex items-center rounded-lg border px-4 py-3 text-sm font-medium transition",
    isActive
      ? "border-indigo-400 bg-indigo-500 text-white"
      : "border-transparent text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white",
  ].join(" ");

export const navIconClass = "flex min-w-[25px] justify-center text-[1.05rem]";

export const navLinkTextClass = "ml-4 whitespace-nowrap opacity-100 transition-opacity";

export const layoutMainClass = "flex flex-1 flex-col overflow-hidden bg-transparent";

export const topbarClass =
  "flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white/95 px-6 backdrop-blur dark:border-slate-800 dark:bg-slate-900/90";

export const topbarTitleClass =
  "m-0 text-lg font-semibold text-slate-900 dark:text-slate-100";

export const themeToggleContainerClass =
  "inline-flex items-center rounded-lg border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800";

export const getThemeToggleButtonClass = ({ isActive }) =>
  [
    "rounded-md px-2.5 py-1.5 text-xs font-semibold transition",
    isActive
      ? "bg-indigo-600 text-white"
      : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700",
  ].join(" ");

export const contentAreaClass = "flex-1 overflow-y-auto bg-transparent p-6";

export const breadcrumbContainerClass =
  "mb-5 rounded-xl border border-slate-200 bg-white/70 px-4 py-2.5 shadow-sm dark:border-slate-800 dark:bg-slate-900/60";

export const breadcrumbListClass = "mb-0 flex list-none items-center gap-2 text-sm";

export const breadcrumbItemClass = "text-slate-500 dark:text-slate-300";

export const breadcrumbLinkClass =
  "text-slate-600 transition hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-300";

export const breadcrumbActiveItemClass = "font-medium text-indigo-700 dark:text-indigo-300";

export const breadcrumbSeparatorClass = "text-slate-400 dark:text-slate-500";

export const dashboardContainerClass = "w-full";

export const dashboardRootClass = "mx-auto max-w-[1200px]";

export const dashboardTitleClass =
  "mb-8 text-3xl font-semibold text-slate-900 dark:text-slate-100";

export const metricsGridClass =
  "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4";

export const metricCardClass =
  "rounded-xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900/70";

export const metricCardTitleClass =
  "mb-4 text-xs font-semibold uppercase tracking-widest text-slate-600 dark:text-slate-300";

export const metricValueClass = "m-0 text-4xl font-bold text-indigo-600 dark:text-indigo-300";

export const gridContainerClass =
  "ag-grid-container ag-theme-alpine h-[65vh] min-h-[520px] w-full overflow-hidden rounded-xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900/70";

export const gridPageWrapperClass =
  "flex h-full w-full flex-col gap-4";

export const gridHeaderSectionClass =
  "flex shrink-0 items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-800";

export const gridHeaderTitleClass =
  "m-0 text-[1.75rem] font-semibold text-slate-900 dark:text-slate-100";

export const gridActionsSectionClass = "flex items-center gap-4";

export const gridFilterSectionClass = "flex items-center gap-4";

export const gridFilterLabelClass = "mr-2 font-semibold text-slate-600 dark:text-slate-300";

export const gridFilterSelectClass =
  "min-w-[120px] cursor-pointer rounded border border-slate-300 bg-white p-2 text-sm text-slate-800 focus:border-indigo-500 focus:outline-none focus:ring-4 focus:ring-indigo-500/25 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100";

export const gridPrimaryButtonClass =
  "inline-flex items-center gap-2 rounded border border-indigo-600 bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:-translate-y-px hover:border-indigo-700 hover:bg-indigo-700 hover:shadow active:translate-y-0 active:border-indigo-900 active:bg-indigo-900";

export const gridContentSectionClass = "flex min-h-[560px] flex-1 flex-col gap-3";

export const gridEmptyTextClass = "text-sm text-slate-500 dark:text-slate-300";
