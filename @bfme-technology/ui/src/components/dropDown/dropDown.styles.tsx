import { DropdownPosition } from "./dropDown.types";
import { getRight, getTop } from "./dropDown.utils";

export const dropDownMainContainerClass = "relative inline-block overflow-visible";

type DropDownOptionsProps = {
  show?: boolean;
  position?: DropdownPosition;
};

export const getDropDownOptionsClass = ({ show }: DropDownOptionsProps) =>
  [
    "fixed z-[1000] flex-col rounded border border-gray-200 bg-white p-2 shadow",
    show ? "flex" : "hidden",
  ].join(" ");

export const getDropDownOptionsStyle = ({ position }: DropDownOptionsProps) => ({
  top: getTop(position),
  right: getRight(position),
});
