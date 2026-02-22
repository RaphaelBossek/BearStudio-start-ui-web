---
description: Create implementation plan with codebase analysis and technical architecture
argument-hint: <feature description | path to spec/feature/{topic}/{feature}/>
---

# Implementation Plan Generator

**Input**: $ARGUMENTS

## Objective

Transform the input into a battle-tested implementation plan through codebase exploration, pattern extraction, and technical architecture design.

**Core Principle**: PLAN ONLY - no code written. Create a context-rich document that enables one-pass implementation.

**Order**: CODEBASE FIRST. Solutions must fit existing patterns.

---

## Phase 1: PARSE

### Determine Input Type

| Input                                      | Action |
|--------------------------------------------|--------|
| `specs/PRD.md` file                        | Read PRD, extract next pending phase |
| Other `specs/{topic}/{feature}/*.md` files | Read and extract feature description |
| Free-form text                             | Use directly as feature input |
| Blank                                      | Use conversation context |

### Extract Feature Understanding

- **Reference**: Refer to `spec/features/{topic}/{feature}/requirements.md` and related files
- **Problem**: What are we solving? (Extract from spec)
- **User Story**: As a [user], I want to [action], so that [benefit] (Extract from spec)
- **Type**: NEW_CAPABILITY / ENHANCEMENT / REFACTOR / BUG_FIX
- **Complexity**: LOW / MEDIUM / HIGH

---

## Phase 2: EXPLORE

### Study the Codebase

**Mechanism**: Persistent Analysis
- **If** `specs/planning/codebase-analysis-results.md` exists:
  1. Use `git diff` to find changes since last run.
  2. Incorporate these changes into the analysis.
  3. Update the file with the latest codebase state.
- **Else**:
  1. Perform a FULL scan of the codebase.
  2. Save the summary to `specs/planning/codebase-analysis-results.md`.

Use the Explore agent to find:
1. **Similar implementations** - analogous features with file:line references
2. **Naming conventions** - actual examples from the codebase
3. **Error handling patterns** - how errors are created and handled
4. **Type definitions** - relevant interfaces and types
5. **Test patterns** - test file structure and assertion styles

### Document Patterns

| Category | File:Lines | Pattern |
|----------|------------|---------|
| NAMING | `path/to/file.ts:10-15` | {pattern description} |
| ERRORS | `path/to/file.ts:20-30` | {pattern description} |
| TYPES | `path/to/file.ts:1-10` | {pattern description} |
| TESTS | `path/to/test.ts:1-25` | {pattern description} |

---

## Phase 3: ARCHITECTURE (Solution Architect)

Apply the `architecture` skill to design the technical approach. The output of the `architecture` skill will define the following:
1. **Component Structure (Visual Tree)**
2. **Data Model (Plain Language)**
3. **Tech Decisions**
4. **Dependencies**

The resulting design must be added to the feature specification file.

---

## Phase 4: DESIGN & MAPPING

### Map the Changes

- What files need to be created?
- What files need to be modified?
- What's the dependency order?

### Identify Risks

| Risk | Mitigation |
|------|------------|
| {potential issue} | {how to handle} |

---

## Phase 5: GENERATE

### Create Plan File

**Output path**: `.agents/plans/{kebab-case-name}.plan.md`

```bash
mkdir -p .agents/plans
```

```markdown
# Plan: {Feature Name}

## Summary

{One paragraph: What we're building and approach}

## Requirements Reference

- **Feature Spec**: `spec/features/{topic}/{feature}/requirements.md`
- **User Stories & AC**: `spec/features/{topic}/{feature}/{feature-story}.md`
- **Common AC**: `spec/features/{topic}/{feature}/acceptance-criteria.md`

---

## Technical Architecture

{Architecture design from the `architecture` skill, including Component Structure, Data Model, and Tech Decisions}

---

## Patterns to Follow

### Naming
```
// SOURCE: {file:lines}
{actual code snippet}
```

### Error Handling
```
// SOURCE: {file:lines}
{actual code snippet}
```

### Tests
```
// SOURCE: {file:lines}
{actual code snippet}
```

---

## Files to Change

| File | Action | Purpose |
|------|--------|---------|
| `path/to/file.ts` | CREATE | {why} |
| `path/to/other.ts` | UPDATE | {why} |

---

## Tasks

Execute in order. Each task is atomic and verifiable.

### Task 1: {Description}

- **File**: `path/to/file.ts`
- **Action**: CREATE / UPDATE
- **Implement**: {what to do}
- **Mirror**: `path/to/example.ts:lines` - follow this pattern
- **Validate**: `pnpm run build`

{Continue for each task...}

---

## Validation

```bash
# Type check
pnpm run build

# Lint
pnpm run lint

# Tests
pnpm test
```

---

## Acceptance Criteria

- [ ] All tasks completed
- [ ] Type check passes
- [ ] Tests pass
- [ ] Follows existing patterns
```

---

## Phase 6: OUTPUT

```markdown
## Plan Created

**File**: `.agents/plans/{name}.plan.md`

**Summary**: {2-3 sentence overview}

**Scope**:
- {N} files to CREATE
- {M} files to UPDATE
- {K} total tasks


**Next step**: Review the plan, then `/implement {name}` tasks in order.
```
