import React from "react";
import {
  capsuleTagClass,
  dropdownClass,
  getCreateItemClass,
  getInputClass,
  getListItemClass,
  inputWrapperClass,
  removeButtonClass,
  wrapperClass,
} from "./selectBox.styles";
import { SelectProps } from "./selectBox.types";
import { useSelectBox } from "./selectBox.hook";

export const SelectBox: React.FC<SelectProps> = (props) => {
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
    onTypingKeywords,
  } = useSelectBox(props);

  return (
    <>
      <label htmlFor="entityId" className="mb-2 block text-sm font-medium text-slate-700">
        {props.title || "Select Option"}
      </label>

      <div ref={wrapperRef} className={wrapperClass}>
        <div className={[inputWrapperClass, props.className].join(" ")}>
          {selectedOption && (
            <div className={capsuleTagClass}>
              <span className="font-medium">{selectedOption.label}</span>
              <button className={removeButtonClass} onClick={handleRemove}>
                &times;
              </button>
            </div>
          )}
          <input
            value={searchTerm}
            onChange={onTypingKeywords}
            onFocus={() => setIsOpen(true)}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            placeholder={selectedOption ? "" : props.placeholder || "Search..."}
            name={`${props.name}_input`}
            className={getInputClass(!!selectedOption)}
          />
          <input
            type="hidden"
            name={props.name}
            value={selectedOption ? selectedOption.value : "0"}
          />
        </div>
        {isOpen && (
          <div role="listbox" className={dropdownClass}>
            {displayOptions.map((opt, i) => (
              <div
                key={opt.value}
                className={getListItemClass(i === highlightedIndex)}
                onClick={() => handleSelectWithChange(opt)}
              >
                {opt.label}
              </div>
            ))}
            {showCreate && (
              <div
                className={getCreateItemClass(
                  highlightedIndex === displayOptions.length,
                )}
                onClick={handleCreateWithChange}
              >
                + Create &quot;{searchTerm}&quot;
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
