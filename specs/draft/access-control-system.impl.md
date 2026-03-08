### Assessment of Access Control System Specification

The specification `specs/draft/access-control-system.md` provides a solid conceptual foundation for a sophisticated access control system. It correctly identifies the core pillars: RBAC (Role-Based), CBAC (Confidentiality-Based), SBAC (Scope-Based), and the Biba Integrity Model.

However, for **AI coding agents** to implement this consistently and correctly, it requires more **technical precision**, **formalized data structures**, and **explicit logic flows**.

### Proposed Improvements and Clarifications

#### 1. Formalize Data Structures (JSON/Prisma Schema)
AI agents work best with explicit schemas. The specification should include a section defining how these entities map to the database.

**User Model Extension:**
```prisma
model User {
  id              String         @id @default(cuid())
  personalClearance Int          @default(4) // 0: Top Secret, 4: Restricted
  scopes          UserScope[]
  roles           UserRoleMapping[]
}
```

**Resource Group Definition:**
```json
{
  "name": "User Management",
  "paths": ["/users/*", "/users/*/profile"],
  "confidentiality": "level_2_internal"
}
```

#### 2. Explicit Access Resolution Algorithm
The "Most Restrictive Wins" rule is good, but a formal algorithm (pseudo-code) prevents ambiguity in implementation.

**Algorithm: `matchPathRule(requestPath, rules)`**
1. Filter `rules` that match `requestPath` using wildcard logic.
2. If no rules match, return `DENY`.
3. Sort matching rules by prefix length (descending).
4. Return the first matching rule (**Longest Matching Prefix**).

**Algorithm: `getEffectiveClearance(user, activeRole, activeScopes)`**
1.  Initialize `clearance` = `user.personalClearance` (e.g., `0`).
2.  If `activeRole` is provided, `clearance` = `max(clearance, activeRole.clearance)` (numerical index).
3.  For each `scope` in `activeScopes`:
    - `clearance` = `max(clearance, scope.clearanceLimit)`.
4.  Return `clearance`.

**Algorithm: `canAccessResource(effectiveClearance, resourceConfidentiality, strictMode)`**
1.  If `strictMode` is `true` AND `effectiveClearance > resourceConfidentiality`: return `DENY`.
2.  If `effectiveClearance` == `level_4_restricted`: return `DENY`.
3.  If `abs(effectiveClearance - resourceConfidentiality) > clearanceGapThreshold`: return `DENY`.
4.  Return `ALLOW`.

#### 3. Clarify RBAC Integration with `better-auth`
Since the project already uses `better-auth/plugins/access`, the specification should explicitly state if it **extends** or **replaces** this plugin.
- **Recommendation**: Define how the custom CBAC/SBAC logic wraps or hooks into the `better-auth` permission checks.

#### 4. Standardize Resource Naming and Wildcards
The specification uses `/users/*` and `/users/**`. It should explicitly define:
- **Case Sensitivity**: All paths are **case-sensitive** (e.g., `/users/` is not `/Users/`).
- **Overlapping Paths**: If `/projects/123` matches both `/projects/*` and `/projects/**`, the **Longest Matching Prefix** (most specific) rule applies.
- **Rule Precedence**: Always use the most specific rule first.

**Example Implementation**:
```typescript
function getSpecificRule(requestPath: string, rules: Rule[]) {
  return rules
    .filter(rule => matches(requestPath, rule.path))
    .sort((a, b) => b.path.length - a.path.length)[0];
}
```

#### 5. Concrete Examples for Masking Transformations
Providing a mapping between `Clearance Level` and `Transformation Type` for common data types (Email, Date, UUID) would help agents choose the right utility functions.

| Level     | Email                    | Phone            | Name           |
|:----------|:-------------------------|:-----------------|:---------------|
| `level_0` | `john.doe@example.com`   | `+1234567890`    | `John Doe`     |
| `level_1` | `j***e@example.com`      | `+123***7890`    | `J*** D***`    |
| `level_2` | `user_8841@internal.net` | `(Substitute)`   | `John D.`      |
| `level_3` | `(Hashed/Anonymized)`    | `(Country Only)` | `(Anonymized)` |
| `level_4` | `NULL`                   | `NULL`           | `[REDACTED]`   |

#### 6. Action-Based Permissions and Functional Resources (YAML)
Shift from a strict "Database Entity" perspective to a "Functional Resource" perspective using YAML definitions to support intent-based UI actions. Actions are nested within a `resource` definition to provide context.

**Resource & Action Definition Structure (YAML):**
```yaml
# Schema for a Functional Resource and its Intent-Based Actions
resource:
  name: string               # Unique identifier for the module/feature
  paths: list                # List of glob patterns (e.g., ["/users/*"])
  confidentiality: enum      # Default sensitivity (e.g., level_2_internal)
  actions:                   # List of supported intents for this resource
    - name: string               # Unique identifier for the intent
      baseOperation: CRUD        # Create, Read, Update, Delete, Execute
      minIntegrityLevel: enum    # Minimum clearance (e.g., level_2_internal)
      requiresMultiPerson: bool  # Forces Four-Eyes principle
      audit: bool                # Triggers explicit audit logging
      parameters: list           # Optional: list of restricted parameters
```

**Algorithm: `evaluateIntent(user, action, resource)`**
1. **RBAC**: Check if `user.can(action.baseOperation, resource)`. If no, return `DENY`.
2. **Biba Integrity**:
   - Get `effectiveClearance` using `getEffectiveClearance(...)`.
   - If `effectiveClearance <= action.minIntegrityLevel` (numerical comparison):
     - If `action.requiresMultiPerson` is `true`: Return `PENDING_APPROVAL`.
     - Else: Return `ALLOW`.
   - Else: Return `REQUIRE_HIGHER_CLEARANCE` or `PENDING_APPROVAL` (based on system policy).
3. **SBAC**: Verify if `action.parameters` match `user.scopes`. If no, return `DENY`.
4. **Audit**: If `action.audit` is `true`, record transaction details.

#### 7. UI/Backend Synchronization Strategy
To ensure a consistent user experience and robust security:
- **Shared Type Definitions**: Use `@/features/auth/types.ts` to define `Action`, `ClearanceLevel`, and `EffectivePermission` interfaces.
- **Permission Hook (Frontend)**: Implement a `usePermission(resource, action)` hook that queries the `effective_permissions` object provided on load.
- **Middleware Enforcement (Backend)**: Use the same path-matching and "Most Restrictive Wins" logic in API middleware to reject unauthorized requests.

### Next Steps for Implementation
1.  **Update Specification**: Incorporate the formal schemas and algorithms above.
2.  **Define Integration**: Map these concepts to the existing `src/features/auth/permissions.ts`.
3.  **Add Test Cases**: Include a "Testing Matrix" in the spec with expected results for specific user/role/scope/resource combinations.
