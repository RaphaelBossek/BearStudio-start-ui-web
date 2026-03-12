# Table View UI Principles

This document defines the general requirements and UI principles for all data table views within the application.

## Core Technology Stack

- **Library**: [@tanstack/react-table](https://tanstack.com/table)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/) (specifically the `Table` component)

## Functional Requirements

### 1. Data Retrieval and Navigation

- **Pagination**: Implement offset-based pagination (`page` and `limit` parameters).
- **Page Sizes**: Support configurable page sizes (e.g., 25, 50, 100).
- **Sorting**: Enable column-based sorting for all relevant data fields.
- **Search & Filtering**:
  - Provide full-text search (e.g., by name, title) and status-based filtering.
  - **Visibility**: Search and filter controls must ALWAYS be visible above the table.
  - **Scope**: Search/filtering applies ONLY to the columns currently visible in the UI.
  - **Data Depth**: Search/filtering must query ALL rows (server-side), not just the visible page.
- **Navigation Controls**:
  - The bottom navigation bar (Next/Prev, Page Size) must ALWAYS be visible.
  - **Pagination Slider**: Include page-number chips/slider (e.g., `1, 2, 3, ... 9, 10`) below the table.
  - **Logic**: The slider must dynamically update based on the current page size and the total number of pages.

### 2. Interaction and Visibility

- **Column Selection**:
  - Include a dropdown menu to toggle column visibility.
  - **Default State**: All available columns must be selected by default unless explicitly specified otherwise.
  - **Overflow (> 9 columns)**: If more than 9 columns exist, add a "more..." option at the bottom of the dropdown.
  - **"more..." Action**: Selecting "more..." opens a **Drawer** (or Modal) containing a checklist of all available columns.
- **No Page Reloads**: Column toggling and other table interactions must happen without full page refreshes.
- **Detail Inspection**: Every row should provide an "Inspect" action that opens a **Drawer** displaying the full, formatted JSON/Tree structure of the entity.

## Data Presentation Principles

### 1. Formatting

- **Status Badges**: Use color-coded badges for entity states (e.g., `ACTIVE`=Blue, `DONE`=Green, `STORNO`=Red).
- **Array Truncation**: Truncate array displays (e.g., tags, skills) to a maximum of **3 items**.
- **Human-Readable Data**: Transform raw data (e.g., 1-24 hour arrays) into readable formats (e.g., `8-11, 13-15`).

### 2. Layout and UX

- **Responsive Design**: Tables must be scrollable and readable on desktop and tablets.
- **Sidebar Compatibility**: Ensure the table remains usable within multi-pane/sidebar layouts.

---

## Rules for Coding Agents

When implementing or modifying a table view, follow these strict rules to maintain consistency:

1. **Framework**: Use `@tanstack/react-table` + `shadcn/ui`.
2. **Data Fetching**: Always use `oRPC` with offset-based pagination.
3. **Default Visibility**: Enable ALL columns by default.
4. **Column Selection UI**:
   - Use the standard dropdown for <= 9 columns.
   - Implement the "more..." Drawer for > 9 columns.
5. **Always Visible UI**: Ensure search, filters, and pagination controls (including the breadcrumb slider) are NOT hidden during scrolling or data fetching.
6. **Server-side Scope**: Filters must trigger a backend query that searches matching rows across the entire dataset, but filtered results are restricted to data present in visible columns.

## Route Breadcrumb Clarification (TanStack Router)

The pagination slider in table views is **not** the app-level route breadcrumb.

- Route breadcrumbs (top bar navigation hierarchy) must be driven by TanStack Router `staticData.breadcrumb` + `useMatches()`.
- Table pagination chips (`1, 2, 3, ...`) remain part of table pagination UX and are independent from route hierarchy navigation.
- Do not derive route breadcrumbs from table pagination state.

