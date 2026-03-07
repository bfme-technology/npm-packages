import type React from "react";

export type FocusAreaLoadElementProps = {
  areaName: string;
  children: React.ReactNode;
};

declare const FocusAreaLoadElement: React.FC<FocusAreaLoadElementProps>;
export default FocusAreaLoadElement;
export { FocusAreaLoadElement };
