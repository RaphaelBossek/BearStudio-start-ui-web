# General Rules

## Specs & Features
- Track all in `spec/features/INDEX.md` and `spec/features/{category}/{feature}.md`.
- File naming: kebab-case. Max 60 chars. Single responsibility.
- Merge clarifications into existing specs. Avoid new categories.
- Update status: Planned, In Progress, In Review, Deployed.

## Code Style & Rules
- **Biome**: Use `pnpm lint` and `npx tsc --noEmit`. Fix errors immediately.
- **Formatting**: Single quotes for JS/TS, double for JSX. 2-space indent. Always semicolons. Arrow parentheses.
- **Rules**: Use `const` where possible. `===` only. Braces on `if/else`. Use `type` for imports.
- **Logging**: Use `getLogger("domain")`. Pattern: `_started`, `_completed`, `_failed`.

## Git & Commits
- **Skill**: Use `git-commit-message` for all commits.
- **Format**: Tiered Conventional Commits (Tier 1: detailed feat/fix; Tier 2: standard refactor/test; Tier 3: summary-only docs/chore).
- **Style**: Imperative mood ("add"), no period. No agent/tool attribution.

## Workflow
- **Safety**: READ files before editing. Verify paths, names, APIs by reading (no guessing).
- **Handoff**: Suggest next skill manually after completion: "Next step: Run `/skillname` to [action]".
- **Approval**: Ask for user approval before finalizing. Present clear options.
