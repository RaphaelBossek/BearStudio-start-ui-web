---
title: 'User Video History'
---

## Cross-References

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| split | **Sibling** | Same source: `utility/worklog-templates-files.md` | [Worklog](../../accounting/worklog/worklog.md) | Section 1 (Worklog) extracted to sibling |
| split | **Sibling** | Same source: `utility/worklog-templates-files.md` | [Invoice Receiver](../../accounting/invoice-receiver/invoice-receiver.md) | Section 6 (Invoice Receiver) extracted to sibling |
| split | **Sibling** | Same source: `utility/worklog-templates-files.md` | [Templates Files](../../system/templates-files/templates-files.md) | Sections 2–4 (Export/Notification/User File) extracted to sibling |

> **Split origin:** This file and [Worklog](../../accounting/worklog/worklog.md), [Invoice Receiver](../../accounting/invoice-receiver/invoice-receiver.md), and [Templates Files](../../system/templates-files/templates-files.md) were all extracted from `utility/worklog-templates-files.md`. This file covers User Video History (sections 5, 7, 8).

### Source Includes

| Type | Direction | Detail | Linked Document | Condition / Context |
|------|-----------|--------|-----------------|---------------------|
| include | **Sibling** | `video.js` player | [Support And Video](./support-and-video.md) | Video.js player shared across video, videoLibrary, and userVideoHistory modules |
| include | **Sibling** | `peertube-player.min.js` | [Support And Video](./support-and-video.md) | PeerTube integration loaded by video and videoLibrary |
| include | **Sibling** | `userVideoHistory/player.js` | [Support And Video](./support-and-video.md) | Watch tracking script included by video and videoLibrary |
| include | **Sibling** | `HugeUploader.js` | [Support And Video](./support-and-video.md) | Chunked upload (3MB chunks); used by videoCategory module |

---

> **Include context:** `video.js`, `peertube-player.min.js`, and `userVideoHistory/player.js` are shared libraries loaded by both the video/videoLibrary modules (documented in [Support And Video](./support-and-video.md)) and this file's user video history tracking. HugeUploader.js is used for chunked video uploads in the videoCategory module.

---

## 5. User Video History (`userVideoHistory/`)

### 5.1 Overview

CRUD management for video viewing history. Service: `UserVideoHistoryService`. Includes a video player dialog using Video.js and PeerTube integration.

### 5.2 Grid Columns

| # | Field | Name | Sortable | Width | Formatter | Notes |
|---|---|---|---|---|---|---|
| 1 | `id` | `{{i18n.label.id}}` | Yes | 80 | -- | |
| 2 | `user` | `{{i18n.user}}` | Yes | 150 | `Formatter.name` | User who watched |
| 3 | `video` | `{{i18n.video}}` | Yes | 200 | `Formatter.name` | Video entity |
| 4 | `dateStart` | `{{i18n.action.dateStart}}` | Yes | 120 | `Formatter.dateTime` | When viewing started |
| 5 | `dateLast` | `{{i18n.action.dateLast}}` | Yes | 120 | `Formatter.dateTime` | Last activity timestamp |
| 6 | `timeWatched` | `{{i18n.action.timeWatched}}` | Yes | 120 | -- | Raw value (ms or seconds) |
| 7 | `dateDone` | `{{i18n.action.dateDone}}` | Yes | 120 | `Formatter.dateTime` | Completion date |
| 8 | `sessions` | `{{i18n.userVideoHistory.sessions}}` | Yes | 80 | `Formatter.count` | Number of viewing sessions |

### 5.3 Form Elements (Detail Panel)

| # | Field Name | Label | Type | Required | Notes |
|---|---|---|---|---|---|
| 1 | `data.video` | `{{i18n.video}}` | autocomplete object | -- | `VideoService.autocomplete`; icon: `fa-video` |
| 2 | `data.dateStart` | `{{i18n.action.dateStart}}` | date input | -- | Icon: `fa-calendar-alt` |
| 3 | `data.dateLast` | `{{i18n.action.dateLast}}` | date input | -- | Icon: `fa-calendar-alt` |
| 4 | `data.timeWatched` | `{{i18n.action.timeWatched}}` | number input | -- | Icon: `fa-clock` |
| 5 | `data.dateDone` | `{{i18n.action.dateDone}}` | date input | -- | Icon: `fa-calendar-alt` |

### 5.4 Click Actions

| # | Action ID | Symbol | Title | English | Notes |
|---|---|---|---|---|---|
| 1 | `addMenuBtn` | `plus-square` | `action.add` | Add | |
| 2 | `editMenuBtn` | `pencil` | `action.change` | Edit | Initially disabled |
| 3 | `deleteMenuBtn` | `trash` | `action.delete` | Delete | Initially disabled |
| 4 | `watchVideoBtn` | `lock-alt` | Watch | Watch Video | Initially disabled; enabled on row select |

### 5.5 Special Components

| Component | Description | Implementation |
|---|---|---|
| Video Player Dialog | Modal with Video.js player | `#watchVideoDlg`, 800px wide, video-js element 640px |
| Video.js Player | HTML5 video player | ID: `videoPlayer`; source loaded dynamically via `VideoService.get` |
| Watch Time Tracking | Periodic tracking of viewed duration | `calculateAndSubmitWatchTime` every 20s + on pause/end; calls `VideoLibraryService.submitWatchTime` |
| PeerTube Integration | Support for PeerTube-hosted videos | `initPeerTube()` listens for `playbackStatusUpdate`, calculates `pos.watched`, submits every ~20 events |
| Session ID | Unique identifier per viewing session | Generated as `Date.now() + ""` on `watchVideoBtn` click |
| Auto-pause | Pauses video when dialog hidden | 1s interval checks if `#videoPlayer` is hidden, calls `player.pause()` |

### 5.6 Translation Table

| Text-Reference | German | English | Notes |
|---|---|---|---|
| `i18n.userVideoHistory` | Video-Verlauf | Video History | Panel title |
| `i18n.user` | Benutzer | User | |
| `i18n.video` | Video | Video | |
| `i18n.action.dateStart` | Startdatum | Start Date | |
| `i18n.action.dateLast` | Letztes Datum | Last Date | |
| `i18n.action.timeWatched` | Ansichtszeit | Time Watched | |
| `i18n.action.dateDone` | Abschlussdatum | Done Date | |
| `i18n.userVideoHistory.sessions` | Sitzungen | Sessions | |
| "Watch Video" | Watch Video | Watch Video | HARDCODED in dialog title |
| "To view this video..." | (English only) | To view this video please enable JavaScript... | HARDCODED fallback text |

---

## 7. Summary of Cross-Module Dependencies (User Video History)

```
userVideoHistory
    |-- UserVideoHistoryService      (CRUD)
    |-- VideoService                 (get video, autocomplete)
    |-- VideoLibraryService          (submitWatchTime)
    |-- Video.js                     (HTML5 player)
    |-- PeerTube Player API          (iframe-based streaming)
```

## 8. Shared Patterns Across All Modules

| Pattern | Description | Used In |
|---|---|---|
| `Core.initCrud` | Standard CRUD initialization (grid + detail + service) | All 6 modules |
| `slickerGrid` | jQuery grid plugin with data service binding | All 6 modules |
| `Core.hasLoaded` | Guard against duplicate initialization | All 6 modules |
| `saveSettings` | Persist grid column settings via `UserService.saveSetting` | All 6 modules |
| `data-formatter` | Declarative column formatting in HTML grid definitions | All 6 modules |
| `Formatter.name` | Display `.name` property of object fields | worklog, userVideoHistory, invoiceReceiver |
| `Formatter.dateTime` | Date/time formatting | userFile, userVideoHistory, invoiceReceiver |
| `Formatter.bool` | Boolean display (checkmark/cross) | exportTemplate, userFile |
| `Formatter.currency` | Currency formatting | worklog |
| `jsForm` | jQuery form data binding (fill/getData) | exportTemplate, invoiceReceiver |
| `Dialog.init` / `Dialog.open` | Modal dialog management | worklog, invoiceReceiver, userVideoHistory |
