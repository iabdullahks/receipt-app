# Ustaad Anwar — Quotation & Invoice Desktop App

A real offline desktop application (built with Electron) — not a website. It installs and runs
like normal Windows software, with all data stored **locally on the shop's PC** (no internet
required, no cloud).

## What it does

- **Two roles, no password** — a simple screen at launch to pick **Owner** or **Cashier**.
- **Owner**: create bills, see **all** saved Quotations/Invoices (with filters), edit the
  product list and prices, edit shop details.
- **Cashier**: create bills only, and can see **only their own bills created today** — no
  access to the product list, prices, or other people's history.
- Product select from a fixed list (Urdu names), rate auto-fills but can be overridden per sale.
- Auto-calculated line totals and grand total.
- Auto-numbering (`Q-0001`, `INV-0001`, separate counters).
- Save & reload past documents; convert a saved Quotation into an Invoice with one click
  (keeps the original quotation too).
- English/Urdu label toggle.
- Print / Save as PDF via the normal system print dialog.
- 100% offline — no external fonts, scripts, or servers. Urdu text uses whatever Urdu font is
  already installed on the PC (Windows usually has one; if Urdu doesn't render well, install a
  free font like **Jameel Noori Nastaleeq** or **Noto Nastaliq Urdu**).

## Project structure

```
quotation-app/
  main.js        Electron main process — window + local data storage (a JSON file)
  preload.js     Safe bridge between the app window and the local data functions
  src/           The actual screen (HTML/CSS/JS)
  package.json   Project + build configuration
```

Data is stored in a `store.json` file inside the app's own data folder on the user's PC
(Windows: `%APPDATA%\quotation-invoice-app\store.json`). Back this file up if needed —
copying it to a new install restores all products and history.

## Run it during development

Requires [Node.js](https://nodejs.org) (LTS version) installed once on your dev machine.

```
cd quotation-app
npm install
npm start
```

## Build the installer (.exe) to give the client

```
npm run dist
```

This produces an installer inside the `dist/` folder (e.g. `Ustaad Anwar Quotation App Setup 1.0.0.exe`
for Windows, built via `electron-builder`). Send that single file to the client — they just
double-click it to install, then get a normal desktop icon like any other software.

> Building a Windows `.exe` works best when run **on a Windows machine** (or with the right
> cross-build setup on Linux/Mac). If `npm run dist` gives you trouble cross-building from
> Linux, run it on a Windows PC instead — it works out of the box there.

## Known open items (from the client questionnaire — still need answers)

- Exact thermal printer model / paper width (client marked "Other Model" but didn't specify)
- Number of tills/counters that will run this at the same time
- Expected daily transaction volume

## Editing the product list in code (optional shortcut)

The starting product list lives in `main.js` inside `DEFAULT_PRODUCTS` — this only seeds a
brand-new install. Once the app has run once, products live in `store.json` and should be
edited from the **Products** tab (Owner role) instead.
