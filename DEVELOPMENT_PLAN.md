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

* [ ] Create reusable Card component
* [ ] Use layout.borderRadius
* [ ] Use spacing tokens for padding
* [ ] Use borderSubtle for outline
* [ ] No magic shadows or arbitrary spacing

Validation:

* Card width adapts to mobile
* Max width respected

---

# 5. UI Sections Breakdown

## Section 1 – Title Area

Text:
"1 Pound sterling equals"

"1.15 Euro"

"26 Feb, 09:32 UTC · Disclaimer"

Tasks:

* [ ] Implement heading block
* [ ] Use typography.headingMedium for first line
* [ ] Use typography.headingLarge for main value
* [ ] Use textSecondary for timestamp
* [ ] Extract strings into config/text.ts
* [ ] Avoid inline font sizes

---

## Section 2 – Input Blocks

Two stacked input containers.

Each block:

* Left: amount input
* Right: select dropdown
* Vertical divider
* Rounded border
* Fixed height from layout.inputHeight

Tasks:

* [ ] Create CurrencyInputRow component
* [ ] Use flex layout
* [ ] Divider width from config (e.g., 1px token)
* [ ] Input height from layout config
* [ ] No hardcoded widths
* [ ] Use borderSubtle color

---

# 6. Responsive Strategy

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

* [ ] Register API key
* [ ] Create axios instance
* [ ] Create fetchCurrencies
* [ ] Create convertCurrency
* [ ] Add React Query integration
* [ ] Cache currencies for 1 hour
* [ ] Disable conversion until valid inputs

Validation:

* Currencies populate dropdown
* Changing amount triggers conversion
* No duplicate API calls

---

# 8. Interaction Plan

Tasks:

* [ ] Add controlled input for amount
* [ ] Add controlled select for from
* [ ] Add controlled select for to
* [ ] Derive conversion result from hook
* [ ] Display loading state
* [ ] Display error state

---

# 9. Accessibility Plan

Tasks:

* [ ] Label inputs properly
* [ ] Ensure focus states visible
* [ ] Ensure contrast meets WCAG
* [ ] Keyboard navigable dropdown
* [ ] ARIA where necessary

---

# 10. Remove Magic Numbers Review Phase

Strict pass before final:

* [ ] No inline numeric padding
* [ ] No inline font sizes
* [ ] No hardcoded hex colors
* [ ] No hardcoded border radius
* [ ] No hardcoded breakpoints
* [ ] No hardcoded heights
* [ ] All spacing from spacing tokens
* [ ] All typography from typography tokens
* [ ] All colors from colors config

---

# 11. Performance Review

* [ ] Currencies cached
* [ ] Conversion not firing on invalid inputs
* [ ] Avoid unnecessary rerenders
* [ ] Memoize heavy components if needed

---

# 12. Testing Plan

* [ ] Card renders centered
* [ ] Currency dropdown populates
* [ ] Conversion updates on input change
* [ ] Loading state appears
* [ ] Error state handled

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
* [ ] API integration working
* [ ] Code readable and maintainable
* [ ] Clear commit history
