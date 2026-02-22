# AI-Optimized Codebase Guide

Welcome! This guide explains the key principles and patterns that make a codebase "AI-optimized" and shows exactly how they're implemented in this Next.js template.

---

## 📚 Table of Contents

1. [What Makes a Codebase AI-Optimized?](#what-makes-a-codebase-ai-optimized)
2. [Core Principles](#core-principles)
3. [The AI Feedback Loop](#the-ai-feedback-loop)
4. [Architecture: oRPC Router Pattern](#architecture-orpc-router-pattern)
5. [Type Safety with TypeScript](#type-safety-with-typescript)
6. [Runtime Validation with Zod](#runtime-validation-with-zod)
7. [Structured Logging](#structured-logging)
8. [Database Layer with Prisma](#database-layer-with-prisma)
9. [Error Handling](#error-handling)
10. [Testing Strategy](#testing-strategy)
11. [Fast Tooling](#fast-tooling)
12. [Putting It All Together](#putting-it-all-together)

---

## What Makes a Codebase AI-Optimized?

An AI-optimized codebase is designed so that AI agents can:

1. **Understand code quickly** through clear patterns and structure
2. **Self-correct errors** by reading machine-readable feedback
3. **Generate valid code** that passes type checks and validation
4. **Work independently** with minimal human intervention
5. **Iterate rapidly** using fast tools and clear error messages

The key insight: **AI reads error messages like documentation.** If your tools produce clear, structured errors with exact locations and fixes, AI can debug itself.

---

## Core Principles

### 1. Machine-Readable Feedback

Every tool in this codebase produces structured output that AI can parse:

- **TypeScript**: `src/file.ts:45:12 - error TS2322: Type 'X' is not assignable to type 'Y'`
- **Biome**: Lint errors with rule names and auto-fix suggestions
- **Vitest**: `Expected X, received Y` with exact diffs
- **Pino Logs**: Structured JSON with context fields

### 2. One Source of Truth

Don't duplicate information. Types, validation, and database schemas should derive from a single definition:

- Database schema → Types (via Prisma Client generation)
- Zod schema → Types (via `z.infer<>`)
- Schema changes → Automatic migration generation

### 3. Fail Fast

Errors should surface immediately, not at runtime:

- Missing environment variables → App won't start
- Type mismatches → Won't compile
- Invalid queries → TypeScript error
- Wrong validation schema → Test failure

### 4. Clear Boundaries

Each layer has one responsibility. Dependencies flow in one direction:

```
API Router → Handler → Database
     ↓         ↓
  Schemas   Logging
```

### 5. Consistent Patterns

Every feature follows the same structure. Learn it once, apply it everywhere:

```
src/features/{feature}/
├── schema.ts      # Zod validation schemas
├── components/    # Feature-specific components
└── index.ts       # Public UI exports

src/server/routers/{feature}.ts   # oRPC router definitions
```

---

## The AI Feedback Loop

AI development follows a continuous cycle:

```
1. Write Code
   ↓
2. Run Checks (lint, typecheck, test)
   ↓
3. Parse Errors (structured, with locations)
   ↓
4. Fix Issues (automated or guided)
   ↓
5. Repeat until all checks pass
```

### Running the Feedback Loop

After writing or modifying code, always run:

```bash
pnpm lint && npx tsc --noEmit
```

This gives you:
- Lint errors with rule names and auto-fix suggestions
- Type errors with exact file:line:column locations
- Suggestions for fixes (e.g., "Did you mean 'toUpperCase'?")

**Why this matters for AI**: These errors are precise enough for AI to parse and fix automatically.

<details>
<summary>Example: Self-Correction in Action</summary>

**1. Introduce a typo:**
```typescript
// src/features/projects/router.ts
const name = input.name.toUppercase(); // Typo: should be toUpperCase()
```

**2. Run checks:**
```bash
npx tsc --noEmit
```

**3. Get precise error:**
```
src/features/projects/router.ts:48:25 - error TS2551:
Property 'toUppercase' does not exist on type 'string'.
Did you mean 'toUpperCase'?
```

**4. AI parses this and fixes:**
- File: `src/features/projects/router.ts`
- Line: `48`, Column: `25`
- Problem: Property doesn't exist
- Suggestion: Use `toUpperCase` instead

**5. Fix and verify:**
```typescript
const name = input.name.toUpperCase(); // Fixed
```
```bash
npx tsc --noEmit
# ✓ All checks pass
```

</details>

---

## Architecture: oRPC Router Pattern

### What is oRPC Router Pattern?

Traditional codebases organize by technical layer. This template organizes API logic in routers and UI logic in feature slices.

### Feature UI Structure (src/features/)

Every feature in `src/features/` follows this structure:

```
{feature}/
├── schema.ts         # Zod validation schemas
├── components/       # Feature-specific React components
├── manager/          # Management pages/logic
└── index.ts          # Public UI exports
```

### API Router Structure (src/server/routers/)

API logic is organized in oRPC routers:

```
src/server/routers/
├── {feature}.ts      # oRPC router definitions
└── {feature}.test.ts # Router tests
```

### Why This Matters for AI

**Locality**: To understand a feature, AI reads the feature folder and the corresponding router.

**Type Safety**: oRPC ensures that types are shared between frontend and backend without duplication.

**Pattern Recognition**: AI learns the oRPC procedure pattern once and applies it to all endpoints.

---

## Database Layer with Prisma

### Why Type-Safe ORMs Matter for AI

Traditional ORMs use strings for queries, which are prone to typos that AI might introduce. Prisma uses TypeScript, so typos are caught at compile time.

### Prisma in This Codebase

Prisma is a TypeScript-native ORM with full type inference.

### Schema Definition

Database tables are defined in `prisma/schema.prisma`.

```prisma
model Book {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  title     String
  author    String
  genre     Genre?   @relation(fields: [genreId], references: [id])
  genreId   String
  publisher String?
  coverId   String?

  @@unique([title, author])
  @@map("book")
}
```

### Type-Safe Queries

Prisma provides full TypeScript support for queries. Autocomplete works, and typos are caught immediately.

```typescript
const book = await context.db.book.findUnique({
  where: { id: input.id },
});
```

---

## Testing Strategy

### Why Testing Matters for AI

Tests are **executable specifications**. They define what "correct" means.

When tests fail, AI gets:
- What was expected
- What actually happened
- Exact location of failure

This is precise enough for AI to fix automatically.

### Testing Stack

- **Vitest** - 10x faster than Jest
- **Happy DOM** - Lightweight DOM implementation
- **React Testing Library** - Component testing
- **80% coverage** - Required threshold

<details>
<summary>View configuration: vitest.config.ts</summary>

```typescript
export default defineConfig({
  test: {
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
});
```

</details>

### Test Organization

Tests live with the code they test:

```
src/features/projects/
├── schema.prisma
├── schemas.ts
├── router.ts
├── router.ts
├── schema.ts
└── tests/
    ├── service.test.ts     # Business logic tests
    ├── schemas.test.ts     # Validation tests
    └── errors.test.ts      # Error behavior tests
```

### Testing Patterns

<details>
<summary>Example: Testing Schemas (Validation Logic)</summary>

```typescript
// src/features/projects/tests/schemas.test.ts
import { describe, expect, it } from "vitest";
import { CreateProjectSchema } from "../schemas";

describe("CreateProjectSchema", () => {
  it("should accept valid project data", () => {
    const valid = {
      name: "My Project",
      description: "A test project",
      isPublic: true,
    };

    const result = CreateProjectSchema.parse(valid);
    expect(result).toEqual(valid);
  });

  it("should reject empty name", () => {
    const invalid = { name: "" };

    expect(() => CreateProjectSchema.parse(invalid)).toThrow();
  });

  it("should reject name longer than 100 chars", () => {
    const invalid = { name: "x".repeat(101) };

    expect(() => CreateProjectSchema.parse(invalid)).toThrow();
  });

  it("should use default for isPublic", () => {
    const input = { name: "Test" };

    const result = CreateProjectSchema.parse(input);
    expect(result.isPublic).toBe(false);
  });
});
```

</details>

<details>
<summary>Example: Testing Service (Business Logic)</summary>

```typescript
// src/features/projects/tests/service.test.ts
import { describe, expect, it, vi } from "vitest";
import { createProject, getProject } from "../service";
import { ProjectNotFoundError } from "../errors";

// Mock the repository layer
vi.mock("../repository", () => ({
  create: vi.fn((data) => Promise.resolve({
    id: "test-id",
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  })),
  findById: vi.fn(() => Promise.resolve(undefined)),
}));

describe("createProject", () => {
  it("should create project with generated slug", async () => {
    const result = await createProject(
      { name: "My Project", isPublic: true },
      "user-123"
    );

    expect(result.name).toBe("My Project");
    expect(result.slug).toBe("my-project");
    expect(result.ownerId).toBe("user-123");
  });

  it("should handle special characters in name", async () => {
    const result = await createProject(
      { name: "My Project!!!" },
      "user-123"
    );

    expect(result.slug).toBe("my-project");
  });
});

describe("getProject", () => {
  it("should throw ProjectNotFoundError when project doesn't exist", async () => {
    await expect(() => getProject("999", null)).toThrow(ProjectNotFoundError);
  });
});
```

**Key points:**
- Mock repository to isolate business logic
- Test happy paths and error cases
- Clear, descriptive test names
- Fast execution (no database)

</details>

<details>
<summary>Example: Testing API Routes</summary>

```typescript
// src/app/api/projects/route.test.ts
import { describe, expect, it } from "vitest";
import { POST } from "./route";

describe("POST /api/projects", () => {
  it("should create project with valid data", async () => {
    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({
        name: "Test Project",
        description: "A test",
        isPublic: true,
      }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.name).toBe("Test Project");
  });

  it("should return 400 for invalid data", async () => {
    const request = new Request("http://localhost/api/projects", {
      method: "POST",
      body: JSON.stringify({ name: "" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.code).toBe("VALIDATION_ERROR");
  });
});
```

</details>

### Running Tests

```bash
# Run all tests
pnpm test

# Watch mode (re-run on file changes)
pnpm test --watch

# Coverage report
pnpm test --coverage
```

**Test output example:**
```
✓ CreateProjectSchema > should accept valid project data
✓ CreateProjectSchema > should reject empty name
✓ createProject > should create project with generated slug
✗ createProject > should handle special characters

Expected: "my-project"
Received: "my_project"
  at line 45 in service.test.ts
```

**AI benefit:** Exact expected vs received, with file location. AI can parse and fix.

---

## Fast Tooling

### Why Speed Matters for AI

AI iterates rapidly. Slow tools = slow AI.

**Traditional stack:**
- npm install: 30+ seconds
- Jest tests: 5-10 seconds
- ESLint + Prettier: 3-5 seconds

**This stack:**
- pnpm install: 2 seconds
- pnpm test: 0.5 seconds
- Biome: 0.3 seconds

**10-25x faster feedback loop.**

### pnpm: Package Manager + Package Manager + Test Runner

pnpm and Vitest replace npm and Jest with one fast tool.

<details>
<summary>Why pnpm and Vitest are faster</summary>

**Package installation:**
- npm uses JavaScript
- pnpm uses efficient symlinking (native code)
- Result: Faster installs

**Test execution:**
- Jest uses Node.js + Babel + tons of transforms
- Vitest has native TypeScript support
- Result: Faster tests

**Module resolution:**
- Older tools resolve modules slowly
- Modern tools cache aggressively
- Result: Faster startup

</details>

<details>
<summary>Commands in this codebase</summary>

```bash
# Install dependencies
pnpm install

# Development server
pnpm dev

# Type check
npx tsc --noEmit

# Lint + format
pnpm lint
pnpm lint:fix

# Tests
pnpm test
pnpm test --watch

# Build
pnpm build

# Database
pnpm gen:prisma  # Generate migrations
pnpm db:push   # Apply migrations
pnpm db:push      # Push schema directly (dev only)
pnpm db:ui    # Visual database browser
```

</details>

### Biome: Fast Linter + Formatter

Biome replaces ESLint + Prettier with one tool written in Rust.

<details>
<summary>Why Biome is faster</summary>

**Architecture:**
- ESLint: JavaScript, many plugins, slow
- Biome: Rust, single binary, fast
- Result: 10-25x faster

**Features:**
- Linting: Catches errors, enforces rules
- Formatting: Consistent code style
- Auto-fix: Fixes most issues automatically

</details>

<details>
<summary>Configuration: biome.json</summary>

```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 100
  },
  "linter": {
    "rules": {
      "suspicious": {
        "noUnusedVariables": "error",
        "noDebugger": "error"
      },
      "style": {
        "useConst": "error",
        "noDefaultExport": "warn"
      },
      "correctness": {
        "useExportType": "error",
        "useImportType": "error"
      }
    }
  }
}
```

**Key rules:**
- `noUnusedVariables` - Error on unused code
- `useConst` - Prefer `const` over `let`
- `useExportType` - Explicit `type` keyword for type exports
- `noDefaultExport` - Named exports only (except Next.js special files)

</details>

---

## Putting It All Together

### The Complete AI Development Workflow

Here's how all these pieces work together:

#### 1. Initial Setup

```bash
# Clone template
git clone <repo>
cd nextjs-ai-optimized-codebase

# Install dependencies (2 seconds)
pnpm install

# Set up environment
cp .env.example .env
# Edit .env with your credentials

# Push database schema
pnpm db:push
```

#### 2. Create a New Feature

```bash
# Copy the pattern
cp -r src/features/projects src/features/teams

# Update schema
# Edit prisma/schema.prisma
# Add teams table

# Generate types
pnpm gen:prisma
pnpm db:push
```

#### 3. Implement Feature

```
Edit files in order:
1. schema.prisma      - Define types from schema
2. schemas.ts     - Define validation rules
3. schema.ts      - Define error cases
4. router.ts  - Write database queries
5. router.ts     - Write business logic
6. index.ts       - Export public API
```

#### 4. Run Feedback Loop

```bash
# After each change, run:
pnpm lint && npx tsc --noEmit

# Fix any errors reported
# Repeat until all checks pass
```

#### 5. Write Tests

```bash
# Create tests
touch src/features/teams/tests/service.test.ts
touch src/features/teams/tests/schemas.test.ts

# Run tests
pnpm test --watch

# Fix failing tests
# Repeat until all pass
```

#### 6. Create API Route

```
Create: src/app/api/teams/route.ts

1. Import service functions
2. Validate input with schemas
3. Call service functions
4. Handle errors with handleApiError
5. Return JSON responses
```

#### 7. Verify Everything

```bash
# Run all checks
pnpm lint && npx tsc --noEmit && pnpm test

# If all pass:
git add .
git commit -m "Add teams feature"
```

### Example: Adding a "Priority" Field

Let's walk through adding a priority field to projects:

<details>
<summary>Step-by-step example</summary>

**1. Update database schema:**
```prisma
// prisma/schema.prisma
model Project {
  // ... existing fields
  priority Int @default(0)
}
```

**2. Generate migration:**
```bash
pnpm gen:prisma
# Creates: prisma/migrations/0003_add_priority.sql
pnpm db:push
```

**3. Types update automatically:**
```typescript
// src/features/projects/schema.prisma
// Project type now includes priority: number
```

**4. Update validation schema:**
```typescript
// src/features/projects/schemas.ts
export const CreateProjectSchema = z.object({
  // ... existing fields
  priority: z.number().int().min(0).max(10).default(0),
});

export const UpdateProjectSchema = z.object({
  // ... existing fields
  priority: z.number().int().min(0).max(10).optional(),
});
```

**5. Repository is already generic - no changes needed**

**6. Service is already generic - no changes needed**

**7. Run checks:**
```bash
pnpm lint && npx tsc --noEmit
# ✓ All checks pass
```

**8. Update tests:**
```typescript
// src/features/projects/tests/schemas.test.ts
it("should accept priority between 0 and 10", () => {
  const valid = { name: "Test", priority: 5 };
  const result = CreateProjectSchema.parse(valid);
  expect(result.priority).toBe(5);
});

it("should reject priority > 10", () => {
  const invalid = { name: "Test", priority: 11 };
  expect(() => CreateProjectSchema.parse(invalid)).toThrow();
});
```

**9. Run tests:**
```bash
pnpm test
# ✓ All tests pass
```

**Done!** Priority field added with:
- Type safety (TypeScript knows about it)
- Runtime validation (Zod enforces 0-10 range)
- Database constraint (default value)
- Tested (new tests verify behavior)

</details>

---

## Key Takeaways

### For AI Development

1. **Machine-readable errors** - Tools produce structured output AI can parse
2. **Type safety** - Catch bugs at compile-time, not runtime
3. **Single source of truth** - Types derive from schemas and database
4. **Fast feedback** - 10-25x faster tools = faster iteration
5. **Clear patterns** - Consistent structure across all features
6. **Vertical slices** - Features are independent and self-contained

### For Human Developers

1. **Less cognitive load** - One feature, one folder
2. **Faster onboarding** - Learn pattern once, apply everywhere
3. **Safer refactoring** - Types catch breaking changes
4. **Better debugging** - Structured logs with context
5. **Confidence** - Tests define "correct", types prevent errors

### For Your Codebase

1. **Maintainable** - Clear boundaries, consistent patterns
2. **Scalable** - Add features without touching existing code
3. **Debuggable** - Structured logs, clear error messages
4. **Testable** - Isolated layers, easy mocking
5. **AI-friendly** - Everything optimized for AI collaboration

---

## Next Steps

### Explore the Codebase

1. Open `src/features/projects/` - Study the vertical slice pattern
2. Run `pnpm dev` - See the app in action
3. Make a change - Experience the feedback loop
4. Run `pnpm test` - See how tests work
5. Check logs - See structured logging in action

### Try These Exercises

1. **Add a new field** - Add `tags` array to projects
2. **Create a new feature** - Copy `projects/` to `tasks/`
3. **Break something** - Introduce a type error, see the feedback
4. **Write a test** - Add test coverage for edge cases
5. **Check the logs** - Use `grep` to trace a request

### Resources

- [CLAUDE.md](./CLAUDE.md) - Instructions for AI agents
- [README.md](./README.md) - Quick start guide
- [AI-OPTIMIZED-COMPARISON.md](./AI-OPTIMIZED-COMPARISON.md) - Python vs Next.js comparison

---

**Welcome to AI-optimized development!** 🚀
