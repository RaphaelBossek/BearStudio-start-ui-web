# ADR-001: TanStack Router

**Date**: 2026-04-01  
**Status**: Accepted  
**Authors**: BearStudio Team

## Context

We needed to choose a routing solution for our full-stack React application. The routing library must support:
- Type-safe route definitions
- Search parameter validation
- Nested routes
- Code splitting
- Server-side rendering (SSR)
- Strong TypeScript integration

## Decision

We chose **TanStack Router** over React Router and other alternatives.

## Rationale

### Why TanStack Router

1. **Type Safety**: TanStack Router provides end-to-end type safety for routes, search params, and route params without manual type definitions
2. **Search Param Validation**: Built-in Zod-based validation for search parameters
3. **Framework Agnostic**: Works with React, Solid, Vue, and Svelte
4. **Active Development**: Maintained by the TanStack team (same team as TanStack Query, TanStack Table)
5. **SSR Support**: First-class server-side rendering support
6. **Code Splitting**: Automatic code splitting per route
7. **No Breaking Changes**: Stable API with predictable upgrade paths

### Why Not React Router

1. **Type Safety Gaps**: React Router v6+ requires manual type definitions for route params
2. **Search Params**: No built-in validation or type safety for search parameters
3. **Breaking Changes**: React Router has a history of breaking changes between major versions
4. **SSR Complexity**: More complex SSR setup compared to TanStack Router

### Why Not Next.js Routing

1. **Framework Lock-in**: Next.js routing is tightly coupled to Next.js framework
2. **Less Flexibility**: We want to use TanStack Start for more control over SSR
3. **File-based Limitations**: File-based routing can be limiting for complex route structures

## Consequences

### Positive

- ✅ Full type safety across all routes
- ✅ Reduced runtime errors from invalid route params
- ✅ Better developer experience with autocomplete
- ✅ Easier refactoring with TypeScript support
- ✅ Consistent patterns across TanStack ecosystem

### Negative

- 📚 Learning curve for team members familiar with React Router
- 📦 Additional bundle size (~15kb gzipped)
- 🔧 Less community content compared to React Router

### Neutral

- Requires migration of existing React Router code
- Need to establish routing conventions for the team

## References

- [TanStack Router Documentation](https://tanstack.com/router/latest)
- [TanStack Router vs React Router](https://tanstack.com/router/latest/docs/framework/react/guide/react-router-comparison)
- [TanStack Start](https://tanstack.com/start)
