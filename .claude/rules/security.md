# Security Rules

## Core
- **Skill**: Use `owasp-security` for guidance on vulnerability prevention.
- **Secrets**: NEVER commit secrets. Use `.env.local`. Use `VITE_` prefix ONLY for browser-safe values. Verify in `src/env/`.

## Access & Auth (A01, A07)
- **oRPC**: Use `protectedProcedure` for all authenticated endpoints.
- **IDOR**: Implement ownership checks (e.g., `userId: context.user.id`) in Prisma.
- **Client**: Protect routes with `GuardAuthenticated`.
- **Better Auth**: Use for all authentication/session logic. Enforce strong passwords/MFA where needed.

## Data & Communication (A02, A03, A08)
- **HTTPS**: Enforce for all communication.
- **Headers**: Set `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `HSTS`.
- **Injection**: Use Zod for all server-side validation. Prisma prevents SQLi via parameterized queries.
- **Sanitize**: Use DOMPurify before rendering/inserting HTML.
- **Integrity**: Use `pnpm-lock.yaml`. Run `pnpm audit` regularly.

## Design & Logging (A04, A09)
- **Rate Limit**: Apply to sensitive endpoints.
- **Fail Safe**: Don't leak technical info in production errors.
- **Logs**: Use `action_state` to log security events: `logger.warn({ id }, "access_denied")`.
