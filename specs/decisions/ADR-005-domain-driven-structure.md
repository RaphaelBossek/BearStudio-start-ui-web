---
title: 'Adr 005 Domain Driven Structure'
---

---
---

# ADR-005: Domain-Driven Documentation Structure

**Date**: 2026-04-01  
**Status**: Accepted  
**Authors**: BearStudio Team

## Context

The documentation was organized by technical layer:
- All analysis documents in nested subdirectories
- Wireframes in separate parallel structure
- Features scattered across compliance/, performance/, security/
- No clear domain boundaries
- Difficult to find all documentation for a specific feature

## Decision

We reorganized the documentation structure to be domain-driven:
- Organize by business domain (appointments, consultations, customers, staff)
- Co-locate analysis, wireframes, features, and domain docs
- Distribute NFRs to domain-specific files
- Create clear domain boundaries

## Rationale

### Why Domain-Driven

1. **Reduced Context Switching**: Developers work on features, not layers
2. **Domain Expertise**: Domain experts can own their documentation
3. **Discoverability**: All appointment docs in one place
4. **Scalability**: Easier to add new domains
5. **Alignment**: Matches domain-driven design in code

### Why Not Technical Layer

1. **Feature Fragmentation**: Appointment docs scattered across 5+ directories
2. **Context Switching**: Developers must jump between directories
3. **Unclear Ownership**: Who owns `analysis/planning/appointment/`?
4. **Poor Discoverability**: Hard to find all docs for a feature

### Why Co-locate Documentation

1. **Single Source of Truth**: All appointment info together
2. **Easier Updates**: Update all docs in one location
3. **Better Correlation**: Analysis ↔ Wireframes ↔ Features linked
4. **Domain Ownership**: Domain team owns all docs

## New Structure

```
specs/
├── analysis/
│   ├── appointments/     # All appointment analysis
│   ├── consultations/    # All consultation analysis
│   └── customers/        # All customer analysis
│
├── wireframes/
│   ├── appointments/     # All appointment wireframes
│   ├── consultations/    # All consultation wireframes
│   └── customers/        # All customer wireframes
│
├── features/
│   ├── appointments/     # Appointment functional requirements
│   ├── consultations/    # Consultation functional requirements
│   └── customers/        # Customer functional requirements
│
├── domains/
│   ├── appointments/     # Appointment domain model, state machines, NFRs
│   ├── consultations/    # Consultation domain model, state machines, NFRs
│   └── customers/        # Customer domain model, state machines, NFRs
│
└── decisions/            # Architecture Decision Records
```

## Domain Boundaries

### Appointments Domain

**Responsibility**: Scheduling, assignment, collision detection

**Entities**: Appointment, AppointmentAssignment, PatientAppointment

**Analysis**: `analysis/appointments/`
**Wireframes**: `wireframes/appointments/`
**Features**: `features/appointments/`
**Domain Model**: `domains/appointments/`

### Consultations Domain

**Responsibility**: Consultation workflows, prescriptions, warnings

**Entities**: Consultation, Prescription, ActiveIngredient, Warning

**Analysis**: `analysis/consultations/`
**Wireframes**: `wireframes/consultations/`
**Features**: `features/consultations/`
**Domain Model**: `domains/consultations/`

### Customers Domain

**Responsibility**: Customer management, locations, invoicing

**Entities**: Customer, CustomerLocation, Room, Contact, Invoice

**Analysis**: `analysis/customers/`
**Wireframes**: `wireframes/customers/`
**Features**: `features/customers/`
**Domain Model**: `domains/customers/`

### Staff Domain

**Responsibility**: User profiles, skills, availability, onboarding

**Entities**: User, Profile, Skill, Group, Availability

**Analysis**: `analysis/staff/`
**Wireframes**: `wireframes/staff/`
**Features**: `features/staff/`
**Domain Model**: `domains/staff/`

## Consequences

### Positive

- ✅ Reduced context switching for developers
- ✅ Clear domain ownership
- ✅ Easier to find documentation
- ✅ Better alignment with code structure
- ✅ Scalable structure for new domains

### Negative

- 📚 Requires relearning documentation structure
- 🔧 Migration effort to reorganize files
- 📦 Some domains have unclear boundaries initially

### Neutral

- Need to establish domain boundary conventions
- Team needs training on domain-driven design
- CI validation needed to maintain structure

## References

- [MIGRATION-PLAN.md](../MIGRATION-PLAN.md)
- [STRUCTURE.md](../STRUCTURE.md)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)
- [Domain-Driven Design Reference](https://domainlanguage.com/)
