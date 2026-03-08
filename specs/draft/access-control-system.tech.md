### React Frameworks and Libraries with `usePermission(resource, action)` Patterns

Based on the requirements for a React-based framework or library that supports a `usePermission(resource, action)` hook (ideally TanStack-friendly), here is an overview of the most relevant options:

#### 1. CASL (The Industry Standard)
**CASL** is the most mature and widely used library for this specific pattern.
- **Hook**: `useAbility()` (from `@casl/react`).
- **Pattern**: `ability.can(action, resource)`.
- **TanStack Compatibility**: Excellent. Since CASL is logic-only and framework-agnostic, it works perfectly with TanStack Query (to fetch rules) and TanStack Router (for `beforeLoad` guards).
- **Why it fits**: It’s specifically designed for the "action/resource" (subject) mental model.

#### 2. React-Admin (Marmelab)
If you are looking for a more "full-stack" React framework, **React-Admin** has built-in support for exactly this.
- **Hook**: `useCanAccess({ action, resource, record })`.
- **Pattern**: 
  ```tsx
  const { canAccess, isPending } = useCanAccess({ action: 'edit', resource: 'posts' });
  ```
- **TanStack Compatibility**: React-Admin v4+ is built heavily on **TanStack Query**. 

#### 3. Better Auth (Project Choice)
Since this project uses **Better Auth**, it's worth noting that its permission system is designed to be very close to what you're asking for.
- **Current State**: Better Auth provides `authClient.admin.hasPermission`, but it doesn't have a high-level `usePermission(resource, action)` hook out of the box that reacts to global state in a single call.
- **Recommendation**: As outlined in the `access-control-system.impl.md` we created, a custom wrapper around `better-auth` is often the cleanest path for TanStack projects:
  ```tsx
  // Custom implementation for this project
  const { can } = usePermission();
  if (can('Approve', '/projects/123')) { ... }
  ```

#### 4. ZenStack
**ZenStack** is an extension of Prisma that adds an access control layer. It automatically generates hooks based on your database schema.
- **Hook**: `useObjectPermissions(object)`.
- **Pattern**: It generates TanStack Query hooks that include a `permissions` object for every record (e.g., `canUpdate`, `canDelete`).
- **Why it fits**: It bridges the gap between the Backend (Prisma) and Frontend (TanStack) seamlessly.

#### 5. Permit.io / Cerbos (Authorization as a Service)
If you prefer a managed solution, these services provide official React SDKs.
- **Permit.io**: Provides a `usePermit()` hook.
- **Cerbos**: Provides a `@cerbos/react` package with a `useCheck` hook:
  ```tsx
  const { allowed } = useCheck({ resource: 'blog', action: 'publish' });
  ```

### Summary Comparison

| Framework/Library | Hook Name        | Style            | TanStack Integration |
|:------------------|:-----------------|:-----------------|:---------------------|
| **CASL**          | `useAbility`     | Logic-only       | High (Manual)        |
| **React-Admin**   | `useCanAccess`   | Framework-native | High (Built-in)      |
| **ZenStack**      | `use[Model]`     | Schema-generated | Native (Query-based) |
| **Better Auth**   | Custom (planned) | Hook-based       | Planned in Spec      |
| **Cerbos**        | `useCheck`       | Managed Service  | High                 |

For your current project, the **Better Auth** extension we've designed is the most "native" way to achieve this without adding a heavy external dependency like CASL, while still keeping the `usePermission(resource, action)` developer experience you prefer.
