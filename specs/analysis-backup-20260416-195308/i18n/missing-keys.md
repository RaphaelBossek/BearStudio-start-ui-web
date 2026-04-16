---
title: 'Missing Keys'
---

---
---

# Missing Translation Keys

This document tracks gaps in translation coverage with auto-translate suggestions.

## Summary

- **Missing EN**: 22 keys
- **Missing DE**: 9 keys
- **Last Updated**: 2026-04-03

## Missing English Translations

| # | Key | German (DE) | Auto-Translate EN | Priority | Status |
|---|-----|-------------|-------------------|----------|--------|
| 1 | *(to be populated)* | | | | |
| 2 | *(to be populated)* | | | | |

## Missing German Translations

| # | Key | English (EN) | Auto-Translate DE | Priority | Status |
|---|-----|-------------|-------------------|----------|--------|
| 1 | *(to be populated)* | | | | |
| 2 | *(to be populated)* | | | | |

## How to Use This Document

### For Translators

1. Review auto-translate suggestions
2. Validate accuracy in context
3. Replace with professional translation if needed
4. Update domain file in `domains/`
5. Remove from this list

### For Developers

1. When adding new keys, add to both DE and EN
2. If only one language available, add here with auto-translate
3. Mark as high priority for user-facing strings

## Priority Levels

- **P0** — Blocking release (core workflow strings)
- **P1** — High priority (visible user-facing strings)
- **P2** — Medium priority (error messages, tooltips)
- **P3** — Low priority (internal strings, developer-only)

## Auto-Translate Workflow

```bash
# 1. Identify missing key
# 2. Use translation service (DeepL, Google Translate)
# 3. Add to this document with auto-translate note
# 4. Flag for human review
# 5. After review, move to domain file and remove from this list
```

## Related Documentation

- [Translation Inventory](../translation-inventory/) — Complete key inventory
- [Translation Guide](../translation-guide/) — Naming conventions
- [Hardcoded Strings](../hardcoded-strings/) — Strings needing i18n keys
