---
title: 'Fix Mermaid Linebreaks'
---

# Plan: Fix Mermaid Line Breaks (`\n` → `<br>`)

## Issue Summary

Mermaid diagrams in the `specs/wireframes/` and `specs/analysis/` directories use `\n` for line breaks, which does **not** render as line breaks in Mermaid. The correct syntax is `<br>`.

**Example of broken syntax:**
```mermaid
C["Step 3: Fetching Patient Data\n(Loading spinner)"]
```

**Correct syntax:**
```mermaid
C["Step 3: Fetching Patient Data<br>(Loading spinner)"]
```

## Affected Files

15 markdown files require fixes:

| File | Approx. Occurrences |
|------|---------------------|
| `specs/wireframes/planning/workflows.md` | ~50 |
| `specs/wireframes/academy/workflows.md` | ~25 |
| `specs/wireframes/customer/workflows.md` | ~20 |
| `specs/wireframes/treatment/workflows.md` | ~15 |
| `specs/wireframes/interfaces/dashboard/workflows.md` | ~10 |
| `specs/wireframes/user-management/workflows.md` | ~10 |
| `specs/analysis/planning/dashboard/09-calendar-view.md` | ~5 |
| `specs/analysis/treatment/dashboard/consultation-wizard.md` | ~5 |
| `specs/analysis/consultations/07-consultation-view-review.md` | ~3 |
| `specs/analysis/treatments/treatment-plan.md` | ~3 |
| `specs/analysis/staff/profile-form.md` | ~3 |
| `specs/analysis/staff/profile-expert-availability.md` | ~3 |
| `specs/analysis/customers/invoice-details.md` | ~2 |
| `specs/analysis/system-admin/sysconfig-import.md` | ~2 |
| `specs/analysis/includes/includes-customization.md` | ~2 |

**Total: ~263 occurrences**

## Fix Approach

### Step 1: Pattern Analysis

Within mermaid code blocks, replace `\n` with `<br>` when it appears inside node labels, connection labels, or other text content.

**Context patterns where replacement applies:**
- Inside `[]` node labels: `["text\nmore text"]`
- Inside `{}` decision nodes: `{"text\nmore text"}`
- Inside `()` rounded nodes: `("text\nmore text")`
- Inside connection labels: `-->|"label\nlabel"|`
- Inside notes: `Note over X:"text\ntext"`

**Context patterns where replacement should NOT apply:**
- Inside mermaid configuration blocks (YAML frontmatter)
- Inside non-mermaid code blocks (shell commands, JSON, etc.)
- In actual string escape sequences in code examples

### Step 2: Execution

Process files in batches, one file at a time:

1. Read the file
2. Identify all mermaid code blocks (delimited by ` ```mermaid ` and ` ``` `)
3. Within each mermaid block, replace `\n` with `<br>`
4. Write the updated file

### Step 3: Verification

1. After each file is updated, visually inspect the mermaid blocks to ensure replacements are contextually correct
2. Commit changes with message: `fix(mermaid): replace \n with <br> for proper line breaks`
3. Group related files in single commits where logical

## Special Considerations

1. **In Markdown rendering contexts** where `<` may be escaped to `&lt;`, use `&lt;br&gt;` instead of `<br>`. However, most modern Mermaid renderers (GitHub, GitLab, Mermaid Live Editor) handle `<br>` correctly, so prefer `<br>`.

2. **State diagram notes** use different syntax:
   ```mermaid
   state ConfirmSkip <<choice>>
   ```
   These don't contain `\n` issues.

3. **Sequence diagram notes** use `Note over X:"text"` - these should also use `<br>` if multi-line.

4. **Sequence diagram actors/participants** cannot have multi-line labels - these should remain single line.

## Execution Order

Recommended order (largest files first for efficiency):

1. `specs/wireframes/planning/workflows.md`
2. `specs/wireframes/academy/workflows.md`
3. `specs/wireframes/customer/workflows.md`
4. `specs/wireframes/treatment/workflows.md`
5. `specs/wireframes/interfaces/dashboard/workflows.md`
6. `specs/wireframes/user-management/workflows.md`
7. Remaining analysis files

## Rollback Plan

If issues are discovered after deployment:
- Each file can be restored via git: `git checkout HEAD -- <file>`
- Commit history preserves original if commits are not amended
