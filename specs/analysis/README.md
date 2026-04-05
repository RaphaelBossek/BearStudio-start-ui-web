---
title: 'Analysis'
---

---
---

# Analysis Domain Documentation

This directory contains domain-driven analysis documentation for the application.

## Structure

The analysis directory is organized by business domain rather than technical layer:

- **dashboard/** - Dashboard views (standard, admin, self-service)
- **appointments/** - Core appointment management
- **shifts/** - Shift planning and availability
- **treatments/** - Treatment workflows
- **council/** - Council planning
- **consultations/** - Consultation types and forms
- **appointment-admin/** - Appointment administration
- **notifications/** - Notification system
- **customers/** - Customer management
- **staff/** - Staff management and profiles
- **administration/** - Administrative configuration
- **system-admin/** - System administration
- **includes/** - Shared components and templates
- **permissions/** - RBAC matrix and permission gates
- **orphan/** - Orphaned content with context
- **i18n/** - Internationalization documentation

## Navigation

Start with [SITE-NAVIGATION.md](./SITE-NAVIGATION.md) for the complete sitemap.

## Correlation with Wireframes

Each analysis document correlates with wireframes in `specs/wireframes/` using the same domain and file names:

- Analysis: `appointments/list.md` ↔ Wireframe: `appointments/list.png`

## Progress Tracking

| Domain | Analysis | Wireframes | Features | Domains |
|--------|----------|------------|----------|---------|
| Dashboard | ✅ | ✅ | 🔄 | 🔄 |
| Appointments | ✅ | ✅ | 🔄 | 🔄 |
| Shifts | ✅ | ✅ | 🔄 | 🔄 |
| Consultations | ✅ | ✅ | 🔄 | 🔄 |
| Customers | ✅ | ✅ | 🔄 | 🔄 |
| Staff | ✅ | ✅ | 🔄 | 🔄 |

✅ Complete | 🔄 In Progress | ⏳ Pending
