# Common Acceptance Criteria

## Summary
The implementation of database optimization must ensure that the application handles large amounts of data efficiently, remains performant under load, and optimizes for serverless database connection limits.

## Specific Criteria
- [ ] Every database model in `schema.prisma` that is expected to contain >1,000 rows has appropriate indexes.
- [ ] No "N+1" query patterns are present in the codebase.
- [ ] Use `PgBouncer` or Neon's serverless connection string for production database connections.
- [ ] All database queries (read/write) are wrapped in error handling and logged (for slow query detection).
- [ ] Use `select` to only fetch required fields, minimizing data transfer between the database and application server.

## ISO/IEC 25010 Verification
- **Functional Suitability:** Database operations correctly return data even with optimization (e.g., indexes don't impact correctness).
- **Performance Efficiency:** Query response times are monitored and meet the <100ms threshold for common paths.
- **Reliability:** Connection pooling ensures database availability even during traffic spikes.
- **Maintainability:** Schema changes and optimization logic are well-documented and follow standard Prisma patterns.

## Further Suggestions
- **Further Suggestions for Acceptance Criteria:**
    - Monitor Neon's dashboard for "Slowest Queries" to identify new indexing opportunities.
    - Set up a staging environment that mirrors production data volume for realistic performance testing.
- **Further Suggestions for Hypotheses:**
    - Hypothesis: Implementing Prisma's `extended-client` could centralize logging and performance monitoring.
    - Hypothesis: Using Nitro's `useStorage` for expensive aggregation queries could drastically reduce database load.
