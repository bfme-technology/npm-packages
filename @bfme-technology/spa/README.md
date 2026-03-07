# @bfme-technology/spa

Shared SPA utilities/components for BFME apps.

## Install

```bash
npm install @bfme-technology/spa
```

## Exports

- `FocusAreaLoadElement`

## Usage

```tsx
import { FocusAreaLoadElement } from "@bfme-technology/spa";

<FocusAreaLoadElement areaName="DashboardWidget">
  <Widget />
</FocusAreaLoadElement>
```

## Peer dependencies

- `react >= 18`
- `react-dom >= 18`

## Local development

This package is consumed locally in workspace projects via `file:` dependencies.

Example:

```json
"@bfme-technology/spa": "file:../npm_packages/@bfme-technology/spa"
```

After local changes, run `npm install` in the consuming project to refresh linked metadata when needed.
