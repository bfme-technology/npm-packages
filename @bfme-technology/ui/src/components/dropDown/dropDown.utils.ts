import { DropdownPosition } from "./dropDown.types";

export const getRight = (dropdownPosition?: DropdownPosition) => {
  switch (dropdownPosition) {
    case DropdownPosition.BOTTOM:
      return "-10px";
    case DropdownPosition.TOP:
      return "";
    case DropdownPosition.LEFT:
      return "";
    case DropdownPosition.RIGHT:
    default:
      return "0";
  }
};

export const getTop = (dropdownPosition?: DropdownPosition) => {
  switch (dropdownPosition) {
    case DropdownPosition.BOTTOM:
      return "40px";
    case DropdownPosition.TOP:
      return "";
    case DropdownPosition.LEFT:
      return "";
    case DropdownPosition.RIGHT:
    default:
      return "10px";
  }
};
