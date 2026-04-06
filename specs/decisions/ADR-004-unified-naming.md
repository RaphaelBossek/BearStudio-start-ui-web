---
title: 'Adr 004 Unified Naming'
---

---
---

# ADR-004: Unified Wireframe Naming Convention

**Date**: 2026-04-01  
**Status**: Accepted  
**Authors**: BearStudio Team

## Context

The wireframe files had inconsistent naming conventions:
- Some files used numeric prefixes (`01-dashboard-main.md`)
- Some files used descriptive names without prefixes (`dashboard-main.md`)
- Wireframe filenames didn't match analysis document names
- Cross-referencing between analysis and wireframes was error-prone

## Decision

We adopted a unified naming convention for all wireframe and analysis files:

1. **No Numeric Prefixes**: Remove `01-`, `02-`, etc. from filenames
2. **Matching Names**: Wireframe files use the same base name as analysis files
3. **Domain-Based Organization**: Both analysis and wireframes organized by domain
4. **Consistent Extensions**: `.md` for analysis, `.pen` + `.png` for wireframes

## Rationale

### Why Remove Numeric Prefixes

1. **File Ordering**: Numeric prefixes were used for manual ordering
2. **Git Diff Noise**: Renumbering files creates unnecessary git diff noise
3. **Maintenance Overhead**: Adding new files requires renumbering
4. **Better Alternatives**: Use table of contents or navigation files for ordering

### Why Matching Names

1. **Instant Correlation**: `analysis/appointments/list.md` ↔ `wireframes/appointments/list.png`
2. **Simpler Automation**: Scripts can correlate files by name
3. **Reduced Cognitive Load**: Developers don't need to remember different names
4. **Easier Navigation**: Predictable file locations

### Why Domain-Based Organization

1. **Reduced Context Switching**: All appointment-related files together
2. **Domain-Driven Design**: Aligns with DDD principles
3. **Team Organization**: Teams can own domains end-to-end
4. **Scalability**: Easier to add new domains

## Naming Convention

### Analysis Documents

```
analysis/
├── appointments/
│   ├── list.md           # List view
│   ├── details.md        # Details view
│   ├── assign-user.md    # Assign user dialog
│   └── plan.md           # Planning view
```

### Wireframes

```
wireframes/
├── appointments/
│   ├── list.pen          # List view wireframe
│   ├── list.png          # List view screenshot
│   ├── details.pen       # Details view wireframe
│   └── details.png       # Details view screenshot
```

### Features

```
features/
├── appointments/
│   ├── scheduling.md     # Scheduling requirements
│   └── collision.md      # Collision detection requirements
```

### Domains

```
domains/
├── appointments/
│   ├── entity-model.md   # Entity classes
│   ├── state-machines.md # State diagrams
│   ├── workflows.md      # Business workflows
│   └── permissions.md    # Permission gates + NFRs
```

## Consequences

### Positive

- ✅ Instant correlation between analysis and wireframes
- ✅ Easier to navigate documentation
- ✅ Simpler automation and validation scripts
- ✅ Reduced maintenance overhead
- ✅ Better alignment with domain-driven design

### Negative

- 📚 Requires updating all existing file references
- 🔧 Migration effort to rename files
- 📦 Some files may have naming conflicts during migration

### Neutral

- Need to update all internal markdown links
- Team needs to follow convention for new files
- CI validation needed to enforce convention

## Migration

See MIGRATION-PLAN.md (archived) for the complete migration strategy.

## References

- MIGRATION-PLAN.md (archived)
- STRUCTURE.md (archived)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
