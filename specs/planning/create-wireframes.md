# UI Wireframing and Workflow Documentation Plan

This document provides generic instructions for AI coding agents to create wireframes (`.pen` files) and workflow descriptions (Mermaid diagrams) based on the analysis documents in `@specs/analysis`. This is the direct continuation of the analysis performed in `specs/planning/analyse-ui-elements.md` (Phase C).

**Master progress index:** [`specs/analysis/wireframes-index.md`](../analysis/wireframes-index.md) — update checkboxes there as work is completed.

---

## Purpose of the Wireframes (.pen files)

The generated `.pen` files serve a dual purpose:
1. **Human Reference:** They provide visual, conceptual layouts for human developers and stakeholders to understand the UI structure, data binding, and interactions before implementation begins.
2. **AI Code Generation:** AI agents will use the Pencil MCP tools (such as `pencil_batch_get`, `pencil_snapshot_layout`, and `pencil_get_editor_state`) to programmatically read coordinates, nested children, text annotations, and component references from the `.pen` files to automatically generate the target React/Shadcn UI code.

Because AI agents will parse these files for downstream code generation, structural correctness, accurate `@shadcn` component mapping, and consistent use of annotations are critical.

---

## Prerequisites (per domain)

Before starting on a specific domain, the AI Agent must ensure:
- The data dictionary for the domain (`specs/analysis/{domain}/data-dictionary-{domain}.md`) is completed.
- The Pencil MCP server is available and responsive.
- The legacy analysis documents for the target module have been thoroughly read.
- The domain's wireframe plan is self-contained (see Task 1 below).

---

## Task 1: Expand Domain Wireframe Plans

Most domains currently contain a stub `wireframe-plan-{domain}.md` that was split during the Phase D restructuring. Before creating any wireframes, the AI agent must expand the stub into a comprehensive, self-contained plan (similar to `specs/analysis/interfaces/dashboard/wireframe-plan-interfaces.md`).

**Instructions for the AI Agent:**
1. **Read Context:** Read the domain's analysis documents, data dictionary, and existing PRD cross-references.
2. **Map Elements to Shadcn:** Create a table mapping the analyzed legacy UI elements to modern Shadcn UI components (e.g., `dialog`, `select`, `input`, `table`, `alert`, `button`).
3. **Define Wireframe Inventory:** List each screen, dialog, or wizard step that requires a wireframe. Determine if different states (e.g., loading, error, empty) need separate frames.
4. **Establish Annotation Legends:** Include standard text annotations to be used in the `.pen` files:
   - `*` (Required field)
   - `[RO]` (Read-only field)
   - `[HARDCODED]` (Needs i18n key)
   - `[cond: expr]` (Conditional visibility logic)
   - `[async: poll Xms]` (Polling/async states)
   - `data.field.path` (Datamodel binding)
   - `@shadcn/component` (Target UI component mapping)
5. **Update Plan:** Overwrite the stub `wireframe-plan-{domain}.md` with these comprehensive instructions.
6. **Log Completion:** Mark the wireframe plan as expanded in `specs/analysis/wireframes-index.md`.

---

## Task 2: Create Workflow Descriptions (Mermaid Diagrams)

Workflow documents visualize the **user experience and interdependencies** between screens, decisions, and outcomes. They are written from the user's perspective — not the system's. The goal is to show how a clinical staff member navigates through the application, what choices they face, and how those choices affect downstream screens and data.

**Key principles:**
- **User-oriented, not technical:** No function names, jQuery selectors, service class names, or internal API details. Describe what the user *sees and does*, not what the system executes.
- **Interdependency-focused:** Show how upstream choices (e.g., consultation type selection) affect downstream behavior (e.g., which tabs appear in a detail form). Show how errors route users to fallback paths.
- **Context-rich:** Explain who uses this flow, when it's triggered, and what the exit points are.

**Reference implementation:** [`specs/wireframes/interfaces/dashboard/workflows.md`](../wireframes/interfaces/dashboard/workflows.md) — the Interfaces domain workflow serves as the template for all subsequent domains.

**Instructions for the AI Agent:**
1. **Identify Flows:** Identify complex user flows, decision points, error recovery paths, and permission-gated navigations within the domain's analysis documents.
2. **Create Workflows Document:** Create a new `workflows.md` file in the wireframes output directory, mirroring the analysis structure (e.g., `specs/wireframes/{domain}/{subdomain}/workflows.md`).
3. **Generate Diagrams:** Use Mermaid.js syntax to document the user experience:
   - **User Journey Flowcharts** (`flowchart TD`) — high-level decision flow showing what the user sees, decides, and where each path leads. Use color-coded exit nodes to distinguish outcomes (e.g., green for success, yellow for fallback). Include decision diamonds for user choices and error branches.
   - **State Diagrams** (`stateDiagram-v2`) — wizard/screen states as the user experiences them, with transitions labeled by user actions (not system events). Use `<<choice>>` pseudo-states for error/confirmation decision points.
   - **Sequence Diagrams** (`sequenceDiagram`) — user ↔ system interaction showing what the user sees at each step (loading states, results, errors, confirmations). Use `alt`/`else` blocks for branching paths. Participants should be user-facing concepts (e.g., "User", "Wizard", "Detail Form"), not services or APIs.
4. **Document Context:** For each diagram, add brief markdown descriptions covering:
   - **Who** uses this flow (role/persona)
   - **Entry point** (what triggers the flow)
   - **Exit points** (where does the user end up)
   - **Key observations** about branching, error recovery, and interdependencies
5. **Create Interdependencies Summary:** Add a summary table listing the factors that influence the user's path (e.g., role permissions, entity state, configuration settings) and how each factor affects the experience.
6. **Log Completion:** Mark the workflow file as done in `specs/analysis/wireframes-index.md`.

**Execution order within each batch:** Workflows must be created and reviewed by the user **before** wireframe generation begins. The workflow diagrams inform the wireframe structure and ensure completeness.

---

## Task 3: Wireframe Generation (.pen Files)

Once the wireframe plan is expanded and workflows are understood, generate the actual `.pen` files using the Pencil MCP tools. AI agents are also encouraged to generate a rough ASCII graphic in the documentation corresponding to the layout of the UI if it helps in human readability.

### Directory Structure Convention

The `specs/wireframes/` directory **must mirror** the `specs/analysis/` directory structure for easy correlation:

```
specs/analysis/interfaces/dashboard/wireframe-plan-interfaces.md   ← plan + embedded screenshots
specs/wireframes/interfaces/dashboard/workflows.md                  ← user workflows
specs/wireframes/interfaces/dashboard/basisweb-wizard.pen           ← Pencil source file
specs/wireframes/interfaces/dashboard/step-1-start.png              ← exported PNG
```

General pattern:
```
specs/analysis/{domain}/{subdomain}/wireframe-plan*.md   → specs/wireframes/{domain}/{subdomain}/*.pen + *.png + workflows.md
```

### Pencil MCP Environment & WSL2 Path Convention

Pencil runs as a **Windows desktop application** while the project repository lives on **WSL2 (Ubuntu)**. The Pencil MCP server bridges the two environments. All `filePath` parameters passed to Pencil MCP tools **must use Windows UNC paths** to address WSL2 files:

```
\\wsl.localhost\Ubuntu\home\raphael\src\vc\BearStudio-start-ui-web\specs\wireframes\{domain}\{subdomain}\{filename}.pen
```

**Verified behaviors (tested 2026-03-24):**

| Capability | Works? | Notes |
|:---|:---|:---|
| Open existing `.pen` via UNC path (`pencil_open_document`) | Yes | File loads with full node tree |
| Read nodes (`pencil_batch_get`, `pencil_get_editor_state`) | Yes | Returns correct structure and children |
| Write/modify nodes (`pencil_batch_design`) | Yes | Insert, update, delete all work in memory |
| Switch between files (`pencil_open_document` again) | Yes | Each file retains independent content |
| Create new file at UNC path (`pencil_open_document`) | Yes | Opens empty document bound to that path |
| **Auto-save to WSL2 filesystem** | **No** | Pencil keeps changes in memory only; filesystem timestamp does not change |
| **New file creation on disk** | **No** | `pencil_open_document` + `pencil_batch_design` does NOT create the `.pen` file on the WSL2 filesystem |
| **Programmatic save via JSON extraction** | **Yes** | `pencil_batch_get(readDepth:10)` + `pencil_get_variables()` return complete node tree + variables as JSON; AI agent can reconstruct and write the `.pen` file directly to disk |
| Batch MCP calls (`batch` tool) | **No** | Pencil MCP tools are external and cannot be used inside the `batch` tool; call them sequentially |

### mcp2cli + Python Save Pipeline (Recommended)

The recommended workflow splits into two phases:

1. **Design Phase** — Use the built-in Pencil MCP tools (`pencil_open_document`, `pencil_batch_design`, `pencil_get_screenshot`) for interactive wireframe creation.
2. **Save Phase** — Use `mcp2cli` via the Python save script to extract the full document from Pencil's in-memory state and write it to disk. This runs outside the AI context and can handle files of any size.

**Prerequisites:** `pip install mcp2cli` (one-time). The Pencil MCP server binary path: `/mnt/c/Users/RaphaelBossek/AppData/Local/Programs/Pencil/resources/app.asar.unpacked/out/mcp-server-windows-x64.exe --app desktop`

**Save Script:** `specs/wireframes/_save_pen.py` — Converts the Linux path to a Windows UNC path, opens the file in Pencil via `mcp2cli open-document`, extracts the full node tree via `mcp2cli batch-get --stdin` with `readDepth: 10`, extracts variables via `mcp2cli get-variables --stdin`, constructs a valid `.pen` JSON document, writes to the Linux filesystem, and verifies by re-opening in Pencil and comparing node counts.

**Usage:**
```bash
python3 specs/wireframes/_save_pen.py specs/wireframes/customers/location-management.pen
```

**Output:**
```
Saving: specs/wireframes/customers/location-management.pen
UNC:    \\wsl.localhost\Ubuntu\home\...\specs\wireframes\...\location-management.pen
[1/4] Opening in Pencil...
[2/4] Extracting nodes (readDepth:10)...
  Got 49,559 bytes in 1.7s
[3/4] Extracting variables...
  Got 1,076 bytes in 1.8s
[4/4] Writing .pen file...
  Written: 45,664 bytes (44.6 KB)
Verifying round-trip...
  Nodes: 5 (expected 5) — OK
```

**Performance:** mcp2cli batch-get (50KB) ~1.7s, batch-get (816KB) ~1.4s, get-variables ~1.2s. Maximum tested file size: 739KB (round-trip verified).

**Key gotcha:** `get-variables` API wraps its response in `{"variables": {...}}` — must unwrap before inserting into `.pen` document. The `_save_pen.py` script handles this automatically.

### Pencil `.pen` File Save Convention

### Pencil `.pen` File Save Convention

Pencil does **not** auto-save to the WSL2 filesystem. However, the AI agent can **programmatically save** `.pen` files by extracting the full document JSON from Pencil's in-memory state and writing it to disk.

#### Preferred Method: mcp2cli Save Script (no user intervention)

> **Use `specs/wireframes/_save_pen.py` for all saves.** This script handles the full extraction, variable unwrapping, and round-trip verification automatically.

```bash
python3 specs/wireframes/_save_pen.py specs/wireframes/{domain}/{subdomain}/{filename}.pen
```

#### Legacy Method: Manual AI-agent extraction (deprecated)

> **WARNING:** When using `pencil_get_variables` (both the built-in MCP tool and mcp2cli), the response is wrapped in `{"variables": {...}}`. You **must unwrap** this before inserting into the `.pen` document. Failing to do so creates `"variables": {"variables": {"--bg": ...}}` which Pencil cannot parse correctly. The `_save_pen.py` script handles this automatically.

If for any reason the mcp2cli script is unavailable, the manual approach is:

1. **AI agent designs** all wireframe content using `pencil_batch_design` with the UNC `filePath`.
2. **AI agent extracts** the full document data:
   - `pencil_batch_get(readDepth: 10)` — returns the complete node tree
   - `pencil_get_variables(filePath=UNC_path)` — returns `{"variables": {...}}` (note the wrapping!)
3. **AI agent constructs** a valid `.pen` JSON document:
   ```python
   vars_response = pencil_get_variables(filePath=UNC_path)
   # CRITICAL: unwrap the "variables" key from the API response
   variables = vars_response.get("variables", vars_response)
   pen_doc = {"version": "2.9", "variables": variables, "children": children}
   ```
4. **AI agent writes** the `.pen` file to disk using the `Write` tool.
5. **AI agent verifies** by re-opening in Pencil and checking with `pencil_get_screenshot`.

#### Fallback Method: Manual Save (if programmatic save fails)

1. **AI agent notifies the user** to manually save the `.pen` file from within the Pencil desktop app.
2. **User saves** via **File → Save As** (or Ctrl+S if the path is already bound).
3. **AI agent verifies** the file exists on the WSL2 filesystem using `ls` or `glob` after the user confirms save.

### Sequential File Workflow

Because Pencil MCP tools cannot be batched, the AI agent must work on `.pen` files **one at a time**:

1. `pencil_open_document(UNC_path)` — open/create the target file
2. `pencil_batch_design(filePath=UNC_path, operations=...)` — design content (may require multiple calls for complex wireframes)
3. `pencil_get_screenshot(filePath=UNC_path, nodeId=...)` — verify visually
4. `pencil_export_nodes(filePath=UNC_path, ...)` — export PNGs
5. **Save via mcp2cli:** Run `python3 specs/wireframes/_save_pen.py <relative_linux_path>` — extracts from Pencil memory, writes to disk, verifies round-trip
6. Move to next file

### Screenshot Embedding Convention

After exporting wireframe PNGs, they **must** be embedded into the corresponding `workflows.md` file in `specs/wireframes/` (same directory as the PNGs). Each wireframe gets:
1. A heading with its ID and step name
2. A brief description of what the frame shows and its key interactions
3. A markdown image reference using a local relative path (e.g., `./step-1-start.png`)

The `wireframe-plan-{domain}.md` in `specs/analysis/` should link to the workflows file's screenshot section rather than embedding images directly.

**Reference implementation:** [`specs/wireframes/interfaces/dashboard/workflows.md`](../wireframes/interfaces/dashboard/workflows.md)

### Instructions for the AI Agent

1. **Initialize Document:** Use `pencil_open_document` with the **Windows UNC path**:
   ```
   pencil_open_document("\\\\wsl.localhost\\Ubuntu\\home\\raphael\\src\\vc\\BearStudio-start-ui-web\\specs\\wireframes\\{domain}\\{subdomain}\\{file}.pen")
   ```
   > **Important:** All `filePath` parameters to Pencil MCP tools must use Windows UNC format (backslashes, `\\wsl.localhost\Ubuntu\...`), never Linux paths.
2. **Load Guidelines:** Call `pencil_get_guidelines(topic="design-system")` to load Shadcn component rules and design best practices within Pencil. This only needs to be done once per session.
3. **List Registry:** Run `Shadcn_list_items_in_registries(["@shadcn"])` to ensure alignment with the available component library before designing. This only needs to be done once per session.
4. **Execute Design:** Use `pencil_batch_design(filePath=UNC_path, operations=...)` to insert frames, text, inputs, buttons, and layout containers.
   - Frame width should typically be `600px` for dialogs/wizards, or `1440px` for full page views.
   - Apply the annotations established in Task 1 directly into the text elements or component names.
   - Keep each `batch_design` call to **maximum 25 operations** for optimal performance; split larger designs across multiple calls.
5. **Validate Visually:** Use `pencil_get_screenshot(filePath=UNC_path, nodeId=...)` to visually verify the hierarchy, spacing, and completeness of the layout. Iterate with `pencil_batch_design()` as necessary to correct issues.
6. **Export Previews:** Call `pencil_export_nodes(filePath=UNC_path, outputDir=UNC_output_dir, nodeIds=[...])` to generate PNG preview images in `specs/wireframes/{domain}/{subdomain}/` alongside the `.pen` file. Rename exported files from node IDs to human-readable names (e.g., `step-1-start.png`).
7. **Save `.pen` File via mcp2cli:** Run `python3 specs/wireframes/_save_pen.py <relative_linux_path>`. This extracts the full node tree + variables from Pencil's in-memory state, constructs a valid `.pen` document, writes to disk, and verifies the round-trip.
8. **Embed Screenshots:** Add a "Wireframe Screenshots" section to the `workflows.md` file in `specs/wireframes/{domain}/{subdomain}/` (same directory as the PNGs). For each wireframe, include a heading (ID + name), a brief description, and a local `![...](./filename.png)` image reference. Add a link from the `wireframe-plan-{domain}.md` in `specs/analysis/` to this section.
9. **Generate ASCII Representation (Optional but recommended):** Create a rough ASCII representation of the UI layout in the related analysis markdown file to give an immediate low-fi visual cue to human developers reading the text.
10. **Log Completion:** Mark each completed `.pen` frame and exported `.png` in `specs/analysis/wireframes-index.md`.

### Design system reference (from Batch 1)

- Variables: $--bg (#FFFFFF), $--fg (#0A0A0A), $--fg-muted (#737373), $--border (#E5E5E5), $--primary (#171717), $--primary-fg (#FAFAFA), $--secondary (#F5F5F5), $--secondary-fg (#171717), $--input-border (#D4D4D4), $--info-bg (#EFF6FF), $--info-fg (#1D4ED8), $--danger-bg (#FEF2F2), $--destructive (#DC2626), $--warning-bg (#FFFBEB), $--warning (#F59E0B), $--success-bg (#F0FDF4), $--success-fg (#166534), $--card (#FAFAFA), $--header-bg (#F98E33), $--header-fg (#FFFFFF)
- Font: Inter, sizes 13-20px, weights 400-700
- Dialog frames: 600px width, cornerRadius 12, shadow effect, $--bg fill, $--border stroke
- Headers: padding 20,24, bottom border, Inter 20px bold
- Body: padding 24, vertical layout, gap 16
- Footer: top border, justify end, gap 12, Cancel (secondary) + primary button
- Notes: type: "note" for annotations (dashed orange border)
- Input fields: frame with $--input-border stroke, cornerRadius 8, padding 10,14
- Alerts: fill --info-bg/--danger-bg/$--warning-bg, cornerRadius 8, padding 16

**Reference template**: [`specs/wireframes/interfaces/dashboard/basisweb-wizard.pen`](../wireframes/interfaces/dashboard/basisweb-wizard.pen) — study its structure first with batch_get(readDepth:3) on node QMGzX to match exact conventions.

### .pen Schema Gotchas (Learned from Testing)

| Property | Wrong | Correct | Notes |
|:---|:---|:---|:---|
| **stroke** | `stroke:"$--border"` or `stroke:"#E5E5E5",strokeThickness:1` | `stroke:{thickness:1,fill:"$--border"}` | Stroke is an object with `thickness`, `fill`, optional `align`, `join` |
| **effect (shadow)** | `effect:{shadow:{x:0,y:4,...}}` or `effect:{type:"shadow",x:0,y:4,...}` | `effect:{type:"shadow",offset:{x:0,y:4},blur:24,color:"#00000020"}` | Shadow offset is a nested `{x,y}` object |
| **text color** | `textColor:"#000"` | `fill:"$--fg"` | Text color uses the `fill` property, same as shapes |
| **font weight** | `fontWeight:600` | `fontWeight:"600"` | Must be a string, not a number |
| **get-variables response** | `variables = json.loads(raw)` | `variables = json.loads(raw).get("variables", json.loads(raw))` | `get-variables` API wraps result in `{"variables": {...}}` — must unwrap before inserting into `.pen` document |
| **variable references** | `fill:"--bg"` | `fill:"$--bg"` | Always prefix with `$` |
| **padding** | `padding:16` (single), `padding:[10,14]` (horiz/vert) | Both work | Single number = all sides, array = [vertical, horizontal] |
| **cornerRadius** | `cornerRadius:8` (single), `cornerRadius:[8,8,0,0]` (per-corner) | Both work | Array = [topLeft, topRight, bottomRight, bottomLeft] |

### Text Content Conventions (i18n Placeholder & Note Rules — 2026-03-30)

| Rule | Wrong | Correct | Notes |
|:---|:---|:---|:---|
| **No `{{` placeholders** | `{{user.displayName}}` | `John Doe` | Use English sample data for data bindings |
| **No i18n key refs** | `{{i18n.administration.settings}}` | `Settings` | Look up English translation from `specs/planning/translations/lookup-*.csv` |
| **No template refs** | `{{> content}}`, `{{sitemap}}` | `Main Content Area` | Replace with descriptive English text |
| **Notes outside wireframe** | `type:"text"` inside wireframe frame | `type:"note"` positioned outside frame bounds | Annotations must not appear in wireframe screenshots |
| **Export scale** | `scale: 2` | `scale: 1.5` | Reduced size for documentation readability, not 1:1 |

**Translation lookup process:**
1. Identify the domain of the i18n key (e.g., `administration.settings` → system domain)
2. Open `specs/planning/translations/lookup-{domain}.csv` (pipe-delimited: `key|german|english|source|status`)
3. Use the `english` column value
4. If `status` is `MISSING_EN`, use the `Auto-Translated English` from `specs/planning/translations/translation-summary.md`
5. For data bindings (`user.displayName`, `role`, etc.), use realistic English sample data

**Note positioning rules:**
- `type:"note"` nodes must be positioned **outside** the wireframe frame bounds
- For 600px dialog frames: notes at `x: 620+`
- For 1440px full-page frames: notes at `x: 1460+`
- Internal text annotations (e.g., `@shadcn/Sidebar 240px expanded`) that were previously inside frames must be moved to external Note nodes
- The wireframe screenshot (`pencil_get_screenshot` on the frame node) must show only UI elements, not annotations

**Retroactive audit completed (2026-03-30):**
- Scanned all 76 `.pen` files for `{{` placeholders — found 4 affected files
- Fixed: `sysconfig-data-cleanup.pen` (2 data bindings → English sample), `app-shell-layout.pen` (3 placeholders + 1 internal annotation relocated), `global-navigation.pen` (2 internal annotations relocated), `user-menu.pen` (7 i18n/data placeholders → English translations)
- Re-exported PNGs at scale 1.5 for all 4 files
- Zero `{{` occurrences remaining across all `.pen` files

### Critical Requirements (Batch 2 Extension Fix — 2026-03-30)

| Issue | Problem | Solution | Verification |
|:---|:---|:---|:---|
| **Background color** | Frames render black when no fill defined | **ALWAYS** set `fill:"$--bg"` on root frame | Screenshot shows white background |
| **Variable format** | Variables use `--` prefix (not `$--`) in definition | Define as `"--bg":{"type":"color","value":"#FFFFFF"}`; reference as `"$--bg"` | Check `basisweb-wizard.pen` |
| **Note overlap** | Annotation notes overlap main wireframe frame | Position notes **outside** frame bounds (e.g., x: 1460 for 1440px frame) | Visual inspection of screenshot |
| **File creation** | Direct JSON write doesn't load variables into Pencil memory | Use Python script to write JSON, then `python3 specs/wireframes/_save_pen.py` to load into Pencil | Round-trip node count verification |
| **Stroke format** | Missing `align:"inside"` causes border rendering issues | Always use `stroke:{align:"inside",thickness:1,fill:"$--border"}` | Consistent with Batch 1 files |

**Recommended workflow for new .pen files:**

1. **Study reference:** Read `specs/wireframes/interfaces/dashboard/basisweb-wizard.pen` for exact variable format and structure
2. **Create JSON:** Use Python script to write valid `.pen` JSON with:
   - Variables using `--` prefix (e.g., `"--bg"`)
   - Root frame with explicit `fill:"$--bg"`
   - Proper stroke format with `align:"inside"`
   - Notes positioned outside frame bounds
3. **Load into Pencil:** Run `python3 specs/wireframes/_save_pen.py <path>` to extract and reload
4. **Fix Note Overlaps:** Run `python3 specs/wireframes/_fix_notes.py <path>` to intelligently position the `note` type components outside the frame bounds and stack them vertically avoiding overlaps with other notes or frames.
5. **Verify:** Use `pencil_get_screenshot` to confirm white background and no overlap
6. **Export PNGs:** Use `pencil_export_nodes` with scale=1.5

---

## Batched Execution Order

All 79 wireframes across 10 batches are grouped as above, ordered by complexity and dependency. Execute one batch at a time and confirm with the user before proceeding to the next.

### Batch 1 — Interfaces (8 wireframes) ✦ Start here

**Complexity:** Low  
**Why first:** Smallest domain, already has a complete wireframe plan — ideal proof-of-concept batch.  
**Domain plan:** [`specs/analysis/interfaces/dashboard/wireframe-plan-interfaces.md`](../analysis/interfaces/dashboard/wireframe-plan-interfaces.md)

**Steps:**
1. Expand wireframe plan *(already done — skip)*
2. Create `specs/wireframes/interfaces/dashboard/workflows.md` — user-oriented Mermaid diagrams *(done — user journey flowchart, state diagram, sequence diagram, interdependencies table)*
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `specs/wireframes/interfaces/dashboard/basisweb-wizard.pen` with 8 frames (steps 1–6 + 2 error variants)
5. Export all frames to PNG
6. Generate ASCII representations in analysis docs (alongside wireframes)
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (8/8 wireframes, 1 .pen file with 8 frames, 93 KB)

---

### Batch 2 — System: Includes & Notification + Application Shell (15 wireframes)

**Complexity:** Low–Medium  
**Dependencies:** None (shared components, login flow, notifications, application shell)  
**Domain plans:**
- [`specs/analysis/includes/wireframes.md`](../analysis/system/includes/wireframes.md) *(complete, expand to add Shadcn mapping + site.htmlm shell)*
- [`specs/analysis/notifications/wireframes.md`](../analysis/system/notification/wireframes.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/dashboard/wireframe-plan-system.md`](../analysis/system/dashboard/wireframe-plan-system.md) *(stub — expand fully)*

**Steps:**
1. Expand all 3 wireframe plans (add Shadcn mapping, execution steps, annotation legend, **application shell layout**)
2. Create `specs/wireframes/system/workflows.md` — user-oriented diagrams (login TOTP flow, notification lifecycle, session timeout recovery, **shell navigation pattern**)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/system/shell/app-shell-layout.pen` ← **NEW: Application shell with sidebar nav, user menu, shared dialogs**
   - `specs/wireframes/system/shell/global-navigation.pen` ← **NEW: Sitemap-driven sidebar navigation (collapsed/expanded states)**
   - `specs/wireframes/system/shell/user-menu.pen` ← **NEW: User dropdown with role switch, settings, logout**
   - `specs/wireframes/includes/navbar.pen`
   - `specs/wireframes/includes/loading-states.pen`
   - `specs/wireframes/includes/quick-filter.pen`
   - `specs/wireframes/includes/login.pen`
   - `specs/wireframes/includes/bug-report.pen`
   - `specs/wireframes/includes/color-palette.pen`
   - `specs/wireframes/system/notification/notification-list.pen`
   - `specs/wireframes/system/notification/notification-compose.pen`
   - `specs/wireframes/system/notification/send-message.pen`
   - `specs/wireframes/system-admin/dashboard-standard.pen`
   - `specs/wireframes/system-admin/dashboard-admin.pen`
   - `specs/wireframes/system-admin/login-notification.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (12/12 wireframes, 12 .pen files, 9–61 KB each)  
**Shell wireframes:** ⏳ Pending (3/3 wireframes — add to Batch 2 as extension)

---

### Batch 2 Extension — Application Shell Wireframes (3 wireframes)

**Complexity:** Medium  
**Dependencies:** None (foundational layout component)  
**Domain plan:** [`specs/analysis/includes/wireframes.md`](../analysis/system/includes/wireframes.md) (update to include shell section)

**Steps:**
1. Update wireframe plan to add **Application Shell** section with Shadcn mapping:
   - Sidebar nav → Shadcn `Sheet` (mobile) + custom sidebar component (desktop)
   - User menu → Shadcn `DropdownMenu`
   - Role switch → Shadcn `Dialog` + `Select`
   - Loading spinner → React Query `isLoading` states (no wireframe needed)
   - Upload dialog → Shadcn `Dialog` + file input
   - Maintenance toast → Sonner `Toast`
2. Create `specs/wireframes/system/shell/workflows.md` — navigation flow, role switch flow, maintenance mode flow
3. **User review checkpoint**
4. Create `.pen` files:
   - `specs/wireframes/system/shell/app-shell-layout.pen` — Full application shell (1440px width) showing:
     - Sidebar navigation (expanded state, 240px width)
     - Top bar with search, user menu, version
     - Main content area placeholder
     - Maintenance toast (bottom-right)
     - Loading spinner overlay (centered modal)
   - `specs/wireframes/system/shell/global-navigation.pen` — Sidebar navigation detail:
     - Logo area (full + icon variants)
     - Main nav items with icons, colors, active states
     - Submenu expansion (accordion pattern)
     - Collapsed state (icon-only, 64px width)
   - `specs/wireframes/system/shell/user-menu.pen` — User dropdown dialog:
     - User display name + role badge
     - Settings link
     - Security link
     - Role switch trigger (if permitted)
     - Bug report link
     - Logout link
5. Export all to PNG
6. Embed screenshots in `specs/wireframes/system/shell/workflows.md`
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (3/3 wireframes, 3 .pen files, 4 .png exports, embedded in `workflows.md`)

---

### Batch 2b — System: Sysconfig Tabs (5 wireframes) + workflows.md

**Complexity:** Medium  
**Dependencies:** None  
**Note:** These wireframes were discovered during data dictionary creation and were missing from Batch 2.

**Domain plan:** [`specs/analysis/system-admin/sysconfig-import.md`](../analysis/system/admin-system/sysconfig-import.md) (lines 83+) + [`specs/analysis/system/data-dictionary-system.md`](../analysis/system/data-dictionary-system.md) (section 1.1, lines 11–53)

**Steps:**
1. Create `specs/wireframes/system/workflows.md` — admin sysconfig user flows, tab navigation, action triggers, error handling
2. **User review checkpoint**
3. Create `.pen` files:
   - `specs/wireframes/system/admin/sysconfig-basis-web.pen` — 4 text inputs (Jnummer, JVA, UID, PIN, Consultation ID), 6 action buttons, XML/pre output areas
   - `specs/wireframes/system/admin/sysconfig-cache.pen` — cache stats table (Id, Size, TS, Hits, Misses, Resets, DbChecks), 2 action buttons (Verify, Clear)
   - `specs/wireframes/system/admin/sysconfig-data-update.pen` — year + number inputs, 5 action buttons (Public Holidays, Otobo Sync, Cash Register, Missing Templates, CDR Data)
   - `specs/wireframes/system/admin/sysconfig-data-cleanup.pen` — date range inputs (fixStart, fixUntil), 5 action buttons (Attachments, FileCache, Display Names, Times, Reminders)
   - `specs/wireframes/system/admin/sysconfig-training.pen` — comma-separated appointment IDs input, target date input, Move action button
4. Export all to PNG
5. Embed in `workflows.md`
6. Update `wireframes-index.md`

**Status:** ✅ Complete (5/5 wireframes, 5 .pen files, 5–13 KB each)

---

### Batch 3 — Treatment: Questionnaire + Dashboard Dialogs (8 wireframes)

**Complexity:** Low–Medium
**Dependencies:** Batch 5 (consultation details) should follow this batch
**Domain plans:**
- [`specs/analysis/treatment/questionnaire/wireframes.md`](../analysis/treatment/questionnaire/wireframes.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/treatment/dashboard/wireframe-plan-treatment.md`](../analysis/treatment/dashboard/wireframe-plan-treatment.md) *(stub — expand fully)*

**Steps:**
1. Expand both wireframe plans
2. Create `specs/wireframes/treatment/workflows.md` — user-oriented diagrams (questionnaire completion journey, consultation start decision tree, summarize/QM flow)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/treatment/questionnaire/questionnaire-list.pen`
   - `specs/wireframes/treatment/questionnaire/questionnaire-detail.pen`
   - `specs/wireframes/treatment/dashboard/consultation-wizard.pen`
   - `specs/wireframes/treatment/dashboard/consultation-location-wizard.pen`
   - `specs/wireframes/treatment/dashboard/consultation-template.pen`
   - `specs/wireframes/treatment/dashboard/summarize-appointment.pen`
   - `specs/wireframes/treatment/dashboard/incarceration-dialogs.pen`
   - `specs/wireframes/treatment/dashboard/end-appointment.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (8/8 wireframes, 8 .pen files, 9–76 KB each)

---

### Batch 4 — Planning: Appointment + Dashboard (13 wireframes across 9 logical wireframes)

**Complexity:** High
**Dependencies:** MonthTable is a custom component — wireframe carefully with annotations
**Domain plans:**
- [`specs/analysis/appointments/wireframes.md`](../analysis/planning/appointment/wireframes.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/planning/dashboard/wireframe-plan-planning.md`](../analysis/planning/dashboard/wireframe-plan-planning.md) *(stub — expand fully)*

**Steps:**
1. Expand both wireframe plans
2. Create `specs/wireframes/planning/workflows.md` — user-oriented diagrams (appointment lifecycle from user perspective, self-service booking journey, calendar navigation, shift management)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/appointments/appointment-list.pen` *(MonthTable calendar grid)*
   - `specs/wireframes/appointments/appointment-details.pen` *(5-tab detail, state machine)*
   - `specs/wireframes/appointments/appointment-details-referenced.pen` *(Referenced tab sub-dialog)*
   - `specs/wireframes/appointments/appointment-details-patients.pen` *(Patients tab sub-dialog)*
   - `specs/wireframes/appointments/appointment-details-assigned.pen` *(Assigned tab)*
   - `specs/wireframes/appointments/appointment-details-suggestions.pen` *(Suggestions tab)*
   - `specs/wireframes/appointments/appointment-assign-user.pen`
   - `specs/wireframes/appointments/appointment-state-legend.pen`
   - `specs/wireframes/planning/dashboard/calendar.pen`
   - `specs/wireframes/planning/dashboard/expert-availability.pen`
   - `specs/wireframes/planning/dashboard/shift-dialog.pen`
   - `specs/wireframes/planning/dashboard/adhoc-appointment.pen`
   - `specs/wireframes/planning/dashboard/end-shift.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (13 wireframes across 9 .pen files, 12–68 KB each)

---

### Batch 5 — Treatment: Consultation Details (10 wireframes)

**Complexity:** Very High
**Dependencies:** Batch 3 should be complete before this batch
**Note:** This is the most field-dense component in the application (778-line dialog, 11 tabs, 7 types). Split into multiple sessions if needed.
**Domain plan:** [`specs/analysis/consultations/wireframes.md`](../analysis/treatment/consultation/wireframes.md) *(complete, expand to add Shadcn mapping)*

**Steps:**
1. Expand wireframe plan (add Shadcn mapping, update execution steps)
2. Create `specs/wireframes/consultations/workflows.md` — user-oriented diagrams (consultation lifecycle from clinician perspective, type→tab visibility as user experience, review/approval workflow)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files in order of complexity (Phase 1 first, then 2, then 3):
   - `specs/wireframes/consultations/consultation-list.pen`
   - `specs/wireframes/consultations/consultation-details-header.pen`
   - `specs/wireframes/consultations/consultation-details-standard.pen`
   - `specs/wireframes/consultations/consultation-view.pen`
   - `specs/wireframes/consultations/consultation-details-onboarding.pen`
   - `specs/wireframes/consultations/consultation-details-incarceration.pen`
   - `specs/wireframes/consultations/consultation-details-treatment-warning.pen`
   - `specs/wireframes/consultations/consultation-review.pen`
   - `specs/wireframes/consultations/consultation-icd10-search.pen`
   - `specs/wireframes/consultations/consultation-export-template.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (10/10 wireframes, 10 .pen files, PNG exports embedded in `workflows.md`)

---

### Batch 6 — User Management: Profile (8 wireframes)

**Complexity:** High–Very High
**Note:** Profile form is 1014 lines with 8 tabs — the densest form after consultation. Wireframe tabs individually.
**Domain plans:**
- [`specs/analysis/staff/wireframes.md`](../analysis/user-management/profile/wireframes.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/user-management/dashboard/wireframe-plan-user-management.md`](../analysis/user-management/dashboard/wireframe-plan-user-management.md) *(stub — expand fully)*

**Steps:**
1. Expand both wireframe plans
2. Create `specs/wireframes/user-management/workflows.md` — user-oriented diagrams (staff onboarding journey, 2FA setup experience, profile editing by role, expert availability management)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files in Phase order:
   - `specs/wireframes/staff/profile-form.pen`
   - `specs/wireframes/staff/profile-staff-list.pen`
   - `specs/wireframes/staff/profile-expert-search.pen`
   - `specs/wireframes/staff/profile-assignment-dialog.pen`
   - `specs/wireframes/staff/profile-password-dialog.pen`
   - `specs/wireframes/staff/profile-signature-pad.pen`
   - `specs/wireframes/staff/profile-expert-availability.pen`
   - `specs/wireframes/user-management/dashboard/user-stats.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (8/8 wireframes, 8 .pen files split from `new.pen`, 4–28 KB each)

---

### Batch 7 — Accounting (6 wireframes)

**Complexity:** Medium
**Note:** This domain has no wireframe plan yet. Create the plan from scratch using Task 1 instructions before generating any `.pen` files.
**Data dictionary required before starting:**
- `specs/analysis/accounting/data-dictionary-accounting.md`

**Steps:**
1. Create `specs/analysis/accounting/wireframes.md` from scratch
2. Create `specs/wireframes/accounting/workflows.md` — user-oriented diagrams (invoice lifecycle, worklog time tracking, receiver management, job configuration)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/administration/invoice-list.pen`
   - `specs/wireframes/administration/invoice-details.pen`
   - `specs/wireframes/administration/worklog.pen`
   - `specs/wireframes/administration/invoice-receiver.pen`
   - `specs/wireframes/administration/job-configuration.pen`
   - `specs/wireframes/administration/accounting-config.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (6/6 wireframes, 6 .pen files, 35–94 KB each)

---

### Batch 8 — Customer (5 wireframes)

**Complexity:** Medium
**Note:** This domain has no wireframe plan yet. Create the plan from scratch using Task 1 instructions before generating any `.pen` files.
**Data dictionary required before starting:**
- `specs/analysis/customer/data-dictionary-customer.md`

**Steps:**
1. Create `specs/analysis/customer/wireframes.md` from scratch
2. Create `specs/wireframes/customer/workflows.md` — user-oriented diagrams (customer onboarding, location hierarchy, contact management, room/equipment inventory)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/customers/customer-list.pen`
   - `specs/wireframes/customers/location-management.pen`
   - `specs/wireframes/customer/contact/contact-management.pen`
   - `specs/wireframes/customers/room-management.pen`
   - `specs/wireframes/customers/equipment-management.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (5/5 wireframes, 5 .pen files, 27–45 KB each)

---

### Batch 9 — Academy (4 wireframes)

**Complexity:** Low–Medium
**Note:** This domain has no wireframe plan yet. Create the plan from scratch using Task 1 instructions before generating any `.pen` files.
**Data dictionary required before starting:**
- `specs/analysis/academy/data-dictionary-academy.md`

**Steps:**
1. Create `specs/analysis/academy/wireframes.md` from scratch
2. Create `specs/wireframes/academy/workflows.md` — user-oriented diagrams (support ticket lifecycle, video upload/categorization, video library browsing)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/orphan/support-ticket.pen`
   - `specs/wireframes/orphan/video-management.pen`
   - `specs/wireframes/orphan/video-library.pen`
   - `specs/wireframes/orphan/video-category.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (4/4 wireframes, 4 .pen files, 33–72 KB each)

---

### Batch 10 — Planning: Appointment Admin, Support, Shift, Council (20 wireframes)

**Complexity:** Medium–High
**Dependencies:** Wireframe plans exist but need expansion with Shadcn mapping
**Domain plans:**
- [`specs/analysis/planning/appointment-admin/wireframes.md`](../analysis/planning/appointment-admin/wireframes.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/planning/appointment-support/wireframes.md`](../analysis/planning/appointment-support/wireframes.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/shifts/wireframes.md`](../analysis/planning/shift/wireframes.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/council/wireframes.md`](../analysis/planning/council/wireframes.md) *(complete, expand to add Shadcn mapping)*

**Steps:**
1. Expand all 4 wireframe plans (add Shadcn mapping, execution steps, annotation legend)
2. Create `specs/wireframes/planning/workflows.md` — user-oriented diagrams for each subdomain:
   - **appointment-admin**: Inline consultation flow, calculation workflow, QM integration, export/email/print flows
   - **appointment-support**: CDR call tracking lifecycle, assignment management, close-month workflow
   - **shift**: Shift scheduling flow, shift plan creation, apply-plan workflow
   - **council**: Council scheduling flow, council plan creation, apply-plan workflow
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files in priority order:

   **appointment-admin** (8 wireframes) — High priority:
   - `specs/wireframes/planning/appointment-admin/inline-consultation.pen`
   - `specs/wireframes/planning/appointment-admin/calculation.pen`
   - `specs/wireframes/planning/appointment-admin/qm-dialog.pen`
   - `specs/wireframes/planning/appointment-admin/export-dialog.pen`
   - `specs/wireframes/planning/appointment-admin/email-dialog.pen`
   - `specs/wireframes/planning/appointment-admin/print-preview.pen`
   - `specs/wireframes/planning/appointment-admin/job-status.pen`
   - `specs/wireframes/planning/appointment-admin/state-legend.pen`

   **appointment-support** (5 wireframes) — Medium priority:
   - `specs/wireframes/planning/appointment-support/cdr-call-list.pen`
   - `specs/wireframes/planning/appointment-support/cdr-call-detail.pen`
   - `specs/wireframes/planning/appointment-support/cdr-assignment-crud.pen`
   - `specs/wireframes/planning/appointment-support/close-month.pen`
   - `specs/wireframes/planning/appointment-support/cdr-status-legend.pen`

   **shift** (4 wireframes) — Medium priority:
   - `specs/wireframes/shifts/shift-list.pen`
   - `specs/wireframes/shifts/shift-plan-detail.pen`
   - `specs/wireframes/shifts/apply-plan.pen`
   - `specs/wireframes/shifts/state-legend.pen`

   **council** (3 wireframes) — Medium priority:
   - `specs/wireframes/council/council-list.pen`
   - `specs/wireframes/council/council-plan-detail.pen`
   - `specs/wireframes/council/apply-plan.pen`

5. Export all to PNG
6. Embed screenshots in `specs/wireframes/planning/workflows.md`
7. Update `specs/analysis/wireframes-index.md`
8. Update `specs/wireframes/analysis-wireframes-mapping.md` — replace *(no wireframe)* entries for `appointment-admin/appointment-admin.md`, `appointment-support/appointment-plan.md`, `council/council-and-plan.md`, `shift/shift-and-plan.md` with the created `.pen` file references

**Status:** ✅ Complete (20/20 wireframes, 20 .pen files, 21 .png exports, 4–50 KB each)

---

### Batch 11 — System: Admin CRUDs, CDR Call, Config, Templates (4 analysis files)

**Complexity:** Low–Medium
**Dependencies:** Batch 2 (system shell and includes) should be complete before this batch
**Note:** These 4 analysis files currently have no wireframes. Create wireframe plans from scratch using Task 1 instructions.

**Analysis files covered:**
| Analysis File | Brownfield Source |
|---|---|
| `system/admin-cruds/motd-template.md` | `admin/motd.htmlm`, `admin/template.htmlm` |
| `system/cdr-call/cdr-call.md` | `cdrCall/`, `cdrCallAssignment/` |
| `system/config/system-config.md` | `locationType/`, `exclusionCriteria/`, `supportCategory/`, `loginNotification/` |
| `system/templates-files/templates-files.md` | `exportTemplate/`, `notificationTemplate/`, `userFile/` |

**Steps:**
1. Create `specs/analysis/system/wireframe-plan-batch11.md` from scratch covering all 4 subdomains
2. Create or update `specs/wireframes/system/workflows.md` — add user-oriented diagrams (MOTD lifecycle, template management, CDR call tracking, system config CRUD flows, file management)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/system/admin-cruds/motd-template.pen` — MOTD list + create/edit dialog, template list + editor
   - `specs/wireframes/system-admin/cdr-call.pen` — CDR call list, call detail, assignment management
   - `specs/wireframes/system/config/system-config.pen` — Location type, exclusion criteria, support category, login notification CRUD views
   - `specs/wireframes/system/templates-files/templates-files.pen` — Export template, notification template, user file management
5. Export all to PNG
6. Embed screenshots in `specs/wireframes/system/workflows.md`
7. Update `specs/analysis/wireframes-index.md`
8. Update `specs/wireframes/analysis-wireframes-mapping.md` — replace *(no wireframe)* entries for `admin-cruds/motd-template.md`, `cdr-call/cdr-call.md`, `config/system-config.md`, `templates-files/templates-files.md` with the created `.pen` file references

**Status:** ⏳ Pending (0/4 wireframes)

---

### Batch 12 — Treatment: Patient Data, Medication, Treatment Core, Warning (6 analysis files)

**Complexity:** Medium
**Dependencies:** Batch 5 (consultation details) should be complete before this batch
**Note:** These 6 analysis files currently have no wireframes. Create wireframe plans from scratch using Task 1 instructions.

**Analysis files covered:**
| Analysis File | Brownfield Source |
|---|---|
| `treatment/appointment-patient/appointment-details-patient.md` | `appointment/details.html` (patient sections) |
| `treatment/medication/medication.md` | `medication/` |
| `treatment/patient-data/patient-data.md` | `patientData/` |
| `treatment/treatment-core/treatment-and-category.md` | `treatment/`, `treatmentCategory/` |
| `treatment/treatment-core/treatment-plan.md` | `treatmentPlan/` |
| `treatment/warning/warning-management.md` | `warning/` |

**Steps:**
1. Create `specs/analysis/treatment/wireframe-plan-batch12.md` from scratch covering all 6 subdomains
2. Create or update `specs/wireframes/treatment/workflows.md` — add user-oriented diagrams (patient data management, medication prescribing flow, treatment plan lifecycle, warning creation/review, appointment patient tab interactions)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/treatment/appointment-patient/appointment-details-patient.pen` — Patient sections within appointment details
   - `specs/wireframes/treatment/medication/medication.pen` — Medication list, prescribe/edit dialog, history view
   - `specs/wireframes/treatment/patient-data/patient-data.pen` — Patient data overview, edit forms
   - `specs/wireframes/treatment/treatment-core/treatment-and-category.pen` — Treatment list, category management, treatment CRUD
   - `specs/wireframes/treatment/treatment-core/treatment-plan.pen` — Treatment plan list, plan detail/editor
   - `specs/wireframes/treatment/warning/warning-management.pen` — Warning list, create/edit dialog, severity indicators
5. Export all to PNG
6. Embed screenshots in `specs/wireframes/treatment/workflows.md`
7. Update `specs/analysis/wireframes-index.md`
8. Update `specs/wireframes/analysis-wireframes-mapping.md` — replace *(no wireframe)* entries for `appointment-patient/appointment-details-patient.md`, `medication/medication.md`, `patient-data/patient-data.md`, `treatment-core/treatment-and-category.md`, `treatment-core/treatment-plan.md`, `warning/warning-management.md` with the created `.pen` file references

**Status:** ⏳ Pending (0/6 wireframes)

---

### Batch 13 — User Management: Admin, TOTP, Groups, Skills, Onboarding (5 analysis files)

**Complexity:** Medium–High
**Dependencies:** Batch 6 (profile) should be complete before this batch
**Note:** These 5 analysis files currently have no wireframes. Create wireframe plans from scratch using Task 1 instructions.

**Analysis files covered:**
| Analysis File | Brownfield Source |
|---|---|
| `user-management/admin-user/user-management.md` | `admin/user.htmlm`, `admin/user.js` |
| `user-management/admin-user/06-totp-onboarding.md` | `admin/totpOnboarding.html`, `admin/userSecurity.htmlm` |
| `user-management/admin-group/group-management.md` | `admin/group.htmlm`, `admin/group.js` |
| `user-management/admin-skill/skill.md` | `admin/skill.htmlm`, `admin/skill.js` |
| `user-management/onboarding/onboarding-flow.md` | `onboarding/` |

**Steps:**
1. Create `specs/analysis/user-management/wireframe-plan-batch13.md` from scratch covering all 5 subdomains
2. Create or update `specs/wireframes/user-management/workflows.md` — add user-oriented diagrams (user admin CRUD, TOTP enrollment/reset flow, group permission management, skill assignment, onboarding wizard steps)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/user-management/admin-user/user-management.pen` — User list with filters, user create/edit form, role assignment
   - `specs/wireframes/user-management/admin-user/totp-onboarding.pen` — TOTP setup wizard (QR code, verification step), security settings panel
   - `specs/wireframes/user-management/admin-group/group-management.pen` — Group list, group create/edit dialog, permission matrix
   - `specs/wireframes/user-management/admin-skill/skill.pen` — Skill list, skill create/edit dialog
   - `specs/wireframes/user-management/onboarding/onboarding-flow.pen` — Onboarding wizard steps, progress indicator, completion state
5. Export all to PNG
6. Embed screenshots in `specs/wireframes/user-management/workflows.md`
7. Update `specs/analysis/wireframes-index.md`
8. Update `specs/wireframes/analysis-wireframes-mapping.md` — replace *(no wireframe)* entries for `admin-user/user-management.md`, `admin-user/06-totp-onboarding.md`, `admin-group/group-management.md`, `admin-skill/skill.md`, `onboarding/onboarding-flow.md` with the created `.pen` file references

**Status:** ⏳ Pending (0/5 wireframes)

---

### Batch 14 — Academy: Video History + Accounting: Workhour (2 analysis files)

**Complexity:** Low
**Dependencies:** Batch 9 (academy) and Batch 7 (accounting) should be complete before this batch
**Note:** These 2 remaining analysis files currently have no wireframes. They are small enough to combine into a single batch.

**Analysis files covered:**
| Analysis File | Brownfield Source |
|---|---|
| `academy/video-history/user-video-history.md` | `userVideoHistory/` |
| `accounting/admin-workhour/workhour.md` | `admin/workHour.htmlm`, `admin/workHour.js` |

**Steps:**
1. Update existing wireframe plans:
   - Update `specs/analysis/academy/wireframes.md` to add video history section
   - Update `specs/analysis/accounting/wireframes.md` to add workhour section
2. Update workflows:
   - Update `specs/wireframes/academy/workflows.md` — add video history browsing/playback flow
   - Update `specs/wireframes/accounting/workflows.md` — add workhour tracking/admin flow
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/academy/video-history/user-video-history.pen` — Video watch history list, playback progress, filtering
   - `specs/wireframes/accounting/admin-workhour/workhour.pen` — Workhour list, workhour entry/edit form, approval flow
5. Export all to PNG
6. Embed screenshots in respective `workflows.md` files
7. Update `specs/analysis/wireframes-index.md`
8. Update `specs/wireframes/analysis-wireframes-mapping.md` — replace *(no wireframe)* entries for `video-history/user-video-history.md` and `admin-workhour/workhour.md` with the created `.pen` file references

**Status:** ⏳ Pending (0/2 wireframes)

---

## Overview: All Batches

| Batch | Domain(s) | Wireframes | Complexity | Status | .pen files on disk |
|:---|:---|:---|:---|:---|:---|
| **Batch 1** | Interfaces | 8 | Low | ✅ 8/8 | 1 file (8 frames), 93 KB |
| **Batch 2** | System | 12 | Low–Medium | ✅ 12/12 | 12 files, 9–61 KB |
| **Batch 2 Ext** | System (Shell) | 3 | Medium | ✅ 3/3 | 3 files, 5–17 KB |
| **Batch 2b** | System (Sysconfig) | 5 | Medium | ✅ 5/5 | 5 files, 5–13 KB |
| **Batch 3** | Treatment (QM + dialogs) | 8 | Low–Medium | ✅ 8/8 | 8 files, 9–76 KB |
| **Batch 4** | Planning | 13 | High | ✅ 13/13 | 9 files (appointment-details has 4 sub-frames) |
| **Batch 5** | Treatment (consultation) | 10 | Very High | ✅ 10/10 | 10 files |
| **Batch 6** | User Management | 8 | High | ✅ 8/8 | 8 files, 4–28 KB (split from `new.pen`) |
| **Batch 7** | Accounting | 6 | Medium | ✅ 6/6 | 6 files, 35–94 KB |
| **Batch 8** | Customer | 5 | Medium | ✅ 5/5 | 5 files, 27–45 KB |
| **Batch 9** | Academy | 4 | Low–Medium | ✅ 4/4 | 4 files, 33–72 KB |
| **Batch 10** | Planning (admin, support, shift, council) | 20 | Medium–High | ✅ 20/20 | 20 files, 4–50 KB |
| **Batch 11** | System (CRUDs, CDR, config, templates) | 4 | Low–Medium | ⏳ 0/4 | Pending |
| **Batch 12** | Treatment (patient, medication, treatment core, warning) | 6 | Medium | ⏳ 0/6 | Pending |
| **Batch 13** | User Mgmt (admin, TOTP, groups, skills, onboarding) | 5 | Medium–High | ⏳ 0/5 | Pending |
| **Batch 14** | Academy (video history) + Accounting (workhour) | 2 | Low | ⏳ 0/2 | Pending |
| **TOTAL** | — | **119** | — | **99 done, 20 pending** | **78 files** |

---

## Existing .pen File Integrity Audit (2026-03-26)

All **45** individual `.pen` files on disk were scanned programmatically:

| Check | Result |
|:---|:---|
| JSON validity | ✅ 45/45 files parse as valid JSON |
| Schema version | ✅ All files report `"version": "2.9"` |
| Double-nested variables bug | ✅ 0/45 affected — no `"variables":{"variables":{...}}` found |
| Empty shells | ✅ 0 remaining — all files have ≥1 child node (min: 1, max: 11) |
| Size range | 8.7 KB (`login-notification.pen`) to 180 KB (`user-management/new.pen`) |
| Variables key count | 7 to 37 keys per file |

---

## Fix Plan: Batch 6 {#fix-plan-batch-6}

All 8 Batch 6 wireframes exist as frames inside `specs/wireframes/user-management/new.pen` (180 KB, 11 children). PNG exports already exist under `profile/` and `dashboard/` subdirectories. However, the individual `.pen` files listed in the batch plan and wireframes-index do NOT exist on disk.

**Recommended approach — Split `new.pen` into individual files:**

1. Open `new.pen` in Pencil:
   ```
   pencil_open_document("\\\\wsl.localhost\\Ubuntu\\home\\raphael\\src\\vc\\BearStudio-start-ui-web\\specs\\wireframes\\user-management\\new.pen")
   ```
2. List all 11 top-level children:
   ```
   pencil_batch_get(readDepth:2)
   ```
3. Map each frame to its target wireframe:
   - Use PNG filenames in `profile/` and `dashboard/` as reference (e.g., `profile-form-tab-overview.png` → `profile-form.pen`)
4. For each of the 8 target files:
   a. Create empty shell via `pencil_open_document` with target path
   b. Copy frame(s) from `new.pen` using `C()` operation
   c. Save via `python3 specs/wireframes/_save_pen.py <relative_linux_path>`
5. Verify each file with `pencil_get_screenshot`
6. After all 8 verified, archive or delete `new.pen`

**Alternative — Keep as single multi-frame file:**
1. Rename `new.pen` to `user-management-all.pen`
2. Update wireframes-index to reference frame-level (like Batch 1)
