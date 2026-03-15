# Drawer Navigation Implementation - Action Plan for AI Agent

## Project Context

**Goal:** Refactor drawer components to use reusable navigation layouts adapted from shadcn-admin patterns, improving mobile responsiveness and code maintainability.

**Status:** Phase 1 Complete ✅
**Next:** Phase 2 - Refactor AppointmentDrawer

---

## What Has Been Completed (Phase 1)

### ✅ Created Reusable Components

All components are in `src/components/drawer-navigation/`:

1. **categorized-drawer-layout.tsx** - Main layout wrapper with header, responsive nav, and content area
2. **responsive-drawer-nav.tsx** - Mobile select dropdown / desktop button sidebar
3. **drawer-content-section.tsx** - Standardized content section wrapper (card/plain variants)
4. **index.ts** - Barrel exports

**Status:** All files created, TypeScript types verified, JSDoc documentation complete.

**Key Types:**
```typescript
interface DrawerCategory {
  id: string;
  label: string;
  icon: LucideIcon;
}
```

**Component Usage Pattern:**
```typescript
import { CategorizedDrawerLayout, DrawerContentSection } from '@/components/drawer-navigation';

<CategorizedDrawerLayout
  title="Drawer Title"
  description="Description"
  categories={categories}
  activeCategory={activeCategory}
  onCategoryChange={setActiveCategory}
  renderContent={renderContent}
/>
```

---

## Phase 2: Refactor AppointmentDrawer (NEXT TASK)

### Objective
Replace the hardcoded layout in `AppointmentDrawer` with the new reusable components.

### Target File
**`src/features/treatment-table/manager/appointment-drawer.tsx`**

### Current Implementation Issues
- Hardcoded header and sidebar layout
- No mobile responsiveness (desktop button list only)
- Inconsistent content sections (inline Cards)
- ~240 lines with repetitive layout code

### Step-by-Step Refactoring Instructions

#### Step 1: Read Current Implementation
```bash
# Read the current AppointmentDrawer file
Read: src/features/treatment-table/manager/appointment-drawer.tsx
```

**What to look for:**
- Current state management (useState for activeTab)
- Category definitions (general, timing, participants, location, raw)
- Content rendering logic (renderContent switch statement)
- Card usage patterns in each section

#### Step 2: Update Imports
Replace existing imports and add new ones:

```typescript
// ADD these imports at the top
import {
  CategorizedDrawerLayout,
  DrawerContentSection
} from '@/components/drawer-navigation';

// KEEP existing imports:
// - Icon imports (CalendarIcon, DatabaseIcon, InfoIcon, MapPinIcon, UserIcon)
// - UI components (Badge, Card, DataList, etc.)
// - ScrollArea can be REMOVED (now handled by CategorizedDrawerLayout)
```

#### Step 3: Update State Variable Name
```typescript
// BEFORE
const [activeTab, setActiveTab] = useState('general');

// AFTER
const [activeCategory, setActiveCategory] = useState('general');
```

#### Step 4: Update Categories Array
Ensure categories have the required structure:

```typescript
const categories = [
  { id: 'general', label: 'General', icon: InfoIcon },
  { id: 'timing', label: 'Timing', icon: CalendarIcon },
  { id: 'participants', label: 'Participants', icon: UserIcon },
  { id: 'location', label: 'Location/Job', icon: MapPinIcon },
  { id: 'raw', label: 'Raw Data', icon: DatabaseIcon },
];
```

**Note:** Icons should already be imported in the file.

#### Step 5: Wrap Content Sections in DrawerContentSection
For each case in the `renderContent` switch statement:

**BEFORE:**
```typescript
case 'general':
  return (
    <Card>
      <CardHeader>
        <CardTitle>General Information</CardTitle>
        <CardDescription>Basic appointment details.</CardDescription>
      </CardHeader>
      <CardContent>
        <DataList>
          {/* content */}
        </DataList>
      </CardContent>
    </Card>
  );
```

**AFTER:**
```typescript
case 'general':
  return (
    <DrawerContentSection
      variant="card"
      title="General Information"
      description="Basic appointment details."
    >
      <DataList>
        {/* content - unchanged */}
      </DataList>
    </DrawerContentSection>
  );
```

**Apply to all sections:** general, timing, participants, location

**For 'raw' section:** Use `variant="plain"` (no card border for raw JSON)

#### Step 6: Replace Entire Component Return Statement
**BEFORE (delete all this):**
```typescript
return (
  <div className="flex flex-col h-full">
    <div className="flex items-center justify-between px-6 py-4 border-b">
      {/* Header */}
    </div>
    <div className="flex gap-6 flex-1 overflow-hidden p-6">
      <aside className="w-48 shrink-0 flex flex-col gap-1 border-r pr-4">
        {/* Navigation buttons */}
      </aside>
      <ScrollArea className="flex-1 min-w-0">
        {renderContent()}
      </ScrollArea>
    </div>
  </div>
);
```

**AFTER (replace with this):**
```typescript
return (
  <CategorizedDrawerLayout
    title="Appointment Details"
    description="Associated appointment for this treatment."
    categories={categories}
    activeCategory={activeCategory}
    onCategoryChange={setActiveCategory}
    renderContent={renderContent}
  />
);
```

#### Step 7: Remove Unused Imports
After refactoring, remove:
- `ScrollArea` (if only used in layout, not in content)
- Any unused Button/Card imports
- Clean up any other imports that are no longer referenced

#### Step 8: Verify and Test
```bash
# Run type check
npm run typecheck

# Look for errors in appointment-drawer.tsx
# Should compile with no TypeScript errors
```

**Visual Testing:**
- Open the treatments page: `/manager/treatments-mongo`
- Click "View Details" on any appointment row
- Test desktop view (≥768px) - should show button sidebar
- Test mobile view (<768px) - should show select dropdown
- Test all category tabs (general, timing, participants, location, raw)
- Verify content renders correctly in each section

---

## Phase 3: Testing & Polish (AFTER PHASE 2)

### Responsive Testing Checklist
- [ ] Test at 320px (mobile small)
- [ ] Test at 640px (drawer/dialog breakpoint)
- [ ] Test at 768px (nav layout breakpoint)
- [ ] Test at 1024px (desktop)
- [ ] Verify select dropdown appears on mobile (<768px)
- [ ] Verify button sidebar appears on desktop (≥768px)

### Functionality Testing
- [ ] All categories accessible via navigation
- [ ] Active category highlighted correctly
- [ ] Content switches instantly (no flicker)
- [ ] Content scrolls independently of navigation
- [ ] Header remains fixed while scrolling
- [ ] Icons render correctly in all categories

### Accessibility Testing
- [ ] Keyboard navigation works (Tab, Enter, Escape)
- [ ] Select dropdown is keyboard accessible
- [ ] Buttons have proper focus states
- [ ] Screen reader can announce active category

### Code Quality
- [ ] No TypeScript errors
- [ ] No console warnings
- [ ] Imports are clean (no unused)
- [ ] Code is properly formatted

---

## Future Enhancements (Optional)

After completing Phases 2-3, consider:

### 1. Apply Pattern to Other Drawers
Identify other drawer components that could benefit:
- User details drawer (if exists)
- Treatment details drawer
- Shift plan details drawer
- Any other detail view drawers

### 2. Additional Features
- Keyboard shortcuts (e.g., `1-5` keys for categories)
- Persist last viewed category in localStorage
- Add search/filter to navigation for large category lists
- Animation transitions between categories (Framer Motion)
- "Recently Viewed" or "Favorites" category support

### 3. Component Documentation
- Create Storybook stories for visual documentation
- Write unit tests for components
- Add usage examples to project README

---

## Reference Files

### Key Files to Work With
- **Target:** `src/features/treatment-table/manager/appointment-drawer.tsx`
- **New Components:** `src/components/drawer-navigation/*`
- **Concept Doc:** `specs/draft/shadcn-admin-to-tanstack-transition-concept.md`
- **This Plan:** `specs/draft/drawer-navigation-implementation-plan.md`

### Important Context
- **No routing changes** - All navigation is client-side with `useState`
- **No new pages** - Only refactoring existing drawer component
- **Responsive breakpoints:**
  - 640px (sm): ResponsiveDrawer switches from Drawer to Dialog
  - 768px (md): ResponsiveDrawerNav switches from Select to Buttons

### Project Stack
- **Framework:** TanStack Start (React SSR)
- **UI Library:** shadcn/ui + Radix UI
- **Styling:** Tailwind CSS
- **Icons:** Lucide React
- **Type System:** TypeScript

---

## Success Criteria

### Phase 2 Complete When:
- [x] AppointmentDrawer refactored to use new components
- [x] No TypeScript errors
- [x] All category tabs functional
- [x] Mobile responsive (select dropdown appears)
- [x] Desktop functional (button sidebar appears)
- [x] Code is ~50% shorter than before

### Phase 3 Complete When:
- [x] All testing checklists passed
- [x] Visual regression verified
- [x] Accessibility validated
- [x] Code reviewed and approved

---

## Commands Reference

### Development
```bash
# Run type check
npm run typecheck

# Start dev server
npm run dev

# Format code (if needed)
npm run format
```

### Testing Routes
- **Treatments page:** http://localhost:3000/manager/treatments-mongo
- **Drawer trigger:** Click "View Details" on any treatment row

### File Operations
```bash
# Read current implementation
cat src/features/treatment-table/manager/appointment-drawer.tsx

# Check new components
ls -la src/components/drawer-navigation/

# Verify imports work
grep -r "drawer-navigation" src/
```

---

## AI Agent Instructions

When you start working on this:

1. **Read this entire document first** to understand context
2. **Complete Phase 2** step-by-step as outlined above
3. **Test thoroughly** using the checklists in Phase 3
4. **Ask for clarification** if anything is unclear
5. **Document any issues** you encounter for future reference

**Start with:** Reading `src/features/treatment-table/manager/appointment-drawer.tsx` to understand the current structure, then follow Step 2 onwards.

Good luck! The new components are well-documented with JSDoc examples if you need reference.
