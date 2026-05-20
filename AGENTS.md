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

## Architecture

- **Root layout:** `app/layout.tsx` (ThemeProvider, TooltipProvider, Geist + Nunito Sans + Merriweather fonts)
- **Dashboard routes:** `app/dashboard/` (vehicles, drivers, alerts, trips, analytics, devices, history)
- **Login:** `app/login/page.tsx`
- **shadcn/ui components:** `components/ui/`
- **Dashboard components:** `components/dashboard/`
- **Utilities:** `lib/utils.ts` — `cn()` helper (clsx + tailwind-merge)
- **`src/` directory:** intentionally empty (`.gitkeep`), not used for source code
- **Path alias:** `@/*` maps to repo root

## Key Conventions

- **Branch naming:** `feat/frontend-<name>`, `fix/frontend-<name>`, `docs/<topic>`
- **Commits:** conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`)
- **PRs:** small, one concern each. Include screenshots for UI changes.
- **No test framework** — no test script in package.json
- **No `.env`** file — env vars not yet defined

## Style

- Tailwind CSS v4 (uses `@tailwindcss/postcss`, no tailwind.config)
- shadcn/ui: `radix-nova` style, `olive` base color, `tabler` icons
- CSS variables via `next-themes` for dark/light mode

## Shared Context

API contracts and data models live in the integrated repo:
<https://github.com/ayanasamuel8/fuel-Aware-smart-inventory-system>

Update this repo's docs when routes, env vars, or integration contracts change.