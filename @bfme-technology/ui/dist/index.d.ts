import * as react from 'react';
import react__default, { ReactNode, HTMLAttributes, KeyboardEvent, MouseEvent, ChangeEvent } from 'react';
export { breadcrumbActiveItemClass, breadcrumbContainerClass, breadcrumbItemClass, breadcrumbLinkClass, breadcrumbListClass, breadcrumbSeparatorClass } from '@bfme-technology/styled';

interface IDropdownProps {
    children: ReactNode;
    iconClass?: string;
    position?: DropdownPosition;
    action?: DropDownAction;
}
declare enum DropdownPosition {
    TOP = 1,
    BOTTOM = 2,
    RIGHT = 3,
    LEFT = 4
}
declare enum DropDownAction {
    CLICK = 1,
    HOVER = 2
}

declare const useDropdown: (props: IDropdownProps) => {
    showOption: () => void;
    hideOption: () => void;
    show: boolean;
    hideActionCallback: () => void;
    containerProps: HTMLAttributes<HTMLDivElement>;
};

declare const getRight: (dropdownPosition?: DropdownPosition) => "-10px" | "" | "0";
declare const getTop: (dropdownPosition?: DropdownPosition) => "" | "40px" | "10px";

declare const dropDownMainContainerClass = "relative inline-block overflow-visible";
type DropDownOptionsProps = {
    show?: boolean;
    position?: DropdownPosition;
};
declare const getDropDownOptionsClass: ({ show }: DropDownOptionsProps) => string;
declare const getDropDownOptionsStyle: ({ position }: DropDownOptionsProps) => {
    top: string;
    right: string;
};

interface Option {
    label: string;
    value: string;
}
interface SelectProps {
    options: Option[];
    placeholder?: string;
    name: string;
    className: string;
    onChange?: (event: react__default.ChangeEvent<HTMLInputElement>) => void;
    value?: string;
    onBlur?: () => void;
    title?: string;
    defaultValue?: Option;
}

declare const SelectBox: react__default.FC<SelectProps>;

declare const useSelectBox: (props: SelectProps) => {
    wrapperRef: react.RefObject<HTMLDivElement>;
    isOpen: boolean;
    searchTerm: string;
    filteredOptions: Option[];
    highlightedIndex: number;
    showCreate: boolean;
    setSearchTerm: react.Dispatch<react.SetStateAction<string>>;
    setIsOpen: react.Dispatch<react.SetStateAction<boolean>>;
    handleKeyDown: (e: KeyboardEvent) => void;
    handleSelect: (opt: {
        value: string;
        label: string;
    }) => void;
    handleCreate: () => void;
    setHighlightedIndex: react.Dispatch<react.SetStateAction<number>>;
    selectedOption: {
        value: string;
        label: string;
    } | null;
    clearSelection: () => void;
    handleRemove: (e: MouseEvent<HTMLButtonElement>) => void;
    handleInputBlur: () => void;
    displayOptions: Option[];
    handleSelectWithChange: (opt: {
        value: string;
        label: string;
    }) => void;
    handleCreateWithChange: () => Promise<void>;
    onTypingKeywords: (e: ChangeEvent<HTMLInputElement>) => void;
};

declare const wrapperClass = "relative w-full";
declare const inputWrapperClass = "flex min-h-[38px] flex-wrap items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-700/10";
declare const getInputClass: (hasSelection?: boolean) => string;
declare const dropdownClass = "absolute left-0 right-0 top-full z-[1000] mt-1 max-h-[200px] overflow-y-auto rounded border border-gray-200 bg-white shadow";
declare const getListItemClass: (isHighlighted?: boolean) => string;
declare const getCreateItemClass: (isHighlighted?: boolean) => string;
declare const capsuleTagClass = "inline-flex cursor-default items-center gap-1.5 rounded-2xl border border-blue-300 bg-blue-100 px-2.5 py-1 text-sm text-blue-700";
declare const removeButtonClass = "flex h-[18px] w-[18px] items-center justify-center rounded-full border-0 bg-transparent p-0 text-base text-blue-700 hover:bg-blue-700/10 focus:bg-blue-700/20 focus:outline-none";

declare const getNameFromURI: (uri: string) => string;

export { DropDownAction, DropdownPosition, type IDropdownProps, type Option, SelectBox, type SelectProps, capsuleTagClass, dropDownMainContainerClass, dropdownClass, getCreateItemClass, getDropDownOptionsClass, getDropDownOptionsStyle, getInputClass, getListItemClass, getNameFromURI, getRight, getTop, inputWrapperClass, removeButtonClass, useDropdown, useSelectBox, wrapperClass };
