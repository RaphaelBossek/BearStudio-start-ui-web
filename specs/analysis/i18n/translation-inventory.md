---
title: 'Translation Inventory'
---

---
---

# Translation Inventory

**Total Keys**: 466  
**German Coverage**: ~96%  
**English Coverage**: ~96%

## Overview

This document provides a comprehensive inventory of all translation keys used in the BearStudio application.

## Coverage by Domain

| Domain | Keys | DE Coverage | EN Coverage | Status |
|--------|------|-------------|-------------|--------|
| [Treatment](./domains/treatment.md) | 155 | 94-97% | 94-97% | In Progress |
| [Customer](./domains/customer.md) | 111 | 97-98% | 97-98% | In Progress |
| [Accounting](./domains/accounting.md) | 62 | 95-98% | 95-98% | In Progress |
| [System](./domains/system.md) | 49 | 96-100% | 96-100% | In Progress |
| [Planning](./domains/planning.md) | 57 | 95-100% | 95-100% | In Progress |
| [User Management](./domains/user-management.md) | 18 | 89% | 89% | ⚠️ Needs Attention |
| [Interfaces](./domains/interfaces.md) | 6 | 100% | 100% | ✅ Complete |
| [Academy](./domains/academy.md) | 8 | 100% | 100% | ✅ Complete |

## Missing Translations Summary

- **Missing EN**: 22 keys
- **Missing DE**: 9 keys

See [missing-keys.md](./missing-keys.md) for detailed gap analysis with auto-translate suggestions.

## Hardcoded Strings

See [hardcoded-strings.md](./hardcoded-strings.md) for German strings found in code that need i18n keys.

## How to Use This Inventory

1. **Lookup a key**: Use the [lookup script](./scripts/lookup-translations.sh)
   ```bash
   ./scripts/lookup-translations.sh "layout:nav.dashboard"
   ```

2. **Add a new key**: Add to the appropriate domain file in `domains/`

3. **Report missing translation**: Add to [missing-keys.md](./missing-keys.md)

## Related Documentation

- [Translation Guide](./translation-guide.md) — Naming conventions and workflows
- [Glossary](../glossary.md) — Domain terminology
- [SITE-NAVIGATION.md](../SITE-NAVIGATION.md) — Master navigation
