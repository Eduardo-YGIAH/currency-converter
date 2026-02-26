# Currency Converter

## Overview

This project is a simple currency conversion tool built with React and TypeScript.
The goal is to demonstrate strong component composition, clean architecture, and best practices rather than over-engineering the solution.

The application:

* Fetches available currencies from the CurrencyBeacon API.
* Allows users to select “from” and “to” currencies.
* Accepts an amount input.
* Fetches and displays the converted value.
* Handles loading and error states cleanly.

API Documentation:
[https://currencybeacon.com/api-documentation](https://currencybeacon.com/api-documentation)

---

## Tech Stack

* React 18+
* TypeScript
* Vite
* Axios (HTTP client)
* TanStack React Query (data fetching and caching)
* Zod (runtime API validation)
* CSS Modules (or plain CSS)

---

## Architectural Approach

The project is structured to clearly separate:

* UI components
* Feature logic
* API layer
* Runtime validation
* Configuration

This separation improves readability, maintainability, and testability.

### Folder Structure

src/
app/
providers.tsx
components/
CurrencySelect.tsx
AmountInput.tsx
ConverterCard.tsx
features/
currency/
api.ts
hooks.ts
schemas.ts
types.ts
config/
env.ts
App.tsx
main.tsx

---

## Environment Configuration

The API key is stored in a local environment file and not committed.

Example `.env`:

VITE_CURRENCY_API_KEY=currencybeacon_api_key
VITE_CURRENCY_BASE_URL=[https://api.currencybeacon.com/v1](https://api.currencybeacon.com/v1)

Accessed via:

config/env.ts

This prevents hardcoding secrets and follows standard Vite environment practices.

Vite Env Docs:
[https://vitejs.dev/guide/env-and-mode.html](https://vitejs.dev/guide/env-and-mode.html)

---

## API Layer

A dedicated Axios instance is created with:

* Base URL
* API key injected via default params

Endpoints implemented:

* GET /currencies
* GET /convert

All API calls are isolated in `features/currency/api.ts` to avoid coupling network logic to UI components.

Axios Docs:
[https://axios-http.com/](https://axios-http.com/)

---

## Runtime Validation

Zod is used to validate API responses at runtime.

This prevents silent failures if API responses change.

Validation schemas are stored in:

features/currency/schemas.ts

Zod Docs:
[https://zod.dev/](https://zod.dev/)

---

## Data Fetching Strategy

TanStack React Query is used for:

* Caching
* Loading states
* Error handling
* Request deduplication

Currencies list:

* Cached for 1 hour (staleTime)
* Fetched once per session

Conversion:

* Triggered only when valid inputs exist
* Cached per combination of from, to, and amount

React Query Docs:
[https://tanstack.com/query/latest](https://tanstack.com/query/latest)

---

## Component Composition

Top-level component: ConverterCard

Responsibilities:

* Holds local state (from, to, amount)
* Composes child components

Child components:

* CurrencySelect
* AmountInput
* ResultDisplay (if separated)

State is lifted to the top-level container to avoid duplication and maintain a single source of truth.

No unnecessary global state or reducers are introduced because the UI complexity does not justify them.

---

## State Management

Local component state is sufficient:

* from currency
* to currency
* amount

Derived state is computed via React Query results rather than duplicating values.

This keeps the state model minimal and predictable.

---

## User Experience Considerations

* Loading indicators shown during API calls
* Clear error messages on failure
* Conversion disabled when inputs are invalid
* Currencies cached to reduce unnecessary network calls

Enhancements to consider:

* Swap button (swap from/to)
* Debounced amount input
* Currency formatting using Intl.NumberFormat

---

## Performance Considerations

* Currency list cached for one hour
* Conversion queries keyed by input parameters
* Avoided unnecessary re-renders through proper component boundaries
* No redundant API calls

---

## Security Considerations

The API key is exposed in the frontend for this assessment.

In a production system, the API would be proxied through a backend service to prevent exposing private API credentials.

---

## Testing Strategy (Optional Enhancement)

Tools:

* Vitest
* React Testing Library

Tests:

* Rendering of currency options
* Input updates
* Swap functionality
* Proper API calls (mocked)
* Error state rendering

Vitest Docs:
[https://vitest.dev/](https://vitest.dev/)

Testing Library Docs:
[https://testing-library.com/docs/react-testing-library/intro/](https://testing-library.com/docs/react-testing-library/intro/)

---

## How to Run Locally

1. Clone repository
2. Install dependencies
   npm install
3. Create `.env` file with API key
4. Start development server
   npm run dev

---

## Assumptions

* API rate limits are respected.
* API response structure follows documentation.
* The application is frontend-only (no backend proxy required for this assessment).

---

## Possible Improvements

* Backend proxy for API security
* Persist last selected currencies
* Add unit and integration tests
* Improve accessibility
* Add formatting and localization support
* Add optimistic UI updates

---

## Development Philosophy

The focus of this implementation is:

* Clean separation of concerns
* Predictable data flow
* Minimal but robust architecture
* Readable and maintainable code
* Clear handling of loading and error states
