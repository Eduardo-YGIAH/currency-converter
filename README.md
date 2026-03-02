# Currency Converter

A Google-style currency converter built with React + TypeScript, backed by live CurrencyBeacon data and a token-driven UI system.

## Features

- Live currency list and conversion via CurrencyBeacon API
- React Query integration for fetch/state management
- Query caching strategy:
  - currencies cached for 1 hour
  - repeated conversion keys reuse cached responses within stale window
- Controlled converter interactions (amount/from/to) with Google-style swap behavior
- Dynamic UTC timestamp for latest successful rate update
- Mobile-first responsive behavior (validated down to 320px)
- Accessibility support (labels, keyboard navigation, aria-live, alert role)
- Token-driven design (colors/spacing/layout/typography centralized in `config/`)
- Automated tests covering:
  - functional behavior
  - API/query state
  - performance/cache
  - UI parity/layout stability
  - accessibility

## Tech Stack

- React
- TypeScript
- Vite
- TanStack React Query
- Axios
- Vitest
- React Testing Library
- CSS Modules

## Architecture

- `config/` -> design tokens and text/layout configuration
- `components/` -> reusable UI components
- `features/` -> domain logic and API/query hooks
- `utils/` -> formatting utilities
- `src/components/Conversion/ConversionLayout.test.tsx` -> UI and behavior tests
- `src/features/currency/hooks.test.tsx` -> hook-level cache/performance tests

## Project Status

- Development plan is completed and tracked in `DEVELOPMENT_PLAN.md`.
- Implemented phases include responsive strategy, API integration, interaction/accessibility, performance tuning, and testing coverage.

## Run Locally

Set your CurrencyBeacon token in `.env.local`:

```bash
VITE_CURRENCYBEACON_API_KEY=your_api_key_here
```

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Validate Locally

```bash
npm test
npm run lint
npm run build
```
