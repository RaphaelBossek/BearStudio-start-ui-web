# Specs Directory Structure

> **Last Updated**: 2026-04-01  
> **Status**: Migration completed (Phases 1-7)  
> **See Also**: [MIGRATION-PLAN.md](./MIGRATION-PLAN.md)

---

## Overview

The `specs/` directory contains all specification documentation for the BearStudio application, organized by business domain rather than technical layer. This structure enables developers to work on features without context switching between unrelated modules.

## Directory Tree

```
specs/
├── README.md                    # Getting started guide
├── STRUCTURE.md                 # This file - directory structure documentation
├── MIGRATION-PLAN.md            # Migration plan from old to new structure
├── PRD.md                       # Product Requirements Document
├── DOCUMENTATION-IMPROVEMENTS.md # Documentation improvement tracker
├── RESTRUCTURING-PROGRESS.md    # Progress tracking for restructure
├── WIREFRAMES-ALIGNMENT.md      # Wireframe alignment documentation
├── MONGODB-INTEGRATION-PROPOSAL.md # MongoDB integration proposal
│
├── analysis/                    # Domain analysis documents (76 files migrated)
│   ├── README.md               # Domain overview with progress tracking
│   ├── SITE-NAVIGATION.md      # MASTER NAVIGATION - sitemap with all links
│   ├── data-dictionary-index.md # Index of all data dictionaries
│   ├── wireframe-plan-registry.md # Registry of wireframe plans
│   ├── wireframes-index.md     # Index of all wireframes
│   │
│   ├── dashboard/              # All dashboard views consolidated
│   ├── appointments/           # Core appointment management
│   ├── shifts/                 # Shift planning and management
│   ├── treatments/             # Treatment workflows
│   ├── council/                # Council planning
│   ├── consultations/          # Consultation types and wizards
│   ├── appointment-admin/      # Appointment administration
│   ├── notifications/          # Notification system
│   ├── customers/              # Customer management (consolidated)
│   ├── staff/                  # Staff management and profiles
│   ├── administration/         # Admin configuration
│   ├── system-admin/           # System administration
│   ├── includes/               # Shared components (RETAIN)
│   ├── permissions/            # RBAC matrix and permission gates
│   ├── orphan/                 # Orphaned content with context
│   ├── i18n/                   # Translation inventory and guides
│   │   ├── domains/           # Per-domain translation inventories
│   │   └── scripts/           # Translation lookup scripts
│   │
│   └── [legacy domains]        # Old structure directories (to be cleaned)
│       ├── accounting/
│       ├── academy/
│       ├── customer/
│       ├── interfaces/
│       ├── planning/
│       ├── system/
│       ├── treatment/
│       └── user-management/
│
├── wireframes/                  # Wireframe files (parallel to analysis/)
│   ├── README.md               # Wireframes domain overview
│   ├── analysis-wireframes-mapping.md # Mapping between analysis and wireframes
│   │
│   ├── components/             # Component library and design tokens
│   │   └── README.md
│   │
│   ├── dashboard/              # Dashboard wireframes
│   ├── appointments/           # Appointment wireframes
│   ├── shifts/                 # Shift wireframes
│   ├── treatments/             # Treatment wireframes
│   ├── council/                # Council wireframes
│   ├── consultations/          # Consultation wireframes
│   ├── appointment-admin/      # Appointment admin wireframes
│   ├── notifications/          # Notification wireframes
│   ├── customers/              # Customer wireframes
│   ├── staff/                  # Staff wireframes
│   ├── administration/         # Administration wireframes
│   ├── system-admin/           # System admin wireframes
│   ├── includes/               # Shared component wireframes
│   ├── orphan/                 # Orphaned wireframes with context
│   │
│   └── [legacy domains]        # Old structure directories (to be cleaned)
│       ├── accounting/
│       ├── academy/
│       ├── customer/
│       ├── interfaces/
│       ├── planning/
│       ├── system/
│       ├── treatment/
│       └── user-management/
│
├── features/                    # Functional Requirements (domain-aligned)
│   ├── README.md               # Explains FR vs NFR split
│   ├── appointments/           # FR: scheduling, collision detection
│   ├── shifts/                 # FR: shift planning, availability
│   ├── treatments/             # FR: treatment workflows
│   ├── consultations/          # FR: consultation types, wizards
│   ├── customers/              # FR: customer management flows
│   ├── staff/                  # FR: profile, onboarding flows
│   ├── administration/         # FR: admin CRUD flows
│   ├── system-admin/           # FR: system config flows
│   ├── includes/               # FR: search, navigation, user dropdown
│   │
│   └── [NFR categories]        # Non-functional requirements (legacy)
│       ├── compliance/
│       ├── performance/
│       ├── reliability/
│       ├── resource-management/
│       ├── scheduling/
│       ├── security/
│       └── ui/
│
├── domains/                     # Domain-driven design documentation
│   ├── README.md               # Domain overview with entity relationships
│   │
│   ├── appointments/
│   │   ├── entity-model.md     # Appointment, AppointmentAssignment classes
│   │   ├── state-machines.md   # 12-state appointment machine
│   │   ├── workflows.md        # Appointment lifecycle, collision detection
│   │   └── permissions.md      # Domain-specific permission gates + NFRs
│   │
│   ├── consultations/
│   │   ├── entity-model.md     # Consultation, Prescription, Warning classes
│   │   ├── state-machines.md   # 6-state consultation machine
│   │   ├── workflows.md        # Consultation wizard, ICD-10 search
│   │   └── permissions.md      # NFRs: compliance, reliability
│   │
│   ├── customers/
│   │   ├── entity-model.md     # Customer, Location, Room, Invoice classes
│   │   ├── workflows.md        # Customer onboarding, invoicing
│   │   └── permissions.md      # Domain NFRs
│   │
│   └── staff/
│       ├── entity-model.md     # User, Profile, Skill, Group classes
│       ├── workflows.md        # Profile management, onboarding
│       └── permissions.md      # Domain NFRs
│
├── decisions/                   # Architecture Decision Records (ADRs)
│   ├── README.md               # ADR index and status
│   ├── ADR-001-tanstack-router.md
│   ├── ADR-002-shadcn-ui.md
│   ├── ADR-003-mongodb-to-postgres.md
│   ├── ADR-004-unified-naming.md
│   └── ADR-005-domain-driven-structure.md
│
├── migration/                   # Data migration guides
│   ├── README.md               # Migration overview
│   ├── mongodb-reference.md    # Legacy MongoDB collections index
│   ├── schema-mapping.md       # MongoDB → PostgreSQL field mapping
│   ├── data-migration.md       # Migration scripts, validation, rollback
│   ├── denormalization-patterns.md # Embedded vs normalized data
│   ├── cutover-plan.md         # Production migration strategy
│   └── migration-status.md     # Progress per collection
│
├── testing/                     # Testing strategy and E2E scenarios
│   ├── README.md               # Testing pyramid
│   ├── testing-strategy.md     # Unit/integration/E2E balance
│   ├── e2e-scenarios.md        # Critical user journeys (Gherkin)
│   ├── component-patterns.md   # React Testing Library patterns
│   └── test-data.md            # Fixtures, factories, mock data
│
├── rules/                       # Implementation rules (RETAIN)
│   ├── table-view.md           # TanStack React Table patterns
│   └── detail-view.md          # SectionedScrollLayout patterns
│
├── planning/                    # Planning documentation (legacy)
│   ├── migration/              # Migration scripts (used for this migration)
│   │   ├── 01_migrate-directories.sh
│   │   ├── 02_rename-files.sh
│   │   ├── 03_update-references.sh
│   │   ├── 04_check-orphans.sh
│   │   ├── 05_validate-migration.sh
│   │   ├── 06_cleanup-empty-dirs.sh
│   │   └── 07_create-readmes.sh
│   │
│   └── translations/           # Translation files (legacy)
│
└── mongodb-mapping/             # MongoDB collection mappings (legacy)
    └── [collection mappings]
```

## Key Design Principles

1. **Domain-Driven** — Organized by business domain, not technical layer
2. **Parallel Structure** — `wireframes/` mirrors `analysis/` exactly
3. **Unified Naming** — Analysis and wireframes use identical base names
4. **Living Documentation** — New directories for ongoing documentation
5. **Automated Validation** — CI checks for broken links, orphaned files

## Migration Status

### Completed Phases

- ✅ **Phase 1-3**: Directory migration and file renaming
- ✅ **Phase 4**: Orphan detection (41 orphaned PNG files identified)
- ✅ **Phase 5**: Validation (1218 broken links detected - to be fixed)
- ✅ **Phase 6**: Cleanup (14 directories deleted, 53 need manual review)
- ✅ **Phase 7**: README creation for new directories

### Pending Work

- ⏳ **Manual Review**: 53 directories need manual file review/movement
- ⏳ **Wireframe Migration**: Copy .pen/.png files to new domain directories
- ⏳ **Reference Updates**: Fix 1218 broken markdown links
- ⏳ **Legacy Cleanup**: Delete old directory structure after validation
- ⏳ **Domain Docs**: Populate `domains/` directories with entity models
- ⏳ **ADR Creation**: Write Architecture Decision Records
- ⏳ **NFR Migration**: Move NFRs to `domains/{domain}/permissions.md`

## File Counts

| Directory | Files | Status |
|-----------|-------|--------|
| `analysis/` | 76 `.md` files | ✅ Migrated |
| `wireframes/` | ~200 `.pen`, `.png` files | ⚠️ Legacy locations |
| `features/` | Mixed | ⚠️ Restructured |
| `domains/` | 4 subdirs | 🆕 Created |
| `decisions/` | README only | 🆕 Created |
| `migration/` | README only | 🆕 Created |
| `testing/` | 2 files | 🆕 Created |

## Navigation

- **Start Here**: [README.md](./README.md)
- **Site Map**: [analysis/SITE-NAVIGATION.md](./analysis/SITE-NAVIGATION.md)
- **Migration Plan**: [MIGRATION-PLAN.md](./MIGRATION-PLAN.md)
- **Wireframe Mapping**: [wireframes/analysis-wireframes-mapping.md](./wireframes/analysis-wireframes-mapping.md)

## For Developers

When adding new documentation:

1. **Analysis docs** → `analysis/{domain}/{feature}.md`
2. **Wireframes** → `wireframes/{domain}/{feature}.pen` + `.png`
3. **Features** → `features/{domain}/{feature}.md`
4. **Domain models** → `domains/{domain}/entity-model.md`
5. **ADRs** → `decisions/ADR-{NNN}-{title}.md`

Always use relative paths from the file's own directory. Example:
- From `analysis/appointments/list.md`, link to `../wireframes/appointments/list.pen` as `../../wireframes/appointments/list.pen`
