# Frontend Rules

## Core (MANDATORY)
- **A11y**: Use `accessibility-compliance` skill for all UI dev/audits.
- **HTML**: Use semantic HTML (`<main>`, `<nav>`, `<h1>`-`<h6>`).
- **Access**: Elements must be keyboard-accessible with visible focus. Use `aria-label`/`labelledby` if no visible text.
- **shadcn/ui**: Check `src/components/ui/` first. NEVER custom-build primitives (Button, Dialog, etc). Install missing: `pnpm dlx shadcn@canary add <name>`.
- **Styling**: Tailwind CSS 4 only (no inline CSS/modules).

## Components
- **Responsive**: Support mobile (375px), tablet (768px), desktop (1440px).
- **States**: Implement loading (Skeleton), error, and empty states. Reset loading in `finally`.
- **Type**: Use TypeScript `type` for props (not `interface`).

## TanStack Router & Auth
- **Skills**: Follow `better-auth` & `better-auth-best-practices`.
- **Client**: Use `authClient` from `@/features/auth/client`. Plugins must match server.
- **Auth Guard**: Use `GuardAuthenticated` for protected routes.
- **Safety**: Use `Auth` type from `@/server/auth` with `inferAdditionalFields<Auth>()`.
- **Nav**: Use `router.navigate` or `Link`.

## Import Pattern
```tsx
import { Button } from "@/components/ui/button"
import { authClient } from "@/features/auth/client"
```
