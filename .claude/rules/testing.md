# Testing Rules

## Unit Tests (`unit`)
- **Pattern**: `src/**/*.unit.test.ts`. Env: Node.js.
- **Scope**: Server logic, oRPC routers, utilities.
- **Mocks**: Prisma/Auth auto-mocked in `src/server/routers/test-setup.ts`.
- **Router Rule**: Never use `toHaveBeenCalledWith` on `mockDb.*`. Assert only on result.

## Browser Tests (`browser`)
- **Pattern**: `src/**/*.browser.test.ts`. Env: Playwright.
- **Scope**: React components, UI.
- **Cleanup**: `vitest-browser-react`'s `cleanup` is automatic.

## General
- **Imports**: Use `@/` absolute imports.
- **State**: Keep tests independent. Reset shared state in `beforeEach`.
- **Strategy**: Assert on behavior and results, not implementation details.
