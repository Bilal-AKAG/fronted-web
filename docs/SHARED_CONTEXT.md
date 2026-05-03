# Shared Context

This repository owns only the frontend web application.

For now, the canonical shared system docs still live in the integrated repository:

- integrated repo: `https://github.com/ayanasamuel8/fuel-Aware-smart-inventory-system`

Use the integrated repository for:

- API contracts
- architecture
- data model
- feature map
- workflow and ownership guidance

## Planned Direction

Once backend and hardware move to their own repositories, the team should decide one of these models:

1. Keep one separate shared-docs repository for cross-team contracts
2. Keep contract docs in the backend repository and reference them from frontend and hardware
3. Duplicate only stable consumer-facing contract docs into each repo and accept manual sync cost

Recommended option:

- keep one dedicated shared-docs location to avoid contract drift across frontend, backend, and hardware repositories
