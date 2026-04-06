---
name: dev-git-commit-message
description: Generates conventional commit messages from git diffs. Use when you need well-formatted commit messages following Conventional Commits.
argument-hint: "[--validate 'msg' | --tier 1|2|3]"
---

# Git Commit Message Generator

**Auto-generates conventional commit messages from unstaged git changes with semantic batching**

## Purpose

This skill analyzes **unstaged** modified files, groups them into **batches of same meaning/context**, then stages and commits each batch with an appropriate conventional commit message. It works with the working tree directly—not pre-staged changes—by first understanding the logical relationships between modified files, proposing meaningful batches, and then executing commits batch-by-batch.

**Key Innovation**: Semantic batch detection that groups files by meaning (e.g., same feature, same refactor, same docs update) rather than relying on pre-staged changes.

**Process Summary**:
1. Scan working tree for modified files (all unstaged changes)
2. Group files into semantic batches by meaning/context/cohesion
3. For each batch: stage → analyze → generate message → commit
4. Repeat until all meaningful batches are committed

## When This Skill Activates

- When user says "commit" or "commit these changes" (without pre-staging)
- When `/commit-msg` command is invoked
- When user requests commit message suggestions for unstaged changes
- When analyzing unstaged changes before creating commits
- When user wants to batch-commit related changes by meaning/context

## Core Capabilities

**1. Batch Detection & Grouping**
- Analyze ALL modified files (staged + unstaged)
- Cluster files by logical cohesion and dependencies
- Identify unrelated changes that should be separate commits
- Propose optimal batch breakdown with clear rationale
- Support manual batch override by user

**2. Diff Analysis (per batch)**
- Stage files in the current batch: `git add <file1> <file2> ...`
- Parse `git diff --staged` output for the staged batch
- Identify modified, added, and deleted files in batch
- Analyze code changes (additions, deletions, modifications)
- Detect patterns specific to batch scope

**3. Change Classification**
- Determine commit type from changes:
  - `feat`: New features or functionality
  - `fix`: Bug fixes
  - `security`: Security fixes or hardening
  - `refactor`: Code restructuring without behavior change
  - `docs`: Documentation changes
  - `style`: Formatting, whitespace, code style
  - `test`: Adding or modifying tests
  - `chore`: Build process, dependencies, tooling
  - `perf`: Performance improvements
  - `ci`: CI/CD configuration changes
  - `build`: Build system changes
  - `revert`: Reverting previous commits

**3. Scope Detection**
- Infer scope from file paths and patterns:
  - Directory names (e.g., `api`, `auth`, `ui`)
  - File name patterns (e.g., `*.test.js` → `tests`)
  - Framework conventions (e.g., `components/`, `services/`)

**4. Message Generation**
- Format: `type(scope): description`
- Enforce tier limits: Tier 1 summary max 50 chars; Tier 2/3 summary max 72 chars (ideal 50)
- Use imperative mood ("add" not "added")
- Focus on "what" and "why", not "how"
- Provide 2-3 alternative suggestions

**5. Iterative Batch Commit Execution**
- Process batches one at a time
- For each batch:
  * Stage only the files in that batch: `git add <file1> <file2>`
  * Let user choose/approve commit message
  * Execute commit with selected message:
    ```bash
    git commit -m "{message}"
    ```
  * Report success and proceed to next batch
- Allow user to skip batches or abort mid-process
- Track committed batches for final summary

## Tier System: Smart Format Enforcement

This skill uses a **three-tier format system** that matches message detail to commit criticality:

### Tier 1: Critical Commits (feat, fix, perf, security)

**Requirements**: Detailed documentation with impact statement

**Format**:
```
type(scope): summary line (max 50 chars)

- Detailed description point 1
- Detailed description point 2
- Detailed description point 3

This change [impact statement describing user-facing benefit or risk addressed].

Affected files/components:
- path/to/file1
- path/to/file2
```

**Why**: Features, fixes, and performance changes affect users directly and need thorough documentation for future reference and changelog generation.

### Tier 2: Standard Commits (refactor, test, build, ci)

**Requirements**: Brief context and file list

**Format**:
```
type(scope): summary line (max 72 chars)

Brief explanation of what changed and why (1-2 sentences).

Files: path/to/file1, path/to/file2
```

**Why**: Internal improvements need context for maintainability but don't require extensive documentation.

### Tier 3: Minor Commits (docs, style, chore)

**Requirements**: Summary line, optional description

**Format**:
```
type(scope): summary line (max 72 chars)

[Optional: Additional context if helpful]
```

**Why**: Documentation and routine maintenance are self-explanatory from the diff; verbose messages add noise.

## Workflow: Batched Commit Strategy

**Core Principle**: Changes should be committed in logical batches, not all at once. Each batch represents a coherent unit of work that can be understood, reviewed, and reverted independently.

```text
0. Pre-staging typecheck (if project uses TypeScript):
   - Run `pnpm check` on changed files before staging
   - Fix type errors before committing (avoids pre-commit hook retry loops)

1. Get ALL modified files (working tree, not staged):
   - git status --porcelain
   - git diff --name-only HEAD
   - Identify all files with changes (staged + unstaged)

2. Load config → `.skills/dev-git-commit-message/config.yaml`

3. ANALYZE & GROUP: Intelligent Batch Detection
   - Cluster files by logical cohesion:
     * Same directory/module → likely same batch
     * Same file type pattern → likely same batch
     * Dependency relationships → keep together
   - Detect unrelated changes:
     * Different scopes (e.g., src/api/ + docs/)
     * Different change types (e.g., feat + chore)
     * Mixed concerns (e.g., feature + formatting)
   - Propose batch breakdown:
     * Batch 1: feat(api) - authentication endpoints
     * Batch 2: test(api) - authentication tests
     * Batch 3: docs - API documentation updates

4. For EACH BATCH (iterative process):
   a. Stage only batch files:
      - git add <file1> <file2> ...
   b. Analyze batch changes:
      - git diff --staged --name-status
      - git diff --staged --stat
      - git diff --staged
      - Identify primary change type
      - Detect scope from file paths
      - Determine tier (1/2/3)
   c. Generate commit messages for batch:
      - Apply tier-appropriate format
      - Primary suggestion (best match)
      - Alternative 1 (different scope/angle)
      - Alternative 2 (broader/narrower focus)
   d. Validate against rules:
      - Check forbidden patterns
      - Verify required elements
      - Ensure length limits
   e. Present batch to user:
      - Show files in batch
      - Show suggested messages
      - Explain batch logic
   f. User approval:
      - Choose message or modify
      - Confirm commit or skip batch
   g. Execute commit:
      - git commit -m "<chosen_message>"
      - Report success
      - Move to next batch

5. Final Summary:
   - List all commits created
   - Show remaining unstaged changes (if any)
   - Suggest next steps
```

### Batch Grouping Heuristics

**Strong Cohesion (same batch)**:
- Files in same directory with related names
- Source file + its test file
- Component + its styles
- API route + its types/interfaces

**Weak Cohesion (separate batches)**:
- Different top-level directories (src/ vs docs/)
- Different concerns (feature code vs config)
- Unrelated modules (auth/ vs billing/)

**Always Separate**:
- Different commit types (feat vs chore)
- Security fixes mixed with features
- Formatting-only changes mixed with logic changes

## Optional Modes (If Supported By The Caller)

- `--validate "<message>"`: Validate a commit message without generating suggestions (format/type/scope/length/forbidden patterns; then report required Tier 1/2/3 elements if missing).
- `--tier <1|2|3>`: Force the tier format (overrides auto-detection).
- `--interactive` or `-i`: Ask for confirmation of type, scope, and summary before final output.
- `--batch <n>`: Process only batch number n (skip others).
- `--no-batch`: Disable automatic batching, commit all staged changes together (discouraged).
- `--review-batches`: Show proposed batch breakdown without committing (dry run).

## Output Format

### Batch Proposal (Step 1)

```
[NOTE] Detected 8 modified files across 3 logical batches

BATCH 1: feat(api) - 3 files
  Files: src/api/auth.ts, src/api/tokens.ts, src/middleware/auth.ts
  Changes: +145 lines, new authentication logic

BATCH 2: test(api) - 2 files
  Files: src/api/auth.test.ts, src/api/tokens.test.ts
  Changes: +89 lines, test coverage for auth

BATCH 3: docs - 3 files
  Files: README.md, docs/api/auth.md, docs/examples.md
  Changes: +67 lines, documentation updates

Proceed with batch-by-batch commit? [Y/n/custom]
```

### Per-Batch Commit (Step 2, repeated for each batch)

```
[NOTE] Processing BATCH 1 of 3 (feat(api))

Staged files:
  ✓ src/api/auth.ts
  ✓ src/middleware/auth.ts
  ✓ src/api/tokens.ts

SUGGESTED COMMIT MESSAGES:

PRIMARY:
feat(api): add user authentication endpoints

ALTERNATIVES:
1. feat(auth): implement JWT token validation
2. feat: add user authentication system

ANALYSIS:
- 3 files modified in src/api/
- New functions: authenticateUser, generateToken
- Primary change: new feature (authentication)
- Scope detected: api/auth

Choose message [1/2/3/edit/skip]:
```

### Final Summary

```
[SUCCESS] Completed batch commit process

COMMITS CREATED:
  ✓ feat(api): add user authentication endpoints
  ✓ test(api): add authentication test coverage
  ✓ docs: update API authentication documentation

REMAINING CHANGES: None
```

## Conventional Commits Quick Reference

**Type Guidelines**:
- `feat`: User-facing features or API additions
- `fix`: Corrects incorrect behavior
- `refactor`: Improves code without changing behavior
- `docs`: README, comments, documentation files
- `style`: Formatting only (prettier, eslint --fix)
- `test`: Test files or test utilities
- `chore`: Build scripts, package updates, config
- `perf`: Measurable performance improvements
- `ci`: GitHub Actions, CircleCI, build pipelines

**Scope Guidelines**:
- Use lowercase
- Be specific but not too narrow
- Match your project's module structure
- Omit if changes span multiple unrelated areas

**Description Guidelines**:
- Start with lowercase verb
- No period at the end
- Be specific and concise
- Focus on user impact for `feat` and `fix`

## Edge Cases

**Multiple unrelated changes (DEFAULT CASE)**:
- Automatically detect and split into separate batches
- Process each batch as independent commit
- Example detection:
  * src/components/ + docs/ → separate batches
  * feat + chore changes → separate batches
  * feature code + lock file → separate batches

**User wants single commit despite unrelated changes**:
- Warn about commit hygiene best practices
- Explain review/revert difficulties
- If user insists, use broader scope or omit scope
- Document the compromise in commit body

**Breaking changes**:

- Append exclamation mark after type/scope (example: feat(api)!: change auth flow)
- Include BREAKING CHANGE in body (handled by user)

**WIP or experimental**:
- Use `chore(wip): description` or `feat(experimental): description`

**No meaningful changes**:
- Detect and warn: "No modified files in working tree"
- Confirm with user if all changes were already committed

## Integration Points

**Pre-commit hook**: Triggered before commit (if installed/configured)
**Slash command**: Manual invocation via `/commit-msg`
**Direct skill call**: From other skills or tools

## Best Practices

1. **Batch by semantic meaning**: Group files that represent the same logical change (same feature, same fix, same docs update)
2. **One concern per commit**: Each commit should address a single concern or feature
3. **Analyze context**: Look at file paths, function names, import statements, and change content to determine meaning
4. **Prioritize clarity**: Prefer obvious descriptions over clever ones
5. **Respect conventions**: Follow project's existing commit patterns if detected
6. **Avoid hallucination**: Only describe what's actually in the diff
7. **Be concise**: 50 chars is ideal, 72 is maximum for first line
8. **Stage per batch**: Stage only the files in each batch, never `git add -A` or `git add .`
9. **Avoid heredoc in sandboxed shells**: Use `git commit -m "message"` directly
10. **Pre-commit typecheck**: Run `pnpm lint` on staged files before committing
11. **Review batches before committing**: Show user proposed batches for approval
12. **Allow batch customization**: Let users move files between batches or create new ones

## Example Analyses

**Scenario 1**: New React component
```
Files: src/components/UserProfile.tsx, src/components/UserProfile.test.tsx
Changes: +120 lines, component definition, props interface, tests
Message: feat(components): add UserProfile component
```

**Scenario 2**: Bug fix in API
```
Files: src/api/auth.ts
Changes: -5 +8 lines, fix token expiration check
Message: fix(auth): correct token expiration validation
```

**Scenario 3**: Documentation update
```
Files: README.md, docs/api.md
Changes: +45 lines documentation
Message: docs: update API documentation and README
```

**Scenario 4**: Dependency update
```
Files: package.json, package-lock.json
Changes: version bumps for eslint, typescript
Message: chore(deps): update eslint and typescript
```

## Analysis Patterns: Smart Type Detection

The skill uses pattern matching to intelligently detect commit types from diffs:

### feat Detection
- **New files created** (especially in src/, components/, api/)
- **New functions/classes exported** (`export function`, `export class`)
- **New API routes** (`app.get`, `router.post`, etc.)
- **New assets/skills** (in .claude/, custom-gpt/, etc.)
- **Threshold**: 20+ lines added typically indicates feature

### fix Detection
- **Test file changes** (often indicates bug reproduction)
- **New conditionals** (validation fixes)
- **Error handling additions** (`try`, `catch`, `throw`)
- **Input validation** (`validate`, `sanitize`, `check`)
- **Commit message hints**: Words like "bug", "issue", "error", "crash"

### refactor Detection
- **Balanced changes** (similar additions and deletions)
- **Function renames/moves** (same logic, different location)
- **No new features or fixes**
- **Test coverage unchanged**
- **Keywords**: "extract", "move", "rename", "reorganize"

### docs Detection
- **File patterns**: `.md`, `.txt`, `README`, `CHANGELOG`, `/docs/`
- **Pure documentation changes** (no code modifications)
- **Mixed code+docs**: Prefer code type, note docs in description

### test Detection
- **File patterns**: `test.js`, `spec.ts`, `__tests__/`, `/tests/`
- **Test framework patterns**: `describe`, `it`, `test`, `expect`, `assert`

### style Detection
- **CSS/styling files**: `.css`, `.scss`, `.sass`, `.less`
- **Formatter configs**: `prettier`, `eslint`
- **Whitespace-only changes**
- **Keywords**: "formatting", "indent", "whitespace"

### chore Detection
- **Dependency files**: `package.json`, `requirements.txt`, `Gemfile`
- **Lock files**: `package-lock.json`, `yarn.lock`
- **Config files**: `.gitignore`, `.env`
- **Keywords**: "dependency", "deps", "upgrade", "bump"

## Configuration

**Project-specific configuration** loaded from `config.yaml`:

- **Scope mapping**: Maps directory patterns to scope names (e.g., `frameworks/claude-code-kit/**` → `claude-kit`)
- **Tier rules**: Defines which commit types require which tier format
- **Forbidden patterns**: Blocks commits with generic messages or assistant/tool attribution
- **Analysis patterns**: Customizes type detection logic for your codebase
- **Validation mode**: `strict` (block), `warning` (warn), or `disabled`

## Forbidden Patterns (Validation)

The skill automatically blocks commits with these patterns:

### Generic/Vague Messages

- [FAIL] "Update files" → [OK] "docs: update API reference"
- [FAIL] "Fix stuff" → [OK] "fix(auth): correct token validation"
- [FAIL] "Change code" → [OK] "refactor(utils): simplify date formatting"

### Assistant/Tool Attribution (Per Repository Policy)

- [FAIL] "Generated with Claude Code"
- [FAIL] "Co-Authored-By: Claude <noreply@anthropic.com>"
- [FAIL] Any assistant/tool attribution in commit messages

### Work-in-Progress Markers

- [WARNING] "WIP: feature" (warning - should be squashed before merge)
- [WARNING] "temp: quick fix" (warning - should be squashed)

### Missing Type

- [FAIL] Commits without type prefix (feat, fix, docs, etc.)

## Error Handling

- **No modified files**: Run `git status` and report working tree status to user
- **Binary files only**: Note that commit message should mention file types
- **Merge conflicts**: Detect and suggest `chore: resolve merge conflicts`
- **Git not available**: Graceful failure with helpful error message
- **Forbidden pattern detected**: Show error with examples and block commit (strict mode)
- **Missing required elements**: List what's missing based on tier requirements
- **Length exceeded**: Show character count and suggest shortening

## Integration with Repository

This skill integrates with the AI-Agents repository standards:

- **CLAUDE.md reference**: Mandatory skill usage before commits
- **config.yaml**: Project-specific scope mappings and rules
- **Pre-commit hook**: Automatic activation before git commits
- **CONTRIBUTING.md**: Commit guidelines for contributors

---

## Commit Message Template

**[assets/template-commit-message.md](assets/template-commit-message.md)** — Copy-paste template and good/bad examples.

Use it to standardize `type(scope): summary` messages and keep history automation-friendly.

---

## Security-Sensitive Commits

**[assets/template-security-commits.md](assets/template-security-commits.md)** — Guide for handling security-sensitive changes.

### Key Sections

- **Pre-Commit Security Checklist** — Secrets detection, prohibited patterns
- **Security-Related Commit Types** — Security fix, enhancement, configuration
- **Accidental Secret Commits** — Immediate response, rotation, history cleanup
- **Sensitive File Patterns** — .gitignore templates, files that should never be committed
- **Audit Trail Requirements** — CVE, CVSS, CWE metadata for security commits

### Do / Avoid

#### GOOD: Do

- Run secrets scan before every commit
- Rotate secrets immediately if exposed
- Use environment variables for credentials
- Document security fixes with CVE/CVSS
- Require security team review for auth changes
- Keep .gitignore updated for secret patterns

#### BAD: Avoid

- Committing secrets "temporarily"
- Using hardcoded credentials in tests
- Storing real credentials in example files
- Assuming deleted secrets are safe
- Committing before secrets scan completes
- Using generic commit messages for security fixes

### Anti-Patterns

| Anti-Pattern | Problem | Fix |
|--------------|---------|-----|
| **"Add secrets later"** | Secrets committed accidentally | Use env vars from start |
| **Secrets in tests** | Real credentials in repo | Use mocks/test credentials |
| **Force push to hide** | History still recoverable | Rotate + document |
| **Vague security commits** | No audit trail | Include CVE/CVSS |
| **No pre-commit scan** | Secrets reach remote | Install gitleaks hook |

---

## Optional: AI/Automation

> **Note**: AI suggestions should preserve human intent.

- **Commit message suggestions** — Draft from diff analysis
- **Type detection** — Pattern-based commit type inference
- **Scope detection** — Auto-detect from changed paths

### Bounded Claims

- AI-generated messages need human review and modification
- Automated type detection may miss context
- Security commits always need human judgment

---

## Resources

| Resource | Purpose |
|----------|---------|
| [references/conventional-commits-guide.md](references/conventional-commits-guide.md) | Conventional Commits spec and tooling |
| [references/commit-message-antipatterns.md](references/commit-message-antipatterns.md) | Common bad patterns, detection, linting |
| [references/monorepo-commit-conventions.md](references/monorepo-commit-conventions.md) | Scope strategies for multi-package repos |
| [references/changelog-generation-guide.md](references/changelog-generation-guide.md) | Changelog tooling setup, CI integration |
| [data/sources.json](data/sources.json) | Curated external sources |

---

**Version**: 3.1.0-batch-20260406
**Last Updated**: 2026-04-06 (Clarified unstaged-only workflow with semantic batching)
**Repository**: AI-Agents (documentation repository)
**Conventional Commits Spec**: <https://www.conventionalcommits.org/>

## Fact-Checking

- Use web search/web fetch to verify current external facts, versions, pricing, deadlines, regulations, or platform behavior before final answers.
- Prefer primary sources; report source links and dates for volatile information.
- If web access is unavailable, state the limitation and mark guidance as unverified.
