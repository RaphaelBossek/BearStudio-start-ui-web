---
title: 'Domains'
---

---
---

# Domains Directory

This directory contains domain-driven design documentation organized by business domain.

## Purpose

Each domain folder contains:

- **entity-model.md** - Domain entities, classes, relationships
- **state-machines.md** - State machines and transitions
- **workflows.md** - Business workflows and processes
- **permissions.md** - Domain-specific permission gates + NFRs

## Domains

- **appointments/** - Appointment domain
- **consultations/** - Consultation domain
- **customers/** - Customer domain
- **staff/** - Staff domain

## Entity Model Format

```markdown
# Entity: {EntityName}

## Properties

## Relationships

## Business Rules
```

## State Machine Format

```markdown
# State Machine: {MachineName}

## States

## Transitions

## Guards
```

## NFR Categories

Non-Functional Requirements are documented per domain:

- **Performance** - Response times, throughput
- **Security** - Authentication, authorization, data protection
- **Compliance** - Regulatory requirements
- **Reliability** - Uptime, error handling
- **Scalability** - Growth patterns
