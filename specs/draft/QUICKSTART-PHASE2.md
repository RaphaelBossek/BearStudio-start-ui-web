# Quick Start: Phase 2 - Refactor AppointmentDrawer

**For AI Agents starting fresh with a new context window**

---

## TL;DR - What You Need to Know

Phase 1 is **COMPLETE** ✅. New reusable components are ready in `src/components/drawer-navigation/`.

**Your job:** Refactor `src/features/treatment-table/manager/appointment-drawer.tsx` to use them.

**Time estimate:** 30-60 minutes

---

## Step-by-Step Instructions

### 1. Read Current Implementation (3 min)
```bash
Read: src/features/treatment-table/manager/appointment-drawer.tsx
```

**Look for:**
- State management: `useState('general')`
- Categories array: `{ id, label, icon }`
- `renderContent()` switch statement
- Layout structure: header + sidebar + content

### 2. Update Imports (2 min)

**ADD at top:**
```typescript
import {
  CategorizedDrawerLayout,
  DrawerContentSection
} from '@/components/drawer-navigation';
```

**REMOVE (if only used in layout):**
```typescript
import { ScrollArea } from '@/components/ui/scroll-area';
```

### 3. Rename State Variable (1 min)

**Change:**
```typescript
// OLD
const [activeTab, setActiveTab] = useState('general');

// NEW
const [activeCategory, setActiveCategory] = useState('general');
```

### 4. Wrap Each Content Section (10 min)

**For each `case` in `renderContent()` switch:**

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
        <DataList>{/* content */}</DataList>
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
      <DataList>{/* content - unchanged */}</DataList>
    </DrawerContentSection>
  );
```

**Repeat for:** `timing`, `participants`, `location`

**For `raw` section:** Use `variant="plain"`

### 5. Replace Component Return (5 min)

**DELETE all this:**
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

**REPLACE with:**
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

### 6. Test (5 min)

```bash
# Type check
npm run typecheck

# Start dev server
npm run dev

# Navigate to: http://localhost:3000/manager/treatments-mongo
# Click "View Details" on any treatment
# Test all category tabs
# Test mobile responsive (resize browser to <768px)
```

---

## Complete Example (Reference)

```typescript
import { CalendarIcon, DatabaseIcon, InfoIcon, MapPinIcon, UserIcon } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import {
  DataList,
  DataListCell,
  DataListRow,
  DataListText,
  DataListTextHeader,
} from '@/components/ui/datalist';
import {
  CategorizedDrawerLayout,
  DrawerContentSection
} from '@/components/drawer-navigation';

interface AppointmentDrawerProps {
  appointment: any;
}

export const AppointmentDrawer = ({ appointment }: AppointmentDrawerProps) => {
  const [activeCategory, setActiveCategory] = useState('general');

  const categories = [
    { id: 'general', label: 'General', icon: InfoIcon },
    { id: 'timing', label: 'Timing', icon: CalendarIcon },
    { id: 'participants', label: 'Participants', icon: UserIcon },
    { id: 'location', label: 'Location/Job', icon: MapPinIcon },
    { id: 'raw', label: 'Raw Data', icon: DatabaseIcon },
  ];

  const renderContent = (categoryId: string) => {
    switch (categoryId) {
      case 'general':
        return (
          <DrawerContentSection
            variant="card"
            title="General Information"
            description="Basic appointment details."
          >
            <DataList>
              {/* Existing DataListItem components */}
            </DataList>
          </DrawerContentSection>
        );

      case 'timing':
        return (
          <DrawerContentSection
            variant="card"
            title="Timing Details"
            description="Planned and actual times."
          >
            <DataList>
              {/* Existing DataListItem components */}
            </DataList>
          </DrawerContentSection>
        );

      // ... other cases

      default:
        return null;
    }
  };

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
};
```

---

## Expected Outcome

**Before:**
- ~240 lines
- Hardcoded layout
- Desktop-only navigation
- Repetitive Card/CardHeader/CardContent

**After:**
- ~120 lines (~50% reduction)
- Reusable CategorizedDrawerLayout
- Automatic mobile responsiveness
- Clean DrawerContentSection wrappers

---

## Troubleshooting

### "Cannot find module '@/components/drawer-navigation'"
**Cause:** TypeScript path alias issue
**Fix:** Restart TypeScript server (VSCode: Cmd+Shift+P → "Restart TS Server")

### "Property 'activeCategory' does not exist"
**Cause:** Forgot to rename `activeTab` → `activeCategory`
**Fix:** Search and replace all `activeTab` with `activeCategory`

### Mobile nav not showing select dropdown
**Cause:** Tailwind breakpoint not working
**Fix:** Verify `md:` breakpoint in tailwind.config (default is 768px)

### Icons not rendering
**Cause:** Icon imports missing
**Fix:** Ensure all icons (InfoIcon, CalendarIcon, etc.) are imported from 'lucide-react'

---

## Testing Checklist

After refactoring:

- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] All category tabs work (general, timing, participants, location, raw)
- [ ] Desktop (≥768px) shows button sidebar
- [ ] Mobile (<768px) shows select dropdown
- [ ] Active category highlighted correctly
- [ ] Content renders in all sections
- [ ] No console errors

---

## Full Documentation Available

**If you need more context:**
- **Concept:** `specs/draft/shadcn-admin-to-tanstack-transition-concept.md`
- **Action Plan:** `specs/draft/drawer-navigation-implementation-plan.md`
- **Phase 1 Summary:** `specs/draft/PHASE1-COMPLETION-SUMMARY.md`

**Component locations:**
- `src/components/drawer-navigation/categorized-drawer-layout.tsx`
- `src/components/drawer-navigation/responsive-drawer-nav.tsx`
- `src/components/drawer-navigation/drawer-content-section.tsx`
- `src/components/drawer-navigation/index.ts`

---

## Need Help?

**JSDoc examples are in the components themselves:**
```bash
# View component documentation
cat src/components/drawer-navigation/categorized-drawer-layout.tsx | head -70
```

**Check component usage:**
- All components have `@example` blocks in JSDoc
- TypeScript interfaces document all props
- Inline comments explain key decisions

---

**Good luck!** The refactoring is straightforward—mostly replacing existing layout code with the new components. 🚀
