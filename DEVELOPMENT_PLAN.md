# Detailed Development Plan

Currency Converter – Google-Style Card (Mobile Responsive)

Goal: Replicate Google currency converter in a centered card layout that is fully responsive, uses configuration-driven design tokens, and contains no magic numbers or hardcoded UI values.

---

# 1. Git Strategy

## Branching Model

Main branch:

* main → always production-ready

Development branches:

* feature/layout-shell
* feature/design-tokens
* feature/currency-api
* feature/converter-logic
* feature/responsive-behaviour
* feature/accessibility
* refactor/remove-magic-numbers
* chore/project-setup

Others:

* chore/ci-setup
* test/component-tests

---

## Commit Strategy

Conventional commits:

* feat:
* fix:
* refactor:
* chore:
* test:
* docs:

Example:

* feat(layout): add centered card shell
* feat(tokens): introduce spacing and color config
* refactor(ui): remove hardcoded padding
* fix(api): correct currency mapping

Commit rules:

* One logical change per commit
* No mixed concerns
* No large “dump commits”

---

# 2. High-Level Architecture

Structure:

src/
config/
designTokens.ts
layout.ts
typography.ts
theme/
themeProvider.tsx
components/
Card/
CurrencySelect/
AmountInput/
ConverterView/
features/
currency/
api.ts
hooks.ts
App.tsx
main.tsx

---

# 3. Design System Strategy

Everything visual must come from configuration.

## 3.1 Spacing Tokens

config/designTokens.ts

Example structure:

export const spacing = {
xs: 4,
sm: 8,
md: 16,
lg: 24,
xl: 32,
}

No inline padding: 16
Instead: padding: spacing.md

---

## 3.2 Typography Tokens

config/typography.ts

export const typography = {
headingLarge: {
fontSize: 40,
fontWeight: 500,
lineHeight: 1.2,
},
headingMedium: {
fontSize: 20,
fontWeight: 400,
},
body: {
fontSize: 16,
},
}

All text styles must reference these objects.

---

## 3.3 Color Tokens

config/designTokens.ts

export const colors = {
backgroundPage: "#f2f2f2",
backgroundCard: "#ffffff",
textPrimary: "#1f1f1f",
textSecondary: "#5f6368",
borderSubtle: "#dadce0",
}

No hardcoded hex values inside components.

---

## 3.4 Layout Tokens

config/layout.ts

export const layout = {
cardMaxWidth: 480,
borderRadius: 12,
inputHeight: 56,
}

No magic heights inside JSX.

---

# 4. Layout Implementation Plan

## Phase 1 – Page Shell

Tasks:

* [x] Create App layout wrapper
* [x] Implement full-height viewport container
* [x] Center content horizontally and vertically using flex
* [x] Apply background color from tokens
* [x] Add max width constraint from layout config
* [x] Remove all hardcoded pixel values

Validation:

* [x] Card is centered on desktop
* [x] Card is centered on mobile
* [x] No inline numeric styles

---

## Phase 2 – Card Component

Tasks:

* [x] Create reusable Card component
* [x] Use layout.borderRadius
* [x] Use spacing tokens for padding
* [x] Use borderSubtle for outline
* [x] No magic shadows or arbitrary spacing

Validation:

* [x] Card width adapts to mobile
* [x] Max width respected

---

# 5. UI Sections Breakdown

## Section 1 – Title Area

Text:
"1 Pound sterling equals"

"1.15 Euro"

"26 Feb, 09:32 UTC · Disclaimer"

Tasks:

* [x] Implement heading block
* [x] Use typography.headingMedium for first line
* [x] Use typography.headingLarge for main value
* [x] Use textSecondary for timestamp
* [x] Extract strings into config/text.ts
* [x] Avoid inline font sizes

---

## Section 2 – Input Blocks

Two stacked input containers.

Each block:

* [x] Left: amount input
* [x] Right: select dropdown
* [x] Vertical divider
* [x] Rounded border
* [x] Fixed height from layout.inputHeight

Tasks:

* [x] Create CurrencyInputRow component
* [x] Use flex layout
* [x] Divider width from config (e.g., 1px token)
* [x] Input height from layout config
* [x] No hardcoded widths
* [x] Use borderSubtle color

---

# 6. Responsive Strategy - (Deferred)

Requirements:

* Mobile first
* Card width: 100% minus spacing padding
* Desktop: max width constraint

Tasks:

* [ ] Use CSS clamp or media queries
* [ ] No magic breakpoints
* [ ] Breakpoints defined in config

config/layout.ts:

export const breakpoints = {
sm: 480,
md: 768,
}

Validation:

* Works on 320px width
* Looks centered on 1440px

---

# 7. API Integration Phase

Tasks:

* [x] Register API key
* [x] Create axios instance
* [x] Create fetchCurrencies
* [x] Create convertCurrency
* [x] Add React Query integration
* [x] Cache currencies for 1 hour
* [x] Disable conversion until valid inputs

Validation:

* [x] Currencies populate dropdown
* [x] Changing amount triggers conversion
* [x] No duplicate API calls

---

# 8. Interaction Plan

Tasks:

* [x] Add controlled input for amount
* [x] Add controlled select for from
* [x] Add controlled select for to
* [x] Derive conversion result from hook
* [x] Display loading state
* [x] Display error state
* [x] Replace static timestamp with dynamic UTC timestamp

---

# 9. Accessibility Plan

Tasks:

* [x] Label inputs properly
* [x] Ensure focus states visible
* [x] Ensure contrast meets WCAG
* [x] Keyboard navigable dropdown
* [x] ARIA where necessary

---

# 10. Remove Magic Numbers Review Phase

Strict pass before final:

* [x] No inline numeric padding
* [x] No inline font sizes
* [x] No hardcoded hex colors
* [x] No hardcoded border radius
* [x] No hardcoded breakpoints
* [x] No hardcoded heights
* [x] All spacing from spacing tokens
* [x] All typography from typography tokens
* [x] All colors from colors config

---

# 11. Performance Review

* [x] Currencies cached
* [x] Conversion not firing on invalid inputs
* [x] Avoid unnecessary rerenders
* [x] Memoize heavy components if needed

---

# 12. Testing Plan

## Functional Behaviour

* [ ] Card renders centered (desktop and mobile)
* [ ] Currency dropdown populates from API data
* [ ] Conversion updates on amount change
* [ ] Conversion updates on from-currency change
* [ ] Conversion updates on to-currency change
* [ ] Same-currency conversion returns input amount
* [ ] Invalid input does not trigger conversion

## API and Query State

* [ ] Loading state appears while fetching currencies
* [ ] Loading state appears while fetching conversion
* [ ] Error state is shown when currencies request fails
* [ ] Error state is shown when conversion request fails
* [ ] Dynamic timestamp updates from latest successful query

## Performance and Cache

* [ ] Currencies query is cached for 1 hour
* [ ] Repeating same conversion within cache window does not refetch
* [ ] Conversion is disabled until valid inputs are present

## UI Parity and Layout Stability

* [ ] Title/value/meta hierarchy visually matches Google pattern
* [ ] Long conversion labels do not break layout unexpectedly
* [ ] Input rows do not overflow on long currency names
* [ ] Select text uses available space before clipping

## Accessibility

* [ ] Amount and currency controls have associated labels
* [ ] Focus state is clearly visible for keyboard navigation
* [ ] Dropdowns are keyboard navigable
* [ ] Meta updates are announced politely (aria-live)
* [ ] Error message is announced as alert role

---

# 13. Final Visual Parity Checklist

* [ ] Title hierarchy matches Google currency converter
* [ ] Secondary text smaller and muted
* [ ] Input rows stacked
* [ ] Divider visible
* [ ] Rounded borders correct
* [ ] Card visually balanced
* [ ] Spacing proportional
* [ ] Mobile layout clean
* [ ] No overflow issues

---

# 14. Definition of Done

* [ ] Pixel structure visually close to Google currency converter
* [ ] Fully responsive
* [ ] All UI tokens centralized
* [ ] Clean component structure
* [x] API integration working
* [ ] Code readable and maintainable
* [ ] Clear commit history
