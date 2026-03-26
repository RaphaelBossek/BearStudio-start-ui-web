# Wireframe Creation Plan — Academy Domain

> To be executed **after** all Markdown analysis documents are reviewed.
> Wireframes are created as `.pen` files using the Pencil MCP tools with Shadcn registry components.
> Target directory: `specs/wireframes/academy/support-video/`

## Prerequisites

1. All analysis documents in `specs/analysis/academy/support-video/` and `specs/analysis/academy/video-history/` are complete and reviewed
2. Data dictionary `specs/analysis/academy/data-dictionary-academy.md` is complete
3. Pencil MCP server is available and responsive
4. Review the Pencil style guide for design systems: `get_guidelines(topic="design-system")`
5. Enumerate available Shadcn components: `get_project_registries()` then `list_items_in_registries(["@shadcn"])`

## Translation Sources

- **Application-level translations**: `ApplicationResources.properties` (DE) / `ApplicationResources_en.properties` (EN) under `~/src/vc/videoclinic-prod/web/src/main/resources/`
- **Framework-level translations**: `BaseResources.properties` / `BaseResources_de.properties` in corinis:webCore JAR

## Shadcn Component Mapping

| Legacy UI Element                  | Shadcn Component                        | Notes                                                                 |
| :--------------------------------- | :-------------------------------------- | :-------------------------------------------------------------------- |
| SlickerGrid (all grids)            | `@shadcn/table` + DataTable             | Support ticket, video management, video category grids                |
| Cascading selects (3-level)        | 3× `@shadcn/select` chained            | Support ticket category hierarchy (service → category → subcategory)  |
| View modal (ticket)                | `@shadcn/dialog` (800px)                | Ticket details + comment thread + reply                               |
| Comment thread                     | `@shadcn/card` repeated                 | Each comment: dateCreated, subject, from, to, body                    |
| Reply textarea + button            | `@shadcn/textarea` + `@shadcn/button`   | Add comment to ticket                                                 |
| Priority select                    | `@shadcn/select`                        | 5-level enum: VERYLOW / LOW / NORMAL / HIGH / CRITICAL                |
| Video player (local)               | video.js or HTML5 `<video>`             | video.js player component, context menu disabled, no download         |
| Video player (stream)              | `<iframe>`                              | External embed (PeerTube / YouTube-style), full viewport              |
| Card-based browsing                | `@shadcn/card` grid layout              | Video library: category cards + video cards                           |
| Thumbnail image                    | `<img>` element                         | Category and video card thumbnails, upload preview                    |
| Progress indicator (watched)       | `@shadcn/badge` / icon                  | Check mark or badge for completed / in-progress videos                |
| Deep link navigation               | TanStack Router hash                    | `#CATEGORYID;SUBCATEGORY:VIDEOID:POSITION` URL scheme                 |
| Chunked file upload                | Custom upload component                 | HugeUploader replacement: 3MB chunks, progress bar, pause/resume      |
| Autocomplete inputs                | `@shadcn/combobox`                      | Category, video, job autocompletes                                    |
| Thumbnail file upload              | `@shadcn/input[type=file]` + preview    | Video category thumbnail with image preview                           |
| Job collection                     | `@shadcn/badge` list + delete button    | Jobs associated with category, add via autocomplete                   |
| Body textarea                      | `@shadcn/textarea`                      | Support ticket body, video description                                |
| Back / Up navigation button        | `@shadcn/button`                        | Video library breadcrumb-style back navigation                        |
| Watch time tracking                | Custom hook                             | Periodic `submitWatchTime` calls via sessionId                        |
| Tab navigation (minor)             | `@shadcn/tabs`                          | Not extensively used; detail panels are flat forms                    |
| PDF viewer                         | `window.open`                           | Opens PDF in new browser tab (video library PDF type)                 |

## Findings from Analysis that Affect Wireframes

### Cascading Category Selects (Support Ticket — W1)

- **3-level chained selects**: `subjectListStart` → `subjectList2` → `subjectListDone`, each populated from the previous selection.
- Data source: `SupportCategoryService.getAllGrouped()` returns a tree structure; each `<select>` uses `data-next` attribute to reference the next select in chain.
- **Concatenated title**: On final selection, the title field is auto-filled by concatenating all three selected category titles (`[RO]`).
- **Queue auto-fill**: The queue field is populated from the selected category's queue property (`[RO]`).
- Wireframe annotates chained selects with `[cascade: level N → level N+1]` and auto-filled fields with `[auto: concat(cat1.title, cat2.title, cat3.title)]`.

### Video Type Routing (Video Management — W2, Video Library — W3)

- **Two distinct player types** determined by video entity type:
  - `VIDEO` → video.js player (local playback, 640×800px in management, 100%×91vh in library)
  - `STREAM` → iframe embed (1200px modal in management, 100%×calc(100vh−50px) in library)
  - `PDF` → `window.open` in new tab (library only)
- Wireframe must include **two separate player dialog frames** for management (W2) and **three player variants** annotated for library (W3).
- Annotate with `[cond: video.type === VIDEO]` / `[cond: video.type === STREAM]` / `[cond: video.type === PDF]`.

### Chunked Upload (Video Category — W4)

- **HugeUploader.js** handles large video file uploads with 3MB chunk size.
- Upload UI must show: progress bar (percentage + visual), pause button, resume button.
- Upload is embedded in the "Add Video/Stream" dialog — **two-column layout**:
  - **Left column**: Upload section (file input, progress bar, pause/resume controls)
  - **Right column**: Add Stream section (title, lengthInSeconds, description, previewPath, path URL, submit button)
- Wireframe annotates with `[chunked: 3MB, pause/resume]`.

### Card-Based Browsing (Video Library — W3)

- **No DataTable grid** — this is the only Academy view that uses a card layout instead of a table.
- **Category cards**: thumbnail + title + totalTime + description + watched indicator + "View" button.
- **Video cards**: thumbnail + title + duration + description + watched indicator + "Play" button.
- **Deep linking** via URL hash: `#CATEGORYID;SUBCATEGORY:VIDEOID:POSITION` enables direct navigation to a specific video at a specific playback position.
- **Watch time tracking**: A `sessionId` is created per viewing session; `submitWatchTime` is called periodically to persist progress.
- **goBack button** in navigation bar for breadcrumb-style category traversal.

### Comment Thread (Support Ticket — W1)

- Ticket view dialog (800px modal) displays a **comments collection** as a scrollable thread.
- Each comment shows: `dateCreated`, `subject`, `from`, `to`, `body`.
- Below the thread: reply `<textarea>` + reply `<button>` to append new comments.
- Wireframe annotates each comment card with `[repeats]`.

### Self-Referential Category Tree (Video Category — W4)

- `parentCategory` is a self-referential autocomplete (`VideoCategoryService.autocomplete`) — categories can nest under other categories.
- The detail panel includes a **job collection**: add via `JobService.autocomplete`, display as `code` badges with delete buttons.
- **Thumbnail upload** with image preview shown inline in the detail panel.

### User Video History (Admin Grid — No Separate Wireframe)

- Tracked in a separate admin CRUD grid (not a user-facing screen).
- Contains video autocomplete + date fields + watch button that opens a video.js player.
- No dedicated wireframe — documented here for completeness; may appear as a sub-view or linked admin panel.

## Wireframe Inventory

Four `.pen` files, one per primary Academy view:

| #  | Frame                                          | Content                                                                                                                     | Complexity  |
| :- | :--------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- | :---------- |
| W1 | `academy/support-video/support-ticket.pen`     | 6-col grid, cascading 3-level category selects in detail panel, view modal (800px) with comment thread + reply              | Medium      |
| W2 | `academy/support-video/video-management.pen`   | 7-col grid, detail panel with category autocomplete, two player type dialogs (video.js 800px + iframe 1200px)               | Medium      |
| W3 | `academy/support-video/video-library.pen`      | Card-based browsing (category cards + video cards), hash deep linking, progress tracking, full-viewport players (3 variants) | Medium-High |
| W4 | `academy/support-video/video-category.pen`     | 4-col grid, detail panel with thumbnail upload + job collection, add video/stream dialog (two-column: chunked upload + stream form) | Medium-High |

Target directory: `specs/wireframes/academy/support-video/`
Exported PNGs: `specs/wireframes/academy/support-video/*.png`

### Frame Details

#### W1 — Support Ticket (`support-ticket.pen`)

**Grid view (6 columns):**

| Column       | Type    | Notes                           |
| :----------- | :------ | :------------------------------ |
| id           | number  | Primary key                     |
| ticketNumber | string  | Ticket reference number         |
| title        | string  | Auto-filled from category chain |
| queue        | string  | Auto-filled from category       |
| prio         | enum    | VERYLOW–CRITICAL                |
| state        | enum    | Ticket lifecycle state          |

**Detail panel fields:**
- `subjectListStart` — `@shadcn/select` `[cascade: level 1 → level 2]`
- `subjectList2` — `@shadcn/select` `[cascade: level 2 → level 3]`
- `subjectListDone` — `@shadcn/select` `[cascade: level 3 → auto-fill]`
- `title` — `@shadcn/input` `[RO]` `[auto: concat(cat1.title, cat2.title, cat3.title)]`
- `queue` — `@shadcn/input` `[RO]` `[auto: selectedCategory.queue]`
- `prio` — `@shadcn/select` (VERYLOW / LOW / NORMAL / HIGH / CRITICAL, default NORMAL)
- `body` — `@shadcn/textarea`

**View dialog (800px modal):**
- Ticket metadata header (ticketNumber, title, queue, prio, state)
- Comment thread — `[repeats]` `@shadcn/card` per comment (dateCreated, subject, from, to, body)
- Reply section: `@shadcn/textarea` + `@shadcn/button` "Reply"

**Nav actions:** Add, View Ticket

#### W2 — Video Management (`video-management.pen`)

**Grid view (7 columns):**

| Column          | Type    | Notes                          |
| :-------------- | :------ | :----------------------------- |
| id              | number  | Primary key                    |
| path            | string  | Video file path or stream URL  |
| previewImage    | string  | Thumbnail image path           |
| title           | string  | Video title                    |
| lengthInSeconds | number  | Duration in seconds            |
| category        | string  | Via `Formatter.name`           |
| description     | string  | Video description              |

**Detail panel fields:**
- `path` — `@shadcn/input`
- `previewImage` — `@shadcn/input`
- `title` — `@shadcn/input`
- `lengthInSeconds` — `@shadcn/input[type=number]`
- `category` — `@shadcn/combobox` (VideoCategoryService.autocomplete, display title)
- `description` — `@shadcn/textarea`

**Player dialogs:**
- Local player dialog — `@shadcn/dialog` 800px, video.js player 640px `[cond: video.type === VIDEO]`
- Stream player dialog — `@shadcn/dialog` 1200px, iframe full viewport `[cond: video.type === STREAM]`

**Nav actions:** Add, Edit, Delete, Watch (hardcoded)

#### W3 — Video Library (`video-library.pen`)

**Category cards (grid layout):**
- Thumbnail image
- Title
- Total time (aggregated duration)
- Description (truncated)
- Watched indicator — `@shadcn/badge` or check icon
- "View" button — `@shadcn/button`

**Video cards (grid layout):**
- Thumbnail image
- Title
- Duration
- Description (truncated)
- Watched indicator — `@shadcn/badge` or check icon
- "Play" button — `@shadcn/button`

**Deep linking:** `#CATEGORYID;SUBCATEGORY:VIDEOID:POSITION` `[hash: deep link]`

**Players (full viewport):**
- Local — video.js 100% width × 91vh, no download, context menu disabled `[cond: video.type === VIDEO]`
- Stream — iframe 100% width × calc(100vh−50px) `[cond: video.type === STREAM]`
- PDF — `window.open` in new tab `[cond: video.type === PDF]`

**Watch time tracking:** `[async: periodic submitWatchTime via sessionId]`

**Nav actions:** goBack button (breadcrumb-style back navigation)

#### W4 — Video Category (`video-category.pen`)

**Grid view (4 columns):**

| Column      | Type   | Notes                              |
| :---------- | :----- | :--------------------------------- |
| id          | number | Primary key                        |
| title       | string | Category name                      |
| description | string | Category description               |
| priority    | number | Sort order / priority              |

**Detail panel fields:**
- `title` — `@shadcn/input`
- `parentCategory` — `@shadcn/combobox` (self-referential VideoCategoryService.autocomplete)
- `priority` — `@shadcn/input[type=number]`
- `thumbnail` — `@shadcn/input[type=file]` + image preview
- `description` — `@shadcn/textarea`
- `jobs` — collection: `@shadcn/combobox` (JobService.autocomplete) insert + `@shadcn/badge` list with delete `[repeats]`

**Add Video/Stream dialog (two-column layout):**

| Left Column — Upload Video                          | Right Column — Add Stream                          |
| :-------------------------------------------------- | :------------------------------------------------- |
| File input                                          | `title` — `@shadcn/input`                          |
| Progress bar (percentage + visual) `[chunked: 3MB]` | `lengthInSeconds` — `@shadcn/input[type=number]`   |
| Pause button `@shadcn/button`                       | `description` — `@shadcn/textarea`                 |
| Resume button `@shadcn/button`                      | `previewPath` — `@shadcn/input`                    |
|                                                     | `path` — `@shadcn/input` (stream URL)              |
|                                                     | Submit button — `@shadcn/button`                   |

**Video list in dialog:** preview image + title + delete button per row `[repeats]`

**Nav actions:** Add, Edit, Delete, Videos (hardcoded), Recalculate

## Annotation Legend

| Annotation                              | Meaning                                                    |
| :-------------------------------------- | :--------------------------------------------------------- |
| `*`                                     | Required field                                             |
| `[RO]`                                  | Read-only field                                            |
| `[HARDCODED]`                           | Needs i18n key created                                     |
| `[repeats]`                             | Collection row template (comments, jobs, video list items) |
| `[cond: expr]`                          | Dynamic visibility condition                               |
| `[async: description]`                  | Async / polling / periodic operation                       |
| `[cascade: level N → level N+1]`       | Chained select — selection populates the next select       |
| `[auto: expr]`                          | Auto-filled field (computed from other fields/selections)  |
| `[chunked: size, controls]`             | Chunked upload with specified chunk size and controls      |
| `[hash: deep link]`                     | URL hash-based deep link navigation                        |
| `data.field.path`                       | Datamodel binding annotation                               |
| `@shadcn/component`                     | Shadcn component mapping reference                         |

---

## Wireframe Screenshots

See [`specs/wireframes/academy/workflows.md`](../../wireframes/academy/workflows.md#wireframe-screenshots) — screenshots are embedded alongside the workflow diagrams for a unified reference.
