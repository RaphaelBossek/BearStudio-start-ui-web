# Junie Guidelines

This file provides a high-level entry point for working in this repository. For detailed instructions, refer to the specialized rule files in `.claude/rules/`.

## Commands

```bash
pnpm dev          # Start development server
pnpm build        # Production build (includes type checking)
pnpm start        # Production server
pnpm lint         # Check for lint/format errors (Biome)
pnpm lint         # Auto-fix lint/format issues
pnpm format       # Format all files
npx tsc --noEmit  # Type check only (fast, no build)
pnpm test         # Run tests
pnpm test --watch # Watch mode
```

## Tech Stack

- **Framework**: TanStack Start + Router, React 19
- **Database**: Neon (Postgres) + Prisma
- **Auth**: Better Auth
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Quality**: Biome, TypeScript (strict), Vitest

## Specialized Rules

Refer to these files for specific implementation details:

- **[.claude/rules/general.md](.claude/rules/general.md)**: Project workflow, specs, code style, and git conventions.
- **[.claude/rules/backend.md](.claude/rules/backend.md)**: oRPC, Prisma, Neon, and Better Auth server patterns.
- **[.claude/rules/frontend.md](.claude/rules/frontend.md)**: React patterns, accessibility, shadcn/ui, and TanStack Router.
- **[.claude/rules/security.md](.claude/rules/security.md)**: OWASP principles, secrets, and access control.
- **[.claude/rules/testing.md](.claude/rules/testing.md)**: Unit and browser testing strategies.

## Self-Correction Workflow

1. **Write code** → 2. **Run `pnpm lint && pnpx tsc --noEmit`** → 3. **Fix errors** → 4. **Repeat until clean**.

## Project Structure

```
.storybook/             Storybook UI components
e2e/                    Playwright end-to-end tests
prisma/                 Prisma schema and migrations
public/                 Static assets
src/
  components/
    brand/              Brand components
    errors/             Error components
    form/               Form components
    icons/              Icon components
    ui/                 shadcn/ui components (NEVER recreate these)
  email/                Email templates
  env/                  Environment variables
  features/{category}   Feature components by category
    auth/permissions.ts Better Auth permissions, roles and access control
  hooks/                Custom React hooks
  layouts/              Layout components
  lib/                  Utilities (orpc, tailwind, tanstack-query etc.)
  locales/              Translations
  routes/               Route definitions (TanStack Router)
    api/                API routes
    login/              Auth routes
    app/                Users' routes
    manager/            Admin routes
  server/               Server-side code
    router.ts           Router middleware (oRPC)
    db/                 Database models
    routers/            Middleware functions
  styles/               Global styles
  tests/                Vitests
  types/                TypeScript types
spec/
  PRD.md            Product Requirements Document (Vision, Roadmap)
  features/         Feature specifications
    {topic}/{feature}/  Nested feature specifications
```

## Development Workflow

1. `/specify` - Create feature spec from idea
2. `/architecture` - Design tech architecture (PM-friendly, no code)
3. `/frontend` - Build UI components (shadcn/ui first!)
4. `/backend` - Build APIs, database, RLS policies
5. `/qa` - Test against acceptance criteria + security audit
6. `/deploy` - Deploy to Vercel + production-ready checks

## Feature Tracking

All features tracked in `spec/PRD.md`. Every skill reads it at start and updates it when done. Feature specs live in `spec/features/{topic}/{feature}/`.

## Product Context

spec/PRD.md

## Feature Overview

spec/PRD.md
