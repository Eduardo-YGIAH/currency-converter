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

Set your CurrencyBeacon token in `.env.local`:

```bash
VITE_CURRENCYBEACON_API_KEY=your_api_key_here
```

```bash
npm install
cp .env.example .env.local
npm run dev
