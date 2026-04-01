# Shared UI Components (`_include` Directory) -- Legacy Analysis

> **Scope**: All shared/reusable components from `web/src/main/webapp/_include/`
> **Source**: Java/Mustache legacy app
> **Target**: React 19 + Shadcn/ui + TanStack Router + Tailwind CSS 4

---

## 1. Navigation Bar (`navbar.mustache`)

### Template Structure

```mustache
<nav id="appMenu" class="bg-{{active.color}}">
  <ul>
  {{#nav.buttons}}
    {{#spacer}}<li class="spacer" data-roles="{{roles}}" data-auth="{{auths}}"></li>{{/spacer}}
    {{^spacer}}
    <li id="{{id}}" class="action{{#disabled}} disabled{{/disabled}}"
        data-roles="{{roles}}" data-auth="{{auths}}">
      {{#rawIcon}}<i class="{{.}}">{{/rawIcon}}
      {{^rawIcon}}<i class="fa fa-{{icon}}">{{/rawIcon}}
      <span>{{i18n name}}</span>
    </li>
    {{/spacer}}
  {{/nav.buttons}}

  {{#nav.filter}}
    <li id="filterShow" style="float:right">
      <a href="#filter" data-bs-toggle="offcanvas" data-bs-target="#filter">
        <i class="fa fa-filter"></i>
      </a>
    </li>
  {{/nav.filter}}
  </ul>
</nav>
{{#settings}}<div id="gridSetting" data-name="{{name}}" data-value="{{value}}"/>{{/settings}}
```

### Data Model

| Field | Type | Description |
|-------|------|-------------|
| `active.color` | `string` | CSS class suffix for module color (e.g. `color-administration`) |
| `nav.buttons[]` | `Array<NavButton>` | Button definitions passed from each page's HTMLM header |
| `nav.buttons[].id` | `string` | DOM element id for the button |
| `nav.buttons[].icon` | `string` | FontAwesome icon name (without `fa-` prefix) |
| `nav.buttons[].rawIcon` | `string?` | Full CSS class string for non-FA icons |
| `nav.buttons[].name` | `string` | i18n key for the button label |
| `nav.buttons[].roles` | `string` | Comma-separated role names for RBAC visibility |
| `nav.buttons[].auths` | `string` | Comma-separated auth/permission names |
| `nav.buttons[].disabled` | `boolean` | Greys out the button |
| `nav.buttons[].spacer` | `boolean` | Renders a visual separator instead of a button |
| `nav.filter` | `boolean` | Whether to show the filter offcanvas trigger |
| `settings[]` | `Array<{name, value}>` | Hidden grid configuration data attributes |

### Key Behaviors

- **RBAC gating**: `data-roles` and `data-auth` attributes are read by a client-side JS framework to show/hide buttons based on the current user's roles and permissions. In React, this maps to conditional rendering based on `userHasPermission`.
- **Filter toggle**: When `nav.filter` is truthy, a filter icon button appears (float-right) that opens a Bootstrap offcanvas panel (`#filter`).
- **Grid settings**: Hidden `div#gridSetting` elements store key/value pairs for grid configuration -- in React these become component props or context values.
- **Module color**: The nav background color is dynamic per-module (appointments = teal, administration = blue, etc.).

### React Mapping

- Already implemented as a sidebar layout in the new app. Each module has its own route layout with navigation.
- Role/auth gating maps to `protectedProcedure` (server) and `GuardAuthenticated` (client) + role checks.
- The filter offcanvas maps to a Shadcn `Sheet` component triggered from the toolbar.
- Grid settings become TanStack Table column configuration state.

---

## 2. Siteloader (`siteloader.mustache` + `siteloader.js` + `siteloader.css`)

### HTML Structure

```html
<div id="waiting">                          <!-- full-page overlay, z-index: 9000 -->
  <div class="waitingContainer">            <!-- centered flex container -->
    <div class="lineSpinner spinnerMax">    <!-- outer ring: 9em, teal, 3s rotation -->
      <div class="lineSpinner spinnerMid">  <!-- middle ring: 7.2em, dark blue, 5s -->
        <div class="lineSpinner spinnerMin"></div>  <!-- inner ring: 5.4em, grey, 5s -->
      </div>
    </div>
    <div id="waitingProgress" class="progress">
      <div class="progress-bar progress-bar-striped">0%</div>
    </div>
  </div>
</div>
```

### JS API (`siteloader.js` -- 134 lines)

| Function | Signature | Description |
|----------|-----------|-------------|
| `initLoader($base)` | `($base: jQuery) => void` | Binds `doneLoading`/`startLoading` custom events on a container |
| `initGenericLoader()` | `() => void` | Listens to `data.ready` document event; auto-shows/hides overlay for all service calls except `getNotification` and `getStatus` |
| `showLoader(progresstime?)` | `(seconds?: number) => void` | Shows overlay. If `progresstime > 0`, starts animated progress bar incrementing over that duration |
| `showLoaderProgress(progress)` | `(percent: number) => void` | Sets progress bar width/text; auto-increments via `setTimeout` if interval is active |
| `hideLoader()` | `() => void` | Hides everything, resets progress state |
| `asyncExecutorProgress(config)` | `(config: AsyncConfig) => void` | **Full async job executor with polling** (see below) |

### `asyncExecutorProgress` Config Object

```typescript
type AsyncConfig = {
  service: string;        // e.g. "SomeService"
  method: string;         // e.g. "save"
  params?: any[];         // method arguments
  status?: string;        // status-check method name (default: `${method}Status`)
  result?: string;        // result-fetch method name (default: `${method}Result`)
  done?: (data: any) => void;  // completion callback
};
```

**Polling flow**:
1. Call `service.method(params)` -- returns a process ID (`pid`)
2. Poll `service.status(pid)` every 500ms
3. Response shape: `{ end: boolean, current: number, total: number }`
4. When `end === true`, call `service.result(pid)` to get final data
5. Invoke `done(data)` callback, then `hideLoader()`

### CSS Key Details

- **Overlay**: `position: absolute; z-index: 9000; background: rgba(200,200,200,.5)` -- semi-transparent grey covering entire viewport.
- **Spinner**: Three nested circles with `border-top` + `border-right` colored, rotating at different speeds (3s outer, 5s middle, 5s inner). Colors: `#469c9d` (teal), `#20344e` (dark navy), `#878787` (grey).
- **Progress bar**: Bootstrap `.progress` / `.progress-bar-striped`, 200px wide, positioned below spinner.
- **Inline variant**: `.inlineWaitingContainer` exists for non-fullscreen use (no vertical centering).

### React Mapping

- Full-page loading overlay: not typically needed in SPA (React handles this via Suspense boundaries and loading states).
- The spinner visual can be replaced by Shadcn's `Skeleton` or a simple `Loader2` icon animation from Lucide.
- `asyncExecutorProgress` maps to React Query `useMutation` + polling via `useQuery` with `refetchInterval`.
- Progress bar maps to Shadcn `Progress` component.

---

## 3. Preloader (`preloader.mustache` + `preloader.css`)

### HTML Structure

```html
<div class="gooey">
  <span class="dot"></span>
  <div class="dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>
```

### CSS Animation ("Gooey Dots")

- **Effect**: A "gooey blob" animation using `filter: contrast(20)` on the parent and `filter: blur(4px)` on the dots. This creates a metaball/liquid merging effect as dots move toward each other.
- **Timing**: 2.8s infinite loop. Single dot translates 96px right, dot group translates 31px left.
- **Size**: 142x40px container, 16px diameter dots.
- **Colors**: Black dots on white background (the contrast filter inverts perception).
- **Vendor prefixes**: Includes `-moz-`, `-webkit-`, `-o-` keyframes (legacy; modern Tailwind only needs standard `@keyframes`).
- **Card variant**: `.card .loading` sets a 50px-tall relative container for inline preloaders.

### React Mapping

- This is the initial HTML page load animation (shown before React hydrates). In a Vite/React SPA this would go in `index.html` as static HTML, removed on app mount.
- For in-app loading states, use Shadcn `Skeleton` components instead.
- The gooey effect is purely decorative and can be replaced with a simpler loading animation unless brand consistency requires it.

---

## 4. Quick Filter (`quickFilter.mustache`)

### HTML Structure

```html
<div id="quickFilter" class="btn-toolbar" role="toolbar">
  <input type="text" class="form-field"
    {{^quickFilterData.input}}style="display:none"{{/quickFilterData.input}}
    placeholder="{{i18n.label.search}}">

  <div class="btn-group btn-group-sm" role="group">
    <!-- Full mode: individual letter buttons (A, B, C, ..., Z) -->
    <div class="btn-group btn-group-sm single" role="group">
      {{#quickFilterData.full}}
        <button class="btn btn-secondary btn-xs applyFilter"
          data-filter="{{filter}}">{{name}}</button>
      {{/quickFilterData.full}}
    </div>
    <!-- Short mode: grouped letter buttons (A-D, E-H, ...) -->
    <div class="btn-group btn-group-sm grouped" role="group">
      {{#quickFilterData.short}}
        <button class="btn btn-secondary btn-xs applyFilter"
          data-filter="{{filter}}">{{name}}</button>
      {{/quickFilterData.short}}
    </div>
  </div>
</div>
```

### Data Model

| Field | Type | Description |
|-------|------|-------------|
| `quickFilterData.input` | `boolean` | Show/hide the text search input |
| `quickFilterData.full[]` | `Array<{filter, name}>` | Individual letter buttons (A-Z); `filter` = letter, `name` = display label |
| `quickFilterData.short[]` | `Array<{filter, name}>` | Grouped range buttons (A-D, E-H, etc.); `filter` = regex/range, `name` = display label |

### Key Behaviors

- **Two display modes**: "single" (26 individual letter buttons) and "grouped" (7-8 range buttons). Likely toggled via CSS/responsive breakpoints (`.single` shown on wide, `.grouped` on narrow).
- **Filter application**: Buttons have class `.applyFilter` and `data-filter` attribute. External JS (`quickFilter.js` from `_lib/scripts/`) reads these to filter a grid/list.
- **Text search**: Optional free-text input field shown when `quickFilterData.input` is true.
- **External dependencies**: Loads `/_lib/scripts/quickFilter.js` and `quickFilter.css` (not in `_include/`).

### React Mapping

- Maps to a filter toolbar component with:
  - `ToggleGroup` (Shadcn) for alphabet buttons
  - `Input` (Shadcn) for text search
  - Responsive switching between full/grouped mode via Tailwind breakpoints
- Filter state managed via URL search params (TanStack Router `useSearch`).
- The A-Z filter is used on list views (patients, experts, employees) for quick alphabetical navigation.

---

## 5. Job Status Dialog (`jobStatusDlg.html` + `jobStatusDlg.js`)

### HTML Structure

```html
<div id="jobStatusDlg" data-icon="far fa-download" data-target="modal"
     data-color="bg-color-administration" style="display:none" title="Status">
  Processing...
  <div class="progress">
    <div class="progress-bar progress-bar-striped" style="width: 1%">0%</div>
  </div>
  <div id="asyncJob" style="display:none">
    <!-- HARDCODED GERMAN -->
    Der Auftrag ist in der Warteschlange. Sie konnen diesen Dialog schliessen
    und das Ergebnis in <a href="asyncJobQueue.html">Warteschlangen</a> sehen.
  </div>
</div>
```

### JS Logic (`jobStatusDlg.js` -- 101 lines)

**Initialization**: `Dialog.init($("#jobStatusDlg"))` registers it as a modal dialog.

**Usage pattern** (from JSDoc):
```javascript
Core.conn.execute("MyService", "generateDownload", []).then(result => {
  Dialog.open($("#jobStatusDlg"), {
    service: "MyService",
    statusMethod: "getStatus",
    id: result,
    title: "status",
    icon: "bg-color-appointment",
    color: "fa-calendar-week",
    download: '../get/MyService/download/' + result + "/downloadFile.zip"
  });
});
```

**Config object passed via `Dialog.open`**:

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Process/job ID to poll |
| `service` | `string` | Service name (default: `"AsyncJobQueueService"`) |
| `statusMethod` | `string` | Status polling method (default: `"getStatus"`) |
| `download` | `string?` | Download URL template; if ends with `/`, `data.downloadName` is appended |
| `title` | `string?` | Custom modal title |
| `icon` | `string?` | Modal icon class |
| `color` | `string?` | Modal color class |

**Polling flow** (`dialogopen` event handler):
1. Extract config from `jsForm("get")` and `data()` attributes
2. If `service === "AsyncJobQueueService"`, show the async queue message with link to `asyncJobQueue.html#${id}`
3. Reset progress bar to 0%
4. Start polling `service.statusMethod(id)` every **2000ms** (initial delay: 1000ms)
5. Status response: `{ current: number, total: number, end: boolean, downloadName?: string }`
6. If `total === -1` (indeterminate): show animated "..." bar at 100% width
7. On `end === true`:
   - If `download` URL provided: open download in new window, show download link in progress bar
   - Else if `data.downloadName`: construct URL as `/get/${service}/download/${id}/${downloadName}`, open download
   - Else: auto-close dialog
8. Fires `"done"` event on `#jobStatusDlg` with `[id, data]`

### Server API Calls

| Call | Method | Parameters | Response |
|------|--------|------------|----------|
| Initial job start | `Core.conn.execute(service, method, params)` | Varies | Returns `pid: string` (job ID) |
| Status poll | `Core.conn.execute(service, "getStatus", [id])` | Job ID | `{ current: number, total: number, end: boolean, downloadName?: string }` |
| Result fetch (siteloader variant) | `Core.conn.execute(service, resultMethod, [pid])` | Job ID | Final result data |
| Download | `GET /get/{service}/download/{id}/{filename}` | URL path | Binary file |

### React Mapping

- Maps to a Shadcn `Dialog` with `Progress` component.
- Polling via `useQuery` with `refetchInterval: 2000` that stops when `end === true`.
- Download handling via `window.open()` or a generated `<a>` tag.
- The async queue link maps to a route in the new app (e.g. `/admin/async-jobs`).

---

## 6. Browser Notifications (`notify.js`)

### API

```javascript
function notify(title, options) { ... }
// options: { body: string, icon?: string }
```

### Behavior

1. **Bootstrap toast**: Creates and shows a Bootstrap toast (header with title, body with `options.body`). Appended to `document`.
2. **Browser Notification API**: If supported and permission is `"granted"`, creates a native `Notification`. If permission is `"default"`, requests permission first.

### Bugs in Legacy Code

- **`message` is undefined**: The `Notification` constructor uses `message` instead of `title`. This is a bug -- native notifications likely never worked correctly.
- **Toast cleanup**: Toasts are appended to `document` but never removed from DOM.
- **Options not passed**: The `Notification` constructor receives only `message` (should be `title`), and `options` (body, icon) are never forwarded.

### React Mapping

- Toast notifications: use Shadcn `Sonner` (toast library already integrated in most Shadcn setups).
- Browser Notification API: wrap in a custom hook `useNotifications()` with permission management.
- The dual toast + native notification pattern is a good UX (in-app toast always visible, native notification for background tabs).

---

## 7. CSS Analysis -- Animation Patterns

### Spinner (Siteloader)

| Property | Value | Modern Equivalent |
|----------|-------|-------------------|
| Triple nested rotating rings | `border-top/right` + `@keyframes rotate(360deg)` | Lucide `Loader2` with `animate-spin`, or custom Tailwind animation |
| Semi-transparent overlay | `rgba(200,200,200,.5); z-index: 9000` | Tailwind `bg-gray-300/50 fixed inset-0 z-50` |
| Progress bar | Bootstrap `.progress-bar-striped` | Shadcn `Progress` component |

### Preloader (Gooey Dots)

| Property | Value | Modern Equivalent |
|----------|-------|-------------------|
| Metaball effect | `filter: contrast(20)` parent + `filter: blur(4px)` children | Same CSS technique works in Tailwind (`contrast-[20] blur-[4px]`) but is niche |
| Dot animation | `translateX(96px)` / `translateX(-31px)` at 2.8s | Custom `@keyframes` in Tailwind config or `globals.css` |
| Vendor prefixes | `-moz-`, `-webkit-`, `-o-` | Not needed; standard `@keyframes` only |

### Colors (Brand)

| Name | Hex | Usage |
|------|-----|-------|
| Teal | `#469c9d` | Outer spinner ring, primary accent |
| Dark Navy | `#20344e` | Middle spinner ring, headers |
| Grey | `#878787` | Inner spinner ring, secondary |

---

## 8. Server API Calls Summary

| Component | Endpoint Pattern | Method | Polling | Notes |
|-----------|-----------------|--------|---------|-------|
| Siteloader (generic) | `Core.conn.execute(service, method, params)` | Any | No | Auto-shows/hides on all service calls |
| Siteloader (async) | `service.method(params)` then `service.status(pid)` then `service.result(pid)` | POST/RPC | 500ms | Inline progress + polling |
| Job Status Dialog | `service.getStatus(id)` | POST/RPC | 2000ms (initial 1000ms delay) | Progress modal with download |
| Job Status Download | `GET /get/{service}/download/{id}/{filename}` | GET | No | Binary file download |

### Status Response Schema

```typescript
type JobStatus = {
  current: number;   // items processed
  total: number;     // total items (-1 = indeterminate)
  end: boolean;      // job complete
  downloadName?: string;  // filename for download
};
```

---

## 9. Translation Table

### Filter-Related Keys

| Key | EN | DE | Source |
|-----|----|----|--------|
| `filter` | Filter | Filter | properties |
| `filter.activate` | Activate | Anwenden | properties |
| `filter.apply` | Apply | Anwenden | properties |
| `filter.clear` | Clear | Alles | properties |
| `filter.create` | Create Filter | Filter erstellen | properties |
| `filter.name` | Name | Name | properties |
| `filter.remove` | Remove Filter | Filter loschen | properties |
| `filter.remove.confirm` | Remove the selected filter? | Wollen Sie diesen Filter loschen? | properties |
| `filter.reset` | Reset filter | Filter resetieren | properties |
| `filter.results` | Results | Ergebnisse | properties |
| `filter.saved` | Saved Filter | Filter | properties |
| `filter.wildcarddesc` | You can use wildcards ? or * ... | Sie konnen platzhalter wie '?' oder '*' verwenden. | properties |
| `label.filter` | Filter | _(not found in DE)_ | properties |
| `dateFilter.title` | filter | Datumsfilter | properties |

### Async Job Keys

| Key | EN | DE | Source |
|-----|----|----|--------|
| `AsyncJobQueue` | Job Queues | Task-Warteschlangen | properties |
| `AsyncJobQueueState` | State | Status | properties |
| `AsyncJobQueueState.CANCELED` | Canceled | Abgebrochen | properties |
| `AsyncJobQueueState.ERROR` | Error | Fehler | properties |
| `AsyncJobQueueState.FINISHED` | Finished | Erledigt | properties |
| `AsyncJobQueueState.FINISHED_WITH_ERROR` | Done (with errors) | Erledigt (mit Fehler) | properties |
| `AsyncJobQueueState.PAUSED` | Paused | Pausiert | properties |
| `AsyncJobQueueState.PREPARING` | Preparing | In Vorbereitung | properties |
| `AsyncJobQueueState.RUNNING` | Running | In Bearbeitung | properties |
| `AsyncJobQueueState.WAITING` | Waiting | Wartend | properties |
| `asyncJob.cancel` | Cancel task | Aufgabe abbrechen | properties |
| `asyncJob.start` | Start | Starten | properties |

### HARDCODED Strings (No i18n Key)

| String | Language | Location | Recommended Key |
|--------|----------|----------|-----------------|
| `"Processing..."` | EN | `jobStatusDlg.html` | `jobStatus.processing` |
| `"Status"` | EN | `jobStatusDlg.html` (title attr) | `jobStatus.title` |
| `"Der Auftrag ist in der Warteschlange. Sie konnen diesen Dialog schliessen und das Ergebnis in Warteschlangen sehen."` | DE | `jobStatusDlg.html` (#asyncJob) | `jobStatus.queueMessage` |
| `"download..."` / `"download ..."` | EN | `jobStatusDlg.js` (progress bar link text) | `jobStatus.download` |
| `"0%"` | -- | `jobStatusDlg.html` + `siteloader.mustache` | (numeric, no key needed) |
| `"..."` | -- | `jobStatusDlg.js` (indeterminate state) | (symbolic, no key needed) |

---

## 10. Usage Map

| Component | Included By | Mechanism |
|-----------|-------------|-----------|
| **navbar.mustache** | Every page's HTMLM header template | Mustache partial `{{> _include/navbar}}` -- rendered by each module's header; `nav.buttons` array is page-specific |
| **siteloader.mustache** | Every page (global) | Included in the base page template; auto-activates on all `Core.conn.execute` calls via `data.ready` event |
| **preloader.mustache** | Base HTML template | Shown during initial page load before JS executes; removed by the framework on ready |
| **quickFilter.mustache** | List/grid pages (patients, experts, employees, jobs, equipment) | Included on pages with alphabetical listing; data populated server-side |
| **jobStatusDlg.html** | Pages with async export/generation features (reports, shift plans, appointment plans, invoices, work exports) | Included on pages needing async job progress; opened programmatically via `Dialog.open()` |
| **notify.js** | Pages with real-time notification features | Included where push notifications are needed; called from WebSocket/polling handlers |

### Component Dependency Graph

```
Base Page Template
  +-- preloader.mustache (initial load)
  +-- siteloader.mustache (global loading overlay)
  |     +-- siteloader.js (show/hide/progress/async executor)
  |     +-- siteloader.css
  +-- navbar.mustache (per-page navigation)
  |
  +-- [Per-page includes]
       +-- quickFilter.mustache (list pages only)
       |     +-- quickFilter.js (from _lib/scripts/)
       |     +-- quickFilter.css (from _lib/scripts/)
       +-- jobStatusDlg.html (async job pages only)
       |     +-- jobStatusDlg.js
       +-- notify.js (notification-enabled pages)
```

---

## Migration Priority Notes

| Component | Priority | Rationale |
|-----------|----------|-----------|
| Navigation Bar | **Already migrated** | Sidebar navigation exists in the new app via TanStack Router layouts |
| Siteloader | **Low** | React Query + Suspense handles loading states; no full-page overlay needed |
| Preloader | **Low** | Static `index.html` splash screen if desired; React hydration is fast |
| Quick Filter | **Medium** | Needed for patient/expert list views; implement as reusable `AlphabetFilter` component |
| Job Status Dialog | **High** | Core to async operations (exports, plan generation); needs `useJobStatus` hook with polling |
| Browser Notifications | **Medium** | Useful for background task completion; implement as `useNotifications` hook + Sonner toasts |

---

## 7. Application Shell (`site.htmlm`)

### Overview

The `site.htmlm` file is the **main application shell** that wraps all pages. It provides the global layout structure including the sidebar navigation, user menu, and shared infrastructure dialogs.

### HTMLM Header Metadata

```json
[
  {"field":"content","method":"content","params":[]},
  {"field":"maintenance", "method":"serviceCall","params":[{"service":"UserService","method":"isMaintenance"}]},
  {"field":"role", "method":"serviceCall","params":[{"service":"UserService","method":"getRole"}]},
  {"field":"unreadMessages", "method":"serviceCall","params":[{"service":"InfoService","method":"getUnreadMessages"}]},
  {"field":"bugReport", "method":"template","params":["_include/bugReport/bugReport.html"]},
  {"field":"roleSwitch", "method":"authority","params":["USERS_CREATE"]},
  {"field":"isCustomer", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"KUNDE\"]"]}]},
  {"field":"isEmployee", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"LEITER_INTERN\", \"ADMIN\", \"ADMIN_INTERN\", \"STANDARD\"]"]}]},
  {"field":"isAnEmployee", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"LEITER_INTERN\", \"ADMIN\", \"ADMIN_INTERN\",\"STANDARD\", \"REGISTERED\"]"]}]},
  {"field":"isACustomer", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"KUNDE\",\"ADMIN_KUNDE\",\"ADMIN_INTERN\",\"ADMIN\"]"]}]},
  {"field":"isCustomerAdmin", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"ADMIN_KUNDE\"]"]}]},
  {"field":"isAdmin", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"LEITER_INTERN\", \"ADMIN\", \"ADMIN_INTERN\"]"]}]},
  {"field":"isAnAdmin", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"ADMIN_KUNDE\",\"ADMIN_INTERN\",\"ADMIN\"]"]}]},
  {"field":"isStandard", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"STANDARD\"]"]}]}
]
```

### Permission/Authority Variables

| Variable | Method | Parameters | Purpose |
|----------|--------|------------|---------|
| `roleSwitch` | `authority` | `["USERS_CREATE"]` | Shows role switcher dialog if user can create users |
| `isCustomer` | `serviceCall` | `["KUNDE"]` | User has customer role only |
| `isEmployee` | `serviceCall` | Internal roles | User is internal employee (excludes REGISTERED) |
| `isAnEmployee` | `serviceCall` | Internal + REGISTERED | User is any employee including registered |
| `isACustomer` | `serviceCall` | Customer roles | User has any customer-related role |
| `isCustomerAdmin` | `serviceCall` | `["ADMIN_KUNDE"]` | User is customer admin |
| `isAdmin` | `serviceCall` | Internal admin roles | User is internal administrator |
| `isAnAdmin` | `serviceCall` | All admin roles | User has any admin role (internal or customer) |
| `isStandard` | `serviceCall` | `["STANDARD"]` | User has standard role only |

### Body Data Attributes

```html
<body data-service="{{prefix}}/service" 
      data-role="{{role}}" 
      data-reqid="{{csrf}}" 
      data-unread="{{unreadMessages}}" 
      data-user="{{userName}}" 
      data-standard="{{isStandard}}" 
      data-admin="{{isAdmin}}" 
      data-customer="{{isCustomer}}" 
      data-customerAdmin="{{isCustomerAdmin}}">
```

These attributes bootstrap the application state for client-side JavaScript.

---

### Global Navigation Sidebar (`#globalNav`)

#### Structure

```
#globalNav (nav)
├── #logo (span)
│   ├── logo256.png (200px)
│   └── logo64.png (icon, 48px)
├── #mainNav (div)
│   └── ul.nav.flex-column.colored
│       └── {{#sitemap}}  ← Server-generated menu
│           └── li.menuitem
│               ├── .mainItem (clickable parent)
│               │   ├── a href="{{prefix}}{{url}}"
│               │   │   ├── i.fa.fa-fw.fa-{{icon}}
│               │   │   └── span {{i18n title}}
│               │   └── span.opener (toggle submenu)
│               └── ul.submenu
│                   └── {{#sub}}
│                       └── li
│                           └── .subItem
│                               └── a href (same structure as parent)
└── #globalMenu (ul, right side)
    ├── Search toggle
    ├── Full-text search input
    ├── User dropdown menu
    └── Version display
```

#### Sitemap-Driven Navigation

The main navigation is **runtime-generated** from a server-side sitemap structure:

```mustache
{{#sitemap}}
  <li class="menuitem bg-{{color}} {{#active}}active{{/active}}">
    <div class="mainItem">
      <a href="{{prefix}}{{url}}" title="{{title}}">
        <i class="fa fa-fw fa-{{icon}}"></i>
        <span>{{i18n title}}</span>
      </a>
      <span class="opener"><i class="fa fa-bars"></i></span>
    </div>
    <ul class="submenu">
    {{#sub}}
      <li class="bg-{{color}}">
        <div class="subItem {{#active}}active{{/active}}">
          <a href="{{prefix}}{{url}}" id="{{id}}">
            <i class="fa fa-fw fa-{{icon}}"></i>
            <span>{{i18n title}}</span>
          </a>
        </div>
      </li>
    {{/sub}}
    </ul>
  </li>
{{/sitemap}}
```

| Property | Type | Description |
|----------|------|-------------|
| `color` | `string` | Background color class suffix (e.g. `color-appointment`, `color-administration`) |
| `url` | `string` | Relative URL path from app root |
| `title` | `string` | i18n key for menu item label |
| `icon` | `string` | FontAwesome icon name (without `fa-` prefix) |
| `active` | `boolean` | Highlights the menu item as current location |
| `sub[]` | `Array<SitemapItem>` | Nested submenu items (same structure) |
| `id` | `string` | DOM element ID for submenu items |

#### User Dropdown Menu

```html
<li class="dropdown">
  <a href="#" class="dropdown-toggle" data-bs-toggle="dropdown">
    <i class="fas fa-fw fa-user" title="{{role}}"></i>
    <span class="full">{{user.displayName}}</span>
  </a>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="profile.html">
      <i class="fa fa-fw fa-cog"></i> {{i18n.administration.settings}}
    </a>
    <a class="dropdown-item" href="userSecurity.html">
      <i class="fa fa-fw fa-id-card"></i> {{i18n.administration.security}}
    </a>
    {{#roleSwitch}}
    <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#roleSwitchDlg">
      <i class="far fa-fw fa-user-tag"></i> {{role}}
    </a>
    {{/roleSwitch}}
    {{>bugReport}}
    <a class="dropdown-item" href="logout" id="logout">
      <i class="fa fa-fw fa-sign-out"></i> {{i18n.logout}}
    </a>
  </div>
</li>
```

| Menu Item | Icon | Permission Gate | Target |
|-----------|------|-----------------|--------|
| Settings | `fa-cog` | Always visible | `profile.html` |
| Security | `fa-id-card` | Always visible | `userSecurity.html` |
| Role Switch | `fa-user-tag` | `roleSwitch=true` | Opens `#roleSwitchDlg` |
| Bug Report | (from include) | Always visible | Opens bug report dialog |
| Logout | `fa-sign-out` | Always visible | `logout` endpoint |

---

### Shared Infrastructure Dialogs

#### 1. Loading Spinner (`#spinner`)

```html
<div class="modal fade" id="spinner" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body" style="text-align:center">
        <i class="fas fa-circle-notch fa-spin fa-3x"></i>
      </div>
    </div>
  </div>
</div>
```

**Purpose**: Global loading overlay shown during async operations.  
**React mapping**: Replace with React Query `isLoading` states + Suspense boundaries or a `useLoadingOverlay` hook.

#### 2. Role Switch Dialog (`#roleSwitchDlg`)

```html
<div class="modal fade" id="roleSwitchDlg" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body" style="text-align:center">
        Current Role: {{role}}<br/>
        <form>
          <select id="roleSwitchSelection">
            <option value="">---</option>
            <option value="REGISTERED">Neu Registriert</option>
            <option value="STANDARD">Standard</option>
            <option value="LEITER_INTERN">Interner Leiter</option>
            <option value="ADMIN_INTERN">Interner Admin</option>
            <option value="KUNDE">Kunde</option>
            <option value="ADMIN_KUNDE">Kunde Admin</option>
            <option value="ADMIN">System-Admin</option>
          </select>
        </form>
      </div>
    </div>
  </div>
</div>
```

**Purpose**: Allows users with `USERS_CREATE` permission to switch their active role.  
**Role options**: 7 roles (REGISTERED, STANDARD, LEITER_INTERN, ADMIN_INTERN, KUNDE, ADMIN_KUNDE, ADMIN)  
**React mapping**: Shadcn `Dialog` + `Select` component; role switch via auth context update.

#### 3. Upload Dialog (`#uploadDlg`)

```html
<div class="modal fade" id="uploadDlg" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">Upload</h5></div>
      <div class="modal-body" style="text-align:center">
        <input type="file" id="uploadDlgLoadFile" style="display:none" multiple/>
        <button class="btn btn-sm btn-primary" id="uploadDlgBtn">Select a file</button>
        <div class="progress" id="uploadDlgProgress">
          <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
        </div>
        <div id="uploadDlgStatus"></div>
      </div>
    </div>
  </div>
</div>
```

**Purpose**: Generic file upload dialog with progress bar.  
**React mapping**: Shadcn `Dialog` + `Progress` component; use `react-dropzone` or native file input with `fetch` upload.

---

### Maintenance Mode Alert

```html
{{#maintenance}}
<div class="toast" style="opacity:1;right:20px;bottom:20px;position:absolute">
  <div class="toast-header">
    <svg><rect fill="#ff3a00"/></svg>
    <strong>{{i18n.error.maintenance.title}}</strong>
    <small><i class="fa fa-hard-hat fa-2x"></i></small>
  </div>
  <div class="toast-body">{{.}}</div>
</div>
{{/maintenance}}
```

**Purpose**: Shows a persistent toast notification when the system is in maintenance mode.  
**Condition**: Rendered only when `maintenance=true` (from `UserService.isMaintenance` service call).  
**React mapping**: Sonner toast or Shadcn `Toast` component; poll maintenance status on app mount.

---

### Full-Text Search

```html
<li class="full">
  <div class="input-group">
    <span id="clearSiteSearch" class="input-group-text"><i class="fa fa-search"></i></span>
    <input type="password" style="display: none"/>  ← Prevents browser password autofill
    <input type="text" id="siteSearch" autocomplete="off" class="form-control" placeholder="{{i18n.label.search}}"/>
  </div>
</li>
```

**Purpose**: Global search input in the top navigation bar.  
**Behavior**: Toggle visibility via search icon click; triggers full-text search across all entities.  
**React mapping**: Command palette (`cmd+k`) pattern with Shadcn `Command` component.

---

### React Migration Summary

| Shell Component | Legacy Implementation | Modern React Approach |
|-----------------|----------------------|----------------------|
| **Sidebar Nav** | `{{sitemap}}` Mustache iteration | TanStack Router `useMatches()` + recursive menu component |
| **User Menu** | Bootstrap dropdown | Shadcn `DropdownMenu` with auth context |
| **Role Switch** | Modal with `<select>` | Shadcn `Dialog` + `Select`; role switch via auth context |
| **Loading Spinner** | Bootstrap modal overlay | React Query `isLoading` + Suspense boundaries |
| **Upload Dialog** | Bootstrap modal + file input | Shadcn `Dialog` + `react-dropzone` |
| **Maintenance Toast** | Bootstrap toast (server-driven) | Sonner toast + polling `UserService.isMaintenance` |
| **Full-Text Search** | Text input in nav | Shadcn `Command` palette (`cmd+k` pattern) |
| **Bug Report** | Included template | Separate dialog component (see bugReport section below) |
| **Permission Gates** | `{{#variable}}` Mustache blocks | `userHasPermission()` checks + conditional rendering |

---

### Sitemap Structure (Extracted from Legacy)

> **Note**: The actual sitemap is server-generated. Below is the structure extracted from analyzing the navigation patterns across all modules.

| Main Menu Item | Icon | Color | Submenu Items |
|----------------|------|-------|---------------|
| Dashboard | `fa-home` | `dashboard` | (none) |
| Appointments | `fa-calendar` | `appointment` | List, Calendar, Week View, Month View |
| Consultations | `fa-heartbeat` | `consultation` | List, Templates, Quick Consultation |
| Treatments | `fa-stethoscope` | `treatment` | List, Plans, Categories |
| Shifts | `fa-user-clock` | `shift` | List, Shift Plans |
| Council | `fa-users` | `council` | List, Council Plans |
| Patients | `fa-user-injured` | `patient` | List, Quick Filter |
| Experts/Staff | `fa-user-md` | `staff` | List, Availability, Skills |
| Customers | `fa-building` | `customer` | List, Locations, Contacts |
| Rooms | `fa-door-open` | `room` | List, Room Plans |
| Equipment | `fa-toolbox` | `equipment` | List, Equipment Groups |
| Invoices | `fa-file-invoice-dollar` | `invoice` | List, Receivers, Worklog |
| Reports | `fa-chart-bar` | `report` | Various reports |
| Administration | `fa-cog` | `admin` | Users, Groups, Jobs, System Config |
| Support | `fa-headset` | `support` | Tickets, Video Library |

**Color mapping**: Each module has a corresponding `bg-color-{module}` CSS class defined in `_include/categories.css`.

---

## 8. Bug Report Dialog (`_include/bugReport/bugReport.html`)

### Template Include (from site.htmlm header)

```json
{"field":"bugReport", "method":"template","params":["_include/bugReport/bugReport.html"]}
```

### Integration Point

The bug report dialog is included in the user dropdown menu:

```html
{{>bugReport}}
```

### Component Structure

> **Note**: Full analysis of `bugReport.html` requires reading the separate file. This section is a placeholder for the detailed bug report component analysis.

**Known features** (from `analyse-ui-elements.md` lessons learned):
- **html2canvas screen capture** — Automatic screenshot with canvas annotation overlay
- **Drawing tools** — Rectangle, freehand pencil, color picker
- **Description field** — Textarea for bug description
- **Submit action** — Sends screenshot + description to support system

**React mapping**: Shadcn `Dialog` + canvas component for annotation; `html2canvas` library for screenshots.

---

## 7. Application Shell (`site.htmlm`)

### Overview

The `site.htmlm` file is the **main application shell** that wraps all pages. It provides the global layout structure including the sidebar navigation, user menu, and shared infrastructure dialogs.

### HTMLM Header Metadata

```json
[
  {"field":"content","method":"content","params":[]},
  {"field":"maintenance", "method":"serviceCall","params":[{"service":"UserService","method":"isMaintenance"}]},
  {"field":"role", "method":"serviceCall","params":[{"service":"UserService","method":"getRole"}]},
  {"field":"unreadMessages", "method":"serviceCall","params":[{"service":"InfoService","method":"getUnreadMessages"}]},
  {"field":"bugReport", "method":"template","params":["_include/bugReport/bugReport.html"]},
  {"field":"roleSwitch", "method":"authority","params":["USERS_CREATE"]},
  {"field":"isCustomer", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"KUNDE\"]"]}]},
  {"field":"isEmployee", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"LEITER_INTERN\", \"ADMIN\", \"ADMIN_INTERN\", \"STANDARD\"]"]}]},
  {"field":"isAnEmployee", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"LEITER_INTERN\", \"ADMIN\", \"ADMIN_INTERN\",\"STANDARD\", \"REGISTERED\"]"]}]},
  {"field":"isACustomer", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"KUNDE\",\"ADMIN_KUNDE\",\"ADMIN_INTERN\",\"ADMIN\"]"]}]},
  {"field":"isCustomerAdmin", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"ADMIN_KUNDE\"]"]}]},
  {"field":"isAdmin", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"LEITER_INTERN\", \"ADMIN\", \"ADMIN_INTERN\"]"]}]},
  {"field":"isAnAdmin", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"ADMIN_KUNDE\",\"ADMIN_INTERN\",\"ADMIN\"]"]}]},
  {"field":"isStandard", "method":"serviceCall","params":[{"service":"UserService","method":"checkRole","param":["[\"STANDARD\"]"]}]}
]
```

### Permission/Authority Variables

| Variable | Method | Parameters | Purpose |
|----------|--------|------------|---------|
| `roleSwitch` | `authority` | `["USERS_CREATE"]` | Shows role switcher dialog if user can create users |
| `isCustomer` | `serviceCall` | `["KUNDE"]` | User has customer role only |
| `isEmployee` | `serviceCall` | Internal roles | User is internal employee (excludes REGISTERED) |
| `isAnEmployee` | `serviceCall` | Internal + REGISTERED | User is any employee including registered |
| `isACustomer` | `serviceCall` | Customer roles | User has any customer-related role |
| `isCustomerAdmin` | `serviceCall` | `["ADMIN_KUNDE"]` | User is customer admin |
| `isAdmin` | `serviceCall` | Internal admin roles | User is internal administrator |
| `isAnAdmin` | `serviceCall` | All admin roles | User has any admin role (internal or customer) |
| `isStandard` | `serviceCall` | `["STANDARD"]` | User has standard role only |

### Body Data Attributes

```html
<body data-service="{{prefix}}/service" 
      data-role="{{role}}" 
      data-reqid="{{csrf}}" 
      data-unread="{{unreadMessages}}" 
      data-user="{{userName}}" 
      data-standard="{{isStandard}}" 
      data-admin="{{isAdmin}}" 
      data-customer="{{isCustomer}}" 
      data-customerAdmin="{{isCustomerAdmin}}">
```

These attributes bootstrap the application state for client-side JavaScript.

---

### Global Navigation Sidebar (`#globalNav`)

#### Structure

```
#globalNav (nav)
├── #logo (span)
│   ├── logo256.png (200px)
│   └── logo64.png (icon, 48px)
├── #mainNav (div)
│   └── ul.nav.flex-column.colored
│       └── {{#sitemap}}  ← Server-generated menu
│           └── li.menuitem
│               ├── .mainItem (clickable parent)
│               │   ├── a href="{{prefix}}{{url}}"
│               │   │   ├── i.fa.fa-fw.fa-{{icon}}
│               │   │   └── span {{i18n title}}
│               │   └── span.opener (toggle submenu)
│               └── ul.submenu
│                   └── {{#sub}}
│                       └── li
│                           └── .subItem
│                               └── a href (same structure as parent)
└── #globalMenu (ul, right side)
    ├── Search toggle
    ├── Full-text search input
    ├── User dropdown menu
    └── Version display
```

#### Sitemap-Driven Navigation

The main navigation is **runtime-generated** from a server-side sitemap structure:

```mustache
{{#sitemap}}
  <li class="menuitem bg-{{color}} {{#active}}active{{/active}}">
    <div class="mainItem">
      <a href="{{prefix}}{{url}}" title="{{title}}">
        <i class="fa fa-fw fa-{{icon}}"></i>
        <span>{{i18n title}}</span>
      </a>
      <span class="opener"><i class="fa fa-bars"></i></span>
    </div>
    <ul class="submenu">
    {{#sub}}
      <li class="bg-{{color}}">
        <div class="subItem {{#active}}active{{/active}}">
          <a href="{{prefix}}{{url}}" id="{{id}}">
            <i class="fa fa-fw fa-{{icon}}"></i>
            <span>{{i18n title}}</span>
          </a>
        </div>
      </li>
    {{/sub}}
    </ul>
  </li>
{{/sitemap}}
```

| Property | Type | Description |
|----------|------|-------------|
| `color` | `string` | Background color class suffix (e.g. `color-appointment`, `color-administration`) |
| `url` | `string` | Relative URL path from app root |
| `title` | `string` | i18n key for menu item label |
| `icon` | `string` | FontAwesome icon name (without `fa-` prefix) |
| `active` | `boolean` | Highlights the menu item as current location |
| `sub[]` | `Array<SitemapItem>` | Nested submenu items (same structure) |
| `id` | `string` | DOM element ID for submenu items |

#### User Dropdown Menu

```html
<li class="dropdown">
  <a href="#" class="dropdown-toggle" data-bs-toggle="dropdown">
    <i class="fas fa-fw fa-user" title="{{role}}"></i>
    <span class="full">{{user.displayName}}</span>
  </a>
  <div class="dropdown-menu">
    <a class="dropdown-item" href="profile.html">
      <i class="fa fa-fw fa-cog"></i> {{i18n.administration.settings}}
    </a>
    <a class="dropdown-item" href="userSecurity.html">
      <i class="fa fa-fw fa-id-card"></i> {{i18n.administration.security}}
    </a>
    {{#roleSwitch}}
    <a class="dropdown-item" data-bs-toggle="modal" data-bs-target="#roleSwitchDlg">
      <i class="far fa-fw fa-user-tag"></i> {{role}}
    </a>
    {{/roleSwitch}}
    {{>bugReport}}
    <a class="dropdown-item" href="logout" id="logout">
      <i class="fa fa-fw fa-sign-out"></i> {{i18n.logout}}
    </a>
  </div>
</li>
```

| Menu Item | Icon | Permission Gate | Target |
|-----------|------|-----------------|--------|
| Settings | `fa-cog` | Always visible | `profile.html` |
| Security | `fa-id-card` | Always visible | `userSecurity.html` |
| Role Switch | `fa-user-tag` | `roleSwitch=true` | Opens `#roleSwitchDlg` |
| Bug Report | (from include) | Always visible | Opens bug report dialog |
| Logout | `fa-sign-out` | Always visible | `logout` endpoint |

---

### Shared Infrastructure Dialogs

#### 1. Loading Spinner (`#spinner`)

```html
<div class="modal fade" id="spinner" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body" style="text-align:center">
        <i class="fas fa-circle-notch fa-spin fa-3x"></i>
      </div>
    </div>
  </div>
</div>
```

**Purpose**: Global loading overlay shown during async operations.  
**React mapping**: Replace with React Query `isLoading` states + Suspense boundaries or a `useLoadingOverlay` hook.

#### 2. Role Switch Dialog (`#roleSwitchDlg`)

```html
<div class="modal fade" id="roleSwitchDlg" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-body" style="text-align:center">
        Current Role: {{role}}<br/>
        <form>
          <select id="roleSwitchSelection">
            <option value="">---</option>
            <option value="REGISTERED">Neu Registriert</option>
            <option value="STANDARD">Standard</option>
            <option value="LEITER_INTERN">Interner Leiter</option>
            <option value="ADMIN_INTERN">Interner Admin</option>
            <option value="KUNDE">Kunde</option>
            <option value="ADMIN_KUNDE">Kunde Admin</option>
            <option value="ADMIN">System-Admin</option>
          </select>
        </form>
      </div>
    </div>
  </div>
</div>
```

**Purpose**: Allows users with `USERS_CREATE` permission to switch their active role.  
**Role options**: 7 roles (REGISTERED, STANDARD, LEITER_INTERN, ADMIN_INTERN, KUNDE, ADMIN_KUNDE, ADMIN)  
**React mapping**: Shadcn `Dialog` + `Select` component; role switch via auth context update.

#### 3. Upload Dialog (`#uploadDlg`)

```html
<div class="modal fade" id="uploadDlg" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header"><h5 class="modal-title">Upload</h5></div>
      <div class="modal-body" style="text-align:center">
        <input type="file" id="uploadDlgLoadFile" style="display:none" multiple/>
        <button class="btn btn-sm btn-primary" id="uploadDlgBtn">Select a file</button>
        <div class="progress" id="uploadDlgProgress">
          <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%"></div>
        </div>
        <div id="uploadDlgStatus"></div>
      </div>
    </div>
  </div>
</div>
```

**Purpose**: Generic file upload dialog with progress bar.  
**React mapping**: Shadcn `Dialog` + `Progress` component; use `react-dropzone` or native file input with `fetch` upload.

---

### Maintenance Mode Alert

```html
{{#maintenance}}
<div class="toast" style="opacity:1;right:20px;bottom:20px;position:absolute">
  <div class="toast-header">
    <svg><rect fill="#ff3a00"/></svg>
    <strong>{{i18n.error.maintenance.title}}</strong>
    <small><i class="fa fa-hard-hat fa-2x"></i></small>
  </div>
  <div class="toast-body">{{.}}</div>
</div>
{{/maintenance}}
```

**Purpose**: Shows a persistent toast notification when the system is in maintenance mode.  
**Condition**: Rendered only when `maintenance=true` (from `UserService.isMaintenance` service call).  
**React mapping**: Sonner toast or Shadcn `Toast` component; poll maintenance status on app mount.

---

### Full-Text Search

```html
<li class="full">
  <div class="input-group">
    <span id="clearSiteSearch" class="input-group-text"><i class="fa fa-search"></i></span>
    <input type="password" style="display: none"/>  ← Prevents browser password autofill
    <input type="text" id="siteSearch" autocomplete="off" class="form-control" placeholder="{{i18n.label.search}}"/>
  </div>
</li>
```

**Purpose**: Global search input in the top navigation bar.  
**Behavior**: Toggle visibility via search icon click; triggers full-text search across all entities.  
**React mapping**: Command palette (`cmd+k`) pattern with Shadcn `Command` component.

---

### React Migration Summary

| Shell Component | Legacy Implementation | Modern React Approach |
|-----------------|----------------------|----------------------|
| **Sidebar Nav** | `{{sitemap}}` Mustache iteration | TanStack Router `useMatches()` + recursive menu component |
| **User Menu** | Bootstrap dropdown | Shadcn `DropdownMenu` with auth context |
| **Role Switch** | Modal with `<select>` | Shadcn `Dialog` + `Select`; role switch via auth context |
| **Loading Spinner** | Bootstrap modal overlay | React Query `isLoading` + Suspense boundaries |
| **Upload Dialog** | Bootstrap modal + file input | Shadcn `Dialog` + `react-dropzone` |
| **Maintenance Toast** | Bootstrap toast (server-driven) | Sonner toast + polling `UserService.isMaintenance` |
| **Full-Text Search** | Text input in nav | Shadcn `Command` palette (`cmd+k` pattern) |
| **Bug Report** | Included template | Separate dialog component (see bugReport section below) |
| **Permission Gates** | `{{#variable}}` Mustache blocks | `userHasPermission()` checks + conditional rendering |

---

### Sitemap Structure (Extracted from Legacy)

> **Note**: The actual sitemap is server-generated. Below is the structure extracted from analyzing the navigation patterns across all modules.

| Main Menu Item | Icon | Color | Submenu Items |
|----------------|------|-------|---------------|
| Dashboard | `fa-home` | `dashboard` | (none) |
| Appointments | `fa-calendar` | `appointment` | List, Calendar, Week View, Month View |
| Consultations | `fa-heartbeat` | `consultation` | List, Templates, Quick Consultation |
| Treatments | `fa-stethoscope` | `treatment` | List, Plans, Categories |
| Shifts | `fa-user-clock` | `shift` | List, Shift Plans |
| Council | `fa-users` | `council` | List, Council Plans |
| Patients | `fa-user-injured` | `patient` | List, Quick Filter |
| Experts/Staff | `fa-user-md` | `staff` | List, Availability, Skills |
| Customers | `fa-building` | `customer` | List, Locations, Contacts |
| Rooms | `fa-door-open` | `room` | List, Room Plans |
| Equipment | `fa-toolbox` | `equipment` | List, Equipment Groups |
| Invoices | `fa-file-invoice-dollar` | `invoice` | List, Receivers, Worklog |
| Reports | `fa-chart-bar` | `report` | Various reports |
| Administration | `fa-cog` | `admin` | Users, Groups, Jobs, System Config |
| Support | `fa-headset` | `support` | Tickets, Video Library |

**Color mapping**: Each module has a corresponding `bg-color-{module}` CSS class defined in `_include/categories.css`.

---

## 8. Bug Report Dialog (`_include/bugReport/bugReport.html`)

### Template Include (from site.htmlm header)

```json
{"field":"bugReport", "method":"template","params":["_include/bugReport/bugReport.html"]}
```

### Integration Point

The bug report dialog is included in the user dropdown menu:

```html
{{>bugReport}}
```

### Component Structure

> **Note**: Full analysis of `bugReport.html` requires reading the separate file. This section is a placeholder for the detailed bug report component analysis.

**Known features** (from `analyse-ui-elements.md` lessons learned):
- **html2canvas screen capture** — Automatic screenshot with canvas annotation overlay
- **Drawing tools** — Rectangle, freehand pencil, color picker
- **Description field** — Textarea for bug description
- **Submit action** — Sends screenshot + description to support system

**React mapping**: Shadcn `Dialog` + canvas component for annotation; `html2canvas` library for screenshots.
