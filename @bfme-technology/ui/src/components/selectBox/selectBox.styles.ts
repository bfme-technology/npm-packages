export const wrapperClass = "relative w-full";

export const inputWrapperClass =
  "flex min-h-[38px] flex-wrap items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-700/10";

export const getInputClass = (hasSelection?: boolean) =>
  [
    "flex-1 border-0 p-0 text-sm outline-none",
    hasSelection ? "min-w-[100px]" : "min-w-[200px]",
  ].join(" ");

export const dropdownClass =
  "absolute left-0 right-0 top-full z-[1000] mt-1 max-h-[200px] overflow-y-auto rounded border border-gray-200 bg-white shadow";

export const getListItemClass = (isHighlighted?: boolean) =>
  [
    "cursor-pointer px-2.5 py-2.5 hover:bg-blue-50",
    isHighlighted ? "bg-gray-100" : "bg-transparent",
  ].join(" ");

export const getCreateItemClass = (isHighlighted?: boolean) =>
  [
    getListItemClass(isHighlighted),
    "border-t border-gray-200 font-bold text-blue-600",
  ].join(" ");

export const capsuleTagClass =
  "inline-flex cursor-default items-center gap-1.5 rounded-2xl border border-blue-300 bg-blue-100 px-2.5 py-1 text-sm text-blue-700";

export const removeButtonClass =
  "flex h-[18px] w-[18px] items-center justify-center rounded-full border-0 bg-transparent p-0 text-base text-blue-700 hover:bg-blue-700/10 focus:bg-blue-700/20 focus:outline-none";
