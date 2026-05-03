# Fuel-Aware Frontend Web

Frontend web application repository for the Fuel-Aware Smart Inventory System.

## Purpose

This repository owns the standalone web dashboard and related frontend-only assets for the project.

Current scope:

- React web dashboard
- frontend state and UI flows
- dashboard integration with backend APIs and realtime updates
- frontend environment setup
- frontend CI

## Relationship To Other Repositories

This repository is part of a split project structure:

- frontend web: this repository
- backend: separate repository planned
- hardware: separate repository planned
- shared project planning and cross-team contracts: currently maintained in the integrated project repository

Shared contract docs currently live in:

- `https://github.com/ayanasamuel8/fuel-Aware-smart-inventory-system`

Until the backend and hardware repositories are split, treat the integrated repository as the source of truth for:

- API contracts
- shared architecture decisions
- shared data model
- team workflow and ownership boundaries

## Initial Structure

```text
.
├── .github/
├── docs/
├── public/
└── src/
```

## Next Setup Steps

1. Initialize the frontend stack in `src/`
2. Add `package.json` and lockfile
3. Add frontend environment examples
4. Add lint, test, and build scripts
5. Add frontend CI workflow
6. Connect the app to the backend API and Supabase-backed realtime flow

## Working Rules

- keep PRs small
- include screenshots for UI changes
- update frontend docs when routes, env vars, or integration contracts change
- do not hardcode secrets or service keys
