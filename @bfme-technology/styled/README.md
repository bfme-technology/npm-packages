# @bfme-technology/styled

Shared styling primitives for BFME apps.

## Install

```bash
npm install @bfme-technology/styled
```

## Exports

- `documentationBaseStyles`
- `documentationBaseLayoutStyles`
- Studio admin style class constants (layout, breadcrumb, dashboard, grid)

## Usage

```ts
import {
  documentationBaseStyles,
  gridContainerClass,
  gridHeaderSectionClass,
} from "@bfme-technology/styled";
```

## Local development

This package is consumed locally in workspace projects via `file:` dependencies.

Example:

```json
"@bfme-technology/styled": "file:../npm_packages/@bfme-technology/styled"
```

After local changes, run `npm install` in the consuming project to refresh linked metadata when needed.
