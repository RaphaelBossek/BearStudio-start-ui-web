# Wireframe Creation Plan — Includes Module + Application Shell

> Target directory: `specs/wireframes/includes/` (includes components)  
> Target directory: `specs/wireframes/system/shell/` (application shell)

## Prerequisites

1. All analysis documents in `specs/analysis/includes/` are reviewed (01, 02, 03)
2. Pencil MCP server available
3. Style guide obtained via `get_guidelines(topic="web-app")`
4. Shadcn component registry reviewed (`Shadcn_list_items_in_registries(["@shadcn"])`)

---

## Wireframe Inventory — Includes Components

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W1 | `includes-navbar.pen` | 01 | Low | Dynamic nav bar with buttons, role gating, filter toggle |
| W2 | `includes-loading-states.pen` | 01 | Low | Preloader (gooey dots), siteloader (spinner + progress), job status (progress modal) |
| W3 | `includes-quick-filter.pen` | 01 | Low | A-Z filter bar: full mode (individual) + short mode (grouped) + search input |
| W4 | `includes-login.pen` | 02 | Medium | Login page: credentials form, TOTP 2FA step (QR + digit input), password reset flow |
| W5 | `includes-bug-report.pen` | 02 | Medium | Bug report dialog: screen capture with annotation tools, description form |
| W6 | `includes-color-palette.pen` | 02 | Low | Visual reference: 14 entity colors + state color mappings |

**Status**: ✅ Complete (6/6 wireframes)

---

## Wireframe Inventory — Application Shell (NEW)

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W7 | `app-shell-layout.pen` | 03 | Medium | Full application shell (1440px width): sidebar nav, top bar, main content area, maintenance toast, loading spinner overlay |
| W8 | `global-navigation.pen` | 03 | Medium | Sidebar navigation detail: logo area, main nav items with icons/colors/active states, submenu expansion (accordion), collapsed state (icon-only, 64px) |
| W9 | `user-menu.pen` | 03 | Low | User dropdown dialog: display name + role, settings, security, role switch trigger, bug report, logout |

**Status**: ⏳ Pending (0/3 wireframes) — **Batch 2 Extension**

---

## Shadcn Component Mapping

### Application Shell Components

| Legacy Component | Shadcn Component | Notes |
|------------------|------------------|-------|
| **Sidebar Navigation** | Custom + `Sheet` (mobile) | Recursive menu component; mobile uses `Sheet` for drawer |
| **User Dropdown** | `DropdownMenu` | Auth context integration |
| **Role Switch Dialog** | `Dialog` + `Select` | Role switch via auth context update |
| **Loading Spinner** | (React Query states) | No global overlay — per-component `isLoading` states |
| **Upload Dialog** | `Dialog` + file input | `react-dropzone` for drag-drop |
| **Maintenance Toast** | `Toast` (Sonner) | Persistent toast with polling |
| **Full-Text Search** | `Command` | `cmd+k` pattern with fuzzy search |

### Includes Components

| Legacy Component | Shadcn Component | Notes |
|------------------|------------------|-------|
| **Navbar** | (Already migrated) | Sidebar nav exists via TanStack Router layouts |
| **Quick Filter** | `ToggleGroup` | A-Z toggle buttons with multi-select |
| **Login Form** | `Dialog` + `Input` + `Select` | TOTP 2FA with 6-digit input component |
| **Bug Report** | `Dialog` + canvas | `html2canvas` for screenshots |
| **Job Status** | `Dialog` + `Progress` | Polling with React Query |

---

## Key Design Notes

### Application Shell

- **Full shell layout** (W7) should be 1440px wide showing:
  - Sidebar (240px, expanded state)
  - Top bar with search, user menu, version
  - Main content area placeholder
  - Maintenance toast (bottom-right)
  - Loading spinner overlay (centered modal)
- **Global navigation** (W8) has two states:
  - **Expanded** (240px): Icons + labels, submenus visible
  - **Collapsed** (64px): Icons only, hover tooltips
- **User menu** (W9) is a dropdown with 5-6 items depending on permissions
- **Color coding**: Each module has a `bg-color-{module}` class — reference `categories.css`

### Includes Components

- **Navbar** is already implemented in modern UI as sidebar — wireframe is for legacy reference only
- **Login** has 3 flows: standard → TOTP 2FA onboarding (QR code) → password reset — should be wireframed as a flow
- **Bug report** has a canvas overlay for screenshot annotation — draw rectangles + freehand + color picker
- **Color palette** wireframe is a visual reference card, not a UI component

---

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `[HARDCODED]` | Needs i18n key |
| `[already-migrated]` | Component already exists in modern UI |
| `[framework]` | Part of corinis:webCore, needs modern equivalent |
| `[PERM: PERMISSION_NAME]` | Permission-gated UI element |
| `[state: STATE_NAME]` | State-driven visibility |
| `data.field.path` | Datamodel binding path |
| `@shadcn/component` | Target Shadcn component |

---

## Execution Steps

### Batch 2 Extension — Application Shell (3 wireframes)

1. **Open Pencil** with UNC path:
   ```
   pencil_open_document("\\\\wsl.localhost\\Ubuntu\\home\\raphael\\src\\vc\\BearStudio-start-ui-web\\specs\\wireframes\\system\\shell\\app-shell-layout.pen")
   ```

2. **Design app-shell-layout.pen** (1440px width):
   - Sidebar (240px, expanded, left)
   - Top bar (48px height, full width)
   - Main content area (placeholder)
   - Maintenance toast (bottom-right corner)
   - Loading spinner overlay (centered modal, semi-transparent background)
   - Use `@shadcn/Sidebar`, `@shadcn/DropdownMenu` annotations

3. **Design global-navigation.pen** (two states side-by-side):
   - Left: Expanded state (240px) with logo, 5-6 main menu items, one submenu expanded
   - Right: Collapsed state (64px) with icons only
   - Annotate color classes (`bg-color-appointment`, etc.)
   - Show active state highlighting

4. **Design user-menu.pen** (dropdown dialog):
   - User display name + role badge
   - 5-6 menu items (Settings, Security, Role Switch, Bug Report, Logout)
   - Annotate permission gate for Role Switch (`USERS_CREATE`)

5. **Export PNGs** for all three wireframes:
   ```
   pencil_export_nodes(filePath=UNC_path, outputDir=UNC_output_dir, nodeIds=[...])
   ```

6. **Save via mcp2cli**:
   ```bash
   python3 specs/wireframes/_save_pen.py specs/wireframes/system/shell/app-shell-layout.pen
   python3 specs/wireframes/_save_pen.py specs/wireframes/system/shell/global-navigation.pen
   python3 specs/wireframes/_save_pen.py specs/wireframes/system/shell/user-menu.pen
   ```

7. **Embed screenshots** in `specs/wireframes/system/shell/workflows.md`

8. **Update** `specs/analysis/wireframes-index.md` with completion status

---

## Workflows Documentation

Create `specs/wireframes/system/shell/workflows.md` with:

1. **Navigation Flow** — How users navigate between modules via sidebar
2. **Role Switch Flow** — User switches active role via dropdown → dialog → confirmation
3. **Maintenance Mode Flow** — System enters maintenance → toast appears → user notified
4. **Search Flow** — User clicks search icon → input expands → types query → results shown

Each flow documented with:
- Mermaid flowchart or sequence diagram
- Wireframe screenshots embedded
- Brief description of user experience

---

## Completion Tracking

| Wireframe | .pen File | PNG Export | Workflows.md | Status |
|-----------|-----------|------------|--------------|--------|
| W7: App Shell Layout | ⏳ Pending | ⏳ Pending | ⏳ Pending | 0% |
| W8: Global Navigation | ⏳ Pending | ⏳ Pending | ⏳ Pending | 0% |
| W9: User Menu | ⏳ Pending | ⏳ Pending | ⏳ Pending | 0% |

**Overall Progress**: 0/3 wireframes complete (0%)
