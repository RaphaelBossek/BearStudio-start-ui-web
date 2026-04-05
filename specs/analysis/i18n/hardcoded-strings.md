---
title: 'Hardcoded Strings'
---

---
---

# Hardcoded Strings

This document tracks German strings found in the codebase that need i18n keys.

## Priority Levels

- **P0** — User-facing strings in core workflows (immediate action required)
- **P1** — User-facing strings in secondary features (high priority)
- **P2** — Error messages, tooltips (medium priority)
- **P3** — Developer-only strings, comments (low priority)

## Strings by Domain

### Appointments

| String | Location | Priority | Suggested Key | Status |
|--------|----------|----------|---------------|--------|
| *(to be populated)* | | | | |

### Consultations

| String | Location | Priority | Suggested Key | Status |
|--------|----------|----------|---------------|--------|
| *(to be populated)* | | | | |

### Customers

| String | Location | Priority | Suggested Key | Status |
|--------|----------|----------|---------------|--------|
| *(to be populated)* | | | | |

### Staff

| String | Location | Priority | Suggested Key | Status |
|--------|----------|----------|---------------|--------|
| *(to be populated)* | | | | |

### Administration

| String | Location | Priority | Suggested Key | Status |
|--------|----------|----------|---------------|--------|
| *(to be populated)* | | | | |

### System

| String | Location | Priority | Suggested Key | Status |
|--------|----------|----------|---------------|--------|
| *(to be populated)* | | | | |

## How to Add Strings

1. **Find hardcoded strings**: Search for German text in `.tsx`, `.ts` files
2. **Categorize by domain**: Place in appropriate section above
3. **Assign priority**: Based on user visibility and impact
4. **Create i18n key**: Follow naming conventions in [translation-guide.md](./translation-guide.md)
5. **Update code**: Replace string with `t('domain:key')` call

## Related Documentation

- [Translation Inventory](./translation-inventory.md) — Complete key inventory
- [Translation Guide](./translation-guide.md) — Naming conventions
- [Missing Keys](./missing-keys.md) — Gaps in translation coverage
