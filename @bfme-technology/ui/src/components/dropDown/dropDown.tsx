import {
  dropDownMainContainerClass,
  getDropDownOptionsClass,
  getDropDownOptionsStyle,
} from "./dropDown.styles";
import { useDropdown } from "./dropDown.hook";
import { IDropdownProps } from "./dropDown.types";

const DropDown = (props: IDropdownProps) => {
  const { showOption, containerProps, show } = useDropdown(props);

  return (
    <div {...containerProps} className={dropDownMainContainerClass}>
      <button onClick={showOption}>
        <span
          className={props.iconClass ? props.iconClass : "fa fal fa-ellipsis-v"}
        />
      </button>
      <div
        style={getDropDownOptionsStyle({ position: props.position })}
        className={getDropDownOptionsClass({
          show,
          position: props.position,
        })}
      >
        {props.children}
      </div>
    </div>
  );
};

export default DropDown;
