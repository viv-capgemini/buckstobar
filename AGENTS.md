# Bucks2Bar

Client-side income & expense tracker — vanilla JS, Bootstrap 5.3 (CDN), Chart.js 4.4 (CDN).  
**No build step, no backend, no package manager.** Open `index.html` directly in a browser.

## Files

| File | Purpose |
|------|---------|
| `index.html` | All markup, inline `<style>`, Bootstrap tab structure |
| `script.js` | All logic in one IIFE (`'use strict'`) |

Do not add new files unless explicitly requested.

## Key Conventions

- **IIFE**: all JS stays inside `(() => { 'use strict'; ... })()` in `script.js`
- **`const`/`let` only** — never `var`
- **DOM queries**: `document.getElementById` — never `querySelector`
- **Currency**: always GBP via the shared `GBP` formatter (`Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' })`)
- **Month IDs**: `income-jan` … `income-dec` / `expense-jan` … `expense-dec` (from `MONTH_KEYS[]`)
- **`innerHTML`**: only in `buildDataTable()`, only from internal constants — never from user input
- No new external libraries beyond Bootstrap and Chart.js without explicit approval

## Architecture

```
script.js functions
  buildDataTable()   inject 12 <tr> rows into #data-tbody
  getData()          read 24 inputs → { income[], expenses[] }
  updateTotals()     write footer (#total-income, #total-expenses) + stat cards
  buildChart()       first-time Chart.js instantiation; barChart null → instance
  updateChart()      patch datasets[0] (Income) + datasets[1] (Expenses) + barChart.update()
  downloadBarChart() canvas → PNG; exposed on window for inline onclick
  init()             DOMContentLoaded — calls buildDataTable(), updateTotals(), wires listeners
```

`barChart` is a module-level `let`; `null` = never rendered. Always guard with `if (!barChart)` before patching.

## Extension Patterns

**New data column** (e.g. Savings):
1. Add `<th>` to `<thead>` and `<tfoot>` in `index.html`
2. Add `<td id="savings-${key}">` in `buildDataTable()`
3. Return new array from `getData()`
4. Compute + display total in `updateTotals()`
5. Add `datasets[2]` in `buildChart()`; patch in `updateChart()`

**New stat card**: copy a `.stat-card` block in `index.html`, assign unique `id` to `.value`, add colour rule, write value in `updateTotals()`.

**New chart type**: new `<canvas>` + parallel `buildXChart()` / `updateXChart()` pair in `script.js` using the same null-guard pattern.

**localStorage persistence**:
- On `input`: `localStorage.setItem('b2b-data', JSON.stringify(getData()))`
- In `init()` after `buildDataTable()`: read, restore inputs, call `updateTotals()`

## Styling

- Brand colours: `--brand: #7f1a6e`, `--brand-dark: #1d5f14`
- Prefer Bootstrap utility classes; write custom CSS only when Bootstrap can't
- Stat card colours: income `#198754`, expenses `#dc3545`, net `var(--brand-dark)` (red when negative)

## Security

- Never `eval` user input or pass it to `innerHTML`
- All numeric inputs: `type="number" min="0" step="0.01"`
- All state is in-memory; no server calls
