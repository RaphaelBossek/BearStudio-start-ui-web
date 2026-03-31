# Wireframes Directory Alignment Plan

> **Purpose**: Align `specs/wireframes/` directory structure to exactly match `specs/analysis/`  
> **Date**: 2026-03-31  
> **Status**: **PLANNED** - Do not execute until reviewed

---

## Overview

The wireframes directory will **mirror** the analysis directory structure exactly. This ensures:

1. **Consistent navigation** - Same folder names in both directories
2. **Easy cross-referencing** - Simple relative paths between analysis and wireframes
3. **Parallel READMEs** - Each domain has README in both locations
4. **Reduced cognitive load** - Developers know where to find everything

---

## Domain Mapping

### Complete Mapping Table

| # | Analysis Domain | Wireframes Domain | Source Directories (Current) |
|---|-----------------|-------------------|------------------------------|
| 1 | `dashboard/` | `dashboard/` | `planning/dashboard/` + `system/dashboard/` + `interfaces/dashboard/` |
| 2 | `appointments/` | `appointments/` | `planning/appointment/` + `planning/appointment-support/` |
| 3 | `shifts/` | `shifts/` | `planning/shift/` |
| 4 | `treatments/` | `treatments/` | `treatment/treatment-core/` |
| 5 | `council/` | `council/` | `planning/council/` |
| 6 | `consultations/` | `consultations/` | `treatment/consultation/` + `treatment/dashboard/` |
| 7 | `appointment-admin/` | `appointment-admin/` | `planning/appointment-admin/` |
| 8 | `notifications/` | `notifications/` | `system/notification/` |
| 9 | `customers/` | `customers/` | `customer/customer-core/` + `customer/room/` + `customer/equipment/` + `customer/contact/` |
| 10 | `staff/` | `staff/` | `user-management/profile/` + `user-management/dashboard/` |
| 11 | `administration/` | `administration/` | `accounting/` (all) + `treatment/questionnaire/` |
| 12 | `system-admin/` | `system-admin/` | `system/admin-system/` + `system/cdr-call/` + `system/config/` |
| — | `includes/` | `includes/` | `system/includes/` + `system/shell/` + `system/templates-files/` |
| — | `academy/` | `academy/` | `academy/` (retain separate) |

---

## File Moves

### Phase 1: Dashboard Domain

```bash
# Merge 3 source directories into wireframes/dashboard/
mv specs/wireframes/planning/dashboard/*.pen specs/wireframes/dashboard/
mv specs/wireframes/planning/dashboard/*.png specs/wireframes/dashboard/
mv specs/wireframes/system/dashboard/*.pen specs/wireframes/dashboard/
mv specs/wireframes/system/dashboard/*.png specs/wireframes/dashboard/
mv specs/wireframes/interfaces/dashboard/*.pen specs/wireframes/dashboard/
mv specs/wireframes/interfaces/dashboard/*.png specs/wireframes/dashboard/

# Rename files to match analysis docs
mv specs/wireframes/dashboard/calendar.png specs/wireframes/dashboard/month-view.png
mv specs/wireframes/dashboard/expert-availability-week.png specs/wireframes/dashboard/availability-week.png
mv specs/wireframes/dashboard/expert-availability-month.png specs/wireframes/dashboard/availability-month.png
```

### Phase 2: Appointments Domain

```bash
# Merge 2 source directories
mv specs/wireframes/planning/appointment/*.pen specs/wireframes/appointments/
mv specs/wireframes/planning/appointment/*.png specs/wireframes/appointments/
mv specs/wireframes/planning/appointment-support/*.pen specs/wireframes/appointments/
mv specs/wireframes/planning/appointment-support/*.png specs/wireframes/appointments/

# Rename to match analysis docs
mv specs/wireframes/appointments/appointment-list.png specs/wireframes/appointments/list.png
mv specs/wireframes/appointments/appointment-details.png specs/wireframes/appointments/details.png
mv specs/wireframes/appointments/appointment-details-referenced.png specs/wireframes/appointments/details-referenced.png
mv specs/wireframes/appointments/appointment-details-patients.png specs/wireframes/appointments/details-patients.png
mv specs/wireframes/appointments/appointment-details-assigned.png specs/wireframes/appointments/details-assigned.png
mv specs/wireframes/appointments/appointment-details-suggestions.png specs/wireframes/appointments/details-suggestions.png
mv specs/wireframes/appointments/appointment-assign-user.png specs/wireframes/appointments/assign-user.png
mv specs/wireframes/appointments/appointment-state-legend.png specs/wireframes/appointments/state-legend.png

# DELETE ORPHANED FILES
rm specs/wireframes/appointments/F5baI.png  # NOT referenced in any .md
rm specs/wireframes/appointments/up8ie.png  # NOT referenced in any .md
```

### Phase 3: Consultations Domain

```bash
# Merge 2 source directories
mv specs/wireframes/treatment/consultation/*.pen specs/wireframes/consultations/
mv specs/wireframes/treatment/consultation/*.png specs/wireframes/consultations/
mv specs/wireframes/treatment/dashboard/*.pen specs/wireframes/consultations/
mv specs/wireframes/treatment/dashboard/*.png specs/wireframes/consultations/

# Rename to match analysis docs
mv specs/wireframes/consultations/consultation-list.png specs/wireframes/consultations/list.png
mv specs/wireframes/consultations/consultation-details-header.png specs/wireframes/consultations/details-header.png
mv specs/wireframes/consultations/consultation-details-standard.png specs/wireframes/consultations/standard-form.png
mv specs/wireframes/consultations/consultation-details-onboarding.png specs/wireframes/consultations/onboarding-form.png
mv specs/wireframes/consultations/consultation-details-incarceration.png specs/wireframes/consultations/incarceration-form.png
mv specs/wireframes/consultations/consultation-details-treatment-warning.png specs/wireframes/consultations/treatment-warning.png
mv specs/wireframes/consultations/consultation-view.png specs/wireframes/consultations/view.png
mv specs/wireframes/consultations/consultation-review.png specs/wireframes/consultations/review.png
mv specs/wireframes/consultations/consultation-icd10-search.png specs/wireframes/consultations/icd10-search.png
mv specs/wireframes/consultations/consultation-export-template.png specs/wireframes/consultations/export-template.png
mv specs/wireframes/consultations/consultation-wizard.png specs/wireframes/consultations/wizard.png
mv specs/wireframes/consultations/consultation-location-wizard.png specs/wireframes/consultations/location-wizard.png
```

### Phase 4: Other Domains

Similar pattern for remaining domains (see MIGRATION-PLAN.md for complete list).

---

## Orphaned Files Cleanup

### Identified Orphans

The following PNG files are **not referenced** in any markdown documentation:

| File | Current Location | Reason for Deletion |
|------|------------------|---------------------|
| `F5baI.png` | `planning/appointment/` | Not referenced in any .md file |
| `up8ie.png` | `planning/appointment/` | Not referenced in any .md file |
| `login.png` | `system/includes/` | Not referenced in any .md file |

### Verification

Before deletion, verify these files are truly orphaned:

```bash
cd specs/wireframes

# Check each file
echo "Checking F5baI.png..."
grep -r "F5baI.png" . --include="*.md" && echo "FOUND" || echo "NOT FOUND - SAFE TO DELETE"

echo "Checking up8ie.png..."
grep -r "up8ie.png" . --include="*.md" && echo "FOUND" || echo "NOT FOUND - SAFE TO DELETE"

echo "Checking login.png..."
grep -r "login.png" . --include="*.md" && echo "FOUND" || echo "NOT FOUND - SAFE TO DELETE"
```

### Deletion Command

```bash
# Execute during Phase 7 (Cleanup)
rm specs/wireframes/planning/appointment/F5baI.png
rm specs/wireframes/planning/appointment/up8ie.png
rm specs/wireframes/system/includes/login.png

# Verify deletion
ls specs/wireframes/planning/appointment/*.png | grep -E 'F5baI|up8ie' && echo "ERROR: Files still exist" || echo "SUCCESS: Orphans removed"
ls specs/wireframes/system/includes/*.png | grep login && echo "ERROR: File still exists" || echo "SUCCESS: Orphans removed"
```

---

## Cross-Reference Updates

After moving files, update all references in markdown files:

### Pattern 1: Workflows.md References

```bash
# Old format
![W1: Appointment List](./appointment/appointment-list.png)

# New format
![W1: Appointment List](./appointments/list.png)
```

### Pattern 2: Domain README References

```bash
# Old format
[`calendar.png`](../wireframes/planning/dashboard/calendar.png)

# New format
[`calendar.png`](../wireframes/dashboard/calendar.png)
```

### Automated Update Script

```bash
#!/bin/bash
# Update wireframe references in all .md files

find specs -name "*.md" -type f | while read file; do
  # Update appointment references
  sed -i 's|wireframes/planning/appointment/appointment-list|wireframes/appointments/list|g' "$file"
  sed -i 's|wireframes/planning/appointment/appointment-details|wireframes/appointments/details|g' "$file"
  # ... (add all other patterns)
  
  # Update dashboard references
  sed -i 's|wireframes/planning/dashboard/calendar|wireframes/dashboard/calendar|g' "$file"
  sed -i 's|wireframes/system/dashboard/dashboard-admin|wireframes/dashboard/admin|g' "$file"
  # ... (add all other patterns)
done
```

---

## Validation

After all moves and updates:

### 1. Check Directory Structure

```bash
echo "=== Analysis Domains ==="
ls -d specs/analysis/*/ | sort

echo "=== Wireframes Domains ==="
ls -d specs/wireframes/*/ | sort

# Verify they match (excluding academy)
diff <(ls -d specs/analysis/*/ | grep -v academy | sort) \
     <(ls -d specs/wireframes/*/ | grep -v academy | sort) && \
echo "✅ Directory structures match!" || echo "❌ Mismatch detected"
```

### 2. Check PNG File References

```bash
# Find all broken image references
find specs -name "*.md" -type f | while read file; do
  grep -oP '!\[.*?\]\(.*?\.png\)' "$file" | while read img; do
    target=$(echo "$img" | grep -oP '\(\K.*?\.png')
    if [ ! -f "specs/$target" ]; then
      echo "BROKEN LINK in $file: $target"
    fi
  done
done
```

### 3. Check for Orphaned PNGs

```bash
# Find PNG files not referenced in any .md
find specs/wireframes -name "*.png" -type f | while read file; do
  if ! grep -r "$(basename $file)" specs --include="*.md" > /dev/null 2>&1; then
    echo "ORPHANED: $file"
  fi
done
```

---

## Timeline

| Phase | Task | Estimated Time |
|-------|------|----------------|
| 1 | Create domain READMEs | 2 hours |
| 2 | Move dashboard wireframes | 30 min |
| 3 | Move appointments wireframes | 30 min |
| 4 | Move consultations wireframes | 30 min |
| 5 | Move remaining domains | 2 hours |
| 6 | Update cross-references | 1 hour |
| 7 | Delete orphaned files | 15 min |
| 8 | Validation | 30 min |
| **Total** | | **~7 hours** |

---

## Related Documents

- [`MIGRATION-PLAN.md`](./MIGRATION-PLAN.md) - Complete migration guide
- [`RESTRUCTURING-PROGRESS.md`](./RESTRUCTURING-PROGRESS.md) - Progress tracking
- [`analysis/SITE-NAVIGATION.md`](./analysis/SITE-NAVIGATION.md) - Master navigation
- [`wireframes/README.md`](./wireframes/README.md) - Wireframes overview

---

**Last Updated**: 2026-03-31  
**Status**: PLANNED - Do not execute until reviewed
