---
title: 'Translation Guide'
---

---
---

# Translation Guide

This document provides guidelines and conventions for managing translations in the BearStudio application.

## Naming Conventions

### Key Structure

Translation keys follow the pattern: `{domain}:{context}.{action}`

**Examples**:
- `appointment:list.title` — Title for appointment list page
- `consultation:standard.form.submit` — Submit button in standard consultation form
- `customer:detail.location.add` — Add location action in customer details

### Domain Prefixes

| Domain | Prefix | File Location |
|--------|--------|---------------|
| Appointments | `appointment:` | `analysis/appointments/` |
| Consultations | `consultation:` | `analysis.consultations/` |
| Customers | `customer:` | `analysis/customers/` |
| Staff/Users | `user:` | `analysis/staff/` |
| Accounting | `accounting:` | `analysis/administration/` |
| System | `system:` | `analysis/system-admin/` |
| Planning | `planning:` | `analysis/appointments/`, `analysis/shifts/` |
| Interfaces | `interface:` | `analysis/includes/` |
| Academy | `academy:` | `analysis/orphan/` |

### Context Levels

1. **Page/View Level**: `appointment:list`, `customer:detail`
2. **Section Level**: `appointment:list.header`, `customer:detail.locations`
3. **Element Level**: `appointment:list.header.title`, `customer:detail.locations.add`

## Gender Handling

German has grammatical gender. Follow these guidelines:

### Generic Masculine/Feminine

Use underscore notation for gender-neutral labels:

- `Mitarbeiter:in` — Staff member
- `Benutzer:in` — User
- `Expert:in` — Expert

### Translation Key Pattern

```
user:role.expert_in = "Expert:in"
user:role.staff_member = "Mitarbeiter:in"
```

### Plurals

Handle plurals explicitly in keys:

```
appointment:list.count_one = "{{count}} Termin"
appointment:list.count_other = "{{count}} Termine"
```

## Batched Recheck Workflow

When updating translations, follow this workflow:

### 1. Extract New Strings

```bash
# Search for German strings in code
grep -r "[ÄÖÜäöüß]" src/components/ src/routes/ --include="*.tsx" --include="*.ts"
```

### 2. Add to Inventory

Add new strings to appropriate domain file in `domains/` or [hardcoded-strings.md](./hardcoded-strings.md)

### 3. Lookup Existing Keys

Use the lookup script to check if keys already exist:

```bash
./scripts/lookup-translations.sh "appointment:list.title" "customer:detail.name"
```

### 4. Update Missing Translations

Add missing translations to [missing-keys.md](./missing-keys.md) with auto-translate suggestions

### 5. Review and Validate

- Review auto-translate suggestions for accuracy
- Validate context appropriateness
- Update domain files with final translations

## Translation File Structure

Each domain file in `domains/` follows this structure:

```markdown
# {Domain} Domain Translations

**Keys**: {count} | **DE Coverage**: {percentage} | **EN Coverage**: {percentage}

## Translation Keys

| Key | German (DE) | English (EN) | Status |
|-----|-------------|--------------|--------|
| `domain:key` | German text | English text | ✅ |

## Missing Translations

| Key | German (DE) | English (EN) | Priority |
|-----|-------------|--------------|----------|
| `domain:missing` | ... | ... | P1 |
```

## Best Practices

1. **Be Consistent** — Use the same term for the same concept throughout
2. **Context Matters** — Provide context when adding new keys
3. **Avoid Concatenation** — Don't build sentences from fragments
4. **Use Variables** — For dynamic content: `"Hello, {{name}}!"`
5. **Test in UI** — Always verify translations render correctly in the UI

## Related Documentation

- [Translation Inventory](./translation-inventory.md) — Complete key inventory
- [Hardcoded Strings](./hardcoded-strings.md) — Strings needing i18n keys
- [Missing Keys](./missing-keys.md) — Gaps in translation coverage
