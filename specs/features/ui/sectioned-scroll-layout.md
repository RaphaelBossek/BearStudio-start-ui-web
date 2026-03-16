# SectionedScrollLayout — Implementation Plan

## Context

This plan is for a coding agent operating in a **new context window**. Read the files referenced below before writing any code.

### Background
`CategorizedDrawerLayout` is a **tab-based** component: it renders one category at a time and switches content when the user clicks a nav item. This plan replaces it with `SectionedScrollLayout`, a **continuous-scroll** layout where all sections are rendered at once and a bookmark sidebar serves as a jump-nav with live scroll-spy highlighting.

### Files to Read First
- `src/components/drawer-navigation/categorized-drawer-layout.tsx`
- `src/components/drawer-navigation/responsive-drawer-nav.tsx`
- `src/components/drawer-navigation/drawer-content-section.tsx`
- `src/components/drawer-navigation/index.ts`
- `src/features/shift-plan-table/manager/shift-plan-details.tsx` ← reference consumer
- `src/features/treatment-table/manager/treatment-details.tsx`
- `src/features/user-table/manager/user-details-settings.tsx`
- `src/features/appointment-table/manager/appointment-details.tsx`
- `src/components/ui/sheet.tsx`
- `src/components/ui/tooltip.tsx`
- `src/components/ui/scroll-area.tsx`
- `.claude/rules/frontend.md`

---

## Decisions (already confirmed)

| Decision | Choice |
|---|---|
| Scope | 4 consumers migrated (`shift-plan-details`, `treatment-details`, `user-details-settings`, `appointment-details`) |
| Width detection | JS `ResizeObserver` |
| Scroll-spy | Yes — `IntersectionObserver` |
| Old component fate | **Delete** `categorized-drawer-layout.tsx` + `responsive-drawer-nav.tsx` after migration |
| Intermediate state | Yes — 3 states: full sidebar, icon-only sidebar, hamburger |
| `appointment-drawer.tsx` | **Delete** — no replacement; no drawers anywhere in the app |
| Table actions column | **Remove** from all 4 tables (appointments, treatments, shift-plans, users) — rows are clickable instead |

---

## New Files to Create

### 1. `src/hooks/use-container-width.ts`

```ts
import { useEffect, useRef, useState } from 'react';

/**
 * Returns a ref to attach to an element and its current content width in pixels.
 * Updates reactively via ResizeObserver.
 */
export function useContainerWidth<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null);
  const [width, setWidth] = useState<number | undefined>(undefined);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Set initial width synchronously
    setWidth(el.getBoundingClientRect().width);

    const observer = new ResizeObserver(([entry]) => {
      setWidth(entry.contentRect.width);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, width };
}
```

### 2. `src/components/drawer-navigation/sectioned-scroll-layout.tsx`

#### Public API

```tsx
import type { LucideIcon } from 'lucide-react';

export type SectionConfig = {
  /** Unique ID — used for anchor scrolling and scroll-spy. Must be stable (not random). */
  id: string;
  /** Display label shown in nav sidebar and sheet */
  label: string;
  /** Lucide icon component */
  icon: LucideIcon;
  /** Content rendered unconditionally — do NOT lazy-render. */
  content: React.ReactNode;
};

type SectionedScrollLayoutProps = {
  title: string;
  description?: string;
  sections: SectionConfig[];
  /** Optional className on root element */
  className?: string;
};
```

#### Width Breakpoints (constants at top of file)

```ts
/** Panel width at which the full sidebar (icon + label) is shown */
const SIDEBAR_FULL_THRESHOLD = 420;
/** Panel width at which the icon-only sidebar is shown (below → hamburger) */
const SIDEBAR_ICON_THRESHOLD = 220;
```

So:
- `width >= 420` → `'full'` — sidebar shows icon + label (width: `168px`)
- `width >= 220 && width < 420` → `'icons-only'` — sidebar shows icon only (width: `40px`), tooltip on hover
- `width < 220` → `'hamburger'` — sidebar hidden, hamburger button in header opens `Sheet`

#### Internal state

```tsx
const [activeId, setActiveId] = useState<string>(sections[0]?.id ?? '');
const [sheetOpen, setSheetOpen] = useState(false);
const { ref: containerRef, width } = useContainerWidth();
const scrollAreaRef = useRef<HTMLDivElement>(null);
const sectionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
```

#### Scroll-spy (IntersectionObserver)

```tsx
useEffect(() => {
  const scrollEl = scrollAreaRef.current;
  if (!scrollEl) return;

  const observers: IntersectionObserver[] = [];

  for (const section of sections) {
    const el = sectionRefs.current.get(section.id);
    if (!el) continue;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveId(section.id);
        }
      },
      {
        root: scrollEl,
        // Trigger when section enters the top 40% of the scroll viewport
        rootMargin: '0px 0px -60% 0px',
        threshold: 0,
      }
    );
    observer.observe(el);
    observers.push(observer);
  }

  return () => observers.forEach((o) => o.disconnect());
  // Re-run only when section IDs change (not content/icons — those don't affect observers)
}, [sections.map((s) => s.id).join(',')]);
```

> **Note**: The `sections` prop must be memoized with `useMemo` in every consumer. If it is not, the IntersectionObserver will be torn down and rebuilt on every render, causing flickering active-state.

#### Anchor navigation (click → scroll)

```tsx
const scrollToSection = useCallback(
  (sectionId: string) => {
    const el = sectionRefs.current.get(sectionId);
    if (!el) return;
    // Scroll within the ScrollArea viewport, not window
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(sectionId);
    setSheetOpen(false); // close sheet after nav
  },
  []
);
```

#### JSX structure

```tsx
const navState: 'full' | 'icons-only' | 'hamburger' =
  width >= SIDEBAR_FULL_THRESHOLD
    ? 'full'
    : width >= SIDEBAR_ICON_THRESHOLD
      ? 'icons-only'
      : 'hamburger';

return (
  <div ref={containerRef} className={cn('flex flex-col h-full', className)}>
    {/* Header */}
    <div className="flex-none flex items-start justify-between px-6 py-4 border-b gap-3">
      <div className="min-w-0">
        <h2 className="text-lg font-semibold">{title}</h2>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
      {navState === 'hamburger' && (
        <Button
          variant="ghost"
          size="icon"
          aria-label="Open section navigation"
          onClick={() => setSheetOpen(true)}
        >
          <MenuIcon className="size-4" />
        </Button>
      )}
    </div>

    {/* Body */}
    <div className="flex flex-1 overflow-hidden">
      {/* Sidebar nav (full or icon-only) */}
      {navState !== 'hamburger' && (
        <nav
          aria-label="Section navigation"
          className={cn(
            'flex-none flex flex-col gap-1 py-2 border-r overflow-y-auto',
            navState === 'full' ? 'w-42 px-2' : 'w-10 px-1'
          )}
        >
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === activeId;
            const btn = (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <Icon className="size-4 shrink-0" />
                {navState === 'full' && <span className="truncate">{section.label}</span>}
              </button>
            );

            if (navState === 'icons-only') {
              return (
                <Tooltip key={section.id}>
                  <TooltipTrigger asChild>{btn}</TooltipTrigger>
                  <TooltipContent side="right">{section.label}</TooltipContent>
                </Tooltip>
              );
            }
            return btn;
          })}
        </nav>
      )}

      {/* Scrollable content — all sections rendered at once */}
      <ScrollArea className="flex-1 min-w-0">
        <div
          ref={scrollAreaRef}  {/* ← must point to scrollable viewport, see note */}
          className="flex flex-col gap-4 p-4"
        >
          {sections.map((section) => (
            <div
              key={section.id}
              ref={(el) => {
                if (el) sectionRefs.current.set(section.id, el);
                else sectionRefs.current.delete(section.id);
              }}
            >
              {section.content}
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>

    {/* Sheet (hamburger state) */}
    <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
      <SheetContent side="right" className="w-56 p-0">
        <SheetHeader className="px-4 py-3 border-b">
          <SheetTitle className="text-sm font-semibold">Navigate to</SheetTitle>
        </SheetHeader>
        <nav aria-label="Section navigation" className="flex flex-col gap-1 p-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = section.id === activeId;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                aria-current={isActive ? 'true' : undefined}
                className={cn(
                  'flex items-center gap-2 w-full rounded-md px-2 py-1.5 text-sm transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                  isActive
                    ? 'bg-muted text-foreground font-medium'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted/60'
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span>{section.label}</span>
              </button>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  </div>
);
```

> **Critical ScrollArea note**: `shadcn/ui`'s `<ScrollArea>` wraps content in a `[data-radix-scroll-area-viewport]` div. The `IntersectionObserver` `root` must be that viewport div, **not** the outer `ScrollArea` element. Get it via:
> ```tsx
> const scrollAreaRef = useRef<HTMLDivElement>(null);
> // After mounting:
> const viewport = containerRef.current?.querySelector<HTMLDivElement>(
>   '[data-radix-scroll-area-viewport]'
> );
> ```
> Attach `scrollAreaRef` to the outer `<ScrollArea>` and query the viewport inside the `useEffect`.

---

## Files to Modify

### 3. `src/components/drawer-navigation/index.ts`

- Export `SectionedScrollLayout` and `SectionConfig`
- Remove exports for `CategorizedDrawerLayout`, `DrawerCategory`, `ResponsiveDrawerNav`
- Keep export for `DrawerContentSection` (unchanged)

### 4–8. Migrate all 5 consumers

#### Migration pattern

**Before (tab-based):**
```tsx
const [activeCategory, setActiveCategory] = useState('general');

const categories = [
  { id: 'general', label: 'General', icon: InfoIcon },
  { id: 'schedule', label: 'Schedule', icon: CalendarIcon },
];

const renderContent = (categoryId: string) => {
  switch (categoryId) {
    case 'general':
      return <DrawerContentSection ...>...</DrawerContentSection>;
    case 'schedule':
      return <DrawerContentSection ...>...</DrawerContentSection>;
  }
};

return (
  <CategorizedDrawerLayout
    title="Shift Plan Details"
    description="..."
    categories={categories}
    activeCategory={activeCategory}
    onCategoryChange={setActiveCategory}
    renderContent={renderContent}
  />
);
```

**After (continuous scroll):**
```tsx
// No useState for active category — managed internally by SectionedScrollLayout

const sections = useMemo<SectionConfig[]>(
  () => [
    {
      id: 'general',
      label: 'General',
      icon: InfoIcon,
      content: (
        <DrawerContentSection variant="card" title="General Information" description="...">
          ...
        </DrawerContentSection>
      ),
    },
    {
      id: 'schedule',
      label: 'Schedule',
      icon: CalendarIcon,
      content: (
        <DrawerContentSection variant="card" title="Schedule Details" description="...">
          ...
        </DrawerContentSection>
      ),
    },
  ],
  [shiftPlan] // ← include actual data dependencies
);

return (
  <SectionedScrollLayout
    title="Shift Plan Details"
    description="..."
    sections={sections}
  />
);
```

**Rules for each consumer migration:**
1. **Remove** `const [activeCategory, setActiveCategory] = useState(...)`
2. **Remove** the `categories` array
3. **Remove** the `renderContent` function
4. **Add** `const sections = useMemo<SectionConfig[]>(() => [...], [deps])` — deps are the data object(s) rendered in section content
5. Convert each `case` in `renderContent` to a section object with `content: <DrawerContentSection ...>`
6. Replace `<CategorizedDrawerLayout ... />` with `<SectionedScrollLayout ... />`
7. **Verify imports** — remove `CategorizedDrawerLayout` import, add `SectionedScrollLayout`, `SectionConfig`

#### Consumer-specific notes

| Consumer | Data dep for `useMemo` | Notes |
|---|---|---|
| `shift-plan-details.tsx` | `shiftPlan` | 5 categories → 5 sections |
| `treatment-details.tsx` | `treatment` | Check current number of categories |
| `user-details-settings.tsx` | `user` | Inside `ResizablePanel` — test rendering in its actual context |
| `appointment-details.tsx` | `appointment` | Inside `ResizablePanel` — rebuild from scratch using `SectionedScrollLayout` |

---

## Files to Delete

After all 4 consumers are migrated and verified:

```
src/components/drawer-navigation/categorized-drawer-layout.tsx
src/components/drawer-navigation/responsive-drawer-nav.tsx
src/features/treatment-table/manager/appointment-drawer.tsx
```

> `appointment-drawer.tsx` is a standalone Drawer that was opened via the Calendar button in the treatments table. Both the button and the file are removed entirely — no migration needed.

---

## Implementation Order

1. **Create** `src/hooks/use-container-width.ts`
2. **Create** `src/components/drawer-navigation/sectioned-scroll-layout.tsx`
3. **Update** `src/components/drawer-navigation/index.ts` (add new exports only — keep old ones temporarily)
4. **Remove actions column** from all 4 tables:
   - `appointments-table.tsx` — remove `actions` column + `onInspect` prop
   - `treatments-table.tsx` — remove `actions` column + `onInspect` + `onViewAppointments` props
   - `shift-plans-table.tsx` — remove `actions` column + `onInspect` prop
   - `users-table.tsx` — remove `actions` column + `onInspect` prop
5. **Update page components** for each table:
   - Remove `onInspect` / `onViewAppointments` prop pass-throughs
   - Remove `AppointmentDrawer` import + usage in `page-treatments-mongo.tsx`
   - Ensure `onRowClick={handleInspect}` (or equivalent) is still passed
6. **Delete** `src/features/treatment-table/manager/appointment-drawer.tsx`
7. **Migrate** `shift-plan-details.tsx` → verify in browser that all 3 width states work
8. **Migrate** `treatment-details.tsx`
9. **Migrate** `user-details-settings.tsx`
10. **Rebuild** `appointment-details.tsx` using `SectionedScrollLayout` (previously used `CategorizedDrawerLayout`)
11. **Remove** old exports from `index.ts`
12. **Delete** `categorized-drawer-layout.tsx` and `responsive-drawer-nav.tsx`
13. Run `pnpm lint` + `npx tsc --noEmit` — fix all errors

---

## Known Pitfalls

### P1 — `sections` prop must be memoized
Every consumer **must** wrap its `sections` array in `useMemo`. If not:
- `IntersectionObserver` tears down and rebuilds on every render
- Active section flickers
- Scroll performance degrades

### P2 — `IntersectionObserver` root must be the ScrollArea viewport
`shadcn/ui` `<ScrollArea>` renders the scrollable content inside a `[data-radix-scroll-area-viewport]` div. Passing the outer `ScrollArea` element as `root` will not work — it is not the scroll container. Query the viewport element after mount:
```tsx
const viewportEl = scrollAreaRef.current?.querySelector<HTMLDivElement>(
  '[data-radix-scroll-area-viewport]'
);
```

### P3 — Width initialises at 0 on first render
`useContainerWidth` starts at `width: 0` before the `ResizeObserver` fires. With the thresholds above, `0 < 220` → `navState = 'hamburger'`. This means there will be a flash of the hamburger state on first render.

**Fix**: Initialize `width` to `undefined` (not `0`) and render nothing for the nav until width is known:
```tsx
const [width, setWidth] = useState<number | undefined>(undefined);
// navState calculation:
const navState = width === undefined
  ? 'full'           // ← assume full on SSR / first paint
  : width >= SIDEBAR_FULL_THRESHOLD
    ? 'full'
    : width >= SIDEBAR_ICON_THRESHOLD
      ? 'icons-only'
      : 'hamburger';
```

### P4 — `DrawerContentSection` renders all sections at once
Previously each section was rendered lazily (only when active). Now **all sections render immediately**. If any section contains an expensive component or fetch, it will now always run. Audit each consumer's section content for side-effect-heavy children.

### P5 — `Sheet` import conflict
The `Sheet` used inside `SectionedScrollLayout` must be the shadcn `Sheet`, not a custom component. Check that `src/components/ui/sheet.tsx` exports `SheetContent`, `SheetHeader`, `SheetTitle`.

---

## Accessibility Checklist (frontend.md compliance)

- [ ] `<nav aria-label="Section navigation">` on both sidebar and sheet nav
- [ ] `aria-current="true"` on the active section button
- [ ] Hamburger button has `aria-label="Open section navigation"`
- [ ] All buttons are keyboard-focusable (no `div` used as button)
- [ ] Tooltip appears on keyboard focus for icon-only state (not just hover)
- [ ] `Sheet` traps focus correctly when open
- [ ] Section anchor `div`s do **not** need `role="region"` unless content warrants it

---

## Linting & Type Safety

- Run `pnpm lint` after each file migration
- Run `npx tsc --noEmit` at the end
- The `sections` prop type `SectionConfig[]` must be exported from `index.ts` so consumers can import it
- Do **not** use `any` in the new component — type `sections` strictly
- The `useEffect` dependency for the `IntersectionObserver` setup: use `sections.map(s => s.id).join(',')` as the dependency string (or derive a stable key from section IDs) to avoid re-running when only content changes

---

## Suggested Skill Invocations

After completing the implementation:
- Run `/simplify` to review the new `sectioned-scroll-layout.tsx` for over-engineering
- Run `/git-commit-message` for the commit
