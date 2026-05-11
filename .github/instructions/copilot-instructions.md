---
description: Guidelines for working on the Bucks2Bar income & expense tracker project
applyTo: '**/*.{html,js,css}'
---

<!-- Full project context: .github/copilot-instructions.md -->

## Must-Not-Break Rules

- All JS stays inside the IIFE in `script.js` — never add `<script>` tags or separate files
- `innerHTML` only in `buildDataTable()`, only from `MONTHS`/`MONTH_KEYS` constants — never user input
- DOM queries use `document.getElementById` only — never `querySelector`
- All monetary values use the shared `GBP` formatter — never format currency ad-hoc
- Chart `datasets[0]` = Income, `datasets[1]` = Expenses — do not reorder
- `barChart` starts as `null`; guard with `if (!barChart)` before patching

## Extension Checklists

**New data column** (e.g. "Savings"):
1. `index.html` — add `<th>` to `<thead>` and `<tfoot>`
2. `buildDataTable()` — add `<td id="savings-${key}">` in the row template
3. `getData()` — return a new `savings[]` array
4. `updateTotals()` — compute and write the new total
5. `buildChart()` / `updateChart()` — add and patch `datasets[2]`

**New stat card**:
1. Copy a `.stat-card` block in `index.html`; give `.value` a unique `id`
2. Add `.stat-card.<name> .value { color: …; }` in `<style>`
3. Write the value in `updateTotals()`

**localStorage persistence**:
- `input` handler → `localStorage.setItem('b2b-data', JSON.stringify(getData()))`
- `init()` after `buildDataTable()` → read, restore inputs, call `updateTotals()`

## Styling

- Brand colours: `--brand: #1a7f5a`, `--brand-dark: #145f44`
- Prefer Bootstrap utility classes; write custom CSS only when Bootstrap can't
- Stat card colours: income `#198754`, expenses `#dc3545`, net `var(--brand-dark)` (red when negative)

## Security

- Never `eval` user input or pass it to `innerHTML`
- Numeric inputs: `type="number" min="0" step="0.01"`