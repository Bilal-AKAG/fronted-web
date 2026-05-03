# Contributing Guide

## Purpose

This repository is focused on the frontend web application only. The contribution process is optimized for small UI and integration changes with low merge risk.

## Core Expectations

- build in small slices
- keep work scoped to one concern
- use mocked data when backend endpoints are not ready
- update documentation when routes, env vars, or integration contracts change
- include screenshots for visual changes

## Branch Naming

Use:

```text
feat/frontend-<short-name>
fix/frontend-<short-name>
docs/<topic>
chore/<topic>
test/<topic>
```

Examples:

- `feat/frontend-dashboard-shell`
- `feat/frontend-alerts-panel`
- `fix/frontend-loading-state`
- `docs/frontend-setup`

## Commit Format

Use conventional commits:

```text
feat: add dashboard shell
fix: handle empty alert state
docs: define frontend setup
test: add dashboard component tests
chore: add frontend ci workflow
```

## Pull Request Rules

- one logical change per PR
- keep PRs small
- include test steps
- include screenshots for UI changes
- state follow-up work clearly

## Required Checks Before Merge

- relevant CI passes
- docs updated if needed
- at least one approval
- no unresolved critical review comments

## Review Priorities

1. correctness
2. UI behavior and regressions
3. contract clarity
4. testability
5. code style

## Definition of Done

A change is done when:

- the change works locally or against mock data
- affected docs are updated
- the PR description is complete
- screenshots or test evidence are included when relevant
