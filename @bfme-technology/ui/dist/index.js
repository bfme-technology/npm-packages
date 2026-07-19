// src/components/dropDown/dropDown.types.ts
var DropdownPosition = /* @__PURE__ */ ((DropdownPosition2) => {
  DropdownPosition2[DropdownPosition2["TOP"] = 1] = "TOP";
  DropdownPosition2[DropdownPosition2["BOTTOM"] = 2] = "BOTTOM";
  DropdownPosition2[DropdownPosition2["RIGHT"] = 3] = "RIGHT";
  DropdownPosition2[DropdownPosition2["LEFT"] = 4] = "LEFT";
  return DropdownPosition2;
})(DropdownPosition || {});
var DropDownAction = /* @__PURE__ */ ((DropDownAction2) => {
  DropDownAction2[DropDownAction2["CLICK"] = 1] = "CLICK";
  DropDownAction2[DropDownAction2["HOVER"] = 2] = "HOVER";
  return DropDownAction2;
})(DropDownAction || {});

// src/components/dropDown/dropDown.utils.ts
var getRight = (dropdownPosition) => {
  switch (dropdownPosition) {
    case 2 /* BOTTOM */:
      return "-10px";
    case 1 /* TOP */:
      return "";
    case 4 /* LEFT */:
      return "";
    case 3 /* RIGHT */:
    default:
      return "0";
  }
};
var getTop = (dropdownPosition) => {
  switch (dropdownPosition) {
    case 2 /* BOTTOM */:
      return "40px";
    case 1 /* TOP */:
      return "";
    case 4 /* LEFT */:
      return "";
    case 3 /* RIGHT */:
    default:
      return "10px";
  }
};

// src/components/dropDown/dropDown.styles.tsx
var dropDownMainContainerClass = "relative inline-block overflow-visible";
var getDropDownOptionsClass = ({ show }) => [
  "fixed z-[1000] flex-col rounded border border-gray-200 bg-white p-2 shadow",
  show ? "flex" : "hidden"
].join(" ");
var getDropDownOptionsStyle = ({ position }) => ({
  top: getTop(position),
  right: getRight(position)
});

// src/components/dropDown/dropDown.hook.ts
import { useMemo, useState } from "react";
var useDropdown = (props) => {
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
  const containerProps = useMemo(
    () => ({
      onMouseLeave: () => {
        switch (props.action) {
          case 1 /* CLICK */:
            return null;
          case 2 /* HOVER */:
          default:
            hideOption();
        }
      },
      className: "dropdown"
    }),
    [props]
  );
  return { showOption, hideOption, show, hideActionCallback, containerProps };
};

// src/components/dropDown/dropDown.tsx
import { jsx, jsxs } from "react/jsx-runtime";

// src/components/selectBox/selectBox.styles.ts
var wrapperClass = "relative w-full";
var inputWrapperClass = "flex min-h-[38px] flex-wrap items-center gap-2 rounded border border-gray-300 bg-white px-3 py-1.5 focus-within:border-blue-700 focus-within:ring-2 focus-within:ring-blue-700/10";
var getInputClass = (hasSelection) => [
  "flex-1 border-0 p-0 text-sm outline-none",
  hasSelection ? "min-w-[100px]" : "min-w-[200px]"
].join(" ");
var dropdownClass = "absolute left-0 right-0 top-full z-[1000] mt-1 max-h-[200px] overflow-y-auto rounded border border-gray-200 bg-white shadow";
var getListItemClass = (isHighlighted) => [
  "cursor-pointer px-2.5 py-2.5 hover:bg-blue-50",
  isHighlighted ? "bg-gray-100" : "bg-transparent"
].join(" ");
var getCreateItemClass = (isHighlighted) => [
  getListItemClass(isHighlighted),
  "border-t border-gray-200 font-bold text-blue-600"
].join(" ");
var capsuleTagClass = "inline-flex cursor-default items-center gap-1.5 rounded-2xl border border-blue-300 bg-blue-100 px-2.5 py-1 text-sm text-blue-700";
var removeButtonClass = "flex h-[18px] w-[18px] items-center justify-center rounded-full border-0 bg-transparent p-0 text-base text-blue-700 hover:bg-blue-700/10 focus:bg-blue-700/20 focus:outline-none";

// src/components/selectBox/selectBox.hook.ts
import {
  useState as useState2,
  useRef,
  useEffect
} from "react";
var useSelectBox = (props) => {
  const [isOpen, setIsOpen] = useState2(false);
  const [searchTerm, setSearchTerm] = useState2("");
  const [options, setOptions] = useState2(props.options);
  const [highlightedIndex, setHighlightedIndex] = useState2(-1);
  const [selectedOption, setSelectedOption] = useState2(null);
  const wrapperRef = useRef(null);
  useEffect(() => {
    if (props.value) {
      const selectedOption2 = props.defaultValue;
      if (selectedOption2) {
        setSearchTerm(selectedOption2.label);
        setSelectedOption(selectedOption2);
      }
    }
  }, [props.value, props.defaultValue]);
  const filteredOptions = options.filter(
    (opt) => opt.label.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const showCreate = searchTerm.length > 0 && !options.some(
    (opt) => opt.label.toLowerCase() === searchTerm.toLowerCase()
  );
  useEffect(() => {
    const handler = (e) => {
      if (!wrapperRef.current?.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);
  const handleSelect = (opt) => {
    setSelectedOption(opt);
    setSearchTerm(opt.label);
    setIsOpen(false);
    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name || "",
          value: opt.value
        }
      });
    }
  };
  const handleCreate = () => {
    const newOpt = { label: searchTerm, value: searchTerm.toLowerCase() };
    setOptions([...options, newOpt]);
    handleSelect(newOpt);
  };
  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex(
        (prev) => Math.min(prev + 1, filteredOptions.length + (showCreate ? 0 : -1))
      );
    } else if (e.key === "ArrowUp") {
      setHighlightedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" && highlightedIndex >= 0) {
      if (showCreate && highlightedIndex === filteredOptions.length) {
        handleCreate();
      } else if (filteredOptions[highlightedIndex]) {
        handleSelect(filteredOptions[highlightedIndex]);
      }
    }
  };
  useEffect(() => {
    if (selectedOption) {
      setSearchTerm("");
    }
  }, [selectedOption]);
  const handleSelectWithChange = (opt) => {
    handleSelect(opt);
    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name || "",
          value: opt.value
        }
      });
      setSearchTerm("");
    }
  };
  const handleCreateWithChange = async () => {
    await handleCreate();
    if (props.onChange && selectedOption) {
      props.onChange({
        target: {
          name: props.name || "",
          value: selectedOption.value
        }
      });
      setSearchTerm("");
    }
  };
  const handleRemove = (e) => {
    e.stopPropagation();
    clearSelection();
    setSearchTerm("");
    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name || "",
          value: ""
        }
      });
    }
  };
  const handleInputBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      if (props.onBlur) {
        props.onBlur();
      }
    }, 200);
  };
  const displayOptions = searchTerm ? filteredOptions : props.options || [];
  const clearSelection = () => {
    setSelectedOption(null);
    setSearchTerm("");
  };
  const onTypingKeywords = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setIsOpen(true);
    setHighlightedIndex(-1);
  };
  return {
    wrapperRef,
    isOpen,
    searchTerm,
    filteredOptions,
    highlightedIndex,
    showCreate,
    setSearchTerm,
    setIsOpen,
    handleKeyDown,
    handleSelect,
    handleCreate,
    setHighlightedIndex,
    selectedOption,
    clearSelection,
    handleRemove,
    handleInputBlur,
    displayOptions,
    handleSelectWithChange,
    handleCreateWithChange,
    onTypingKeywords
  };
};

// src/components/selectBox/selectBox.tsx
import { Fragment, jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
var SelectBox = (props) => {
  const {
    wrapperRef,
    isOpen,
    searchTerm,
    highlightedIndex,
    handleKeyDown,
    setIsOpen,
    showCreate,
    selectedOption,
    handleRemove,
    handleInputBlur,
    displayOptions,
    handleSelectWithChange,
    handleCreateWithChange,
    onTypingKeywords
  } = useSelectBox(props);
  return /* @__PURE__ */ jsxs2(Fragment, { children: [
    /* @__PURE__ */ jsx2("label", { htmlFor: "entityId", className: "mb-2 block text-sm font-medium text-slate-700", children: props.title || "Select Option" }),
    /* @__PURE__ */ jsxs2("div", { ref: wrapperRef, className: wrapperClass, children: [
      /* @__PURE__ */ jsxs2("div", { className: [inputWrapperClass, props.className].join(" "), children: [
        selectedOption && /* @__PURE__ */ jsxs2("div", { className: capsuleTagClass, children: [
          /* @__PURE__ */ jsx2("span", { className: "font-medium", children: selectedOption.label }),
          /* @__PURE__ */ jsx2("button", { className: removeButtonClass, onClick: handleRemove, children: "\xD7" })
        ] }),
        /* @__PURE__ */ jsx2(
          "input",
          {
            value: searchTerm,
            onChange: onTypingKeywords,
            onFocus: () => setIsOpen(true),
            onBlur: handleInputBlur,
            onKeyDown: handleKeyDown,
            placeholder: selectedOption ? "" : props.placeholder || "Search...",
            name: `${props.name}_input`,
            className: getInputClass(!!selectedOption)
          }
        ),
        /* @__PURE__ */ jsx2(
          "input",
          {
            type: "hidden",
            name: props.name,
            value: selectedOption ? selectedOption.value : "0"
          }
        )
      ] }),
      isOpen && /* @__PURE__ */ jsxs2("div", { role: "listbox", className: dropdownClass, children: [
        displayOptions.map((opt, i) => /* @__PURE__ */ jsx2(
          "div",
          {
            className: getListItemClass(i === highlightedIndex),
            onClick: () => handleSelectWithChange(opt),
            children: opt.label
          },
          opt.value
        )),
        showCreate && /* @__PURE__ */ jsxs2(
          "div",
          {
            className: getCreateItemClass(
              highlightedIndex === displayOptions.length
            ),
            onClick: handleCreateWithChange,
            children: [
              '+ Create "',
              searchTerm,
              '"'
            ]
          }
        )
      ] })
    ] })
  ] });
};

// src/components/breadcrumb/breadcrumb.tsx
import { useLocation, Link } from "react-router-dom";
import { Fragment as Fragment2 } from "react";

// src/components/breadcrumb/breadcrumb.styles.ts
import {
  breadcrumbContainerClass,
  breadcrumbListClass,
  breadcrumbItemClass,
  breadcrumbLinkClass,
  breadcrumbActiveItemClass,
  breadcrumbSeparatorClass
} from "@bfme-technology/styled";

// src/components/breadcrumb/breadcrumb.utils.ts
var getNameFromURI = (uri) => {
  if (!uri) return "";
  const cleanUri = uri.replace(/\/+$/, "");
  const segments = cleanUri.split("/").filter((segment) => segment.length > 0);
  if (segments.length === 0) return "";
  const lastSegment = segments[segments.length - 1];
  return decodeURIComponent(lastSegment).replace(/[-_]/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

// src/components/breadcrumb/breadcrumb.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
export {
  DropDownAction,
  DropdownPosition,
  SelectBox,
  breadcrumbActiveItemClass,
  breadcrumbContainerClass,
  breadcrumbItemClass,
  breadcrumbLinkClass,
  breadcrumbListClass,
  breadcrumbSeparatorClass,
  capsuleTagClass,
  dropDownMainContainerClass,
  dropdownClass,
  getCreateItemClass,
  getDropDownOptionsClass,
  getDropDownOptionsStyle,
  getInputClass,
  getListItemClass,
  getNameFromURI,
  getRight,
  getTop,
  inputWrapperClass,
  removeButtonClass,
  useDropdown,
  useSelectBox,
  wrapperClass
};
//# sourceMappingURL=index.js.map