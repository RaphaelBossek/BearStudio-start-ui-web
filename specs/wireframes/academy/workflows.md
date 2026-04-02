# Academy Domain -- User Workflows

This document describes the user experience and decision flows across the Academy domain, covering support ticket management, video administration, video library browsing, and video category management. All diagrams represent the journey from the user's perspective, not internal system architecture.

---

## Context

The Academy domain serves two primary user groups: **end users** who browse training videos and submit support tickets, and **administrators** who manage video content, categories, and support queues. The domain is organized around a card-based video library for learning, a grid-based administrative interface for content management, and a ticketing system for user support.

**Who uses it:**
- **All authenticated users** — browse the video library, watch training content, create support tickets
- **Support staff** — view and reply to support tickets
- **System administrators** — manage videos, video categories, and associated metadata

**Entry points:**
- Support ticket list page (all users)
- Video library page (all users)
- Video management page (admin)
- Video category management page (admin)

**Exit points:**
- Ticket created or replied to
- Video playback completed (watch time tracked)
- Video/category/stream CRUD operation completed
- Navigation to another domain area

---

## 1. Support Ticket Creation Flow

This diagram shows the end-to-end flow a user follows to create a new support ticket, emphasizing the cascading category selection that auto-fills the ticket title and queue.

```mermaid
flowchart TD
    A["Support Ticket List Page<br>(Grid: id, number, title, queue, priority, state)"] -->|"Create New Ticket"| B["Step 1: Select Level 1 Category<br>(Top-level category dropdown)"]

    B -->|"Category selected"| C["Step 2: Select Level 2 Category<br>(Populated from Level 1 children)"]
    C -->|"Category selected"| D{"Level 3 Available?"}

    D -->|"Yes"| E["Step 3: Select Level 3 Category<br>(Populated from Level 2 children)"]
    D -->|"No"| F["Title & Queue Auto-Filled<br>from concatenated category titles"]

    E -->|"Category selected"| F

    F --> G["Set Priority<br>(Default: NORMAL)"]
    G --> H["Write Message Body<br>(Textarea)"]
    H -->|"Submit"| I["Ticket Created<br>Redirect to Ticket List"]

    B -->|"No selection / Cancel"| A

    style A fill:#e8f4f8,stroke:#2c7bb6
    style F fill:#d4edda,stroke:#155724
    style I fill:#d4edda,stroke:#155724
    style D fill:#fff3cd,stroke:#856404
```

**Key observations:**
- The title field is **auto-generated** from concatenated category titles (e.g. "Billing: Invoice: Missing Payment"), reducing user effort and ensuring consistent naming.
- The queue field is **auto-assigned** from the deepest selected category's `queue` property — users never manually select a queue.
- Level 3 category is optional; if the selected Level 2 category has no children, the flow skips directly to the auto-filled title.
- Priority defaults to NORMAL but can be overridden before submission.

---

## 2. Ticket Lifecycle State Diagram

This diagram models the states a support ticket passes through from the user's and support staff's perspective.

```mermaid
stateDiagram-v2
    [*] --> Creating: User clicks "Create Ticket"

    Creating: Filling Out Ticket Form
    Open: Ticket Open (Awaiting Response)
    Viewing: Viewing Ticket Detail (800px Modal)
    Replying: Writing Reply
    Updated: Thread Updated

    Creating --> Open: User submits ticket
    Open --> Viewing: User or staff opens ticket
    Viewing --> Replying: User writes reply in textarea
    Replying --> Updated: Submit adds comment to thread
    Updated --> Viewing: Thread refreshes chronologically
    Viewing --> Open: User closes modal

    note right of Viewing
        Modal shows: ticket title, priority badge, body.
        Comment thread: date, subject, from, to, body
        (whitespace-preserving display).
    end note

    note right of Creating
        Cascading category select →
        auto-fills title & queue.
        Priority default: NORMAL.
    end note
```

**State transition notes:**
- **Creating** is the entry state where the cascading category selection, title auto-fill, and message composition happen.
- **Viewing** displays the full ticket in an 800px modal, with the comment thread rendered chronologically with whitespace preservation.
- The ticket cycles between **Viewing** and **Updated** as users and staff add comments, growing the thread over time.

---

## 3. Cascading Category Selection Sequence

This diagram shows the user–system interaction during the cascading category selection process when creating a support ticket.

```mermaid
sequenceDiagram
    actor User
    participant Form as Ticket Creation Form
    participant API as Category Service

    User->>Form: Opens "Create Ticket"
    Form->>API: Fetch Level 1 categories
    API-->>Form: Returns Level 1 list
    Form-->>User: Shows Level 1 dropdown

    User->>Form: Selects Level 1 category
    Form->>API: Fetch Level 2 categories (parentId = L1)
    API-->>Form: Returns Level 2 list
    Form-->>User: Shows Level 2 dropdown (populated)

    User->>Form: Selects Level 2 category

    alt Level 3 categories exist
        Form->>API: Fetch Level 3 categories (parentId = L2)
        API-->>Form: Returns Level 3 list
        Form-->>User: Shows Level 3 dropdown (populated)
        User->>Form: Selects Level 3 category
        Form-->>User: Title auto-fills "L1: L2: L3"
        Form-->>User: Queue auto-fills from L3 queue property
    else No Level 3 categories
        Form-->>User: Title auto-fills "L1: L2"
        Form-->>User: Queue auto-fills from L2 queue property
    end

    User->>Form: Sets priority (default NORMAL)
    User->>Form: Writes message body
    User->>Form: Clicks Submit
    Form->>API: Create ticket (title, queue, priority, body)
    API-->>Form: Ticket created successfully
    Form-->>User: Redirects to ticket list
```

**Interaction highlights:**
- Each category level is loaded **on demand** — Level 2 only fetches when Level 1 is selected, Level 3 only fetches when Level 2 is selected.
- Title and queue are derived fields, not user input. This ensures consistency and correct routing.
- The system determines whether Level 3 exists based on the selected Level 2 category's children.

---

## 4. Video Library Browsing Journey

This diagram shows how an end user navigates the card-based video library, from category browsing through to video playback.

```mermaid
flowchart TD
    A["Video Library Page<br>(Category Cards)"] -->|"Browse"| B["Category Card<br>(thumbnail, title, total time,<br>description, watched indicator)"]

    B -->|"Click 'View'"| C["URL Hash Updates<br>→ Subcategories & Videos Shown"]
    C -->|"Has subcategories"| D["Deeper Category Cards<br>(hash: ;categoryId segments)"]
    D -->|"Click 'View'"| C

    C -->|"Has videos"| E{"Video Type?"}

    E -->|"VIDEO"| F["Full-Viewport Player<br>video.js (100% width, 91vh)<br>No download, right-click disabled"]
    E -->|"STREAM"| G["Full-Viewport Iframe<br>External URL embed"]
    E -->|"PDF"| H["Opens in New Tab<br>Immediate watch time logged"]

    F -->|"Watch time tracked<br>every 20s + pause/end"| I["Progress Updated<br>(Video card: watched indicator)"]
    G -->|"Watch time tracked<br>via playbackStatusUpdate events"| I
    H -->|"Immediate tracking<br>(position: 0)"| I

    I -->|"All videos in category watched"| J["Category Card<br>Shows Watched Checkmark"]

    C -->|"Back button"| K["Strip Last Hash Segment<br>→ Navigate Up"]
    K --> A

    style A fill:#e8f4f8,stroke:#2c7bb6
    style F fill:#d4edda,stroke:#155724
    style G fill:#d4edda,stroke:#155724
    style H fill:#fff3cd,stroke:#856404
    style J fill:#d4edda,stroke:#155724
```

**Key observations:**
- Navigation uses **URL hash segments** (`#;categoryId;subcategoryId`) rather than route changes, allowing deep-linking and browser back-button navigation.
- The back button strips the last hash segment to move up one level in the hierarchy.
- Three distinct content types (VIDEO, STREAM, PDF) each have their own playback mode and tracking behavior.
- Progress is hierarchical: individual video completion rolls up to category-level watched indicators.

---

## 5. Video Upload State Diagram

This diagram models the states of a chunked video upload from the admin's perspective, including pause/resume support.

```mermaid
stateDiagram-v2
    [*] --> Idle: Admin opens "Add Video" dialog

    Idle: Waiting for File Selection
    Selecting: File Selected
    Uploading: Chunked Upload in Progress
    Paused: Upload Paused
    Completed: Upload Finished
    Error: Upload Failed

    Idle --> Selecting: Admin selects file
    Selecting --> Uploading: Upload begins (3MB chunks)

    Uploading --> Paused: Admin pauses upload
    Uploading --> Completed: All chunks uploaded
    Uploading --> Error: Network or server error

    Paused --> Uploading: Admin resumes upload

    Completed --> [*]: Video added to category, list refreshes

    Error --> Uploading: Retry upload
    Error --> Idle: Select different file

    note right of Uploading
        HugeUploader.js: 3MB chunks
        Progress bar shows percentage
    end note

    note right of Paused
        Upload can be resumed
        from last successful chunk
    end note
```

**State transition notes:**
- **Uploading** uses HugeUploader.js with 3MB chunk sizes, showing a real-time progress bar.
- **Paused** preserves upload state so the admin can resume from the last successful chunk.
- **Error** provides two recovery paths: retry the current upload or start fresh with a different file.
- On **Completed**, the video is automatically added to the current category and the video list refreshes.

---

## 6. Video Playback with Watch Time Tracking Sequence

This diagram shows the interaction between the user, the video player, and the tracking system during video playback.

```mermaid
sequenceDiagram
    actor User
    participant Player as Video Player (video.js / iframe)
    participant Tracker as Watch Time Tracker
    participant API as Video Tracking API

    User->>Player: Clicks play on video card

    alt Type = VIDEO
        Player-->>User: Full-viewport video.js player loads
        Player->>Tracker: Generate sessionId (Date.now())

        loop Every 20 seconds
            Tracker->>API: submitWatchTime(videoId, sessionId, position)
            API-->>Tracker: Acknowledged
        end

        User->>Player: Pauses video
        Player->>Tracker: Trigger final update
        Tracker->>API: submitWatchTime(videoId, sessionId, position)

        User->>Player: Resumes / video ends
        Player->>Tracker: Trigger final update
        Tracker->>API: submitWatchTime(videoId, sessionId, position)

    else Type = STREAM (PeerTube)
        Player-->>User: Full-viewport iframe loads external URL

        Player->>Tracker: Generate sessionId (Date.now())

        loop Every ~20 playbackStatusUpdate events
            Tracker->>API: submitWatchTime(videoId, sessionId, position)
            API-->>Tracker: Acknowledged
        end

    else Type = PDF
        Player-->>User: Opens PDF in new browser tab
        Tracker->>API: submitWatchTime(videoId, sessionId, position=0)
        API-->>Tracker: Acknowledged
        Note right of Tracker: Immediate single tracking call, no session loop
    end

    API-->>Player: Video marked as watched
    Player-->>User: Video card shows watched indicator
```

**Interaction highlights:**
- **Session ID** is generated as `Date.now()` at play start, uniquely identifying each viewing session.
- **VIDEO** type tracks position every 20 seconds plus on pause/end events.
- **STREAM** (PeerTube) type tracks based on `playbackStatusUpdate` event counts (~every 20 events).
- **PDF** type is a degenerate case: no player, immediate single tracking call with position 0.
- The watched indicator on the video card updates once the API confirms the video is marked as watched.

---

## 7. Chunked Upload Process Sequence

This diagram details the chunked upload process from the admin's interaction through to completion.

```mermaid
sequenceDiagram
    actor Admin
    participant Dialog as Add Video/Stream Dialog
    participant Uploader as HugeUploader.js
    participant Server as Upload Server

    Admin->>Dialog: Opens "Add Video" in category
    Dialog-->>Admin: Shows left column (upload) + right column (stream)

    Admin->>Dialog: Selects video file
    Dialog->>Uploader: Initialize (file, 3MB chunk size)
    Uploader-->>Dialog: Ready to upload

    Uploader->>Server: Send chunk 1 (0-3MB)
    Server-->>Uploader: Chunk 1 received
    Uploader-->>Dialog: Progress: 10%
    Dialog-->>Admin: Progress bar updates

    Uploader->>Server: Send chunk 2 (3-6MB)
    Server-->>Uploader: Chunk 2 received
    Uploader-->>Dialog: Progress: 20%
    Dialog-->>Admin: Progress bar updates

    alt Admin pauses upload
        Admin->>Dialog: Clicks pause
        Dialog->>Uploader: Pause
        Uploader-->>Dialog: Upload paused at chunk N
        Dialog-->>Admin: Shows "Resume" button

        Admin->>Dialog: Clicks resume
        Dialog->>Uploader: Resume from chunk N
        Uploader->>Server: Send chunk N+1
    end

    Note over Uploader, Server: Continues chunking until complete...

    Uploader->>Server: Send final chunk
    Server-->>Uploader: Upload complete
    Uploader-->>Dialog: Progress: 100%
    Dialog-->>Admin: Video added to category
    Dialog-->>Admin: Video list refreshes with new entry

    Note right of Dialog
        Bottom section shows:
        preview thumbnail + title +
        delete button per video
    end note
```

**Process details:**
- The upload dialog has a **split layout**: left column for file uploads, right column for adding streams manually.
- Chunks are sent sequentially at 3MB each, with the progress bar reflecting cumulative completion.
- Pause/resume is supported at chunk boundaries — the uploader remembers the last successful chunk.
- On completion, the category's video list auto-refreshes to include the new entry with preview thumbnail, title, and delete button.

---

## 8. Video Category Management Flow

This diagram shows the admin flow for managing video categories, including the hierarchical parent-child relationship and associated jobs.

```mermaid
flowchart TD
    A["Video Category Management Page<br>(Grid: id, title, description, priority)"] -->|"Create / Edit Category"| B["Category Form"]

    B --> C["Set Title"]
    B --> D["Select Parent Category<br>(Self-referential autocomplete)"]
    B --> E["Set Priority Number"]
    B --> F["Upload Thumbnail<br>(File upload → preview refreshes)"]
    B --> G["Write Description<br>(Textarea)"]
    B --> H["Manage Jobs Collection<br>(JobService autocomplete)"]

    H -->|"Add job"| I["Job appears: code + delete icon"]
    I -->|"Delete job"| H

    B -->|"Save"| J["Category Saved<br>Grid Refreshes"]

    A -->|"Open Category"| K["Manage Videos in Category"]
    K --> L["Add Video/Stream Dialog"]

    L --> M["Left: Upload Video<br>(Chunked upload flow)"]
    L --> N["Right: Add Stream<br>(Title, length, desc, preview, URL)"]
    L --> O["Bottom: Video List<br>(Thumbnail + title + delete)"]

    A -->|"Recalculate Watched"| P["Refresh Watched Status<br>for All Users & Categories"]

    style A fill:#e8f4f8,stroke:#2c7bb6
    style J fill:#d4edda,stroke:#155724
    style P fill:#fff3cd,stroke:#856404
```

**Key observations:**
- Categories are **self-referential** — a category can be a child of another category, forming a tree structure.
- The **jobs collection** links categories to job roles via autocomplete against the JobService, displayed as code badges with delete icons.
- **Thumbnail upload** provides immediate visual feedback with a preview image refresh.
- The "Recalculate Watched" admin action is a bulk operation that refreshes watched status across all users and all categories.

---

## Interdependencies Summary

| Factor | Affects | How |
|---|---|---|
| **User role** | Available features | End users see video library + ticket creation; admins additionally see video/category management grids |
| **Video type** (VIDEO / STREAM / PDF) | Playback mode & tracking | VIDEO uses video.js player, STREAM uses iframe embed, PDF opens in new tab; each has distinct tracking intervals |
| **Category hierarchy** | Navigation depth & title generation | Deeper category trees create longer hash URLs and longer auto-generated ticket titles; video library shows nested card layers |
| **Upload state** (idle / uploading / paused / error) | Admin interaction options | Pause/resume only available during active upload; retry only available after error; completion auto-refreshes video list |
| **Watch time sessions** | Progress indicators | Session-based tracking determines per-video completion; category watched status rolls up from all child video completion |
| **Cascading category selection** | Ticket title & queue assignment | Selected category chain auto-generates title string and determines queue routing — no manual override |
| **Chunk size (3MB)** | Upload granularity & resume point | Smaller chunks mean more requests but finer-grained resume points; pause/resume operates at chunk boundaries |
| **Category jobs** | User access to content | Job associations on categories may determine which users see which video content based on their role |

---

## Wireframe Screenshots

### WA-1: Support Ticket List (W1)

Grid view with 6 columns (id, number, title, queue, priority, state). Toolbar with Add and View Ticket buttons. Row click opens 800px ticket detail modal. Annotation note describes cascading selects, auto-fill behavior, priority enum, and view dialog structure.

**Annotations:**
- `[DataTable]` 6-col grid → @shadcn/table DataTable pattern
- Detail panel: 3 cascading selects `[cascade: level 1 → level 2 → level 3]`
- Title `[RO]` `[auto: concat(cat1.title, cat2.title, cat3.title)]` — auto-generated
- Queue `[RO]` — determined by category selection
- Priority: VERYLOW | LOW | NORMAL | HIGH | CRITICAL
- View dialog (800px): ticket metadata header + comment thread `[repeats]` + reply textarea
- Body textarea for ticket description

![W1: Support Ticket List](./support-video/support-ticket.png)

### WA-2: Support Ticket Creation — Cascading Category Select (W1)

600px dialog with three-level category dropdown cascade (`[cascade: level N → level N+1]`). Title field auto-populated from concatenated selections (`[RO]` `[auto: concat]`). Queue field auto-filled from selected category. Priority selector defaulting to NORMAL. Message body textarea. Cancel + Submit footer.

**Annotations:**
- `[DataTable]` 6-col grid → @shadcn/table DataTable pattern
- Detail panel: 3 cascading selects `[cascade: level 1 → level 2 → level 3]`
- Title `[RO]` `[auto: concat(cat1.title, cat2.title, cat3.title)]` — auto-generated
- Queue `[RO]` — determined by category selection
- Priority: VERYLOW | LOW | NORMAL | HIGH | CRITICAL
- View dialog (800px): ticket metadata header + comment thread `[repeats]` + reply textarea
- Body textarea for ticket description

![W1: Create Ticket Dialog](./support-video/support-ticket-create.png)

### WA-3: Support Ticket Detail Modal (W1)

800px modal displaying ticket number + concatenated title in header, metadata row (queue, priority badge, state), full body text with whitespace preservation. Chronological comment thread (`[repeats]`) with date, subject, from, to, and body per comment. Reply textarea + "Send Reply" button at bottom.

**Annotations:**
- `[DataTable]` 6-col grid → @shadcn/table DataTable pattern
- Detail panel: 3 cascading selects `[cascade: level 1 → level 2 → level 3]`
- Title `[RO]` `[auto: concat(cat1.title, cat2.title, cat3.title)]` — auto-generated
- Queue `[RO]` — determined by category selection
- Priority: VERYLOW | LOW | NORMAL | HIGH | CRITICAL
- View dialog (800px): ticket metadata header + comment thread `[repeats]` + reply textarea
- Body textarea for ticket description

![W1: Ticket Detail Modal](./support-video/support-ticket-view.png)

### WA-4: Video Management Grid (W2)

1440px full-page view with 7-column DataTable grid (id, path, preview thumbnail, title, duration, category, description). Toolbar with Add, Edit, Delete, and Watch buttons. Watch button triggers player dialog based on video type. Annotation note describes two player dialog variants.

**Annotations:**
- `[DataTable]` 7-col grid → @shadcn/table DataTable pattern
- Detail panel: path, previewImage, title, lengthInSeconds, category combobox, description textarea
- Two player dialog types:
- `[cond: video.type === VIDEO]` video.js player 800px dialog
- `[cond: video.type === STREAM]` iframe embed 1200px dialog
- Watch button opens appropriate player based on video type

![W2: Video Management Grid](./support-video/video-management.png)

### WA-5: Video Management Detail Panel (W2)

600px dialog with form fields: path, preview image, title, duration (seconds), category combobox (VideoCategoryService.autocomplete), and description textarea. Info box annotates player type routing: `[cond: video.type === VIDEO]` → video.js 800px, `[cond: video.type === STREAM]` → iframe 1200px.

**Annotations:**
- `[DataTable]` 7-col grid → @shadcn/table DataTable pattern
- Detail panel: path, previewImage, title, lengthInSeconds, category combobox, description textarea
- Two player dialog types:
- `[cond: video.type === VIDEO]` video.js player 800px dialog
- `[cond: video.type === STREAM]` iframe embed 1200px dialog
- Watch button opens appropriate player based on video type

![W2: Video Detail Panel](./support-video/video-management-detail.png)

### WA-6: Video Library — Card Browsing (W3)

1440px full-page card-based browsing layout (no DataTable). Header with Back button and "Video Library" title. **Categories section**: 3-column card grid with thumbnail placeholder, title, total time, watched badge (success/warning), and View button. **Videos section**: 3-column card grid within selected category, each card with play icon thumbnail, title, duration, watched indicator (check icon), and Play button. Annotation note describes hash deep linking (`#CATEGORYID;SUBCATEGORY:VIDEOID:POSITION`), periodic watch time tracking, and 3 player variants.

**Annotations:**
- Card-based browsing layout (no DataTable)
- Category cards grid: thumbnail, title, totalTime, watched indicator, View button
- Video cards grid: thumbnail, title, duration, watched indicator, Play button
- `[hash: deep link]` #CATEGORYID;SUBCATEGORY:VIDEOID:POSITION
- `[async: periodic submitWatchTime]` track video watch progress
- 3 player variants: VIDEO (video.js), STREAM (iframe), PDF (embedded viewer)
- goBack button returns to previous view

![W3: Video Library](./support-video/video-library.png)

### WA-7: Video Category Management (W4)

1440px full-page view with 4-column grid (id, title, description, priority). Toolbar with Add, Edit, Delete, Videos, and Recalculate buttons. **Detail form** below grid: title input, self-referential parent category combobox, priority number, thumbnail file upload with image preview, description textarea, and jobs collection (`[repeats]`) with autocomplete insert + badge list with delete buttons. **Add Video/Stream dialog**: split two-column layout — left column for chunked file upload (`[chunked: 3MB, pause/resume]`) with progress bar + pause/resume controls, right column for stream form (title, length, description, preview URL, stream URL, Add button). Bottom section shows existing videos in category with thumbnail + title + delete.

![W4: Video Category Management](./support-video/video-category.png)
