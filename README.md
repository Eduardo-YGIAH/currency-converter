# Currency Converter

A Google-style currency converter built with React + TypeScript.

## Features

- Token-driven design system (no magic numbers)
- Reusable Card and CurrencyInputRow components
- Controlled inputs
- Swap behavior (Google-style)
- Intl-based number formatting
- Clean Git history with milestone-based commits

## Tech Stack

- React
- TypeScript
- Vite
- CSS Modules

## Architecture

- `config/` → design tokens and layout system
- `components/` → reusable UI components
- `features/` → domain-specific logic
- `utils/` → pure formatting utilities

## Next Steps

- API integration (CurrencyBeacon)
- Loading & error states
- Accessibility improvements
- Responsive refinement

## Run Locally

```bash
npm install
npm run dev
