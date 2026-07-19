import React from "react";
export interface Option {
  label: string;
  value: string;
}

export interface SelectProps {
  options: Option[];
  placeholder?: string;
  name: string;
  className: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
  onBlur?: () => void;
  title?: string;
  defaultValue?: Option;
}
