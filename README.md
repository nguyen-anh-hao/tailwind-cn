# tailwind-cn

A **theme-driven** React UI starter built on **Tailwind CSS v4**, **CSS custom properties**, and **OKLCH color science**. Every visual property — color, shadow, radius, border, animation easing, duration, and hover transform — is controlled by a single source of truth: **theme tokens** defined in `src/index.css`.

> **Core principle:** Components adapt to _any_ theme automatically. Developers build features; the **lead** decides the themes.

---

## Table of Contents

1. [Quick Start](#quick-start)
2. [Project Structure](#project-structure)
3. [How Theming Works](#how-theming-works)
4. [Onboarding — Your First Day](#onboarding--your-first-day)
5. [The Token System (must-read)](#the-token-system)
6. [DO's and DON'Ts](#dos-and-donts)
7. [ESLint Guard](#eslint-guard)
8. [Available Components](#available-components)
9. [Creating a New Component](#creating-a-new-component)
10. [Scripts](#scripts)
11. [FAQ](#faq)

---

## Quick Start

```bash
git clone <repo-url>
cd tailwind-cn
npm install
npm run dev        # → http://localhost:5173
```

Before pushing any code, run the token linter:

```bash
npm run lint:tokens
```

---

## Project Structure

```text
tailwind-cn/
├── src/
│   ├── index.css                    # TOKEN AUTHORITY — all theme definitions live here
│   ├── App.tsx                      # Interactive showcase (demo page)
│   ├── lib/
│   │   └── utils.ts                 # cn() helper (clsx + tailwind-merge)
│   └── components/ui/
│       ├── core/
│       │   ├── layout.tsx           # Box, Stack, Flex, Container, Text
│       │   └── icon.tsx             # Lucide icon wrapper with loading skeleton
│       ├── button.tsx
│       ├── badge.tsx
│       ├── alert.tsx
│       ├── card.tsx                 # Card + AdaptiveCard (container-query)
│       ├── accordion.tsx
│       ├── tooltip.tsx
│       └── dropdown-menu.tsx
├── eslint-plugin-theme-tokens/      # Custom ESLint rule (CI guard)
│   └── index.js
├── eslint.config.js
└── package.json
```

### Off-limits for regular contributors

| File / Folder | Owner | Why |
|---|---|---|
| `src/index.css` (theme blocks) | Lead | Theme personality, colors, animation curves are design decisions |
| `eslint-plugin-theme-tokens/` | Lead | Changing guard rules can break the whole token system |

Everything else — components, pages, utilities — is fair game as long as you follow the token rules below.

---

## How Theming Works

Themes are activated by two `data-*` attributes on `<html>`:

```html
<html data-theme="neo" data-mode="dark">
```

| Attribute | Values | Controls |
|---|---|---|
| `data-theme` | `""` (default), `neo`, `glass`, `apple`, `dynamic`, `prose` | Colors, radius, shadow, border-width, animation behavior, font weight, icon stroke |
| `data-mode` | `""` (light), `dark` | Light/dark color overrides |

Each theme defines **all** CSS custom properties (`--brand`, `--radius`, `--speed`, `--ease`, `--h-transform`, etc.) in `src/index.css`. Components never pick their own visual style — they **read from tokens**.

### Theme Personalities (for context only — you don't code these)

| Theme | Animation | Radius | Border | Vibe |
|---|---|---|---|---|
| Default | Smooth scale | 0.6rem | 1px | Professional / neutral |
| Neo | Stepped snap offset | 0 | 4px | Harsh brutalism |
| Glass | Slow float upward | 1.5rem | 1px | Dreamy / ethereal |
| Apple | No hover, press-only | 0.75rem | 0.5px | Restrained elegance |
| Dynamic | Bouncy tilt | 1rem | 1.5px | Playful / energetic |
| Prose | No hover, warm shadow | 0.5rem | 1px | Warm stillness / literary |

---

## Onboarding — Your First Day

### 1. Clone & run

```bash
git clone <repo-url> && cd tailwind-cn
npm install
npm run dev
```

Open `http://localhost:5173` and use the **control panel** to switch themes and modes. Observe how every element changes automatically.

### 2. Understand the mental model

```
index.css (tokens)  →  @theme (Tailwind bridge)  →  Component classes  →  Browser
     ↑                                                     ↑
  Lead decides                                    You write these
```

You write components. Components consume tokens. The lead defines what the tokens resolve to per theme. That's the contract.

### 3. Read these files first (in order)

1. **`src/index.css`** — skim the `:root` block to see all available tokens
2. **`src/components/ui/button.tsx`** — a clean example of token usage in practice
3. **`src/lib/utils.ts`** — the `cn()` helper you'll use everywhere
4. **`src/components/ui/core/layout.tsx`** — layout primitives (`Stack`, `Flex`, `Box`, `Text`)

### 4. Run the token linter

```bash
npm run lint:tokens
```

If it passes — you're good. If it fails — it'll tell you exactly which line has a hardcoded value and what to replace it with.

---

## The Token System

Every visual property has a CSS variable → Tailwind alias → Tailwind class path:

| Property | CSS Variable | Tailwind Token | Class You Write |
|---|---|---|---|
| Shadow | `--shadow` | `--shadow-main` | `shadow-main` |
| Hover shadow | `--h-shadow` | `--hover-shadow-extra` | `hover:shadow-[var(--hover-shadow-extra)]` |
| Radius (lg) | `--radius` | `--radius-lg` | `rounded-(--radius-lg)` |
| Radius (md) | calc(--radius - 2px) | `--radius-md` | `rounded-(--radius-md)` |
| Radius (sm) | calc(--radius - 4px) | `--radius-sm` | `rounded-(--radius-sm)` |
| Duration | `--speed` | `--duration-theme` | `duration-(--duration-theme)` |
| Easing | `--ease` | `--ease-main` | `ease-main` |
| Border width | `--border-width` | `--border-width-default` | `style={{ borderWidth: "var(--border-width-default)" }}` or inline border shorthand |
| Hover transform | `--h-transform` | `--hover-transform` | `hover:[transform:var(--hover-transform)]` |
| Active transform | `--a-transform` | `--active-transform` | `active:[transform:var(--active-transform)]` |
| Brand color | `--brand` | `--color-brand` | `bg-brand`, `text-brand` |
| Background | `--background` | `--color-background` | `bg-background` |
| Foreground | `--foreground` | `--color-foreground` | `text-foreground` |
| Card bg | `--card` | `--color-card` | `bg-card` |
| Border color | `--border` | `--color-border` | `border-border` |
| Muted | `--muted` | `--color-muted` | `bg-muted` |
| Icon stroke | `--icon-w` | `--icon-stroke` | Handled by `<Icon>` component |
| Font weight | `--weight-h1`, `--weight-h2` | `--font-weight-h1`, `--font-weight-h2` | Handled by `<Text>` component |

---

## DO's and DON'Ts

### ✅ DO

```tsx
// Shadow → use token
className="shadow-main"

// Radius → use token
className="rounded-(--radius-md)"

// Duration & easing → use tokens
className="transition-all duration-(--duration-theme) ease-main"

// Hover transform → use CSS variable
className="hover:[transform:var(--hover-transform)]"

// Colors → use semantic names
className="bg-card text-card-foreground border-border"

// Border width → use CSS variable
style={{ border: "var(--border-width-default) solid var(--border)" }}

// Layout → use primitives
<Stack gap={4}>
  <Text variant="h2">Title</Text>
</Stack>
```

### ❌ DON'T

```tsx
// Hardcoded shadow → BLOCKED by ESLint
className="shadow-lg"           // ✗ Use shadow-main

// Hardcoded radius → BLOCKED by ESLint
className="rounded-lg"          // ✗ Use rounded-(--radius-lg)
className="rounded-full"        // ✗ Use rounded-(--radius-sm) or (--radius-lg)

// Hardcoded duration → BLOCKED by ESLint
className="duration-300"        // ✗ Use duration-(--duration-theme)

// Hardcoded easing → BLOCKED by ESLint
className="ease-in-out"         // ✗ Use ease-main

// Hardcoded colors (non-semantic)
className="bg-white"            // ✗ Use bg-background or bg-card
className="text-gray-700"       // ✗ Use text-foreground or text-muted-foreground
className="border-gray-200"     // ✗ Use border-border

// Hardcoded border width → BLOCKED by ESLint
className="border-2"            // ✗ Use var(--border-width-default)
```

### Why this matters

If you write `rounded-lg`, that element will have `border-radius: 0.5rem` in _every_ theme. But Neo needs `0`, Glass needs `1.5rem`, Apple needs `0.75rem`. By using `rounded-(--radius-lg)`, the element automatically adapts. Same logic for every token.

---

## ESLint Guard

This project includes a **custom ESLint plugin** (`eslint-plugin-theme-tokens`) that catches hardcoded values at dev time:

```bash
npm run lint:tokens    # Check all files in src/
npm run lint           # Full ESLint run (includes token check)
```

### What it catches

| Category | Forbidden Example | Required Replacement |
|---|---|---|
| Shadows | `shadow-lg` | `shadow-main` |
| Radius | `rounded-md` | `rounded-(--radius-md)` |
| Duration | `duration-300` | `duration-(--duration-theme)` |
| Easing | `ease-in-out` | `ease-main` |
| Border width | `border-2` | `var(--border-width-default)` |

The rule scans `className`, `cn()`, `cva()`, `clsx()`, and `twMerge()` calls. It understands string literals, template literals, ternaries, logical expressions, and arrays.

> **CI integration**: Add `npm run lint:tokens` to your CI pipeline to prevent merging non-compliant code.

---

## Available Components

| Component | File | Key Tokens Used |
|---|---|---|
| `Button` | `button.tsx` | `rounded-(--radius-md)`, `shadow-main`, `duration-(--duration-theme)`, `ease-main`, hover/active transforms |
| `Badge` | `badge.tsx` | `rounded-(--radius-sm)`, `duration-(--duration-theme)`, `ease-main` |
| `Alert` | `alert.tsx` | `rounded-(--radius-md)`, `duration-(--duration-theme)`, `ease-main`, opacity-based colors |
| `Card` / `AdaptiveCard` | `card.tsx` | `rounded-(--radius-lg)`, `shadow-main`, transforms, container queries |
| `Accordion` | `accordion.tsx` | Framer Motion animated, `border-border` |
| `Tooltip` | `tooltip.tsx` | `rounded-(--radius-sm)`, `shadow-main` (Radix UI) |
| `DropdownMenu` | `dropdown-menu.tsx` | `rounded-(--radius-md)`, `shadow-main` (Radix UI) |
| `Icon` | `core/icon.tsx` | `--icon-stroke` width, skeleton with `rounded-(--radius-sm)` |
| `Box` / `Stack` / `Flex` / `Container` / `Text` | `core/layout.tsx` | Layout primitives, density-aware spacing |

---

## Creating a New Component

Follow this checklist:

```tsx
// 1. Import
import { cn } from "../../lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

// 2. Define variants with TOKEN classes only
const myComponentVariants = cva(
  [
    "transition-all duration-(--duration-theme) ease-main",   // ✅ token duration & easing
    "rounded-(--radius-md)",                                  // ✅ token radius
    "shadow-main",                                            // ✅ token shadow
    "hover:[transform:var(--hover-transform)]",               // ✅ token hover
    "active:[transform:var(--active-transform)]",             // ✅ token active
  ],
  {
    variants: {
      variant: {
        primary: "bg-brand text-brand-foreground",            // ✅ semantic colors
        secondary: "bg-muted text-foreground border-border",  // ✅ semantic colors
      },
    },
    defaultVariants: { variant: "primary" },
  }
);

// 3. Component with cn() merge
export function MyComponent({ className, variant, ...props }) {
  return (
    <div
      className={cn(myComponentVariants({ variant }), className)}
      style={{ border: "var(--border-width-default) solid var(--border)" }}
      {...props}
    />
  );
}
```

### Before submitting a PR

1. `npm run lint:tokens` — must pass with 0 errors
2. Switch through all 5 themes + dark mode in the browser — visually verify your component adapts
3. Check `prefers-reduced-motion` — animations should disappear (handled by the global `--speed: 0ms` override)

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | TypeScript check + production build |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Full ESLint (includes token check) |
| `npm run lint:tokens` | Token compliance check only |

---

## FAQ

**Q: Can I add a new theme?**
No. Theme creation and modification is the lead's responsibility. You work with the tokens that exist.

**Q: What if I need a color that isn't in the token system?**
Use opacity modifiers on existing tokens: `bg-brand/10`, `text-foreground/60`. Don't introduce raw color values like `bg-blue-500`.

**Q: Can I use `rounded-none` or `shadow-none`?**
Yes. These are explicit _removals_ and are whitelisted by the ESLint rule.

**Q: What about one-off overrides for a very specific case?**
Use CSS variable syntax: `rounded-[var(--some-var)]` or `shadow-[var(--some-var)]`. The ESLint rule allows `var()` references. If no existing variable fits, talk to the lead about adding a new token.

**Q: I need a different animation duration for a specific micro-interaction.**
Don't hardcode `duration-150`. Instead, discuss with the lead about whether a new speed token (e.g., `--speed-fast`) should be added to the system.

**Q: The linter is blocking my code but I believe it's a false positive.**
Check the [whitelisted patterns](eslint-plugin-theme-tokens/index.js). If your case is genuinely safe, open a PR to update the ESLint plugin — the lead will review.

---

## Tech Stack

| Tech | Version | Purpose |
|---|---|---|
| React | 19 | UI framework |
| Tailwind CSS | 4 | Utility-first CSS with `@theme` API |
| Vite | 7 | Build tool & dev server |
| TypeScript | 5.9 | Type safety |
| CVA | 0.7 | Component variant management |
| Framer Motion | 12 | Animation orchestration |
| Lucide React | 0.563 | Icon system |
| Radix UI | — | Accessible primitives (Tooltip, Dropdown) |
| tailwind-merge | 3.4 | Smart class deduplication |

---

**Build features. Trust the tokens. Ship fast.**