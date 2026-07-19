export const layoutWrapperClass =
  "flex h-screen overflow-hidden bg-bg-deep text-text-primary font-sans selection:bg-teal-500/30 selection:text-teal-200";

export const getSidebarClass = ({ isCollapsed, isOpen }) =>
  [
    "fixed md:relative inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out md:translate-x-0 shrink-0 border-r border-border-color bg-bg-glass backdrop-blur-xl",
    isOpen ? "translate-x-0" : "-translate-x-full",
    isCollapsed ? "w-72 md:w-20 px-4 py-6 gap-4" : "w-72 md:w-68 px-4 py-6 gap-8",
  ].join(" ");

export const logoAdminClass = "h-auto max-w-[140px] opacity-90 hover:opacity-100 transition-opacity duration-200";

export const navClass = "flex flex-col gap-2";

export const getLayoutNavLinkClass = ({ isActive }) =>
  [
    "flex items-center rounded-2xl text-sm font-medium transition-all duration-300 pl-2 pr-4 py-2.5",
    isActive
      ? "bg-primary-accent-bg text-primary-accent border-l-4 border-primary-accent font-semibold shadow-[0_0_15px_rgba(13,148,136,0.15)]"
      : "text-text-secondary hover:text-text-primary hover:bg-bg-surface/40",
  ].join(" ");

export const navIconClass = "inline-flex items-center justify-center w-8 h-8 rounded-xl text-base shrink-0 bg-primary-accent-bg text-primary-accent";

export const navLinkTextClass = "whitespace-nowrap transition-opacity";

export const layoutMainClass = "flex-grow flex flex-col min-w-0 h-full overflow-hidden bg-transparent";

export const topbarClass =
  "border-b border-border-color px-4 md:px-6 py-3 md:py-4 flex justify-between items-center gap-4 relative z-30 bg-bg-glass backdrop-blur-md";

export const topbarTitleClass =
  "m-0 text-lg md:text-xl font-bold tracking-tight text-text-primary bg-gradient-to-r from-primary-accent to-accent-violet bg-clip-text text-transparent";

export const themeToggleContainerClass =
  "inline-flex items-center rounded-xl border border-border-color bg-bg-surface p-1 shadow-sm";

export const getThemeToggleButtonClass = ({ isActive }) =>
  [
    "rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200",
    isActive
      ? "bg-primary-accent text-bg-deep dark:text-black shadow-md font-bold"
      : "text-text-secondary hover:bg-bg-deep hover:text-text-primary",
  ].join(" ");

export const contentAreaClass = "flex-grow min-w-0 overflow-y-auto p-4 md:p-6 flex flex-col gap-4 md:gap-6";

export const breadcrumbContainerClass =
  "mb-4 rounded-xl border border-border-color/40 bg-bg-surface/50 px-4 py-2.5 shadow-sm backdrop-blur-sm";

export const breadcrumbListClass = "mb-0 flex list-none items-center gap-2 text-xs font-semibold uppercase tracking-wider";

export const breadcrumbItemClass = "text-text-muted";

export const breadcrumbLinkClass =
  "text-text-secondary transition hover:text-primary-accent";

export const breadcrumbActiveItemClass = "font-bold text-primary-accent";

export const breadcrumbSeparatorClass = "text-text-muted";

export const dashboardContainerClass = "w-full flex flex-col gap-6";

export const dashboardRootClass = "mx-auto w-full max-w-[1400px] flex flex-col gap-6";

export const dashboardTitleClass =
  "text-2xl font-extrabold tracking-tight text-text-primary bg-gradient-to-r from-text-primary to-text-secondary bg-clip-text text-transparent";

export const metricsGridClass =
  "grid grid-cols-1 gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3";

export const metricCardClass =
  "rounded-2xl border border-border-color bg-bg-surface/60 p-5 md:p-6 shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-primary-accent/20 hover:shadow-teal-950/20";

export const metricCardTitleClass =
  "text-[11px] font-bold text-text-secondary tracking-wider uppercase";

export const metricValueClass = "m-0 text-xl md:text-2xl font-extrabold text-primary-accent font-display tracking-tight";

export const gridContainerClass =
  "h-[60vh] min-h-[500px] w-full overflow-hidden rounded-2xl border border-border-color bg-bg-surface/60 shadow-lg backdrop-blur-sm";

export const gridPageWrapperClass =
  "flex h-full w-full flex-col gap-4";

export const gridHeaderSectionClass =
  "flex shrink-0 items-center justify-between border-b border-border-color pb-4";

export const gridHeaderTitleClass =
  "m-0 text-xl font-bold tracking-tight text-text-primary";

export const gridActionsSectionClass = "flex items-center gap-3";

export const gridFilterSectionClass = "flex items-center gap-2";

export const gridFilterLabelClass = "text-xs font-bold text-text-secondary uppercase tracking-wider";

export const gridFilterSelectClass =
  "min-w-[130px] cursor-pointer rounded-xl border border-border-color bg-bg-deep p-2.5 text-xs text-text-primary focus:border-primary-accent focus:outline-none focus:ring-2 focus:ring-primary-accent/20 transition-all duration-200";

export const gridPrimaryButtonClass =
  "inline-flex items-center gap-1.5 rounded-xl border border-primary-accent bg-primary-accent px-4 py-2.5 text-xs font-bold text-bg-deep dark:text-black transition-all duration-200 hover:bg-primary-accent/90 hover:border-primary-accent/90 hover:shadow-lg active:scale-[0.98]";

export const gridContentSectionClass = "flex flex-1 flex-col gap-3";

export const gridEmptyTextClass = "text-xs text-text-secondary";
