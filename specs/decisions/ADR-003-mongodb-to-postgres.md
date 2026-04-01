# ADR-003: MongoDB to PostgreSQL Migration

**Date**: 2026-04-01  
**Status**: Accepted  
**Authors**: BearStudio Team

## Context

The application currently uses MongoDB as its primary database. We evaluated migrating to PostgreSQL for the following reasons:
- Better support for complex queries and joins
- Stronger data integrity guarantees (ACID compliance)
- Better fit for relational data (appointments, users, customers)
- Improved type safety with Prisma ORM
- Better support for transactions

## Decision

We are migrating from MongoDB to PostgreSQL with Prisma as the ORM.

## Rationale

### Why PostgreSQL

1. **Relational Data**: Our data model is highly relational (appointments ↔ users ↔ customers)
2. **ACID Compliance**: Critical for appointment scheduling and billing
3. **Complex Queries**: Better support for complex queries with joins
4. **Type Safety**: Stronger typing with Prisma schema
5. **Transactions**: Better transaction support for multi-step operations
6. **Mature Ecosystem**: Extensive tooling and community support
7. **Neon Integration**: Serverless PostgreSQL with Neon for scaling

### Why Prisma ORM

1. **Type Safety**: End-to-end type safety from schema to queries
2. **Migrations**: Built-in migration system with version control
3. **Developer Experience**: Excellent DX with autocomplete and error messages
4. **Multi-Database Support**: Can switch databases if needed
5. **Active Development**: Rapidly improving with frequent updates

### Why Not Keep MongoDB

1. **Data Integrity**: MongoDB's eventual consistency model is not suitable for appointments
2. **Query Complexity**: Complex queries require aggregation pipelines
3. **Joins**: No native join support (requires $lookup)
4. **Transactions**: Limited transaction support compared to PostgreSQL
5. **Schema Evolution**: Schema-less design leads to inconsistent data over time

### Why Not Other SQL Databases

1. **MySQL**: Less advanced features compared to PostgreSQL
2. **SQLite**: Not suitable for production multi-user applications
3. **SQL Server**: Licensing costs and platform lock-in

## Migration Strategy

### Phase 1: Schema Design
- Map MongoDB collections to PostgreSQL tables
- Define Prisma schema with relationships
- Establish migration patterns

### Phase 2: Dual Write
- Write to both MongoDB and PostgreSQL
- Validate data consistency
- Build rollback capability

### Phase 3: Read Migration
- Migrate read operations to PostgreSQL
- Monitor performance and data accuracy
- Keep MongoDB as fallback

### Phase 4: Write Migration
- Migrate write operations to PostgreSQL
- Disable MongoDB writes
- Final validation

### Phase 5: Cutover
- Switch all traffic to PostgreSQL
- Archive MongoDB data
- Remove MongoDB dependency

## Consequences

### Positive

- ✅ Better data integrity and consistency
- ✅ Improved query performance for complex queries
- ✅ Stronger type safety throughout the stack
- ✅ Better support for transactions
- ✅ Easier to reason about data relationships

### Negative

- 📚 Learning curve for team members unfamiliar with SQL
- 🔧 Significant migration effort
- 📦 Need to maintain migration scripts and rollback plans
- ⏱️ Downtime during cutover (planned maintenance window)

### Neutral

- Need to update all database queries
- MongoDB data must be transformed for relational schema
- New monitoring and observability for PostgreSQL

## References

- [Prisma Documentation](https://www.prisma.io/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Neon Serverless PostgreSQL](https://neon.tech/)
- [MongoDB to PostgreSQL Migration Guide](../migration/data-migration.md)
