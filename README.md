# Bucks2Bar

Client-side income & expense tracker — vanilla JS, Bootstrap 5.3, Chart.js 4.4.  
No build step, no backend. Open `index.html` directly in a browser.

## Features

- Enter monthly income and expenses across 12 months
- Automatic totals and net income calculation (GBP)
- Bar chart visualisation with Chart.js
- Download chart as PNG
- Username validation

## Usage

Open `index.html` in any modern browser. No server required.

## Testing

Tests use [Jest 29](https://jestjs.io/) with `jest-environment-jsdom`.

**Install dependencies:**

```sh
npm install
```

**Run tests:**

```sh
npm test
```

Test suites cover:

- `validateUsername` — all validation rules (length, uppercase, number, special character)
- `getData` — DOM input reading via jsdom
- Net income calculation logic

## Tech stack

| Layer | Technology |
|---|---|
| Markup | HTML5 |
| Styling | Bootstrap 5.3 (CDN) |
| Charts | Chart.js 4.4 (CDN) |
| Logic | Vanilla JS (IIFE, ES6+) |
| Tests | Jest 29 + jest-environment-jsdom |
