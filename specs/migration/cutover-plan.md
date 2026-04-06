---
title: 'Cutover Plan'
---

# Cutover Plan: MongoDB → PostgreSQL

> **Last Updated**: 2026-04-01  
> **Status**: Draft  
> **See Also**: [Data Migration](./data-migration.md), [Migration Status](./migration-status.md)

---

## Overview

This document describes the production cutover process for migrating from MongoDB to PostgreSQL. The cutover is planned as a maintenance window with minimal downtime.

## Pre-Cutover Checklist

### Technical Readiness

- [ ] All migration scripts tested in staging
- [ ] Rollback scripts tested and verified
- [ ] PostgreSQL schema deployed to production
- [ ] Monitoring dashboards configured for PostgreSQL
- [ ] Backup strategy defined and tested
- [ ] Performance benchmarks acceptable

### Business Readiness

- [ ] Maintenance window scheduled and communicated
- [ ] Stakeholders notified of potential downtime
- [ ] Support team briefed on migration
- [ ] Rollback decision criteria defined

## Cutover Timeline

### T-7 Days (One Week Before)

- [ ] Final reminder to users about maintenance window
- [ ] Verify all migration scripts work with production data snapshot
- [ ] Confirm rollback procedure tested

### T-1 Day (Day Before)

- [ ] Full MongoDB backup
- [ ] PostgreSQL pre-provisioning check
- [ ] Team briefing and role assignments
- [ ] Communication channels established (Slack, email, phone)

### T-0 (Cutover Day)

#### Phase 1: Preparation (Duration: 30 minutes)

**Time**: HH:00 - HH:30

1. **Disable user writes** (HH:00)
   ```bash
   # Set application to maintenance mode
   kubectl set env deployment/bearstudio-app MAINTENANCE_MODE=true
   ```

2. **Verify no active writes** (HH:05)
   ```javascript
   // Check MongoDB oplog for active writes
   db.oplog.rs.find().sort({$natural: -1}).limit(1)
   ```

3. **Final MongoDB backup** (HH:10)
   ```bash
   mongodump --db bearstudio_prod --out /backups/mongodb_final_$(date +%Y%m%d_%H%M%S)
   ```

4. **PostgreSQL backup** (HH:20)
   ```bash
   pg_dump bearstudio_prod > /backups/postgresql_pre_$(date +%Y%m%d_%H%M%S).sql
   ```

#### Phase 2: Data Migration (Duration: 60 minutes)

**Time**: HH:30 - HH+30

1. **Run migration scripts** (HH:30)
   ```bash
   node scripts/migrate-all-collections.js --env=production
   ```

2. **Monitor migration progress** (HH:30 - HH+30)
   ```bash
   # Watch migration logs
   tail -f logs/migration.log
   
   # Check row counts
   psql -c "SELECT 'appointments' as table, COUNT(*) FROM appointments UNION ALL ..."
   ```

3. **Run validation scripts** (HH+20)
   ```bash
   node scripts/validate-migration.js --env=production
   ```

#### Phase 3: Validation (Duration: 30 minutes)

**Time**: HH+30 - HH+60

1. **Data integrity checks** (HH+30)
   ```sql
   -- Check foreign key integrity
   SELECT COUNT(*) FROM appointments a
   LEFT JOIN customers c ON a.customer_id = c.id
   WHERE c.id IS NULL;
   -- Should return 0
   ```

2. **Application smoke tests** (HH+40)
   ```bash
   # Run smoke test suite
   npm run test:smoke -- --env=production
   ```

3. **Performance checks** (HH+50)
   ```sql
   -- Check query performance
   EXPLAIN ANALYZE SELECT * FROM appointments WHERE start_time > now();
   ```

#### Phase 4: Go/No-Go Decision (Duration: 10 minutes)

**Time**: HH+60 - HH+70

**Criteria for GO**:
- ✅ All data migrated successfully
- ✅ Validation scripts pass
- ✅ Smoke tests pass
- ✅ Performance acceptable
- ✅ No critical issues

**Decision Process**:
1. Migration lead presents validation results
2. Team leads confirm readiness
3. Product owner gives final approval

**If NO-GO**:
- Execute rollback plan immediately
- Restore MongoDB from backup
- Revert application code

#### Phase 5: Switch Traffic (Duration: 10 minutes)

**Time**: HH+70 - HH+80

1. **Update database connection** (HH+70)
   ```bash
   # Update environment variable to PostgreSQL
   kubectl set env deployment/bearstudio-app DATABASE_URL=postgresql://...
   ```

2. **Restart application** (HH+75)
   ```bash
   kubectl rollout restart deployment/bearstudio-app
   ```

3. **Verify application health** (HH+80)
   ```bash
   kubectl rollout status deployment/bearstudio-app
   ```

#### Phase 6: Post-Cutover (Duration: 30 minutes)

**Time**: HH+80 - HH+110

1. **Disable maintenance mode** (HH+80)
   ```bash
   kubectl set env deployment/bearstudio-app MAINTENANCE_MODE=false
   ```

2. **Monitor application** (HH+80 - HH+110)
   - Watch error rates
   - Monitor query performance
   - Check user activity

3. **Communicate completion** (HH+90)
   - Send completion email to stakeholders
   - Update status page
   - Notify support team

## Rollback Plan

### Rollback Triggers

Execute rollback if ANY of the following occur:
- Data migration fails (>5% data loss)
- Validation scripts fail
- Critical smoke test failures
- Performance degradation >50%
- Application crashes on startup

### Rollback Procedure

1. **Stop migration** (Immediate)
   ```bash
   # Kill migration process
   pkill -f migrate-all-collections.js
   ```

2. **Restore MongoDB** (Duration: 30 minutes)
   ```bash
   mongorestore --db bearstudio_prod /backups/mongodb_final_...
   ```

3. **Revert application code** (Duration: 10 minutes)
   ```bash
   kubectl set env deployment/bearstudio-app DATABASE_URL=mongodb://...
   kubectl rollout restart deployment/bearstudio-app
   ```

4. **Verify rollback** (Duration: 10 minutes)
   ```bash
   # Check application health
   kubectl rollout status deployment/bearstudio-app
   
   # Verify MongoDB connectivity
   node scripts/test-mongodb-connection.js
   ```

## Post-Cutover Tasks

### Day 1 (Cutover Day)

- [ ] Monitor application continuously
- [ ] Review error logs
- [ ] Check user feedback
- [ ] Verify backup schedules

### Day 2-7 (First Week)

- [ ] Daily performance reviews
- [ ] Monitor query performance trends
- [ ] Address any data issues
- [ ] Update documentation

### Week 2-4 (Archive Phase)

- [ ] Archive MongoDB data (read-only)
- [ ] Remove MongoDB dependency from code
- [ ] Update CI/CD pipelines
- [ ] Conduct retrospective

## Communication Plan

### Before Cutover

- **T-7 days**: Email to all users
- **T-1 day**: Reminder email
- **T-0 day**: Status page update

### During Cutover

- **Status page**: Updated every 15 minutes
- **Internal Slack**: Real-time updates
- **Stakeholder group**: Key milestone updates

### After Cutover

- **Completion email**: To all users
- **Status page**: Updated to "Complete"
- **Retrospective**: Scheduled for T+3 days

## Contacts

| Role | Name | Contact |
|------|------|---------|
| Migration Lead | TBD | Slack: @migration-lead |
| Tech Lead | TBD | Slack: @tech-lead |
| Product Owner | TBD | Slack: @product-owner |
| On-Call DBA | TBD | Phone: +49-XXX-XXX |

## References

- [Data Migration](./data-migration.md) - Migration scripts
- [Migration Status](./migration-status.md) - Current progress
- [MongoDB Reference](./mongodb-reference.md) - Collection index
- [Schema Mapping](./schema-mapping.md) - Field-by-field mappings
