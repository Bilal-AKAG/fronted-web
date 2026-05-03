# AGENTS.md — frontend-web

## Project

Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui.
Part of the **Fuel-Aware Smart Inventory System** split-repo setup.

## Commands

```
bun dev          # dev with Turbopack
bun build        # production build
bun start        # run production server
bun lint         # ESLint (next/core-web-vitals)
bun typecheck    # tsc --noEmit
bun format       # prettier --write
```

**CI mismatch:** `.github/workflows/frontend-ci.yml` uses `npm` and watches `src/**`, but the repo uses `bun.lock` and source files live at the root (`app/`, `components/`, `hooks/`, `lib/`), not in `src/`. CI will not trigger on most file changes. Fix or align when appropriate.

## Architecture

- **App Router entrypoint:** `app/layout.tsx` (root layout with ThemeProvider, Geist + Nunito Sans + Merriweather fonts)
- **Home page:** `app/page.tsx`
- **shadcn/ui components:** `components/ui/` (aliases: `@/components/ui`, `@/lib`, `@/hooks`)
- **Utilities:** `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- **`src/` directory:** intentionally empty (`.gitkeep`), not used for source code
- **Path alias:** `@/*` maps to repo root (not to `src/`)

## Key Conventions

- **PRs:** small, one concern each. Include screenshots for UI changes.
- **Branch naming:** `feat/frontend-<name>`, `fix/frontend-<name>`, `docs/<topic>`
- **Commits:** conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`)
- **No test framework** configured yet — `npm test --if-present` in CI is a no-op
- **No `.env`** file present — env vars not yet defined

## Shared Context

API contracts, data models, and architecture decisions live in the integrated repo:
<https://github.com/ayanasamuel8/fuel-Aware-smart-inventory-system>

Update this repo's docs when routes, env vars, or integration contracts change.

## Style

- Tailwind CSS v4 (uses `@tailwindcss/postcss`, no tailwind.config file)
- shadcn/ui style: `radix-nova`, base color: `olive`, icons: `tabler`
- CSS variables for fonts and theming via `next-themes`
- Prettier with `prettier-plugin-tailwindcss`
