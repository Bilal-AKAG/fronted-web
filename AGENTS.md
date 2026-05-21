# AGENTS.md — frontend-web

## Project

Next.js 16 App Router + React 19 + TypeScript + Tailwind CSS v4 + shadcn/ui (`radix-nova`, `olive`, `tabler` icons).
Part of the **Fuel-Aware Smart Inventory System** split-repo setup.

## Commands

```
bun dev          # dev with Turbopack
bun build        # next build
bun start        # run production server
bun lint         # ESLint (next/core-web-vitals)
bun typecheck    # tsc --noEmit  — run after lint
bun format       # prettier --write
```

CI runs: `bun lint && bun typecheck && bunx next build`

## Architecture

- **Entrypoint:** `app/layout.tsx` — wraps `ThemeProvider` + `TooltipProvider` + TanStack Query `Providers`
- **Route guard:** `proxy.ts` (Next.js 16 — not `middleware.ts`) reads `auth-token` cookie, redirects `/dashboard/*` → `/login`
- **Client fallback:** `components/auth-guard.tsx` in `app/dashboard/layout.tsx`
- **API layer:** `lib/api/client.ts` — base fetch wrapper auto-injects `Authorization: Bearer`. Per-resource modules in `lib/api/`
- **State:** Zustand stores in `lib/store/` (auth, live WebSocket state)
- **Data fetching:** TanStack Query hooks in `hooks/` — one file per resource
- **Live telemetry:** `hooks/use-websocket.ts` → `lib/store/live-state.ts` (Zustand)
- **Path alias:** `@/*` → repo root
- **`src/`:** intentionally empty (`.gitkeep`), not used

## Dashboard Pages

All under `app/dashboard/`:
- `/` — summary cards + fleet list
- `/vehicles` — grid of vehicle cards → `/vehicles/[id]` detail page (info, current state, per-vehicle alerts)
- `/alerts` — alert list → `/alerts/[id]` detail page (evidence, acknowledge/resolve)
- `/drivers` — driver table → `/drivers/[id]` detail page (info, violations, inline edit)
- `/devices` — device table (ESP32 hardware)
- `/trips` — per-vehicle trip aggregation
- `/analytics` — fleet metrics
- `/history` — telemetry history (hardcoded to vehicle V001)

## Backend Integration

- **Base URL:** `NEXT_PUBLIC_API_URL` in `.env` (`https://fuel-aware-backend.onrender.com`)
- **API prefix:** All admin routes under `/api/`
- **Auth:** `POST /api/auth/login` returns `{ token, admin }` — stored in Zustand + cookie
- **Backend repo:** https://github.com/Astu-2026-integrated-team/backend
- **Full REST coverage:** All 21 backend endpoints wired (GET + POST/PATCH mutations for vehicles, devices, drivers, alerts)
- **No global trips endpoint** — trips per-vehicle via `GET /api/vehicles/:vehicleId/trips`
- **Device telemetry:** `POST /api/telemetry` uses `X-Device-Token` (ESP32-only, not callable from frontend)

## WebSocket

- **URL:** Derived from `NEXT_PUBLIC_API_URL` — replaces `http` → `ws`, appends `/ws`
- **Events:** `CONNECTED`, `ALL_VEHICLES_STATE`, `VEHICLE_UPDATE`, `ALERT_FIRED`, `DEVICE_STATUS_CHANGE`
- **Usage:** `<WebSocketProvider />` in dashboard layout → `useLiveState` store
- **Auto-reconnect:** 3s delay, no auth required on WS connection

## Key Conventions

- **Branch naming:** `feat/frontend-<name>`, `fix/frontend-<name>`, `docs/<topic>`
- **Commits:** conventional commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`)
- **No test framework** — no test script in package.json
- **Lint before typecheck:** `bun lint && bun typecheck`
- **Create forms use shadcn `Dialog`** (not inline toggles); selects use shadcn `Select` (not native `<select>`)
- **shadcn CLI:** `bunx --bun shadcn@latest add <component>` — MCP integration available via `opencode.json`
- **Tailwind v4** — uses `@tailwindcss/postcss`, no `tailwind.config`
- **Fonts:** Nunito Sans (`--font-heading`), Merriweather (`--font-serif`), Geist (`--font-sans`), Geist Mono (`--font-mono`)
