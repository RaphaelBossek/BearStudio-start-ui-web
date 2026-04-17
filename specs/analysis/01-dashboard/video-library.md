---
title: 'Support And Video'
---

---
---

# Legacy UI Analysis: Support Ticket, Video, Video Library, Video Category

---

## Cross-References

### Service Calls

| Service | Method | Parameters | Context |
|---------|--------|------------|---------|
| `SupportTicketService` | `get`, `getAll` | `[id]`, `[]` | Grid data loading for supportTicket module |
| `SupportTicketService` | `addComment` | `[id, newComment]` | Reply form in `#viewSupportTicket` dialog |
| `SupportCategoryService` | `getAllGrouped` | `[]` | Cascading dropdown for category chain (L1→L2→L3) |
| `VideoService` | `get`, `getAll` | `[id]`, `[]` | Grid data loading for video module |
| `VideoService` | `autocomplete` | `[query]` | Autocomplete for `data.category` field |
| `VideoCategoryService` | `autocomplete` | `[query]` | Autocomplete for `data.parentCategory` in videoCategory; category field in video |
| `VideoCategoryService` | `thumbnail` | `[id, size]` | Category thumbnail URLs in videoLibrary |
| `VideoCategoryService` | `playVideo` | `[id, format]` | Video playback URLs (video.mp4, pdf.pdf) |
| `VideoCategoryService` | `addVideo` | `[categoryId, fileName]` | Prepares chunked upload ID in videoCategory |
| `VideoCategoryService` | `addStream` | `[streamData]` | Adds stream entry in videoCategory dialog |
| `VideoCategoryService` | `deleteVideo` | `[videoId]` | Removes video from category |
| `VideoCategoryService` | `uploadFile` | `[uploadId, chunk, total]` | Chunked upload endpoint (3MB chunks) |
| `VideoLibraryService` | `getLibrary` | `[]` | Returns category tree for videoLibrary browsing |
| `VideoLibraryService` | `submitWatchTime` | `[videoId, sessionId, position]` | PDF tracking and periodic watch time |
| `AdminService` | `refreshWatchedVideos` | `[]` | Recalculates watched categories in videoCategory |
| `JobService` | `autocomplete` | `[query]` | Job assignment autocomplete in videoCategory |

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Sibling** | `video.js` player library | [User Video History](./user-video-history.md) | Shared player; used by video and videoLibrary modules |
| include | **Sibling** | `peertube-player.min.js` | [User Video History](./user-video-history.md) | PeerTube integration; loaded by video and videoLibrary |
| include | **Sibling** | `userVideoHistory/player.js` | [User Video History](./user-video-history.md) | Watch session tracking; loaded by video and videoLibrary |
| include | **Sibling** | `HugeUploader.js` | [User Video History](./user-video-history.md) | Chunked upload (3MB); videoCategory only |

---

> **Service context:** This file documents 4 modules (supportTicket, video, videoLibrary, videoCategory) that collectively call SupportTicketService, SupportCategoryService, VideoService, VideoCategoryService, VideoLibraryService, AdminService, and JobService. videoCategory acts as the central service hub — it provides autocomplete for video's category field, exposes thumbnail/playVideo endpoints consumed by videoLibrary, and integrates with AdminService (refresh) and JobService (autocomplete). The video and videoLibrary modules both depend on VideoCategoryService and share video.js/PeerTube player libraries via userVideoHistory/player.js.

---

**Service**: `SupportTicketService` (CRUD: `get`, `getAll`, `addComment`)
**Related Service**: `SupportCategoryService` (`getAllGrouped`)
**Container**: `#supportTicket`, class `tableView`, limit 100
**Icon**: `far fa-user-headset`, color `bg-color-administration`

### 1.1 Grid Columns

| # | Field          | Name (i18n key)             | Sortable | Resizable | Width | Formatter |
|---|----------------|-----------------------------|----------|-----------|-------|-----------|
| 1 | `id`           | `label.id`                  | Yes      | Yes       | 80    | --        |
| 2 | `ticketNumber` | `label.number`              | Yes      | Yes       | 150   | --        |
| 3 | `title`        | `SupportTicket.subject`     | Yes      | Yes       | 280   | --        |
| 4 | `queue`        | `SupportTicket.queue`       | Yes      | Yes       | 80    | --        |
| 5 | `prio`         | `label.priority`            | Yes      | Yes       | 80    | --        |
| 6 | `state`        | `SupportTicket.state`       | Yes      | Yes       | 80    | --        |

### 1.2 Form Elements (Detail Panel -- Create/Edit)

| # | Field              | Type          | Name / Placeholder (i18n)   | CSS class         | Width   | Notes                                                     |
|---|--------------------|---------------|-----------------------------|-------------------|---------|------------------------------------------------------------|
| 1 | `subjectListStart` | `<select>`    | (dynamic, from service)     | `subjectlist mandatory` | col-md-4 | Level 1 category dropdown; chains to `subjectList2`        |
| 2 | `subjectList2`     | `<select>`    | (dynamic)                   | `subjectlist mandatory` | col-md-4 | Level 2 category; chains to `subjectListDone`              |
| 3 | `subjectListDone`  | `<select>`    | (dynamic)                   | `subjectlist`     | col-md-4 | Level 3 category (optional)                                |
| 4 | `data.title`       | `<input>`     | `SupportTicket.subject`     | `form-control`    | col-md-6 | **readonly** -- auto-filled from chained select values     |
| 5 | `data.queue`       | `<input>`     | (none)                      | `form-control`    | col-md-3 | **readonly** -- auto-filled from selected category's queue |
| 6 | `data.prio`        | `<select>`    | (enum options)              | `form-select mandatory` | col-md-3 | Default: `NORMAL`. Values: VERYLOW, LOW, NORMAL, HIGH, CRITICAL |
| 7 | `data.body`        | `<textarea>`  | `SupportTicket.body`        | `form-control`    | col-md-12| Free text body                                             |

**Cascading dropdown logic**: `SupportCategoryService.getAllGrouped` returns a tree. Each level populates the next `<select>` via `data-next`. The concatenated titles (joined with `: `) are written into `data.title`. The `queue` value comes from whichever selected option carries a `queue` property.

**Default onCreate values**: `{ prio: "NORMAL" }`

### 1.3 View Dialog (Modal -- `#viewSupportTicket`)

**Width**: 800px, target: modal

| # | Field                   | Type         | Display     | Width   | Notes                      |
|---|-------------------------|--------------|-------------|---------|----------------------------|
| 1 | `data.title`            | `<h5>`       | field       | col-md-9| Ticket subject as heading  |
| 2 | `data.prio`             | `<span>`     | field       | col-md-3| Priority badge             |
| 3 | `data.body`             | `<div>`      | field       | col-md-12| Ticket body               |
| -- | **--- Comments Collection ---** (`data.comments`) | | | | |
| 4 | `comments.dateCreated`  | `<span>`     | datetime    | col-md-2| Formatted as datetime      |
| 5 | `comments.subject`      | `<span>`     | bold field  | col-md-4| Comment subject            |
| 6 | `comments.from`         | `<span>`     | field       | col-md-3| Sender                     |
| 7 | `comments.to`           | `<span>`     | field       | col-md-3| Recipient                  |
| 8 | `comments.body`         | `<div>`      | comment, pre| col-md-12| Whitespace-preserving body |
| -- | **--- Reply Form ---** | | | | |
| 9 | `newComment`            | `<textarea>` | input       | col-md-12| New comment text           |
| 10| (reply button)          | `<button>`   | action      | col-md-12| Calls `addComment`         |

### 1.4 Click Actions (Navbar Buttons)

| Action ID              | Icon                | Name (i18n key)    | English          | Notes                                   |
|------------------------|---------------------|--------------------|------------------|-----------------------------------------|
| `addMenuBtn`           | `plus-square`       | `action.add`       | Add              | Opens detail panel for new ticket       |
| `viewTicketMenuBtn`    | `envelope-open-text`| `action.view`      | View             | Opens view modal with comments          |
| `captureScreen`        | `camera-retro`      | `action.capture`   | Capture Screen   | **Commented out** in both HTML and JS   |

### 1.5 Translation Keys

| Text-Reference               | German (probable)     | English (probable)      | Notes                                  |
|------------------------------|-----------------------|-------------------------|----------------------------------------|
| `SupportTicket.subject`      | Betreff               | Subject                 | i18n.js: `$[SupportTicket.subject]`    |
| `SupportTicket.queue`        | Warteschlange         | Queue                   | i18n.js: `$[SupportTicket.queue]`      |
| `SupportTicket.state`        | Status                | State                   | Referenced in grid only                |
| `SupportTicket.body`         | Nachricht             | Message / Body          | Placeholder on textarea                |
| `supportTicket.reply`        | Antworten             | Reply                   | Button label in view modal             |
| `label.id`                   | ID                    | ID                      | Shared label                           |
| `label.number`               | Nummer                | Number                  | Shared label                           |
| `label.priority`             | Prioritaet            | Priority                | Shared label                           |
| `TicketPriority.VERY_LOW`    | Sehr Niedrig          | Very Low                | Select option                          |
| `TicketPriority.LOW`         | Niedrig               | Low                     | Select option                          |
| `TicketPriority.NORMAL`      | Normal                | Normal                  | Select option (default)                |
| `TicketPriority.HIGH`        | Hoch                  | High                    | Select option                          |
| `TicketPriority.CRITICAL`    | Kritisch              | Critical                | Select option                          |

### 1.6 Special Components

- **Cascading category selects**: Three chained `<select>` elements driven by `SupportCategoryService.getAllGrouped`. Auto-populates `title` and `queue` fields.
- **Comment thread**: Collection-based rendering of `data.comments` with `addComment` RPC call.
- **Screen capture** (disabled): `captureScreen` button and `#screenShotDlg` dialog are commented out.

### 1.7 Bug in Legacy Code

- `comment.lenth` (line 60 of index.js) -- typo for `comment.length`. Minimum length check never works.

---

## 2. video Module

**Service**: `VideoService` (CRUD: `get`, `getAll`)
**Container**: `#video`, class `tableView`, limit 100
**Detail icon**: `far fa-video`, color `bg-color-video`

### 2.1 Grid Columns

| # | Field             | Name (i18n key)          | Sortable | Resizable | Width | Formatter          |
|---|-------------------|--------------------------|----------|-----------|-------|--------------------|
| 1 | `id`              | `label.id`               | Yes      | Yes       | 80    | --                 |
| 2 | `path`            | `video.path`             | Yes      | Yes       | 500   | --                 |
| 3 | `previewImage`    | `video.previewImage`     | Yes      | Yes       | 120   | --                 |
| 4 | `title`           | `label.title`            | Yes      | Yes       | 180   | --                 |
| 5 | `lengthInSeconds` | `video.lengthInSeconds`  | Yes      | Yes       | 150   | --                 |
| 6 | `category`        | `video.category`         | Yes      | Yes       | 80    | `Formatter.name`   |
| 7 | `description`     | `label.description`      | Yes      | Yes       | 200   | --                 |

### 2.2 Form Elements (Detail Panel -- Create/Edit)

| # | Field                | Type          | Label / Placeholder (i18n) | CSS class                  | Width    | Notes                                             |
|---|----------------------|---------------|----------------------------|----------------------------|-----------|----------------------------------------------------|
| 1 | `data.path`          | `<input>`     | `video.path`               | `form-control`             | col-md-4 | Video file path / URL                              |
| 2 | `data.previewImage`  | `<input>`     | `video.previewImage`       | `form-control`             | col-md-4 | Preview image path                                 |
| 3 | `data.title`         | `<input>`     | `label.title`              | `form-control`             | col-md-4 | Video title                                        |
| 4 | `data.lengthInSeconds`| `<input>`    | `video.lengthInSeconds`    | `form-control`             | col-md-4 | Duration in seconds                                |
| 5 | `data.category`      | `<input>`     | `video.category`           | `form-control object autoselect` | col-md-4 | Autocomplete via `VideoCategoryService.autocomplete`, displays `title` |
| 6 | `data.description`   | `<textarea>`  | `label.description`        | `form-control`             | col-md-12| Free text description                              |

### 2.3 Click Actions (Navbar Buttons)

| Action ID        | Icon        | Name (i18n key)   | English      | Notes                                    |
|------------------|-------------|--------------------|--------------|------------------------------------------|
| `addMenuBtn`     | `plus-square`| `action.add`      | Add          | Opens detail panel                       |
| `editMenuBtn`    | `pencil`    | `action.change`    | Edit         | Initially disabled; enabled on row select |
| `deleteMenuBtn`  | `trash`     | `action.delete`    | Delete       | Initially disabled; enabled on row select |
| `watchVideoBtn`  | `eye`       | **"Watch"**        | **Watch**    | **HARDCODED** (no i18n key). Disabled until row selected |

### 2.4 Video Player Dialogs

#### 2.4.1 Local Video Player (`#watchVideoDlg`)

| Property      | Value                        |
|---------------|------------------------------|
| Title         | **"Video"** (HARDCODED)      |
| Width         | 800px                        |
| Player        | video.js (`<video-js>`)      |
| Player ID     | `videoPlayer`                |
| Default src   | `_include/videos/clouds.mp4` |
| Dimensions    | 640px width                  |
| Controls      | Yes, preload auto            |

#### 2.4.2 Stream Player (`#streamVideoDlg`)

| Property      | Value                               |
|---------------|--------------------------------------|
| Title         | **"Video"** (HARDCODED)              |
| Width         | 1200px                               |
| Player        | `<iframe>`, initially `about:blank`  |
| Dimensions    | width 100%, height calc(100vh - 50px)|
| Permissions   | accelerometer, autoplay, clipboard-write, encrypted-media, gyroscope, picture-in-picture, fullscreen |

**Video type routing** (index.js):
- `type === VIDEO` --> opens video.js player with `data.path` as source
- `type === STREAM` --> opens iframe with `data.path` as src

### 2.5 Translation Keys

| Text-Reference            | German (probable)   | English (probable)   | Notes                                  |
|---------------------------|---------------------|----------------------|----------------------------------------|
| `video.path`              | Pfad                | Path                 | i18n.js: `$[video.path]`              |
| `video.previewImage`      | Vorschaubild        | Preview Image        | i18n.js: `$[video.previewImage]`      |
| `video.lengthInSeconds`   | Laenge (in Sekunden)| Length (in seconds)  | i18n.js: `$[video.lengthInSeconds]`   |
| `video.category`          | Kategorie           | Category             | i18n.js: `$[video.category]`          |
| `label.title`             | Titel               | Title                | Shared; `$[label.title]`              |
| `label.description`       | Beschreibung        | Description          | Shared; `$[label.description]`        |
| `room.video`              | Video               | Video                | Detail panel title                     |

### 2.6 Special Components

- **video.js player**: External library (`video.min.js`, `video-js.css`). Used for local VIDEO type playback.
- **PeerTube player**: `peertube-player.min.js` loaded but usage is implicit (may be used by the video.js plugin layer).
- **User video history**: `userVideoHistory/player.js` loaded -- tracks viewing sessions via `sessionId = Date.now()`.
- **Autocomplete**: `data.category` uses `VideoCategoryService.autocomplete` with `data-display="title"`.

### 2.7 Cross-Module References

| Target Module    | Reference                                          |
|------------------|----------------------------------------------------|
| videoCategory    | `VideoCategoryService.autocomplete` for category field |
| userVideoHistory | `player.js` loaded for watch tracking              |

---

## 3. videoLibrary Module

**Service**: `VideoLibraryService` (`getLibrary`, `submitWatchTime`)
**Related Service**: `VideoCategoryService` (`thumbnail`, `playVideo`)
**Container**: `#videoLibrary` (no `tableView` class -- card-based browsing UI)
**No navbar buttons** (empty nav config)

### 3.1 Grid Columns

This module has **no data grid**. It uses a card-based browsing layout.

### 3.2 UI Structure

#### 3.2.1 Navigation Bar

| Element        | Type      | ID              | Notes                                         |
|----------------|-----------|-----------------|-----------------------------------------------|
| Back button    | `<button>`| `goBack`        | Icon: `fa fa-level-up`. Navigates up hash path |
| Progress bar   | container | `progressBarMenu`| **Commented out**. Shows videos seen count & percentage |

#### 3.2.2 Category Cards (`#categoryList`)

Collection bound to `data.children`.

| Element            | Type          | Source field         | Notes                                      |
|--------------------|---------------|----------------------|--------------------------------------------|
| Thumbnail          | `<img>`       | `/get/VideoCategoryService/thumbnail/[[cur.id]]/thumb` | Templated URL  |
| Title              | `<span>`      | `children.title`     | Bold                                        |
| Total Time         | `<span>`      | `children.totalTime` | Class `humantime` (formatted duration)      |
| Watched indicator  | `<i>`         | (conditional)        | `fa fa-check watched` -- shown if `pojo.seen === true` |
| Description        | `<p>`         | `children.description`| Card text                                  |
| View button        | `<button>`    | --                   | Label: `button.view`. Navigates via hash `#...;categoryId` |

#### 3.2.3 Video Cards (`#videoList`)

Collection bound to `data.videos`.

| Element            | Type          | Source field         | Notes                                      |
|--------------------|---------------|----------------------|--------------------------------------------|
| Thumbnail          | `<img>`       | `[[cur.previewUrl]]` | Templated URL from video data              |
| Title              | `<span>`      | `videos.title`       | Bold                                        |
| Duration           | `<span>`      | `videos.length`      | Class `humantime`                           |
| Watched indicator  | `<i>`         | (conditional)        | `fa fa-check watched` -- shown if `pojo.seen === true` |
| Description        | `<p>`         | `videos.description` | --                                          |
| Play button        | `<button>`    | --                   | Label: `button.view`. Type-dependent action |

### 3.3 Click Actions

| Action ID    | Element     | Title / Label        | English       | Notes                                          |
|--------------|-------------|----------------------|---------------|-------------------------------------------------|
| `goBack`     | `<button>`  | (icon only)          | Back / Up     | Strips last `;` or `:` segment from URL hash   |
| `showVideos` | `<button>`  | `button.view`        | View          | Per-card; appends `;categoryId` to hash         |
| `playVideo`  | `<button>`  | `button.view`        | View          | Per-card; type-routed (VIDEO/STREAM/PDF)        |

### 3.4 Video Players

#### 3.4.1 Local Video Player (`#videoPlayerContainer`)

| Property      | Value                                                      |
|---------------|------------------------------------------------------------|
| Player        | video.js (`<video-js>`)                                    |
| Player ID     | `videoPlayer`                                              |
| Width         | 800px (HTML), overridden to 100% / 91vh via CSS            |
| Controls      | Yes, `controlsList="nodownload"`, preload auto             |
| Source URL    | `/get/VideoCategoryService/playVideo/{videoId}/video.mp4`  |
| Auto-play     | Yes, via `setTimeout(1000)` after source set               |
| Context menu  | Disabled (right-click blocked)                             |
| Download      | Hidden via CSS pseudo-element selectors                    |

#### 3.4.2 Stream Player (`#streamPlayerContainer`)

| Property      | Value                                                      |
|---------------|------------------------------------------------------------|
| Player        | `<iframe>`                                                 |
| Dimensions    | width 100%, height calc(100vh - 50px)                      |
| Source URL    | `{video.path}?api=1`                                       |

#### 3.4.3 PDF Download

- Type `PDF` triggers `window.open` to `/get/VideoCategoryService/playVideo/{pdfId}/pdf.pdf`
- Immediately submits `submitWatchTime(pdfId, sessionId, 0)` for tracking

### 3.5 Deep Linking / Hash Navigation

**Format**: `#CATEGORYID;SUBCATEGORY:VIDEOID:POSITION`

| Segment       | Separator | Meaning                            |
|---------------|-----------|-------------------------------------|
| Category path | `;`       | Nested category IDs                 |
| Video ID      | `:`       | Selected video within category      |
| Position      | `:`       | Playback position (parsed but not directly used in display logic) |

Navigation is driven by `window.location.hash` changes with a `hashchange` event listener.

### 3.6 Translation Keys

| Text-Reference            | German (probable) | English (probable) | Notes                           |
|---------------------------|-------------------|--------------------|----------------------------------|
| `VideoLibrary.allvideos`  | Alle Videos       | All Videos         | i18n.js: `$[VideoLibrary.allvideos]` |
| `VideoLibrary.seen`       | gesehen           | seen               | Commented-out progress bar text  |
| `button.view`             | Ansehen           | View               | Shared button label              |

### 3.7 CSS (`style.css`)

| Selector                                     | Properties                          | Notes                         |
|-----------------------------------------------|-------------------------------------|-------------------------------|
| `#videoPlayerContainer`                       | `display:none; width:100%; height:91vh` | Full-viewport player      |
| `#videoPlayer`                                | `width:100%; height:91vh`           | Matches container             |
| `.btn.btn-primary > span`                     | `display:none`                      | Hides span inside play buttons |
| `video::-internal-media-controls-download-button` | `display:none`                  | Hides native download button  |
| `video::-webkit-media-controls-enclosure`     | `overflow:hidden`                   | Prevents controls overflow    |
| `video::-webkit-media-controls-panel`         | `width:calc(100% + 30px)`          | Extends controls width        |

### 3.8 Static Assets

- `category.png` -- category card placeholder/icon
- `video.png` -- video card placeholder/icon

### 3.9 Cross-Module References

| Target Module      | Reference                                              |
|--------------------|--------------------------------------------------------|
| videoCategory      | `VideoCategoryService.thumbnail` for category images   |
| videoCategory      | `VideoCategoryService.playVideo` for video playback URLs |
| userVideoHistory   | `player.js` for watch session tracking                 |
| videoLibrary       | `VideoLibraryService.getLibrary` returns category tree |
| videoLibrary       | `VideoLibraryService.submitWatchTime` for PDF tracking |

---

## 4. videoCategory Module

**Service**: `VideoCategoryService` (CRUD: `get`, `getAll`, `addVideo`, `addStream`, `getVideos`, `deleteVideo`, `uploadFile`, `thumbnail`, `autocomplete`)
**Related Service**: `AdminService` (`refreshWatchedVideos`), `JobService` (`autocomplete`)
**Container**: `#videoCategory`, class `tableView`, limit 100
**Detail icon**: `far fa-camcorder`, color `bg-color-dash`

### 4.1 Grid Columns

| # | Field         | Name (i18n key)      | Sortable | Resizable | Width | Formatter |
|---|---------------|----------------------|----------|-----------|-------|-----------|
| 1 | `id`          | `label.id`           | Yes      | Yes       | 80    | --        |
| 2 | `title`       | `label.title`        | Yes      | Yes       | 250   | --        |
| 3 | `description` | `label.description`  | Yes      | Yes       | 380   | --        |
| 4 | `priority`    | `label.priority`     | Yes      | Yes       | 80    | --        |

### 4.2 Form Elements (Detail Panel -- Create/Edit)

| # | Field                | Type                | Label / Placeholder (i18n)  | CSS class                     | Width    | Notes                                                   |
|---|----------------------|---------------------|-----------------------------|-------------------------------|----------|---------------------------------------------------------|
| 1 | `data.title`         | `<input>`           | `label.title`               | `form-control`                | col-md-8 | Category title                                          |
| 2 | `data.parentCategory`| `<input>`           | `VideoCategory.parent`      | `form-control object autoselect` | col-md-8 | Autocomplete: `VideoCategoryService.autocomplete`, display `title`. Icon: `fas fa-folder` |
| 3 | `data.priority`      | `<input>`           | `label.priority`            | `form-control numer`          | col-md-8 | Numeric priority (note: class typo `numer` not `number`) |
| 4 | `data.thumbnail`     | `<input type="file">`| --                          | `custom-file-input singlefileupload object` | col-md-4 | File upload to `VideoCategoryService`. Preview: `#categoryPreview` img |
| 5 | `data.id` (preview)  | `<img>`             | --                          | `templatefield`               | col-md-4 | Shows `/get/VideoCategoryService/thumbnail/[[data.id]]/thumb`. Height 60px |
| 6 | `data.description`   | `<textarea>`        | `label.description`         | `form-control`                | col-md-12| Category description                                    |
| 7 | `data.jobs` (insert) | `<input>`           | **"Job"** (HARDCODED)       | `form-control insert autoselect` | col-md-12 | Autocomplete: `JobService.autocomplete`, display `code`. Insert into collection |
| 8 | `data.jobs` (list)   | collection          | --                          | --                            | col-md-12| Shows `jobs.code` readonly with delete button            |

### 4.3 Click Actions (Navbar Buttons)

| Action ID                      | Icon        | Name (i18n key)      | English       | Notes                                            |
|--------------------------------|-------------|----------------------|---------------|--------------------------------------------------|
| `addMenuBtn`                   | `plus-square`| `action.add`        | Add           | Opens detail panel for new category              |
| `editMenuBtn`                  | `pencil`    | `action.change`      | Edit          | Initially disabled                               |
| `deleteMenuBtn`                | `trash`     | `action.delete`      | Delete        | Initially disabled                               |
| `addVideoBtn`                  | `plus`      | **"Videos"**         | **Videos**    | **HARDCODED**. Disabled until row selected. Opens video management dialog |
| `refreshWatchedCategoriesBtn`  | `recycle`   | `action.recalculate` | Recalculate   | Calls `AdminService.refreshWatchedVideos`. Shows `alert("done")` |

### 4.4 Add Video/Stream Dialog (`#addVideoToCategory`)

**Icon**: `far fa-camcorder`, color `bg-color-dash`, title `video` (i18n)

#### 4.4.1 Video Upload Section (col-md-6)

| Element          | Type            | Notes                                                  |
|------------------|-----------------|--------------------------------------------------------|
| Heading          | `<h6>`          | **"Upload"** (HARDCODED)                               |
| File input       | `<input file>`  | ID `videoUpload`. Triggers chunked upload              |
| Progress bar     | Bootstrap       | Shows upload percentage                                |

**Upload mechanism** (HugeUploader.js):
- Chunked upload via `POST` to `/get/VideoCategoryService/uploadFile/{uploadId}`
- Chunk size: 3 MB (`3000000`)
- Retries: 3, delay: 1000ms
- Headers: `upload`, `uploader-file-id`, `uploader-chunks-total`, `uploader-chunk-number`
- Events: `progress`, `finish`, `error`, `fileRetry`, `online`, `offline`
- Supports pause/resume (`togglePause`)
- Prepares upload ID via `VideoCategoryService.addVideo(categoryId, fileName)`

#### 4.4.2 Add Stream Section (col-md-6)

| # | Field               | Type       | Placeholder                    | Notes                          |
|---|---------------------|------------|--------------------------------|--------------------------------|
| 1 | Heading             | `<h6>`     | **"Add Stream"** (HARDCODED)   | --                             |
| 2 | `data.title`        | `<input>`  | `label.title`                  | Stream title                   |
| 3 | `data.lengthInSeconds`| `<input>`| **"Laenge (in s)"** (HARDCODED German) | Numeric, with `s` suffix badge |
| 4 | `data.description`  | `<input>`  | `label.description`            | Stream description             |
| 5 | `data.previewPath`  | `<input>`  | **"Vorschau URL"** (HARDCODED German) | Preview image URL. Icon: `fa fa-image` |
| 6 | `data.path`         | `<input>`  | **"URL"** (HARDCODED)          | Stream URL. Icon: `fa fa-link` |
| 7 | (submit button)     | `<button>` | `button.add`                   | Calls `VideoCategoryService.addStream` |

#### 4.4.3 Video List in Dialog

Collection bound to `data.videos`:

| Element          | Type       | Source field    | Notes                                   |
|------------------|------------|------------------|-----------------------------------------|
| Preview image    | `<img>`    | `[[cur.previewUrl]]` | Max width 300px                     |
| Title            | `<span>`   | `videos.title`  | --                                       |
| Delete button    | `<i>`      | --               | `fa fa-trash deleteVideo`. Confirms with `dialog_delete_confirm`, calls `VideoCategoryService.deleteVideo` |

### 4.5 Translation Keys

| Text-Reference              | German (probable)      | English (probable)    | Notes                              |
|-----------------------------|------------------------|-----------------------|------------------------------------|
| `label.title`               | Titel                  | Title                 | Shared; `$[label.title]`          |
| `label.description`         | Beschreibung           | Description           | Shared; `$[label.description]`    |
| `label.priority`            | Prioritaet             | Priority              | Shared                             |
| `videoCategory.title`       | Videokategorie         | Video Category        | i18n.js: `$[videoCategory.title]` |
| `videoCategory.thumbnail`   | Vorschaubild           | Thumbnail             | i18n.js: `$[videoCategory.thumbnail]` |
| `VideoCategory.parent`      | Uebergeordnete Kategorie | Parent Category     | Placeholder on autocomplete        |
| `video` (dialog title)      | Video                  | Video                 | Dialog title for add video         |
| `button.add`                | Hinzufuegen            | Add                   | Shared button label                |
| `dialog_delete_confirm`     | Wirklich loeschen?     | Really delete?        | Shared confirm dialog              |

### 4.6 Hardcoded Strings (require i18n in rebuild)

| Location                     | String                 | Language | Suggested Key                   |
|------------------------------|------------------------|----------|---------------------------------|
| Navbar button name           | `"Videos"`             | English  | `action.manageVideos`           |
| Upload heading               | `"Upload"`             | English  | `videoCategory.upload`          |
| Stream heading               | `"Add Stream"`         | English  | `videoCategory.addStream`       |
| Length placeholder            | `"Laenge (in s)"`     | German   | `video.lengthInSeconds`         |
| Preview URL placeholder       | `"Vorschau URL"`      | German   | `video.previewUrl`              |
| URL placeholder               | `"URL"`               | English  | `video.streamUrl`               |
| Job label                    | `"Job"`                | English  | `videoCategory.job`             |
| Upload alerts                | `"done"`, `"ERROR"`   | English  | `message.uploadComplete`, `message.uploadError` |
| Recalculate alert            | `"done"`               | English  | `message.recalculateComplete`   |
| video module Watch button    | `"Watch"`              | English  | `action.watch`                  |
| video dialog titles          | `"Video"`              | English  | `video.player`                  |

### 4.7 Special Components

- **HugeUploader.js**: Full chunked file upload client (162 lines). Implements: chunk splitting via `FileReader`, retry logic with exponential backoff, pause/resume, online/offline detection, progress events. This is a standalone class that should be replaced with a modern upload library (e.g., tus-js-client or a custom React hook wrapping fetch with chunking).
- **Thumbnail upload**: Single file upload via `singlefileupload` class with preview refresh on `upload` event.
- **Job autocomplete collection**: Insert-mode autocomplete that appends to a `data.jobs` collection with inline delete.

### 4.8 Cross-Module References

| Target Module    | Reference                                              |
|------------------|---------------------------------------------------------|
| video            | Category provides autocomplete for video's category field |
| videoLibrary     | Category tree structure consumed by library browsing    |
| videoLibrary     | `VideoCategoryService.thumbnail` and `playVideo` endpoints |
| admin            | `AdminService.refreshWatchedVideos` for recalculation  |
| jobs             | `JobService.autocomplete` for job assignment           |

---

## 5. Cross-Module Dependency Map

```
supportTicket
  --> SupportTicketService (CRUD + addComment)
  --> SupportCategoryService (getAllGrouped)

video
  --> VideoService (CRUD)
  --> VideoCategoryService (autocomplete)
  --> userVideoHistory/player.js (watch tracking)

videoLibrary
  --> VideoLibraryService (getLibrary, submitWatchTime)
  --> VideoCategoryService (thumbnail, playVideo)
  --> userVideoHistory/player.js (watch tracking)

videoCategory
  --> VideoCategoryService (CRUD + addVideo, addStream, getVideos, deleteVideo, uploadFile, thumbnail)
  --> JobService (autocomplete)
  --> AdminService (refreshWatchedVideos)
```

### Shared Dependencies

| Dependency                   | Used By                          |
|------------------------------|----------------------------------|
| `VideoCategoryService`       | video, videoLibrary, videoCategory |
| `video.js` player            | video, videoLibrary              |
| `peertube-player.min.js`     | video, videoLibrary              |
| `userVideoHistory/player.js` | video, videoLibrary              |
| `video-js.css`               | video, videoLibrary              |
| `HugeUploader.js`            | videoCategory only               |
| `SupportCategoryService`     | supportTicket only               |

---

## 6. Data Model Summary (inferred from UI)

### SupportTicket
```
{
  id: number,
  ticketNumber: string,
  title: string,          // auto-composed from category chain
  queue: string,          // from category
  prio: enum(VERYLOW, LOW, NORMAL, HIGH, CRITICAL),
  state: string,          // displayed in grid, not editable in form
  body: string,
  comments: [{
    dateCreated: datetime,
    subject: string,
    from: string,
    to: string,
    body: string
  }]
}
```

### Video
```
{
  id: number,
  path: string,           // URL or file path
  previewImage: string,   // preview image URL
  title: string,
  lengthInSeconds: number,
  category: { id, title },  // reference to VideoCategory
  description: string,
  type: enum(VIDEO, STREAM)  // determines player type
}
```

### VideoCategory
```
{
  id: number,
  title: string,
  description: string,
  priority: number,
  parentCategory: { id, title },  // self-referential
  thumbnail: file/blob,
  jobs: [{ code: string }],       // job assignments
  children: VideoCategory[],      // nested categories (library tree)
  videos: [{
    id: number,
    title: string,
    description: string,
    previewUrl: string,
    path: string,
    length: number,
    type: enum(VIDEO, STREAM, PDF),
    seen: boolean
  }],
  totalTime: number,              // seconds, for humantime display
  seen: boolean                   // all videos watched flag
}
```

### SupportCategory (from SupportCategoryService.getAllGrouped)
```
{
  title: string,
  queue: string,
  subcategories: [{
    title: string,
    queue?: string,
    subcategories?: [string | { title, queue?, subcategories? }]
  }]
}
```

---

## 7. Video Content Types

| Type     | Player            | URL Pattern                                               | Tracking               |
|----------|-------------------|-----------------------------------------------------------|------------------------|
| `VIDEO`  | video.js          | `/get/VideoCategoryService/playVideo/{id}/video.mp4`      | sessionId via player.js |
| `STREAM` | iframe            | `{path}?api=1` (external, e.g. PeerTube/YouTube embed)   | sessionId via data attr |
| `PDF`    | browser tab       | `/get/VideoCategoryService/playVideo/{id}/pdf.pdf`        | `submitWatchTime` immediate |

---

## 8. Wireframe ASCII Representations

### W1: Support Ticket (Grid + Create Dialog + View Modal)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header-bg] Support Tickets                                      │
├─────────────────────────────────────────────────────────────────┤
│ [+ Add]  [👁 View Ticket]                                        │
├──────┬──────────┬─────────────────┬───────────┬──────┬──────────┤
│ ID   │ TicketNo │ Title           │ Queue     │ Prio │ State    │
├──────┼──────────┼─────────────────┼───────────┼──────┼──────────┤
│ 1    │ TKT-001  │ Billing—Invoice │ Billing   │ HIGH │ OPEN     │
│ 2    │ TKT-002  │ Video issues    │ TechSupp  │ NORM │ CLOSED   │
└──────┴──────────┴─────────────────┴───────────┴──────┴──────────┘
  Showing 2 of 18 tickets                              [1]

┌─── Create Ticket (600px dialog) ────────────────────────────────┐
│ Category L1 ▼  →  Category L2 ▼  →  Category L3 ▼              │
│ [cascade: level 1 → 2 → 3]                                      │
│                                                                  │
│ Title [RO] [auto: concat(cat1, cat2, cat3)]                     │
│ ┌──────────────────────────────────────────────────┐             │
│ │ Billing — Invoice — Missing Payment              │             │
│ └──────────────────────────────────────────────────┘             │
│ Queue [RO]                  Priority                             │
│ ┌──────────────────┐       ┌──────────────────┐                 │
│ │ Billing Support  │       │ HIGH           ▼ │                 │
│ └──────────────────┘       └──────────────────┘                 │
│ Body                                                             │
│ ┌──────────────────────────────────────────────────┐             │
│ │ Describe your issue...                           │             │
│ └──────────────────────────────────────────────────┘             │
│                                       [Cancel] [Submit]          │
└──────────────────────────────────────────────────────────────────┘

┌─── View Ticket (800px modal) ───────────────────────────────────┐
│ TKT-001 — Billing — Invoice — Payment            [i]             │
│ Queue: Billing Support  | Prio: HIGH  | State: OPEN             │
├──────────────────────────────────────────────────────────────────┤
│ Description                                                      │
│ I submitted a payment for Invoice #1234...                       │
│                                                                  │
│ Comments [repeats] (2)                                           │
│ ┌────────────────────────────────────────────────────────┐       │
│ │ 2024-03-18 10:30 | support@academy.com                │       │
│ │ We have located your payment...                        │       │
│ ├────────────────────────────────────────────────────────┤       │
│ │ 2024-03-19 14:15 | finance@academy.com                │       │
│ │ Payment confirmed. Invoice updated to PAID.            │       │
│ └────────────────────────────────────────────────────────┘       │
│ Reply                                                            │
│ ┌────────────────────────────────────────────────────────┐       │
│ │ Type your reply...                                     │       │
│ └────────────────────────────────────────────────────────┘       │
│                                              [Send Reply]        │
└──────────────────────────────────────────────────────────────────┘
```

### W2: Video Management (Grid + Detail Panel)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header-bg] Video Management                                     │
├─────────────────────────────────────────────────────────────────┤
│ [+ Add]  [✏ Edit]  [🗑 Delete]  │  [▶ Watch]                    │
├────┬──────────────────┬─────┬──────────┬──────┬─────────┬───────┤
│ ID │ Path             │ Prev│ Title    │ Dur  │ Category│ Desc  │
├────┼──────────────────┼─────┼──────────┼──────┼─────────┼───────┤
│ 1  │ /videos/intro.mp4│ [📷]│ Intro    │ 04:32│ Training│ Basic │
│ 2  │ https://stream.. │ [📷]│ Live Sess│ LIVE │ Webinar │ Live  │
└────┴──────────────────┴─────┴──────────┴──────┴─────────┴───────┘

┌─── Detail Panel (600px dialog) ─────────────────────────────────┐
│ Video — Introduction                                    [×]      │
├──────────────────────────────────────────────────────────────────┤
│ Path                           Preview Image                     │
│ ┌────────────────────┐        ┌──────────────┐                  │
│ │ /videos/intro.mp4  │        │ preview.jpg  │                  │
│ └────────────────────┘        └──────────────┘                  │
│ Title                          Duration (sec)                    │
│ ┌────────────────────┐        ┌──────────────┐                  │
│ │ Introduction       │        │ 272          │                  │
│ └────────────────────┘        └──────────────┘                  │
│ Category @shadcn/combobox                                        │
│ ┌──────────────────┐                                            │
│ │ Training       ▼ │                                            │
│ └──────────────────┘                                            │
│ Description @shadcn/textarea                                     │
│ ┌────────────────────────────────────────────────────────┐       │
│ │ Basic intro video for new users                        │       │
│ └────────────────────────────────────────────────────────┘       │
│ ┌─ Player Type Annotations ──────────────────────────────┐       │
│ │ [cond: video.type === VIDEO] → video.js player 800px   │       │
│ │ [cond: video.type === STREAM] → iframe player 1200px   │       │
│ └────────────────────────────────────────────────────────┘       │
│                                       [Cancel] [Save]            │
└──────────────────────────────────────────────────────────────────┘
```

### W3: Video Library (Card Browsing)

```
┌─────────────────────────────────────────────────────────────────┐
│ [← Back] [Header-bg] Video Library                               │
├─────────────────────────────────────────────────────────────────┤
│ Categories                                                       │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐     │
│ │   [📁 folder]   │ │   [📁 folder]   │ │   [📁 folder]   │     │
│ │                 │ │                 │ │                 │     │
│ │ Training Basics │ │ Advanced Topics │ │ Safety Protocols│     │
│ │ 45 min [3/5 ✓] │ │ 1h20 [1/8 ⚠]  │ │ 30 min [4/4 ✓] │     │
│ │     [View]      │ │     [View]      │ │     [View]      │     │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘     │
│─────────────────────────────────────────────────────────────────│
│ Videos — Training Basics                                         │
│ ┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐     │
│ │    [▶ play]     │ │    [▶ play]     │ │    [▶ play]     │     │
│ │                 │ │                 │ │                 │     │
│ │ Introduction    │ │ Setup Guide     │ │ Best Practices  │     │
│ │ 04:32   ✓      │ │ 12:15           │ │ 08:45           │     │
│ │   [▶ Play]     │ │   [▶ Play]     │ │   [▶ Play]     │     │
│ └─────────────────┘ └─────────────────┘ └─────────────────┘     │
│                                                                  │
│ [hash: #CATEGORYID;SUBCATEGORY:VIDEOID:POSITION]                │
│ [async: periodic submitWatchTime via sessionId]                  │
│ Players: VIDEO (video.js), STREAM (iframe), PDF (new tab)       │
└─────────────────────────────────────────────────────────────────┘
```

### W4: Video Category Management (Grid + Detail + Upload Dialog)

```
┌─────────────────────────────────────────────────────────────────┐
│ [Header-bg] Video Categories                                     │
├─────────────────────────────────────────────────────────────────┤
│ [+ Add] [✏ Edit] [🗑 Delete] [📹 Videos] [🔄 Recalculate]      │
├────┬──────────────────┬──────────────────────────┬──────────────┤
│ ID │ Title            │ Description              │ Priority     │
├────┼──────────────────┼──────────────────────────┼──────────────┤
│ 1  │ Training Basics  │ Fundamental training...  │ 1            │
│ 2  │ Advanced Topics  │ In-depth coverage...     │ 2            │
└────┴──────────────────┴──────────────────────────┴──────────────┘

┌─── Detail Form ─────────────────────────────────────────────────┐
│ Title                  Parent Category        Priority           │
│ ┌────────────────┐    ┌──────────────┐      ┌────┐             │
│ │ Category Title │    │ None (root)▼ │      │ 1  │             │
│ └────────────────┘    └──────────────┘      └────┘             │
│ Thumbnail              Description                               │
│ ┌──────┐ [⬆ Upload]   ┌────────────────────────────────┐        │
│ │ [🖼] │              │ Category description...         │        │
│ └──────┘              └────────────────────────────────┘        │
│ Jobs [repeats]                                                   │
│ ┌──────────────────────────────────────────────────┐             │
│ │ [🔍 Search jobs...]                              │             │
│ │ [Nurse ×] [Doctor ×] [Admin ×]                   │             │
│ └──────────────────────────────────────────────────┘             │
│                                     [💾 Save] [Cancel]           │
├──────────────────────────────────────────────────────────────────┤
│  Add Video / Stream (dialog)                                     │
│ ┌── Upload Video ──────┬── Add Stream ─────────────────┐         │
│ │ [📄 Choose file...]  │ Title ┌──────────────────┐   │         │
│ │                      │       │ Stream title...  │   │         │
│ │ [████████░░] 67%     │       └──────────────────┘   │         │
│ │ [chunked: 3MB]       │ Length ┌──────────────────┐  │         │
│ │ [Pause] [Cancel]     │        │ 360              │  │         │
│ │                      │        └──────────────────┘  │         │
│ │                      │ Desc  ┌──────────────────┐   │         │
│ │                      │       │ Stream desc...   │   │         │
│ │                      │       └──────────────────┘   │         │
│ │                      │ Preview URL ┌────────────┐   │         │
│ │                      │             │ https://.. │   │         │
│ │                      │             └────────────┘   │         │
│ │                      │ Stream URL  ┌────────────┐   │         │
│ │                      │             │ https://.. │   │         │
│ │                      │             └────────────┘   │         │
│ │                      │              [Add]           │         │
│ └──────────────────────┴──────────────────────────────┘         │
│ Videos in Category                                               │
│ [🖼] Introduction to Basics                        [🗑]          │
│ [🖼] Advanced Entry Stream                         [🗑]          │
└──────────────────────────────────────────────────────────────────┘
```

See [`specs/wireframes/academy/workflows.md#wireframe-screenshots`](../../wireframes/academy/workflows.md#wireframe-screenshots) for rendered wireframe screenshots.
