# Feature: Database Optimization Patterns

## Status: Planned
**Created:** 2026-02-22
**Last Updated:** 2026-02-22

## Dependencies
- Prisma ORM
- Neon Postgres
- TanStack Start

## Timeline & Resources
- **Timeline:** 3 days
- **Required Resources:** Full-stack Developer, Database Administrator (or experienced Dev).

## Functional Requirements
- Improve database query performance for large datasets.
- Ensure efficient connection management in serverless environments.
- Provide a consistent pattern for data caching.

## Technical Requirements
- Use Prisma `@index` and `@@index` in the `schema.prisma` file for frequently filtered columns.
- Use Neon's connection pooling URL (usually port 5432 or 6543) for production environments.
- Implement the Prisma `include` and `select` features to avoid N+1 queries.
- Utilize TanStack Query for client-side caching and Nitro's caching for server-side responses where appropriate.

## User Stories
- **As a** Developer, **I want to** implement database indexing in Prisma **so that** my queries remain fast as the database grows.
    - **Acceptance Criteria**:
        - [ ] All tables with more than 1,000 projected rows have indexes on frequently filtered/sorted columns.
        - [ ] Indexes are defined in `schema.prisma` and applied via Prisma migrations.
        - [ ] No redundant indexes exist (verified with `EXPLAIN ANALYZE`).
    - **Definition of Done** (ISO/IEC 25010):
        - Database query times for common operations are <100ms.
        - PR with schema changes and migrations reviewed.

- **As a** DevOps Engineer, **I want to** configure Neon's connection pooling **so that** the application handles traffic spikes without hitting database connection limits.
    - **Acceptance Criteria**:
        - [ ] Connection strings are configured to use Neon's pooling server.
        - [ ] The Prisma client is correctly initialized to reuse connections.
        - [ ] Benchmarking under load (e.g., using `k6`) shows no "Too many connections" errors.

- **As a** Backend Developer, **I want to** use efficient query patterns in Prisma **so that** I avoid N+1 query performance traps.
    - **Acceptance Criteria**:
        - [ ] All related data fetching uses Prisma's `include` or `select` instead of multiple separate calls.
        - [ ] Query results are limited and paginated by default.
        - [ ] Code reviews specifically check for nested loop database calls.

## Edge Cases
- **Complex Full-Text Searches:** Standard indexing might not be enough; consider GIN indexes or full-text search features if needed.
- **Cache Invalidation:** Ensure that when data changes, the corresponding caches (TanStack Query or server-side) are invalidated or updated.
- **Cold Starts:** Connection pool initialization should not significantly impact serverless cold start times.
