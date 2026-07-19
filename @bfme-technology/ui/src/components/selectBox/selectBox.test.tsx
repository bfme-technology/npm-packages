import { render, screen, fireEvent } from "@testing-library/react";
import { SelectBox } from "./selectBox";
import { useSelectBox } from "./selectBox.hook";

jest.mock("./selectBox.hook");

const mockUseSelectBox = useSelectBox as jest.MockedFunction<
  typeof useSelectBox
>;

describe("SelectBox Component", () => {
  const defaultProps = {
    title: "Test Select",
    name: "test-select",
    className: "test-class",
    options: [
      { label: "Option 1", value: "1" },
      { label: "Option 2", value: "2" },
    ],
    onSelect: jest.fn(),
    keywordable: false,
    createable: false,
  };

  const defaultHookValues = {
    wrapperRef: { current: null } as any,
    isOpen: false,
    searchTerm: "",
    filteredOptions: defaultProps.options,
    highlightedIndex: 0,
    handleKeyDown: jest.fn(),
    setIsOpen: jest.fn(),
    setSearchTerm: jest.fn(),
    showCreate: false,
    selectedOption: [],
    handleRemove: jest.fn(),
    handleSelect: jest.fn(),
    handleCreate: jest.fn(),
    handleInputBlur: jest.fn(),
    displayOptions: defaultProps.options,
    handleSelectWithChange: jest.fn(),
    handleCreateWithChange: jest.fn(),
    onTypingKeywords: jest.fn(),
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSelectBox.mockReturnValue(defaultHookValues as any);
  });

  it("should render with title", () => {
    render(<SelectBox {...defaultProps} />);

    expect(screen.getByText("Test Select")).toBeInTheDocument();
  });

  it("should render with default title when not provided", () => {
    mockUseSelectBox.mockReturnValue(defaultHookValues as any);

    render(<SelectBox {...defaultProps} title={undefined} />);

    expect(screen.getByText("Select Option")).toBeInTheDocument();
  });

  it("should call useSelectBox hook with props", () => {
    render(<SelectBox {...defaultProps} />);

    expect(mockUseSelectBox).toHaveBeenCalledWith(defaultProps);
  });
});
