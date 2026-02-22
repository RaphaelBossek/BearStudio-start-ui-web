# Backend Rules

## Database (Neon + Prisma)
- **Skill**: Use `neon-postgres` for all Neon tasks (branching, pooler, CLI).
- **Prisma**: Type-safe DB access. Run `pnpm gen:prisma` on schema change.
- **Pooling**: Add `-pooler` to hostname in serverless if needed.
- **Push**: Use `pnpm db:push` for dev, `prisma migrate` for prod.
- **Commands**: `pnpm db:seed` (seed), `pnpm db:ui` (studio).
- **Schema**: Add indexes on columns for `WHERE`, `ORDER BY`, `JOIN`. Use `onDelete: Cascade` appropriately.
- **Backward Compatibility**: Follow the **"Expand and Contract"** (or "Parallel Schema") pattern for database changes:
    1.  **Expand**: Add new optional fields or tables.
    2.  **Migrate**: Update application code to handle both old and new structures.
    3.  **Contract**: Remove the old structures only after confirming they are no longer in use.

## API (oRPC)
- **Validation**: Define Zod schemas in `src/features/{feature}/schema.ts` for input/output. Use `zod/v4`. `z.record(z.string(), z.unknown())`.
- **Auth**: Use `protectedProcedure()` for authenticated routes.
- **RBAC**: Check roles/permissions via `context.auth.api.userHasPermission`.
- **Logging**: Use `context.logger` for structured logs (`logger.info({ id }, "event_started")`).
- **Errors**: Throw `ORPCError` (e.g., `NOT_FOUND`, `FORBIDDEN`).
- **Backward Compatibility**: Ensure non-breaking changes for OpenAPI/oRPC (trigger: `**/contract.ts`, `**/router.ts`):
    1.  **Schema Evolution**:
        - NEVER remove a field from an existing schema.
        - All new input fields must be `optional()` to avoid breaking old clients.
        - Do not change existing field types (e.g., `z.string()` cannot become `z.boolean()`).
    2.  **Procedure Management**:
        - If a procedure is replaced, use `.route({ deprecated: true })`.
        - Ensure `os.implement()` exactly matches the `oc` builder contract to prevent drift.
    3.  **Validation**:
        - After any change, run `npx orpc generate` (or spec generator) and diff the `openapi.json`.
        - If the diff shows a "Removed" property or a "Required" change on an existing field, revert.
    4.  **Versioning**: If a breaking change is required, create a new endpoint or version.

## Architecture: oRPC + Routers
- UI in `src/features/`. API in `src/server/routers/`.
- **UI Structure**: `schema.ts`, `components/`, `manager/`, `index.ts`.
- **API Structure**: `{feature}.ts` (router), `{feature}.test.ts` (test).

## Better Auth
- **Skills**: Follow `better-auth` & `better-auth-best-practices`.
- **CLI**: Run `npx @better-auth/cli generate` after schema/plugin changes.
- **Config**: Auth in `src/server/auth.tsx`. API via `src/routes/api/auth.$.ts`.
- **Adapter**: Uses `prismaAdapter` with `db` from `@/server/db`.
- **Plugins**: Synchronize client/server plugins. Use tree-shakeable imports.
- **Hooks**: Use `databaseHooks` for custom logic (e.g., demo restrictions).
- **Security**: Enable `useSecureCookies` in prod. Check `BETTER_AUTH_SECRET`/`URL` in `@/env/server`.
