---
title: 'Adr 002 Shadcn Ui'
---

# ADR-002: Shadcn/ui

**Date**: 2026-04-01  
**Status**: Accepted  
**Authors**: BearStudio Team

## Context

We needed to choose a UI component library for our application. The library must provide:
- Accessible components (WCAG 2.1 AA compliance)
- Customizable design system
- TypeScript support
- Dark mode support
- Responsive design
- Active maintenance and community support

## Decision

We chose **Shadcn/ui** over Material-UI, Chakra UI, Mantine, and other alternatives.

## Rationale

### Why Shadcn/ui

1. **Copy-Paste Components**: Components are copied into your codebase, not installed as dependencies
2. **Full Customization**: Complete control over component styles and behavior
3. **Radix Primitives**: Built on top of Radix UI primitives for accessibility
4. **Tailwind CSS**: Native Tailwind CSS integration
5. **No Runtime Overhead**: No component library bundle size impact
6. **TypeScript**: Full TypeScript support out of the box
7. **Dark Mode**: Built-in dark mode support via CSS variables
8. **Active Development**: Rapidly growing ecosystem with frequent updates

### Why Not Material-UI

1. **Bundle Size**: Material-UI has a large bundle size (~100kb+)
2. **Customization Complexity**: Overriding Material Design requires significant effort
3. **Design Language**: Forces Material Design aesthetic
4. **Runtime Dependency**: Must ship entire component library

### Why Not Chakra UI

1. **Runtime Overhead**: Chakra UI adds runtime style computation
2. **Bundle Size**: Larger bundle size compared to Shadcn/ui
3. **Customization**: Less flexible than having components in your codebase
4. **Performance**: Runtime style generation impacts performance

### Why Not Mantine

1. **Bundle Size**: Mantine has significant bundle size
2. **Customization**: More complex to customize design tokens
3. **Ecosystem**: Smaller community compared to Shadcn/ui

## Consequences

### Positive

- ✅ Full control over component implementation
- ✅ No external component library dependencies
- ✅ Smaller bundle size
- ✅ Better performance (no runtime style generation)
- ✅ Easier to customize components for brand requirements
- ✅ Accessibility built-in via Radix primitives

### Negative

- 📚 More code to maintain (components in codebase)
- 🔧 Need to update components manually when Shadcn/ui updates
- 📦 Initial setup requires more configuration

### Neutral

- Team needs to understand Radix UI primitives
- Need to establish component customization conventions

## References

- [Shadcn/ui Documentation](https://ui.shadcn.com/)
- [Radix UI Primitives](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
