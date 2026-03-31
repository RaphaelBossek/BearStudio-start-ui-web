# Specs Directory Migration - Executive Summary

> **Date**: 2026-03-31  
> **Status**: ✅ **READY TO EXECUTE**  
> **Approach**: Automated shell script

---

## What's Been Prepared

### 1. Documentation ✅

| Document | Purpose | Status |
|----------|---------|--------|
| [`MIGRATION-PLAN.md`](./MIGRATION-PLAN.md) | Complete migration guide | ✅ Complete |
| [`RESTRUCTURING-PROGRESS.md`](./RESTRUCTURING-PROGRESS.md) | Progress tracking | ✅ Complete |
| [`WIREFRAMES-ALIGNMENT.md`](./WIREFRAMES-ALIGNMENT.md) | Wireframes domain mapping | ✅ Complete |
| [`analysis/SITE-NAVIGATION.md`](./analysis/SITE-NAVIGATION.md) | Master navigation | ✅ Complete |
| [`analysis/README.md`](./analysis/README.md) | Analysis domain overview | ✅ Complete |
| [`wireframes/README.md`](./wireframes/README.md) | Wireframes domain overview | ✅ Complete |
| [`migrate-directory.sh`](./migrate-directory.sh) | **Migration automation script** | ✅ Complete |

---

## Migration Overview

### What Will Happen

1. **Directory Reorganization**
   - Consolidate 50+ folders into 13 domain folders
   - Align `wireframes/` structure to match `analysis/`
   - Reduce directory depth from 5 levels to 2-3 levels

2. **File Moves**
   - Move 47+ analysis documents to new locations
   - Move 148+ wireframe files (merging from multiple sources)
   - Rename files to match new naming convention

3. **Cleanup**
   - Delete 3 orphaned PNG files not referenced anywhere
   - Remove empty directories after moves

### What Will NOT Happen (Yet)

- ❌ Content of files will NOT be modified
- ❌ Cross-references will NOT be updated (separate phase)
- ❌ Wireframe-plan transformations will NOT be done yet

---

## Automated Migration Script

### Why Use the Script?

| Aspect | Manual | Script |
|--------|--------|--------|
| **Time** | ~7 hours | ~10 seconds |
| **Errors** | Likely | Prevented |
| **Backup** | Manual | Automatic |
| **Rollback** | Complex | One command |
| **Validation** | Manual | Automatic |
| **Repeatability** | Low | Perfect |

### Script Features

- ✅ **Automatic backup** - Creates timestamped backup before any changes
- ✅ **Dry-run mode** - Preview changes without making them
- ✅ **Rollback support** - Restore from backup with one command
- ✅ **Atomic operation** - All moves happen in one run
- ✅ **Error handling** - Stops on first error, preserves backup
- ✅ **Progress logging** - Real-time status updates
- ✅ **Validation** - Checks all domains created successfully
- ✅ **File counting** - Reports how many files moved

### Usage

```bash
cd specs/

# Step 1: Preview (no changes made)
./migrate-directory.sh --dry-run

# Step 2: Execute (creates backup automatically)
./migrate-directory.sh

# Step 3: Rollback if needed
./migrate-directory.sh --rollback
```

---

## Domain Structure (After Migration)

### Analysis Domains (13)

```
analysis/
├── dashboard/          # Merged from system/dashboard + planning/dashboard
├── appointments/       # Merged from planning/appointment + appointment-support
├── shifts/             # From planning/shift
├── treatments/         # From treatment/treatment-core
├── council/            # From planning/council
├── consultations/      # Merged from treatment/consultation + treatment/dashboard
├── appointment-admin/  # From planning/appointment-admin
├── notifications/      # From system/notification
├── customers/          # Merged from customer/* subfolders
├── staff/              # Merged from user-management/* subfolders
├── administration/     # Merged from accounting/* + treatment/questionnaire
├── system-admin/       # Merged from system/admin-system + system/cdr-call
└── includes/           # Merged from system/includes + system/shell
```

### Wireframes Domains (13 - matching analysis)

```
wireframes/
├── dashboard/          # Merged from 3 sources
├── appointments/       # Merged from 2 sources
├── shifts/             # From planning/shift
├── treatments/         # From treatment/treatment-core
├── council/            # From planning/council
├── consultations/      # Merged from 2 sources
├── appointment-admin/  # From planning/appointment-admin
├── notifications/      # From system/notification
├── customers/          # Merged from customer/* subfolders
├── staff/              # Merged from user-management/* subfolders
├── administration/     # Merged from accounting/* + treatment/questionnaire
├── system-admin/       # Merged from system/admin-system + system/cdr-call
└── includes/           # Merged from system/includes + system/shell
```

---

## Orphaned Files

The following PNG files are **not referenced** in any markdown documentation and will be deleted:

| File | Location | Action |
|------|----------|--------|
| `F5baI.png` | `wireframes/planning/appointment/` | **DELETE** |
| `up8ie.png` | `wireframes/planning/appointment/` | **DELETE** |
| `login.png` | `wireframes/system/includes/` | **DELETE** |

**Total**: 3 files (~50-100 KB)

---

## Timeline

### Execution Phases

| Phase | Task | Method | Time |
|-------|------|--------|------|
| 1 | Review script | Manual | 5 min |
| 2 | Dry-run | Script | 30 sec |
| 3 | **Execute migration** | **Script** | **10 sec** |
| 4 | Verify files | Manual | 15 min |
| 5 | Update cross-references | Script (TBD) | 30 min |
| 6 | Validate links | Manual | 15 min |
| **Total** | | | **~1 hour** |

### Comparison

| Approach | Time | Risk | Reversibility |
|----------|------|------|---------------|
| **Script (recommended)** | ~1 hour | Low | One command |
| Manual | ~8 hours | High | Complex |

---

## Risk Mitigation

### Backup Strategy

1. **Automatic backup** created before any changes
   - Location: `specs/backup-YYYYMMDD-HHMMSS/`
   - Contains: Complete `analysis/` and `wireframes/` directories
   
2. **Rollback command** available
   ```bash
   ./migrate-directory.sh --rollback
   ```

3. **Backup retention** - Keep for 1 week after migration

### Validation Steps

After migration, verify:

```bash
# 1. Check all domains exist
ls -d specs/analysis/*/
ls -d specs/wireframes/*/

# 2. Count files
find specs/analysis -name "*.md" | wc -l  # Should be ~47
find specs/wireframes -name "*.png" | wc -l  # Should be ~145

# 3. Check for broken links
find specs -name "*.md" -exec grep -l "\.png" {} \; | head -5
```

---

## Next Steps

### Immediate (Before Execution)

1. ✅ Review [`migrate-directory.sh`](./migrate-directory.sh)
2. ✅ Run dry-run: `./migrate-directory.sh --dry-run`
3. ✅ Verify backup strategy is acceptable
4. ✅ Ensure no one else is working in `specs/` directory

### After Execution

1. Verify all files moved correctly
2. Create cross-reference update script (Phase 6)
3. Update all markdown internal links
4. Validate all links work (manual spot-check)
5. Delete backup after 1 week of successful use

---

## Success Criteria

Migration is successful when:

- ✅ All 13 domain directories exist in both `analysis/` and `wireframes/`
- ✅ All analysis documents moved (47+ files)
- ✅ All wireframe files moved (148+ files)
- ✅ Orphaned PNGs deleted (3 files)
- ✅ Directory structures match between analysis and wireframes
- ✅ No files lost (backup available if needed)
- ✅ Script completes without errors

---

## Questions?

- **Migration plan**: See [`MIGRATION-PLAN.md`](./MIGRATION-PLAN.md)
- **Script details**: See [`migrate-directory.sh`](./migrate-directory.sh)
- **Progress tracking**: See [`RESTRUCTURING-PROGRESS.md`](./RESTRUCTURING-PROGRESS.md)
- **Wireframes alignment**: See [`WIREFRAMES-ALIGNMENT.md`](./WIREFRAMES-ALIGNMENT.md)
- **Navigation**: See [`analysis/SITE-NAVIGATION.md`](./analysis/SITE-NAVIGATION.md)

---

**Ready to execute when you are!** 🚀

Run `./migrate-directory.sh --dry-run` to preview the changes.
