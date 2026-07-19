import { HTMLAttributes, useMemo, useState } from "react";
import { DropDownAction, IDropdownProps } from "./dropDown.types";

export const useDropdown = (props: IDropdownProps) => {
  const [show, setShow] = useState(false);
  const showOption = () => {
    setShow(true);
  };
  const hideOption = () => {
    setShow(false);
  };

  const hideActionCallback = () => {
    hideOption();
  };

  const containerProps = useMemo<HTMLAttributes<HTMLDivElement>>(
    () => ({
      onMouseLeave: () => {
        switch (props.action) {
          case DropDownAction.CLICK:
            return null;
          case DropDownAction.HOVER:
          default:
            hideOption();
        }
      },
      className: "dropdown",
    }),
    [props]
  );

  return { showOption, hideOption, show, hideActionCallback, containerProps };
};
