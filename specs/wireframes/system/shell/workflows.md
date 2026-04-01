# Application Shell Workflows

> **Domain**: System / Application Shell  
> **Source**: `site.htmlm` (272 lines)  
> **Wireframes**: W7 (App Shell Layout), W8 (Global Navigation), W9 (User Menu)

---

## 1. Navigation Flow

User navigates between modules via the sidebar navigation.

```mermaid
flowchart TD
    A[User lands on Dashboard] --> B{Sidebar visible?}
    B -->|Expanded 240px| C[Full menu with icons + labels]
    B -->|Collapsed 64px| D[Icons only with hover tooltips]
    C --> E{Click main menu item}
    D --> E
    E -->|Has submenu| F[Accordion expands]
    E -->|No submenu| G[Navigate to route]
    F --> H{Click submenu item}
    H --> G
    G --> I[Page loads in #main content area]
    I --> J[Active state highlights current route]
    
    style A fill:#EFF6FF,stroke:#1D4ED8
    style G fill:#F0FDF4,stroke:#166534
    style J fill:#FEF2F2,stroke:#DC2626
```

**User Experience:**
- **Entry point**: Any page load or route change
- **Navigation**: Click main menu items or submenu items
- **Visual feedback**: Active route highlighted with `bg-color-{module}` class
- **Sitemap-driven**: Menu structure generated from `{{sitemap}}` server data

---

## 2. Role Switch Flow

User switches active role via dropdown menu → dialog → confirmation.

```mermaid
sequenceDiagram
    participant U as User
    participant DM as Dropdown Menu
    participant D as Role Switch Dialog
    participant S as Server Session
    
    U->>DM: Click user menu icon
    DM->>U: Show dropdown with role badge
    U->>DM: Click "Role Switch" item
    Note over DM: [PERM: USERS_CREATE] gate
    DM->>D: Open modal dialog
    D->>U: Show current role + select dropdown
    U->>D: Select new role from 7 options
    Note over D: Hardcoded German labels
    U->>D: Confirm selection
    D->>S: POST session update
    S->>U: Reload page with new role
    Note over U: Sidebar/nav refresh
```

**User Experience:**
- **Entry point**: User menu → Role Switch item
- **Permission gate**: Only visible if `roleSwitch=true` (authority: `USERS_CREATE`)
- **Dialog content**: Current role display + 7-option select dropdown
- **Hardcoded strings**: German role labels need i18n keys
- **Exit point**: Session update + page reload with new role

**Role Options:**
1. REGISTERED (Neu Registriert)
2. STANDARD (Standard)
3. LEITER_INTERN (Interner Leiter)
4. ADMIN_INTERN (Interner Admin)
5. KUNDE (Kunde)
6. ADMIN_KUNDE (Kunde Admin)
7. ADMIN (System-Admin)

---

## 3. Maintenance Mode Flow

System enters maintenance → persistent toast appears → user notified.

```mermaid
flowchart TD
    A[System enters maintenance mode] --> B[UserService.isMaintenance returns true]
    B --> C{Render site.htmlm}
    C -->|maintenance=true| D[Show maintenance toast]
    C -->|maintenance=false| E[No toast shown]
    D --> F[Toast positioned bottom-right]
    F --> G[Red header with hard hat icon]
    G --> H[Display Wartungsnachricht]
    H --> I[Show maintenance message]
    I --> J[User continues working with alert]
    
    style A fill:#FFFBEB,stroke:#F59E0B
    style D fill:#FEF2F2,stroke:#DC2626
    style J fill:#EFF6FF,stroke:#1D4ED8
```

**User Experience:**
- **Trigger**: `UserService.isMaintenance` returns `true`
- **Visual**: Persistent toast in bottom-right corner
- **Styling**: Red header (`#ff3a00`), hard hat icon
- **Content**: i18n title + server-provided message
- **Behavior**: Non-blocking alert — user can continue working

---

## 4. Search Flow

User clicks search icon → input expands → types query → results shown.

```mermaid
sequenceDiagram
    participant U as User
    participant SB as Search Button
    participant SI as Search Input
    participant RS as Results Section
    
    U->>SB: Click search icon in top bar
    SB->>SI: Expand text input
    Note over SI: Hidden password field prevents autofill
    U->>SI: Type search query
    Note over SI: autocomplete="off"
    U->>SI: Press Enter or click search
    SI->>RS: Submit full-text search
    RS->>U: Display search results
    Note over RS: Fuzzy search across entities
    U->>SI: Clear search or close
    SI->>SB: Collapse input, show icon only
```

**User Experience:**
- **Entry point**: Click search icon in `#globalMenu`
- **Expansion**: Text input expands from icon
- **Anti-autofill**: Hidden `type="password"` field prevents browser password autofill
- **Search behavior**: Full-text search across all entities
- **Exit point**: Clear search or collapse input

---

## Wireframe Screenshots

### W7: App Shell Layout

![App Shell Layout](./app-shell-layout.png)

**Full application shell (1440px width) showing:**
- Sidebar navigation (240px expanded, left side)
- Top bar (48px height, contains search toggle, user menu, version)
- Main content area placeholder (routed page loads here)
- Maintenance toast (bottom-right corner, fixed position)
- Loading spinner overlay (centered modal, semi-transparent background)

**Annotations:**
- `@shadcn/Sidebar` — Sidebar navigation component
- `@shadcn/DropdownMenu` — User menu component
- `[PERM: USERS_CREATE]` — Permission gate on role switch
- `data-service`, `data-role`, `data-unread` — Body data bindings

---

### W8: Global Navigation

![Global Navigation Expanded](./global-navigation-expanded.png)

**Expanded state (240px width):**
- Logo area (64px height, full logo + subtext)
- Main menu items with icons and labels
- Color-coded backgrounds (`bg-color-{module}`)
- Active state highlighting (current route)
- Accordion submenu expansion

![Global Navigation Collapsed](./global-navigation-collapsed.png)

**Collapsed state (64px width):**
- Icons only (no labels)
- Hover tooltips (annotated)
- Logo icon variant (64px square)

**Key features:**
- Sitemap-driven: `{{sitemap}}` iteration
- FontAwesome icons: `fa-{icon}` naming
- Color classes: `bg-color-appointment`, `bg-color-consultation`, etc.

---

### W9: User Menu

![User Menu](./user-menu.png)

**User dropdown dialog showing:**
- User display name + role badge at top
- 5 menu items:
  1. **Settings** (`fa-cog`) → `profile.html`
  2. **Security** (`fa-id-card`) → `userSecurity.html`
  3. **Role Switch** (`fa-user-tag`) → Opens dialog (gated by `USERS_CREATE`)
  4. **Bug Report** (`fa-bug`) → Opens bug report dialog
  5. **Logout** (`fa-sign-out`) → `logout` endpoint
- Version display at bottom

**Annotations:**
- `[PERM: USERS_CREATE]` — Permission gate on Role Switch item
- `[HARDCODED]` — German role labels in role switch dialog
- `{{user.displayName}}`, `{{role}}` — Data bindings
- `{{i18n.*}}` — Translation keys

---

## Interdependencies Summary

| Factor | Influences | Impact on UX |
|--------|------------|--------------|
| **Sitemap structure** | Sidebar menu items, submenus | Determines navigation hierarchy and available routes |
| **User role** | Role switch availability, menu visibility | Controls which features/actions are accessible |
| **Permission: USERS_CREATE** | Role switch menu item visibility | Only admins/user managers can switch roles |
| **Maintenance mode** | Toast visibility | Alerts users to system status |
| **Nav state (expanded/collapsed)** | Label visibility, hover tooltips | Affects discoverability vs. screen real estate |
| **Module color** | Menu item background | Visual categorization of navigation sections |

---

## Related Documentation

- **Analysis**: [`specs/analysis/includes/site-shell.md`](../../../analysis/system/includes/site-shell.md)
- **Wireframe Plan**: [`specs/analysis/includes/wireframes.md`](../../../analysis/system/includes/wireframes.md)
- **Progress Index**: [`specs/analysis/wireframes-index.md`](../../wireframes-index.md)
