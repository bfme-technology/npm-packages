import { AllCommunityModule, ModuleRegistry } from "ag-grid-community";

let modulesRegistered = false;

const registerModulesOnce = () => {
  if (modulesRegistered) return;
  ModuleRegistry.registerModules([AllCommunityModule]);
  modulesRegistered = true;
};

export const createGridConfig = (props) => {
  registerModulesOnce();

  return {
    ...props,
    rowData: Array.isArray(props?.rowData) ? props.rowData : [],
    pagination: false,
    domLayout: "normal",
    suppressNoRowsOverlay: false,
    overlayNoRowsTemplate:
      '<span class="ag-overlay-no-rows-center">No data available</span>',
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
      ...(props?.defaultColDef ?? {}),
    },
    onGridReady: props?.onGridReady,
  };
};
