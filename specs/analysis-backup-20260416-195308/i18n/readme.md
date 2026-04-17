---
title: 'I18n'
---

# i18n Documentation

This directory contains the internationalization (i18n) documentation for the BearStudio application.

## Contents

- **[translation-inventory.md](../translation-inventory/)** — Complete inventory of all translation keys (466 keys), coverage stats, and missing translations
- **[hardcoded-strings.md](../hardcoded-strings/)** — German strings found in code that need i18n keys (prioritized list)
- **[translation-guide.md](../translation-guide/)** — Naming conventions, gender handling, batched recheck workflows
- **[missing-keys.md](../missing-keys/)** — Gaps in translation coverage (22 missing EN, 9 missing DE with auto-translate suggestions)
- **[domains/](./domains/)** — Per-domain detailed translation inventories:
  - `treatment.md` (155 keys, 94-97% coverage)
  - `customer.md` (111 keys, 97-98% coverage)
  - `accounting.md` (62 keys, 95-98% coverage)
  - `system.md` (49 keys, 96-100% coverage)
  - `planning.md` (57 keys, 95-100% coverage)
  - `user-management.md` (18 keys, 89% coverage)
  - `interfaces.md` (6 keys, 100% coverage)
  - `academy.md` (8 keys, 100% coverage)
<!-- scripts/ directory contains automation scripts (lookup-translations.sh) for local use only -->

## Strategy

The i18n implementation follows these principles:

1. **Domain-Driven Organization** — Translation keys are organized by business domain (treatment, customer, accounting, etc.)
2. **Coverage Tracking** — Each domain tracks translation coverage percentage for both German (DE) and English (EN)
3. **Automated Validation** — Batched rechecks and gap detection
4. **Living Documentation** — This inventory is continuously updated as new strings are discovered or translations are added

## Related Documentation

- [Site Navigation](../../readme) — Master navigation with sitemap structure
<!-- TODO: - [Glossary](../glossary.md) — Domain terminology and acronyms -->
