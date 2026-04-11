# Features Directory

This directory contains **Functional Requirements (FR)** organized by domain.

## FR vs NFR Split

- **Functional Requirements (FR)**: Located here in `features/{domain}/`
  - Describe what the system should do
  - User stories and acceptance criteria
  - Domain-specific workflows

- **Non-Functional Requirements (NFR)**: Located in `domains/{domain}/permissions.md`
  - Performance, security, compliance requirements
  - Reliability, scalability constraints
  - Domain-specific quality attributes

## Domain Structure

- **appointments/** - Scheduling, collision detection, assignment
- **shifts/** - Shift planning, availability management
- **treatments/** - Treatment workflows
- **consultations/** - Consultation types, wizards
- **customers/** - Customer management flows
- **staff/** - Profile, onboarding flows
- **administration/** - Admin CRUD flows
- **system-admin/** - System configuration flows
- **includes/** - Search, navigation, user dropdown

## Template

Each feature file should include:

```markdown
# Feature: {Feature Name}

## User Stories

## Acceptance Criteria

## Edge Cases

## Related Documents

- Analysis: `../analysis/{domain}/{file}.md`
- Wireframes: `../wireframes/{domain}/{file}.png`
- Domain Model: `../domains/{domain}/entity-model.md`
```
