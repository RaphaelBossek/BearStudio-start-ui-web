---
title: 'Create Wireframes'
---

# UI Wireframing and Workflow Documentation Guide

> **Status**: WIREFRAMES COMPLETE — All 107 wireframes across 8 domains have been created and exported as PNGs.
> 
> This document provides generic instructions for AI coding agents to create **new** wireframes (`.pen` files) and workflow descriptions (Mermaid diagrams). It is the continuation of the analysis performed in `specs/planning/analyse-ui-elements.md` (Phase C).

---

## Current State

All wireframes are complete. This document now serves as a **reference guide** for any future wireframe creation or updates.

### Master Registry

The **single source of truth** for all wireframe planning information is:

- [`specs/planning/wireframe-plan-registry.md`](./wireframe-plan-registry.md) — Complete inventory of all 107 wireframes, design system reference, annotation legend, Shadcn component mappings, and enum references.

### Completion Summary

| Domain | .pen Files | PNG Exports | Location |
|:---|:---:|:---:|:---|
| Academy | 4 | 8+ | `specs/wireframes/academy/support-video/` |
| Accounting | 6 | 12+ | `specs/wireframes/accounting/{invoice,worklog,invoice-receiver,admin-job,config}/` |
| Customer | 5 | 10+ | `specs/wireframes/customer/{customer-core,contact,room,equipment}/` |
| Interfaces | 1 (8 frames) | 9 | `specs/wireframes/interfaces/dashboard/` |
| Planning | 33 | 50+ | `specs/wireframes/planning/{appointment,appointment-admin,appointment-support,council,dashboard,shift}/` |
| System | 20 | 35+ | `specs/wireframes/system/{includes,shell,notification,admin-cruds,admin,config,templates-files,dashboard}/` |
| Treatment | 24 | 40+ | `specs/wireframes/treatment/{consultation,dashboard,questionnaire,appointment-patient,medication,patient-data,treatment-core,warning}/` |
| User Management | 14 | 25+ | `specs/wireframes/user-management/{profile,dashboard,admin}/` |
| **TOTAL** | **107** | **150+** | — |

### Actual Directory Structure

```
specs/wireframes/
├── academy/support-video/           # 4 .pen files (support-ticket, video-management, video-library, video-category)
├── accounting/
│   ├── invoice/                     # invoice-list, invoice-details
│   ├── worklog/                     # worklog
│   ├── invoice-receiver/            # invoice-receiver
│   ├── admin-job/                   # job-configuration
│   └── config/                      # accounting-config
├── customer/
│   ├── customer-core/               # customer-list, location-management
│   ├── contact/                     # contact-management
│   ├── room/                        # room-management
│   └── equipment/                   # equipment-management
├── interfaces/dashboard/            # basisweb-wizard.pen (8 frames)
├── planning/
│   ├── appointment/                 # appointment-list, appointment-details (+ 4 sub-dialogs), assign-user, state-legend
│   ├── appointment-admin/           # inline-consultation, calculation, qm-dialog, export-dialog, email-dialog, print-preview, job-status, state-legend
│   ├── appointment-support/         # cdr-call-list, cdr-call-detail, cdr-assignment-crud, close-month, cdr-status-legend
│   ├── council/                     # council-list, council-plan-detail, apply-plan
│   ├── dashboard/                   # calendar, expert-availability, shift-dialog, adhoc-appointment, end-shift
│   └── shift/                       # shift-list, shift-plan-detail, apply-plan, state-legend
├── system/
│   ├── includes/                    # navbar, loading-states, quick-filter, login, bug-report, color-palette
│   ├── shell/                       # app-shell-layout, global-navigation, user-menu
│   ├── notification/                # notification-list, notification-compose, send-message
│   ├── admin-cruds/                 # motd-template
│   ├── admin/                       # sysconfig-basis-web, sysconfig-cache, sysconfig-data-update, sysconfig-data-cleanup, sysconfig-training
│   ├── config/                      # system-config
│   ├── templates-files/             # templates-files
│   └── dashboard/                   # dashboard-standard, dashboard-admin, login-notification
├── treatment/
│   ├── consultation/                # consultation-list, details-header, details-standard, details-onboarding, details-incarceration, details-treatment-warning, view, review, icd10-search, export-template
│   ├── dashboard/                   # consultation-wizard, consultation-location-wizard, consultation-template, summarize-appointment, incarceration-dialogs, end-appointment
│   ├── questionnaire/               # questionnaire-list, questionnaire-detail
│   ├── appointment-patient/         # appointment-details-patient
│   ├── medication/                  # medication
│   ├── patient-data/                # patient-data
│   ├── treatment-core/              # treatment-and-category, treatment-plan
│   └── warning/                     # warning-management
├── user-management/
│   ├── profile/                     # profile-form, profile-staff-list, profile-expert-search, profile-assignment-dialog, profile-password-dialog, profile-signature-pad, profile-expert-availability
│   ├── dashboard/                   # user-stats
│   └── admin/                       # user-management, totp-security, group-management, skill, onboarding-flow
├── orphan/                          # user-video-history (legacy path — may be relocated)
├── components/                      # Shared reusable components (if any)
├── _save_pen.py                     # Python save script (mcp2cli pipeline)
├── analysis-wireframes-mapping.md   # Maps analysis files to wireframe files
└── README.md                        # Project overview
```

### Cross-Cutting Directories (analysis only)

These directories exist only in `specs/analysis/` and have no wireframe equivalents because they span multiple domains:

| Directory | Purpose |
|:---|:---|
| `i18n/` | Translation analysis, domain-specific i18n docs, hardcoded strings, missing keys |
| `mongodb-mapping/` | MongoDB-to-Prisma schema mapping documentation |
| `permissions/` | Permission analysis (currently empty) |

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
- The [`wireframe-plan-registry.md`](./wireframe-plan-registry.md) has been consulted for existing wireframe inventory, design system reference, and annotation legend.

---

## Task 1: Consult the Wireframe Plan Registry

**Before creating any new wireframes**, read [`specs/planning/wireframe-plan-registry.md`](./wireframe-plan-registry.md). This file contains:

- Complete wireframe inventory per domain with `.pen` file names and descriptions
- Shadcn component mappings for each domain
- Design system reference (colors, typography, component conventions)
- Annotation legend (standardized annotation system)
- Enum references (appointment states, consultation types, roles, etc.)

If a new wireframe is needed that isn't in the registry:
1. Add it to the registry's domain section with ID, file name, description, and complexity
2. Follow the conventions established in the registry for design and annotations
3. Update the completion statistics at the bottom of the registry

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

**Execution order within each batch:** Workflows must be created and reviewed by the user **before** wireframe generation begins. The workflow diagrams inform the wireframe structure and ensure completeness.

---

## Task 3: Wireframe Generation (.pen Files)

Once the wireframe plan is understood and workflows are defined, generate the actual `.pen` files using the Pencil MCP tools.

### Directory Structure Convention

The `specs/wireframes/` directory **must mirror** the `specs/analysis/` directory structure for easy correlation:

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

1. **Design Phase** — Use the built-in Pencil MCP tools (`pencil_open_document`, `pencil_batch_design`) for interactive wireframe creation.
2. **Save Phase** — Use `mcp2cli` via the Python save script to extract the full document from Pencil's in-memory state and write it to disk. This runs outside the AI context and can handle files of any size.

**Prerequisites:** `pip install mcp2cli` (one-time). The Pencil MCP server binary path: `/mnt/c/Users/RaphaelBossek/AppData/Local/Programs/Pencil/resources/app.asar.unpacked/out/mcp-server-windows-x64.exe --app desktop`

**Save Script:** `specs/wireframes/_save_pen.py` — Converts the Linux path to a Windows UNC path, opens the file in Pencil via `mcp2cli open-document`, extracts the full node tree via `mcp2cli batch-get --stdin` with `readDepth: 10`, extracts variables via `mcp2cli get-variables --stdin`, constructs a valid `.pen` JSON document, writes to the Linux filesystem, and verifies by re-opening in Pencil and comparing node counts.

**Usage:**
```bash
python3 specs/wireframes/_save_pen.py specs/wireframes/{domain}/{subdomain}/{filename}.pen
```

**Output:**
```
Saving: specs/wireframes/{domain}/{subdomain}/{filename}.pen
UNC:    \\wsl.localhost\Ubuntu\home\...\specs\wireframes\...\{filename}.pen
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

### Sequential File Workflow

Because Pencil MCP tools cannot be batched, the AI agent must work on `.pen` files **one at a time**:

1. `pencil_open_document(UNC_path)` — open/create the target file
2. `pencil_batch_design(filePath=UNC_path, operations=...)` — design content (may require multiple calls for complex wireframes)
3. `pencil_export_nodes(filePath=UNC_path, ...)` — export PNGs
4. **Save via mcp2cli:** Run `python3 specs/wireframes/_save_pen.py <relative_linux_path>` — extracts from Pencil memory, writes to disk, verifies round-trip
5. Move to next file

### Screenshot Embedding Convention

After exporting wireframe PNGs, they **must** be embedded into the corresponding `workflows.md` file in `specs/wireframes/` (same directory as the PNGs). Each wireframe gets:
1. A heading with its ID and step name
2. A brief description of what the frame shows and its key interactions
3. A markdown image reference using a local relative path (e.g., `./step-1-start.png`)

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
   - **Do not put annotations inside the `.pen` files.** Integrate annotation texts directly into the markdown files (e.g., `workflows.md`) explaining the components, data binding, required fields, etc.
   - Keep each `batch_design` call to **maximum 25 operations** for optimal performance; split larger designs across multiple calls.
5. **Export Previews:** Call `pencil_export_nodes(filePath=UNC_path, outputDir=UNC_output_dir, nodeIds=[...])` to generate PNG preview images in `specs/wireframes/{domain}/{subdomain}/` alongside the `.pen` file. Rename exported files from node IDs to human-readable names (e.g., `step-1-start.png`).
6. **Save `.pen` File via mcp2cli:** Run `python3 specs/wireframes/_save_pen.py <relative_linux_path>`. This extracts the full node tree + variables from Pencil's in-memory state, constructs a valid `.pen` document, writes to disk, and verifies the round-trip.
7. **Embed Screenshots:** Add a "Wireframe Screenshots" section to the `workflows.md` file. For each wireframe, include a heading (ID + name), a brief description, **all previously internal text annotations**, and a local `![...](./filename.png)` image reference.
8. **Update Registry:** Add the new wireframe to [`specs/planning/wireframe-plan-registry.md`](./wireframe-plan-registry.md) in the appropriate domain section.

---

## Design System Reference

Full design system reference is maintained in [`specs/planning/wireframe-plan-registry.md`](./wireframe-plan-registry.md). Key conventions:

### Color Variables

| Token | Value | Usage |
|:---|:---|:---|
| `$--bg` | `#FFFFFF` | Page and panel backgrounds |
| `$--fg` | `#0A0A0A` | Primary text |
| `$--fg-muted` | `#737373` | Muted/secondary text |
| `$--border` | `#E5E5E5` | Dividers, table borders, input strokes |
| `$--primary` | `#171717` | Primary buttons, active states |
| `$--primary-fg` | `#FAFAFA` | Text on primary background |
| `$--secondary` | `#F5F5F5` | Secondary backgrounds |
| `$--input-border` | `#D4D4D4` | Input field strokes |
| `$--header-bg` | `#F98E33` | Module header backgrounds |
| `$--header-fg` | `#FFFFFF` | Header text |

### Typography

| Property | Value |
|:---|:---|
| Font Family | Inter |
| Font Sizes | 13px (labels), 14px (body), 16-20px (headings) |
| Font Weights | 400 (normal), 500 (medium), 600 (semibold), 700 (bold) |

### Component Conventions

| Component | Convention |
|:---|:---|
| Dialog | 600px width, cornerRadius 12, shadow effect, `$--bg` fill, `$--border` stroke |
| Drawer | 1100px width for complex forms, side="right" |
| Full Page | 1440px width for grid/list views |
| Header | padding [20,24], bottom border, Inter 20px bold, `$--header-bg` fill |
| Body | padding 24, vertical layout, gap 16 |
| Footer | top border, justify end, gap 12, Cancel (secondary) + primary button |
| Input | cornerRadius 8, padding [10,14], `$--input-border` stroke |
| Alert | cornerRadius 8, padding 16, contextual fill colors |

---

## Annotation Legend

Full annotation legend is maintained in [`specs/planning/wireframe-plan-registry.md`](./wireframe-plan-registry.md). **Annotations must NOT be placed inside `.pen` files** — they belong in `workflows.md` alongside embedded screenshots.

Key annotations:
- `*` — Required field
- `[RO]` — Read-only field
- `[HARDCODED]` — Needs i18n key
- `[cond: expr]` — Conditional visibility
- `[async: poll Xms]` — Async/polling state
- `data.field.path` — Datamodel binding
- `@shadcn/component` — Target component mapping

---

## .pen Schema Gotchas

| Property | Wrong | Correct | Notes |
|:---|:---|:---|:---|
| **stroke** | `stroke:"$--border"` or `stroke:"#E5E5E5",strokeThickness:1` | `stroke:{thickness:1,fill:"$--border"}` | Stroke is an object with `thickness`, `fill`, optional `align`, `join` |
| **effect (shadow)** | `effect:{shadow:{x:0,y:4,...}}` | `effect:{type:"shadow",offset:{x:0,y:4},blur:24,color:"#00000020"}` | Shadow offset is a nested `{x,y}` object |
| **text color** | `textColor:"#000"` | `fill:"$--fg"` | Text color uses the `fill` property, same as shapes |
| **font weight** | `fontWeight:600` | `fontWeight:"600"` | Must be a string, not a number |
| **get-variables response** | `variables = json.loads(raw)` | `variables = json.loads(raw).get("variables", json.loads(raw))` | `get-variables` API wraps result in `{"variables": {...}}` |
| **variable references** | `fill:"--bg"` | `fill:"$--bg"` | Always prefix with `$` |
| **stroke format** | Missing `align` | `stroke:{align:"inside",thickness:1,fill:"$--border"}` | Always include `align:"inside"` |

---

## Text Content Conventions

| Rule | Wrong | Correct | Notes |
|:---|:---|:---|:---|
| **No `{{` placeholders** | `{{user.displayName}}` | `John Doe` | Use English sample data |
| **No i18n key refs** | `{{i18n.administration.settings}}` | `Settings` | Use translation lookup CSVs |
| **No template refs** | `{{> content}}` | `Main Content Area` | Replace with descriptive text |
| **No notes in wireframes** | `type:"note"` inside frame | None | Annotations go in markdown only |
| **Export scale** | `scale: 2` | `scale: 1.5` | Reduced for documentation readability |

**Translation lookup process:**
1. Identify the domain of the i18n key
2. Open `specs/planning/translations/lookup-{domain}.csv` (pipe-delimited)
3. Use the `english` column value
4. For data bindings, use realistic English sample data

---

## Critical Requirements

| Issue | Problem | Solution | Verification |
|:---|:---|:---|:---|
| **Background color** | Frames render black when no fill defined | **ALWAYS** set `fill:"$--bg"` on root frame | Screenshot shows white background |
| **Variable format** | Variables use `--` prefix (not `$--`) in definition | Define as `"--bg":{"type":"color","value":"#FFFFFF"}`; reference as `"$--bg"` | Check reference files |
| **Note overlap** | Annotation notes overlap wireframe | Remove all annotations inside wireframe files | Visual inspection |
| **File creation** | Direct JSON write doesn't load into Pencil | Use `_save_pen.py` script | Round-trip node count verification |

**Recommended workflow for new .pen files:**

1. **Study reference:** Read `specs/wireframes/interfaces/dashboard/basisweb-wizard.pen` for exact variable format and structure
2. **Create JSON:** Use Python script to write valid `.pen` JSON with:
   - Variables using `--` prefix (e.g., `"--bg"`)
   - Root frame with explicit `fill:"$--bg"`
   - Proper stroke format with `align:"inside"`
   - No annotations inside the wireframe file
3. **Load into Pencil:** Run `python3 specs/wireframes/_save_pen.py <path>` to extract and reload
4. **Verify:** Use `pencil_get_screenshot` to confirm white background
5. **Export PNGs:** Use `pencil_export_nodes` with scale=1.5

---

## Related Documents

- **Wireframe Plan Registry**: [`specs/planning/wireframe-plan-registry.md`](./wireframe-plan-registry.md) — Single source of truth for all wireframe planning
- **Analysis Index**: `specs/analysis/wireframes-index.md` — Completed wireframe inventory with PNG exports
- **Workflow Docs**: `specs/wireframes/{domain}/workflows.md` — Embedded screenshots + Mermaid diagrams per domain
- **Analysis Plan**: `specs/planning/analyse-ui-elements.md` — Phase A+B findings, hardcoded strings, bugs
- **Translations**: `specs/planning/translations/lookup-{domain}.csv` — German to English translation lookup
- **Analysis-Wireframe Mapping**: `specs/wireframes/analysis-wireframes-mapping.md` — Maps analysis files to wireframe files
