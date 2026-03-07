# @bfme-technology/grid

Reusable React grid package that supports the existing Studio Frejya grid structure while remaining easy to expand later with full React + TypeScript patterns.

## Install

```bash
npm install @bfme-technology/grid ag-grid-community ag-grid-react react react-dom
```

## Usage

```tsx
import { Grid } from "@bfme-technology/grid";

const rowData = [
  { id: 1, name: "Alice", email: "alice@example.com" },
  { id: 2, name: "Bob", email: "bob@example.com" },
];

const columnDefs = [
  { field: "id", headerName: "ID", width: 100 },
  { field: "name", headerName: "Name" },
  { field: "email", headerName: "Email" },
];

export default function Example() {
  return (
    <Grid
      rowData={rowData}
      columnDefs={columnDefs}
      themeMode="auto"
      paginatorInfo={{ total: 2, currentPage: 1, lastPage: 1, perPage: 10 }}
      onPageChange={(page) => console.log("page", page)}
      onPageSizeChange={(size) => console.log("page size", size)}
      paginationPageSize={10}
    />
  );
}
```

## Compatible Props

- `rowData`
- `columnDefs`
- `themeMode` (`auto` | `light` | `dark`)
- `defaultColDef`
- `gridOptions`
- `onGridReady`
- `onPaginationChanged`
- `paginatorInfo`
- `onPageChange`
- `onPageSizeChange`
- `paginationPageSize`

## Dark Mode Support

- `themeMode="auto"` (default): follows `html.dark` class first, then system preference.
- `themeMode="light"`: forces `ag-theme-alpine`.
- `themeMode="dark"`: forces `ag-theme-alpine-dark`.

## Extending Later With TypeScript

The package already exposes `index.d.ts` with typed props and utility exports. A future evolution can move internals to `.ts/.tsx` files without breaking consumers.
