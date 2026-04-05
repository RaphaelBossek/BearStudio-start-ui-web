---
title: 'Wireframe Plan Interfaces'
---

---
---

# Wireframe Creation Plan — Interfaces Domain

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools with Shadcn registry components.
> Target directory: `specs/wireframes/interfaces/`

## Prerequisites

1. All analysis documents in `specs/analysis/interfaces/` are complete and reviewed
2. Data dictionary `specs/analysis/interfaces/data-dictionary-interfaces.md` is complete
3. Pencil MCP server is available and responsive
4. Review the Pencil style guide for design systems: `get_guidelines(topic="design-system")`
5. Enumerate available Shadcn components: `get_project_registries()` then `list_items_in_registries(["@shadcn"])`

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN) under `~/src/vc/videoclinic-prod/web/src/main/resources/`
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Shadcn Component Mapping

| Wizard UI Element                     | Shadcn Component                   | Notes                                           |
| :------------------------------------ | :--------------------------------- | :---------------------------------------------- |
| Modal container                       | `@shadcn/dialog`                   | 600px width, `bg-color-basisWebData` header     |
| Consultation type dropdown            | `@shadcn/select`                   | Dynamic option hiding per step visibility rules |
| JNumber input + search/reload buttons | `@shadcn/input` + `@shadcn/button` | Icon buttons: magnifier + refresh               |
| JNumber results table                 | `@shadcn/table`                    | Selectable rows with radio-select behavior      |
| Book number input                     | `@shadcn/input`                    | Mandatory, min-length 3                         |
| Info/warning/danger alerts            | `@shadcn/alert`                    | Step 1 info, step 2 warning + danger variants   |
| PIN input                             | `@shadcn/input`                    | Key icon prefix, cleared on step show           |
| Spinner / loading indicator           | `Loader2` (lucide-react)           | No native Shadcn spinner; used in steps 3 and 5 |
| Read-only summary fields              | `@shadcn/label` + plain text       | Step 6                                          |
| Disabled summary select               | `@shadcn/select` (disabled)        | Step 6, shows ONBOARDING_SHORT option           |
| Cancel / Next / Retry / Error buttons | `@shadcn/button`                   | Dynamic visibility per step                     |

## Findings from Analysis that Affect Wireframes

### State-driven dynamic UI

- **Consultation type `<select>` visibility** (Step 1): 6 condition rules control which options are visible based on job capabilities and location data type. Wireframe annotates with `[cond: job.X]`.
- **Button visibility matrix**:
  - `Cancel`: Always visible

| Step                                               | Next              | Retry       | Error       |
| :------------------------------------------------- | :---------------- | :---------- | :---------- |
| 1 (Start), 2 (Not Available), 4 (PIN), 6 (Success) | **Visible**       | Hidden      | Hidden      |
| 3 (Getting), 5 (Loading)                           | **[next=hidden]** | Hidden      | Hidden      |
| 3 Error                                            | **[next=hidden]** | Hidden      | **Visible** |
| 5 Error                                            | **[next=hidden]** | **Visible** | Hidden      |

### Async / Polling States

- **Step 3 (Getting)** uses a polling loop (500ms) to check `prepareStatus` until `status.end=true`. Wireframe annotates with `[async: poll 500ms]`.
- **Step 5 (Loading)** is an async decryption call.
- The `Next` button is absent in both states; only a spinner is shown unless an error occurs.

### Component Quirks

- **Step 6 (Success) summary `<select>`**: Includes `ONBOARDING_SHORT` (disabled). This option is specifically excluded from Step 1's select options.
- **Hardcoded German strings (11 found)**: Wireframes should use English translations for all labels. Where hardcoded German was found (e.g. "Ungültige Buchnummer" -> "Invalid book number"), use the English translation from the analysis doc and annotate with `[HARDCODED]`.

## Wireframe Inventory

Single `.pen` file with **one frame per wizard step** (6 steps + 2 error state variants):

| #     | Frame                 | Step ID               | Content                                                                                                               | Complexity |
| :---- | :-------------------- | :-------------------- | :-------------------------------------------------------------------------------------------------------------------- | :--------- |
| W6-1  | `step-1-start`        | `bww-start`           | Consultation type select + JNumber search input + selectable results table + info alerts + search/reload icon buttons | High       |
| W6-2  | `step-2-notavailable` | `bww-notavailable`    | Book number input + danger alert + warning alert                                                                      | Low        |
| W6-3a | `step-3-getting`      | `bww-getting`         | JNumber + UUID display labels + spinner                                                                               | Low        |
| W6-3b | `step-3-error`        | `bww-getting` (error) | Error message area + support mailto + Error button [instead of Next]                                                  | Low        |
| W6-4  | `step-4-pin`          | `bww-pin`             | PIN input with key icon + JNumber/UUID labels + help text                                                             | Low        |
| W6-5a | `step-5-loading`      | `bww-loading`         | JNumber + UUID labels + spinner                                                                                       | Low        |
| W6-5b | `step-5-error`        | `bww-loading` (error) | Error message area + Retry button [instead of Next]                                                                   | Low        |
| W6-6  | `step-6-success`      | `bww-success`         | Summary read-only fields + disabled type select + bold header                                                         | Low        |

Target file: `specs/wireframes/interfaces/dashboard/basisweb-wizard.pen`
Exported PNGs: `specs/wireframes/interfaces/dashboard/step-*.png`

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `*` | Required field |
| `[RO]` | Read-only field |
| `[HARDCODED]` | Needs i18n key created |
| `[repeats]` | Collection row template |
| `[cond: expr]` | Dynamic visibility condition |
| `[async: poll Xms]` | Polling/async loading state |
| `[next=hidden]` | Step has `data-next=false` — Next button absent |
| `data.field.path` | Datamodel binding annotation |
| `@shadcn/component` | Shadcn component mapping reference |

---

## Wireframe Screenshots

See [`specs/wireframes/interfaces/dashboard/workflows.md`](../../../wireframes/interfaces/dashboard/workflows.md#wireframe-screenshots) — screenshots are embedded alongside the workflow diagrams for a unified reference.
