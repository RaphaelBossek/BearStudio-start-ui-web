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
python3 specs/wireframes/_save_pen.py specs/wireframes/customer/customer-core/location-management.pen
```

**Output:**
```
Saving: specs/wireframes/customer/customer-core/location-management.pen
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

### Batch 2 — System: Includes & Notification (12 wireframes)

**Complexity:** Low–Medium  
**Dependencies:** None (shared components, login flow, notifications)  
**Domain plans:**
- [`specs/analysis/system/includes/wireframe-plan.md`](../analysis/system/includes/wireframe-plan.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/system/notification/wireframe-plan.md`](../analysis/system/notification/wireframe-plan.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/system/dashboard/wireframe-plan-system.md`](../analysis/system/dashboard/wireframe-plan-system.md) *(stub — expand fully)*

**Steps:**
1. Expand all 3 wireframe plans (add Shadcn mapping, execution steps, annotation legend)
2. Create `specs/wireframes/system/workflows.md` — user-oriented diagrams (login TOTP flow, notification lifecycle, session timeout recovery)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/system/includes/navbar.pen`
   - `specs/wireframes/system/includes/loading-states.pen`
   - `specs/wireframes/system/includes/quick-filter.pen`
   - `specs/wireframes/system/includes/login.pen`
   - `specs/wireframes/system/includes/bug-report.pen`
   - `specs/wireframes/system/includes/color-palette.pen`
   - `specs/wireframes/system/notification/notification-list.pen`
   - `specs/wireframes/system/notification/notification-compose.pen`
   - `specs/wireframes/system/notification/send-message.pen`
   - `specs/wireframes/system/dashboard/dashboard-standard.pen`
   - `specs/wireframes/system/dashboard/dashboard-admin.pen`
   - `specs/wireframes/system/dashboard/login-notification.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (12/12 wireframes, 12 .pen files, 9–61 KB each)

---

### Batch 2b — System: Sysconfig Tabs (5 wireframes) + workflows.md

**Complexity:** Medium  
**Dependencies:** None  
**Note:** These wireframes were discovered during data dictionary creation and were missing from Batch 2.

**Domain plan:** [`specs/analysis/system/admin-system/05-sysconfig-import.md`](../analysis/system/admin-system/05-sysconfig-import.md) (lines 83+) + [`specs/analysis/system/data-dictionary-system.md`](../analysis/system/data-dictionary-system.md) (section 1.1, lines 11–53)

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

**Status:** ❌ Not started (0/5 wireframes + missing `workflows.md`)

---

### Batch 3 — Treatment: Questionnaire + Dashboard Dialogs (8 wireframes)

**Complexity:** Low–Medium
**Dependencies:** Batch 5 (consultation details) should follow this batch
**Domain plans:**
- [`specs/analysis/treatment/questionnaire/wireframe-plan.md`](../analysis/treatment/questionnaire/wireframe-plan.md) *(complete, expand to add Shadcn mapping)*
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
- [`specs/analysis/planning/appointment/wireframe-plan.md`](../analysis/planning/appointment/wireframe-plan.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/planning/dashboard/wireframe-plan-planning.md`](../analysis/planning/dashboard/wireframe-plan-planning.md) *(stub — expand fully)*

**Steps:**
1. Expand both wireframe plans
2. Create `specs/wireframes/planning/workflows.md` — user-oriented diagrams (appointment lifecycle from user perspective, self-service booking journey, calendar navigation, shift management)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/planning/appointment/appointment-list.pen` *(MonthTable calendar grid)*
   - `specs/wireframes/planning/appointment/appointment-details.pen` *(5-tab detail, state machine)*
   - `specs/wireframes/planning/appointment/appointment-details-referenced.pen` *(Referenced tab sub-dialog)*
   - `specs/wireframes/planning/appointment/appointment-details-patients.pen` *(Patients tab sub-dialog)*
   - `specs/wireframes/planning/appointment/appointment-details-assigned.pen` *(Assigned tab)*
   - `specs/wireframes/planning/appointment/appointment-details-suggestions.pen` *(Suggestions tab)*
   - `specs/wireframes/planning/appointment/appointment-assign-user.pen`
   - `specs/wireframes/planning/appointment/appointment-state-legend.pen`
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
**Domain plan:** [`specs/analysis/treatment/consultation/wireframe-plan.md`](../analysis/treatment/consultation/wireframe-plan.md) *(complete, expand to add Shadcn mapping)*

**Steps:**
1. Expand wireframe plan (add Shadcn mapping, update execution steps)
2. Create `specs/wireframes/treatment/consultation/workflows.md` — user-oriented diagrams (consultation lifecycle from clinician perspective, type→tab visibility as user experience, review/approval workflow)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files in order of complexity (Phase 1 first, then 2, then 3):
   - `specs/wireframes/treatment/consultation/consultation-list.pen`
   - `specs/wireframes/treatment/consultation/consultation-details-header.pen`
   - `specs/wireframes/treatment/consultation/consultation-details-standard.pen`
   - `specs/wireframes/treatment/consultation/consultation-view.pen`
   - `specs/wireframes/treatment/consultation/consultation-details-onboarding.pen`
   - `specs/wireframes/treatment/consultation/consultation-details-incarceration.pen`
   - `specs/wireframes/treatment/consultation/consultation-details-treatment-warning.pen`
   - `specs/wireframes/treatment/consultation/consultation-review.pen`
   - `specs/wireframes/treatment/consultation/consultation-icd10-search.pen`
   - `specs/wireframes/treatment/consultation/consultation-export-template.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (10/10 wireframes, 10 .pen files, PNG exports embedded in `workflows.md`)

---

### Batch 6 — User Management: Profile (8 wireframes)

**Complexity:** High–Very High
**Note:** Profile form is 1014 lines with 8 tabs — the densest form after consultation. Wireframe tabs individually.
**Domain plans:**
- [`specs/analysis/user-management/profile/wireframe-plan.md`](../analysis/user-management/profile/wireframe-plan.md) *(complete, expand to add Shadcn mapping)*
- [`specs/analysis/user-management/dashboard/wireframe-plan-user-management.md`](../analysis/user-management/dashboard/wireframe-plan-user-management.md) *(stub — expand fully)*

**Steps:**
1. Expand both wireframe plans
2. Create `specs/wireframes/user-management/workflows.md` — user-oriented diagrams (staff onboarding journey, 2FA setup experience, profile editing by role, expert availability management)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files in Phase order:
   - `specs/wireframes/user-management/profile/profile-form.pen`
   - `specs/wireframes/user-management/profile/profile-staff-list.pen`
   - `specs/wireframes/user-management/profile/profile-expert-search.pen`
   - `specs/wireframes/user-management/profile/profile-assignment-dialog.pen`
   - `specs/wireframes/user-management/profile/profile-password-dialog.pen`
   - `specs/wireframes/user-management/profile/profile-signature-pad.pen`
   - `specs/wireframes/user-management/profile/profile-expert-availability.pen`
   - `specs/wireframes/user-management/dashboard/user-stats.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ⚠️ Content exists but needs splitting — All 8 wireframes were created as frames inside `user-management/new.pen` (180 KB, 11 children). PNG exports exist under `profile/` and `dashboard/` subdirectories. Individual `.pen` files per the plan above do NOT exist on disk. See [Fix Plan: Batch 6](#fix-plan-batch-6) below.

---

### Batch 7 — Accounting (6 wireframes)

**Complexity:** Medium
**Note:** This domain has no wireframe plan yet. Create the plan from scratch using Task 1 instructions before generating any `.pen` files.
**Data dictionary required before starting:**
- `specs/analysis/accounting/data-dictionary-accounting.md`

**Steps:**
1. Create `specs/analysis/accounting/wireframe-plan.md` from scratch
2. Create `specs/wireframes/accounting/workflows.md` — user-oriented diagrams (invoice lifecycle, worklog time tracking, receiver management, job configuration)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/accounting/invoice/invoice-list.pen`
   - `specs/wireframes/accounting/invoice/invoice-details.pen`
   - `specs/wireframes/accounting/worklog/worklog.pen`
   - `specs/wireframes/accounting/invoice-receiver/invoice-receiver.pen`
   - `specs/wireframes/accounting/admin-job/job-configuration.pen`
   - `specs/wireframes/accounting/config/accounting-config.pen`
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
1. Create `specs/analysis/customer/wireframe-plan.md` from scratch
2. Create `specs/wireframes/customer/workflows.md` — user-oriented diagrams (customer onboarding, location hierarchy, contact management, room/equipment inventory)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/customer/customer-core/customer-list.pen`
   - `specs/wireframes/customer/customer-core/location-management.pen`
   - `specs/wireframes/customer/contact/contact-management.pen`
   - `specs/wireframes/customer/room/room-management.pen`
   - `specs/wireframes/customer/equipment/equipment-management.pen`
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
1. Create `specs/analysis/academy/wireframe-plan.md` from scratch
2. Create `specs/wireframes/academy/workflows.md` — user-oriented diagrams (support ticket lifecycle, video upload/categorization, video library browsing)
3. **User review checkpoint** — get approval before proceeding to wireframes
4. Create `.pen` files:
   - `specs/wireframes/academy/support-video/support-ticket.pen`
   - `specs/wireframes/academy/support-video/video-management.pen`
   - `specs/wireframes/academy/support-video/video-library.pen`
   - `specs/wireframes/academy/support-video/video-category.pen`
5. Export all to PNG
6. Generate ASCII representations in analysis docs
7. Update `specs/analysis/wireframes-index.md`

**Status:** ✅ Complete (4/4 wireframes, 4 .pen files, 33–72 KB each)

---

## Overview: All Batches

| Batch | Domain(s) | Wireframes | Complexity | Status | .pen files on disk |
|:---|:---|:---|:---|:---|:---|
| **Batch 1** | Interfaces | 8 | Low | ✅ 8/8 | 1 file (8 frames), 93 KB |
| **Batch 2** | System | 12 | Low–Medium | ✅ 12/12 | 12 files, 9–61 KB |
| **Batch 2b** | System (Sysconfig) | 5 | Medium | ❌ 0/5 | Missing: 5 .pen + workflows.md |
| **Batch 3** | Treatment (QM + dialogs) | 8 | Low–Medium | ✅ 8/8 | 8 files, 9–76 KB |
| **Batch 4** | Planning | 13 | High | ✅ 13/13 | 9 files (appointment-details has 4 sub-frames) |
| **Batch 5** | Treatment (consultation) | 10 | Very High | ✅ 10/10 | 10 files |
| **Batch 6** | User Management | 8 | High | ⚠️ 8/8 content | 1 file (`new.pen`, 180 KB) — needs split |
| **Batch 7** | Accounting | 6 | Medium | ✅ 6/6 | 6 files, 35–94 KB |
| **Batch 8** | Customer | 5 | Medium | ✅ 5/5 | 5 files, 27–45 KB |
| **Batch 9** | Academy | 4 | Low–Medium | ✅ 4/4 | 4 files, 33–72 KB |
| **TOTAL** | — | **79** | — | **73 done, 6 missing** | **45 files + 1 multi-frame + 6 missing** |

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
