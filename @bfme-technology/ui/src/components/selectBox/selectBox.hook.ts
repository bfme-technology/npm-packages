import {
  useState,
  useRef,
  useEffect,
  KeyboardEvent,
  ChangeEvent,
  MouseEvent,
} from "react";
import { SelectProps, Option } from "./selectBox.types";

export const useSelectBox = (props: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [options, setOptions] = useState<Option[]>(props.options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (props.value) {
      const selectedOption = props.defaultValue;
      if (selectedOption) {
        setSearchTerm(selectedOption.label);
        setSelectedOption(selectedOption);
      }
    }
  }, [props.value, props.defaultValue]);

  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const showCreate =
    searchTerm.length > 0 &&
    !options.some(
      (opt) => opt.label.toLowerCase() === searchTerm.toLowerCase(),
    );

  useEffect(() => {
    const handler = (e: globalThis.MouseEvent) => {
      if (!wrapperRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (opt: { value: string; label: string }) => {
    setSelectedOption(opt);
    setSearchTerm(opt.label);
    setIsOpen(false);
    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name || "",
          value: opt.value,
        },
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  const handleCreate = () => {
    const newOpt = { label: searchTerm, value: searchTerm.toLowerCase() };
    setOptions([...options, newOpt]);
    handleSelect(newOpt);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setHighlightedIndex((prev) =>
        Math.min(prev + 1, filteredOptions.length + (showCreate ? 0 : -1)),
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

  const handleSelectWithChange = (opt: { value: string; label: string }) => {
    handleSelect(opt);
    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name || "",
          value: opt.value,
        },
      } as ChangeEvent<HTMLInputElement>);
      setSearchTerm("");
    }
  };

  const handleCreateWithChange = async () => {
    await handleCreate();
    if (props.onChange && selectedOption) {
      props.onChange({
        target: {
          name: props.name || "",
          value: selectedOption.value,
        },
      } as ChangeEvent<HTMLInputElement>);
      setSearchTerm("");
    }
  };

  const handleRemove = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    clearSelection();
    setSearchTerm("");
    if (props.onChange) {
      props.onChange({
        target: {
          name: props.name || "",
          value: "",
        },
      } as ChangeEvent<HTMLInputElement>);
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

  const onTypingKeywords = (e: ChangeEvent<HTMLInputElement>) => {
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
    onTypingKeywords,
  };
};
