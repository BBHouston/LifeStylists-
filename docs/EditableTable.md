# Editable Table Component Documentation

## Overview
The `EditableTable` React component renders a data table whose cells can be edited in place. Users may add or remove rows dynamically and export the resulting dataset to a CSV file. A convenience `App` example demonstrates how to configure the table for two distinct datasets.

## Component Signatures

### `EditableTable`
```tsx
import React, { useState } from 'react';
import { Download, Plus, Trash2 } from 'lucide-react';

const EditableTable = ({ title, initialData, columns }) => { /* ... */ };
```

**Props**

| Prop         | Type     | Description |
|--------------|----------|-------------|
| `title`      | string   | Heading displayed above the table and used as the exported CSV filename. |
| `initialData`| object[] | Array of row objects that seed the table. Each key should align with one of the column definitions. |
| `columns`    | object[] | Column configuration objects with the shape `{ key: string, label: string }`. |

**State**

The component stores its mutable dataset in local state via `useState`. Editing operations clone and update this state to preserve immutability.

## Core Behaviors

1. **Cell Editing** — Each table cell renders a `<textarea>` bound to the corresponding row and column key. Changes propagate through the `updateCell` helper, which replaces the mutated row in state.
2. **Row Management** — The `addRow` function appends an empty row initialized with blank values for each defined column. Rows can be removed through the delete action button, which filters the targeted index out of the dataset.
3. **CSV Export** — `exportToCSV` transforms the current table state into a CSV string. Column labels form the header row, and each cell value is wrapped in quotes for safety. A Blob is generated, and a transient anchor element triggers the download.
4. **UX Enhancements** — Buttons from the `lucide-react` icon set (Plus, Download, Trash2) visually reinforce each action. Tailwind utility classes provide spacing, typography, and interaction feedback.

## Styling Notes

- The outer container (`div.mb-8`) applies padding, rounded corners, and shadow to emulate a card layout.
- Header controls use flexbox to position action buttons alongside the table title.
- Table headers and cells rely on `border`, `p-*`, and `text-sm` classes for compact readability.
- Textareas disable resizing beyond the component by using `resize-none` while still allowing multiline input.

## Example Usage (`App`)

The provided `App` component illustrates two distinct table instances:

1. **Historical Comparisons: Patterns of Democratic Backsliding** — Columns cover episode, economic context, power concentration, scapegoating, and outcomes. The dataset catalogs seven historical case studies.
2. **Current America: Warning Sign Assessment** — Columns track indicator names, severity ratings, and supporting evidence for contemporary warning signs.

Both tables share consistent UX affordances: editable cells, row addition, deletion, and CSV export. A helper panel beneath the tables summarizes these interactions for end users.

## Extensibility Tips

- **Persisting Data** — Replace the local state hook with a persistence layer (e.g., Context, Redux, or API calls) to save edits beyond the browser session.
- **Validation** — Wrap `updateCell` with validation logic (e.g., rating bounds) to constrain user input.
- **Custom Inputs** — Swap `<textarea>` for custom components (selects, numeric inputs) by augmenting the column configuration with render callbacks.
- **Accessibility** — Add table captions, `aria` labels, and keyboard shortcuts to improve accessibility compliance.

## Related Dependencies

- [`react`](https://react.dev/) — Provides component and state primitives.
- [`lucide-react`](https://lucide.dev/) — Supplies the icon components used for action buttons.
- Tailwind CSS (implicit) — Utility classes referenced in the JSX assume Tailwind or a similar framework is available in the hosting project.

