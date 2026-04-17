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
| [Treatment](./domains/treatment/) | 155 | 94-97% | 94-97% | In Progress |
| [Customer](./domains/customer/) | 111 | 97-98% | 97-98% | In Progress |
| [Accounting](./domains/accounting/) | 62 | 95-98% | 95-98% | In Progress |
| [System](./domains/system/) | 49 | 96-100% | 96-100% | In Progress |
| [Planning](./domains/planning/) | 57 | 95-100% | 95-100% | In Progress |
| [User Management](./domains/user-management/) | 18 | 89% | 89% | ⚠️ Needs Attention |
| [Interfaces](./domains/interfaces/) | 6 | 100% | 100% | ✅ Complete |
| [Academy](./domains/academy/) | 8 | 100% | 100% | ✅ Complete |

## Missing Translations Summary

- **Missing EN**: 22 keys
- **Missing DE**: 9 keys

See [../missing-keys.md](../missing-keys) for detailed gap analysis with auto-translate suggestions.

## Hardcoded Strings

See [../hardcoded-strings.md](../hardcoded-strings) for German strings found in code that need i18n keys.

## How to Use This Inventory

1. **Lookup a key**: Search for the key in the domain files under `domains/`

2. **Add a new key**: Add to the appropriate domain file in `domains/`

3. **Report missing translation**: Add to [missing-keys.md](../missing-keys)

## Related Documentation

- [Translation Guide](../translation-guide) — Naming conventions and workflows
<!-- TODO: - [Glossary](../glossary.md) — Domain terminology -->
- [README](../../readme) — Master navigation
