import { ReactNode } from "react";

export interface IDropdownProps {
  children: ReactNode;
  iconClass?: string;
  position?: DropdownPosition;
  action?: DropDownAction;
}

export enum DropdownPosition {
  TOP = 1,
  BOTTOM = 2,
  RIGHT = 3,
  LEFT = 4,
}

export enum DropDownAction {
  CLICK = 1,
  HOVER = 2,
}
