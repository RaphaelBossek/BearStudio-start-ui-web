# User Story: Shift Plan Table View

## Timeline & Resources
- **Estimated Effort**: 2-3 days
- **Priority**: Medium
- **Target Sprint**: Q1 2026

## User Stories

### US-1: View Shift Plan Table
**As a** scheduling administrator,
**I want to** access a paginated table view of all shift plans,
**So that** I can see an overview of recurring on-call schedules at a glance.

#### Acceptance Criteria
- Table displays shift plans with the following default columns:
  - Shift Plan Name
  - Day of Week (e.g., MONDAY, TUESDAY)
  - Start Hour (formatted as time, e.g., "08:00")
  - End Hour (formatted as time, e.g., "17:00")
  - Duration (calculated, e.g., "9 hours")
  - Price Type (badge: WEEKDAY=Blue, WEEKNIGHT=Purple, WEEKENDDAY=Green, WEEKENDNIGHT=Orange)
  - Active Status (badge: Active=Green, Inactive=Gray)
  - Job Name (from embedded job snapshot)
  - Location Count (number of assigned locations)
- Pagination controls display at the bottom with page size options (25, 50, 100).
- Breadcrumb-style page navigation (1, 2, 3, ... N) is visible and functional.
- Table loads within 2 seconds for datasets up to 1000 shift plans.

---

### US-2: Search and Filter Shift Plans
**As a** scheduling administrator,
**I want to** search and filter shift plans by multiple criteria,
**So that** I can quickly find specific shift configurations without manual scrolling.

#### Acceptance Criteria
- Search input field is always visible above the table.
- Search supports full-text search across:
  - Shift plan name
  - Job name (from embedded snapshot)
- Filter options include:
  - **Status**: Active, Inactive (multi-select)
  - **Day of Week**: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY (multi-select)
  - **Price Type**: WEEKDAY, WEEKNIGHT, WEEKENDDAY, WEEKENDNIGHT (multi-select)
- Filters apply server-side and search across all rows, not just the current page.
- Search/filter results update within 1 second.
- Clear filters button resets all search and filter criteria.
- Active filters are visually indicated (e.g., badge count or highlighted filter buttons).

---

### US-3: Sort Shift Plans by Column
**As a** scheduling administrator,
**I want to** sort shift plans by any column,
**So that** I can organize the data in the most useful order for my current task.

#### Acceptance Criteria
- All columns support sorting (ascending/descending).
- Clicking a column header toggles sort order: unsorted → ascending → descending → unsorted.
- Sort indicator (arrow icon) displays in the active column header.
- Default sort order is by `name` (ascending).
- Sort state persists in the URL query parameters (e.g., `?sortBy=day&sortOrder=asc`).
- Sorting applies server-side for optimal performance.

---

### US-4: Customize Column Visibility
**As a** scheduling administrator,
**I want to** show or hide specific columns,
**So that** I can focus on the data most relevant to my current work.

#### Acceptance Criteria
- Column visibility dropdown is accessible from the table header.
- All available columns are listed with checkboxes.
- Default state: All columns are visible.
- Additional columns available (but hidden by default):
  - Expert Count (number of preferred experts)
  - Comment
  - Created By (name from snapshot)
  - Created Date
  - Changed By (name from snapshot)
  - Changed Date
  - Version Number
- Column visibility changes take effect immediately without page reload.
- Column visibility state persists during the session (local state, not URL).
- If more than 9 columns exist, a "more..." option opens a Drawer with the full checklist.

---

### US-5: Inspect Shift Plan Details
**As a** scheduling administrator,
**I want to** view the complete details of a shift plan,
**So that** I can understand the full configuration including time ranges, locations, jobs, and preferred experts.

#### Acceptance Criteria
- Each table row includes an "Inspect" action button.
- Clicking "Inspect" opens a Drawer on the right side of the screen.
- Drawer displays the full shift plan object in a formatted, readable structure:
  - **Overview Section**:
    - Name, Day, Start/End Hours, Duration
    - Price Type, Active Status
  - **Schedule Section**:
    - Time range visualization (e.g., timeline or bar chart)
  - **Assignment Section**:
    - Job details (from snapshot: type, name)
    - Location list (from snapshot: names, addresses)
    - Preferred expert list (from DBRefs: names, display names)
  - **Audit Section**:
    - Created By, Created Date
    - Changed By, Changed Date
    - Version Number
  - **Raw Data Section** (collapsible):
    - JSON/Tree view of the full entity
- Drawer can be closed via close button, overlay click, or ESC key.
- Drawer is responsive and works on tablet-sized screens (min-width: 768px).

---

### US-6: Navigate Between Pages
**As a** scheduling administrator,
**I want to** navigate between pages using pagination controls,
**So that** I can browse through large datasets efficiently.

#### Acceptance Criteria
- Pagination controls are always visible at the bottom of the table.
- Controls include:
  - Previous/Next buttons (disabled at boundaries)
  - Breadcrumb-style page numbers (e.g., 1, 2, 3, ..., 9, 10)
  - Current page indicator (highlighted)
  - Page size selector (25, 50, 100)
- Clicking a page number navigates to that page.
- Page state persists in the URL (e.g., `?page=3&limit=50`).
- Pagination logic updates dynamically based on:
  - Total count from server
  - Selected page size
- Navigation between pages completes within 1 second.

---

## Functional Requirements

### Data Model (from ShiftPlan entity)
Based on [db-mapping.md](../../../draft/db-mapping.md#entity-schichtplan-shift-plan):

| Field | Type | Description | Display Format |
|-------|------|-------------|----------------|
| `_id` | Long | Internal identifier | Hidden (used for keys) |
| `version` | Long | Version number | Number |
| `name` | String | Shift plan name | Text |
| `day` | DayOfWeek_Enum | Day of week | Badge (MON-SUN) |
| `start` | Number | Start hour (0-23) | Time (HH:00) |
| `end` | Number | End hour (0-23) | Time (HH:00) |
| `priceType` | PriceType_Enum | Pricing category | Badge (color-coded) |
| `active` | Boolean | Active status | Badge (Active/Inactive) |
| `assigned` | Array | Assigned locations (DBRefs) | Count badge |
| `job` | Document | Job snapshot (ConsultationJob) | Nested display |
| `changedBy` | Document | Last modifier (ConsultationDoctor) | Name from snapshot |
| `dateChanged` | Date | Last modification date | Formatted date/time |
| `createdBy` | Document | Creator (ConsultationDoctor) | Name from snapshot |
| `dateCreated` | Date | Creation date | Formatted date/time |
| `comment` | String | Free-text comment | Text (truncated) |
| `count` | Number | Count field | Number |
| `prefered` | Array | Preferred experts (DBRefs) | Count badge |

### Data Transformations
- **Duration Calculation**: `end - start` hours (handle wraparound for overnight shifts)
- **Time Formatting**: Convert hour numbers (0-23) to time strings (e.g., 8 → "08:00")
- **Snapshot Display**: Extract displayable fields from embedded documents:
  - `job.name`, `job.type`
  - `createdBy.displayName` or `createdBy.lastname`
  - `changedBy.displayName` or `changedBy.lastname`
- **Array Counts**: Display counts for `assigned` and `prefered` arrays
- **Status Badges**:
  - `active === true` → Green "Active"
  - `active === false` → Gray "Inactive"
- **Price Type Badges**:
  - WEEKDAY → Blue
  - WEEKNIGHT → Purple
  - WEEKENDDAY → Green
  - WEEKENDNIGHT → Orange

---

## Technical Requirements

### Technology Stack
- **Framework**: TanStack React Table v8 with manual pagination
- **UI Components**: shadcn/ui (Table, Badge, Drawer, Button, Input, Select)
- **Data Fetching**: oRPC with MongoDB Prisma client
- **State Management**: URL-based state for pagination, sorting, filtering
- **Routing**: TanStack Router with search params

### API Requirements
Create oRPC endpoint: `shiftPlan.list`

**Input Schema**:
```typescript
{
  page?: number;        // Default: 1
  limit?: number;       // Default: 25
  sortBy?: string;      // Default: "name"
  sortOrder?: "asc" | "desc"; // Default: "asc"
  search?: string;      // Full-text search
  filters?: {
    status?: ("active" | "inactive")[];
    day?: DayOfWeek_Enum[];
    priceType?: PriceType_Enum[];
  };
}
```

**Output Schema**:
```typescript
{
  data: ShiftPlan[];
  total: number;
  page: number;
  limit: number;
}
```

**Query Implementation**:
- Use Prisma `findMany` with `skip` and `take` for pagination
- Apply `orderBy` for sorting
- Use `OR` conditions for full-text search across `name` and `job.name`
- Use `AND` conditions for multi-select filters
- Return total count via `count()` query

---

## UI/UX Requirements

### Layout
- **Page Structure**:
  ```
  [Breadcrumb: Manager / Shift Plans]

  [Search Input] [Status Filter] [Day Filter] [Price Type Filter] [Clear Filters] [Column Visibility]

  [Table with Headers]
  [Table Rows...]

  [Pagination: Prev | 1 2 3 ... N | Next] [Page Size: 25 ▼]
  ```

### Responsive Behavior
- **Desktop (> 1024px)**: Full table with all visible columns
- **Tablet (768px - 1024px)**: Horizontal scroll for table, fixed search/filter bar
- **Mobile (< 768px)**: Out of scope (redirect to mobile-optimized view or show message)

### Accessibility
- All interactive elements must be keyboard-navigable
- ARIA labels for sort indicators, filter badges, and action buttons
- Screen reader announcements for page changes and filter applications
- Focus management when opening/closing drawers

### Performance
- Initial page load: < 2 seconds
- Page navigation: < 1 second
- Filter application: < 1 second
- Column visibility toggle: Instant (no server request)
- Drawer open/close: < 300ms animation

---

## Edge Cases

### EC-1: Empty State
**Scenario**: No shift plans exist in the database.
**Expected**: Display empty state message with icon:
- "No shift plans found. Create your first shift plan to get started."
- Hide pagination controls

### EC-2: No Search Results
**Scenario**: Search/filter yields zero results.
**Expected**: Display empty state message:
- "No shift plans match your filters. Try adjusting your search criteria."
- Show "Clear Filters" button
- Keep pagination controls visible but disabled

### EC-3: Overnight Shifts
**Scenario**: Shift starts at 22:00 (`start=22`) and ends at 06:00 (`end=6`).
**Expected**: Duration calculation handles wraparound:
- Duration = `(24 - 22) + 6 = 8 hours`
- Display as "22:00 - 06:00 (8 hours)"

### EC-4: Invalid or Missing Snapshot Data
**Scenario**: Embedded `job` or `createdBy` snapshot is missing or incomplete.
**Expected**:
- Display placeholder: "Unknown Job" or "Unknown User"
- Log warning to console for debugging
- Do not crash or fail to render row

### EC-5: Very Long Shift Plan Names
**Scenario**: Shift plan name exceeds 50 characters.
**Expected**: Truncate with ellipsis: "Long Shift Plan Name That Ex..."
- Show full name on hover (tooltip)

### EC-6: Concurrent Updates
**Scenario**: Another user modifies a shift plan while it's being viewed.
**Expected**:
- Table data reflects server state on next pagination/filter action
- Drawer shows data as of when it was opened (no real-time updates)
- Display version number to help identify changes

### EC-7: Large Preferred Expert Lists
**Scenario**: A shift plan has 20+ preferred experts.
**Expected**:
- Table column shows count badge: "20 experts"
- Drawer displays full list with scroll
- No performance degradation

### EC-8: Missing Price Type or Day
**Scenario**: Historical data missing `priceType` or `day` field.
**Expected**:
- Display "N/A" or empty badge
- Allow sorting/filtering to treat as separate category

---

## Definition of Done (ISO/IEC 25010)

### 1. Functional Suitability
- [ ] All 6 user stories implemented and testable
- [ ] All acceptance criteria met
- [ ] All 8 edge cases handled gracefully

### 2. Performance Efficiency
- [ ] Page load time < 2 seconds for 1000 records
- [ ] Filter/sort operations < 1 second
- [ ] No UI blocking during data fetches (loading states)

### 3. Usability
- [ ] Follows [table-view.md](../../../rules/table-view.md) UI principles
- [ ] Consistent with existing table implementations (Appointments, Users)
- [ ] Keyboard navigation fully supported
- [ ] Clear visual feedback for all interactions

### 4. Reliability
- [ ] No runtime errors in console
- [ ] Graceful handling of network failures
- [ ] Data consistency maintained across pagination

### 5. Security
- [ ] Only authorized users can access the table (role-based access control)
- [ ] No sensitive data exposed in URL parameters
- [ ] XSS protection for user-generated content (comments)

### 6. Maintainability
- [ ] Code follows project patterns and conventions
- [ ] Reusable components extracted where appropriate
- [ ] TypeScript types defined for all data structures
- [ ] Comments added for complex logic

### 7. Compatibility
- [ ] Works in Chrome, Firefox, Safari, Edge (latest versions)
- [ ] Responsive design tested on desktop and tablet
- [ ] No layout breaking in sidebar context

### 8. Portability
- [ ] No hard-coded environment-specific values
- [ ] Database queries work with both local and production MongoDB
- [ ] Feature can be deployed independently

---

## Further Suggestions for Acceptance Criteria

### Performance Optimization
- Implement virtual scrolling if dataset exceeds 10,000 records
- Add data caching layer (React Query) to reduce redundant API calls
- Lazy-load drawer content to improve perceived performance

### Enhanced Filtering
- Add date range filter for `dateCreated` and `dateChanged`
- Support combined filters (e.g., "Active shifts on Mondays with WEEKDAY pricing")
- Add saved filter presets for common queries

### Bulk Actions (Future)
- Select multiple shift plans via checkboxes
- Bulk activate/deactivate shifts
- Bulk export to CSV/Excel

### Data Visualization
- Add timeline view showing shift coverage across the week
- Display heatmap of shift density by day/time
- Integrate with expert availability calendar

### Integration
- Link to related appointments using this shift plan
- Show expert assignment conflicts
- Trigger alerts for gaps in shift coverage
