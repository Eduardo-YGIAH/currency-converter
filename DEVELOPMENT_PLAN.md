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

# 6. Responsive Strategy (Google-Parity Mobile First)

Requirements:

* Mobile first
* Must render correctly on 320px viewport without horizontal overflow
* Preserve Google converter proportions and spacing hierarchy
* Card width: fill available space between page paddings on small screens
* Desktop: centered card with max width constraint

Tasks:

* [x] Remove fixed `cardMinWidth` behaviour that blocks 320px layouts
* [x] Keep card at `width: 100%` and rely on container padding + `cardMaxWidth`
* [x] Use media queries only where Google parity requires layout scaling
* [x] Keep all breakpoints tokenized in `config/layout.ts` (no inline values)
* [x] Verify typography scales/line breaks remain visually consistent at 320px
* [x] Ensure long currency names do not cause horizontal overflow at 320px
* [x] Keep select clipping behaviour aligned with Google (no ellipsis glyph)

config/layout.ts:

export const breakpoints = {
xs: 320,
sm: 480,
md: 768,
lg: 1024,
}

Validation:

* [x] No horizontal scrolling at 320px viewport
* [x] Card remains centered and visually balanced on 320px
* [x] Title/value/meta hierarchy remains readable on 320px
* [x] Input rows keep alignment and tap-target usability on 320px
* [x] Looks centered on 1440px

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

* [x] Currency dropdown populates from API data
* [x] Conversion updates on amount change
* [x] Conversion updates on from-currency change
* [x] Conversion updates on to-currency change
* [x] Same-currency conversion returns input amount
* [x] Invalid input does not trigger conversion

## API and Query State

* [x] Loading state appears while fetching currencies
* [x] Loading state appears while fetching conversion
* [x] Error state is shown when currencies request fails
* [x] Error state is shown when conversion request fails
* [x] Dynamic timestamp updates from latest successful query

## Performance and Cache

* [x] Currencies query is cached for 1 hour
* [x] Repeating same conversion within cache window does not refetch
* [x] Conversion is disabled until valid inputs are present

## UI Parity and Layout Stability

* [x] Title/value/meta hierarchy visually matches Google pattern
* [x] Long conversion labels do not break layout unexpectedly
* [x] Input rows do not overflow on long currency names
* [x] Select text uses available space before clipping

## Accessibility

* [x] Amount and currency controls have associated labels
* [x] Focus state is clearly visible for keyboard navigation
* [x] Dropdowns are keyboard navigable
* [x] Meta updates are announced politely (aria-live)
* [x] Error message is announced as alert role

---

# 13. Final Visual Parity Checklist

* [x] Title hierarchy matches Google currency converter
* [x] Secondary text smaller and muted
* [x] Input rows stacked
* [x] Divider visible
* [x] Rounded borders correct
* [x] Card visually balanced
* [x] Spacing proportional
* [x] Mobile layout clean
* [x] No overflow issues

---

# 14. Definition of Done

* [x] Pixel structure visually close to Google currency converter
* [x] Fully responsive
* [x] All UI tokens centralized
* [x] Clean component structure
* [x] API integration working
* [x] Code readable and maintainable
* [x] Clear commit history
