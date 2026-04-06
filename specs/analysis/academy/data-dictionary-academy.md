---
title: 'Data Dictionary Academy'
---

# Data Dictionary: Academy

## Support Ticket (supportTicket)

### Grid Columns

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `text` | `number` | *Workflow: SupportTicketService.getAll* | ID | ID |
| `ticketNumber` | `text` | `string` | *Workflow: SupportTicketService.getAll* | Nummer | Number |
| `title` | `text` | `string` | *Workflow: SupportTicketService.getAll* | Betreff | Subject |
| `queue` | `text` | `string` | *Workflow: SupportTicketService.getAll* | Warteschlange | Queue |
| `prio` | `text` | `enum` | *Workflow: SupportTicketService.getAll* | Prioritaet | Priority |
| `state` | `text` | `string` | *Workflow: SupportTicketService.getAll* | Status | State |

### Detail Panel (Create / Edit)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `subjectListStart` | `<select>` | `string` | *Workflow: SupportCategoryService.getAllGrouped* | - | - |
| `subjectList2` | `<select>` | `string` | *Workflow: chained select* | - | - |
| `subjectListDone` | `<select>` | `string` | *Workflow: chained select* | - | - |
| `data.title` | `<input>` | `string` | *Workflow: SupportTicketService.create* | Betreff | Subject |
| `data.queue` | `<input>` | `string` | *Workflow: SupportTicketService.create* | - | - |
| `data.prio` | `<select>` | `enum(VERYLOW, LOW, NORMAL, HIGH, CRITICAL)` | *Workflow: SupportTicketService.create* | Prioritaet | Priority |
| `data.body` | `<textarea>` | `string` | *Workflow: SupportTicketService.create* | Nachricht | Message / Body |

### View Dialog (Modal)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `data.title` | `<h5>` | `string` | *Workflow: SupportTicketService.get* | - | - |
| `data.prio` | `<span>` | `enum` | *Workflow: SupportTicketService.get* | - | - |
| `data.body` | `<div>` | `string` | *Workflow: SupportTicketService.get* | - | - |
| `comments.dateCreated` | `<span>` | `datetime` | *Workflow: SupportTicketService.get* | - | - |
| `comments.subject` | `<span>` | `string` | *Workflow: SupportTicketService.get* | - | - |
| `comments.from` | `<span>` | `string` | *Workflow: SupportTicketService.get* | - | - |
| `comments.to` | `<span>` | `string` | *Workflow: SupportTicketService.get* | - | - |
| `comments.body` | `<div>` | `string` | *Workflow: SupportTicketService.get* | - | - |
| `newComment` | `<textarea>` | `string` | *Workflow: SupportTicketService.addComment* | - | - |

## Video (video)

### Grid Columns

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `text` | `number` | [`video._id`](../mongodb-mapping/academy.md#entity-videos) | ID | ID |
| `path` | `text` | `string` | [`video.path`](../mongodb-mapping/academy.md#entity-videos) | Pfad | Path |
| `previewImage` | `text` | `string` | [`video.preview`](../mongodb-mapping/academy.md#entity-videos) | Vorschaubild | Preview Image |
| `title` | `text` | `string` | [`video.name`](../mongodb-mapping/academy.md#entity-videos) | Titel | Title |
| `lengthInSeconds` | `text` | `number` | [`video.lengthInSeconds`](../mongodb-mapping/academy.md#entity-videos) | Laenge (in Sekunden) | Length (in seconds) |
| `category` | `text` | `reference:VideoCategory` | [`video.category`](../mongodb-mapping/academy.md#entity-videos) | Kategorie | Category |
| `description` | `text` | `string` | *Workflow: implicit/computed* | Beschreibung | Description |

### Detail Panel (Create / Edit)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `data.path` | `<input>` | `string` | [`video.path`](../mongodb-mapping/academy.md#entity-videos) | Pfad | Path |
| `data.previewImage` | `<input>` | `string` | [`video.preview`](../mongodb-mapping/academy.md#entity-videos) | Vorschaubild | Preview Image |
| `data.title` | `<input>` | `string` | [`video.name`](../mongodb-mapping/academy.md#entity-videos) | Titel | Title |
| `data.lengthInSeconds` | `<input>` | `number` | [`video.lengthInSeconds`](../mongodb-mapping/academy.md#entity-videos) | Laenge (in Sekunden) | Length (in seconds) |
| `data.category` | `<input>` (autocomplete) | `reference:VideoCategory` | [`video.category`](../mongodb-mapping/academy.md#entity-videos) | Kategorie | Category |
| `data.description` | `<textarea>` | `string` | *Workflow: implicit/computed* | Beschreibung | Description |

## Video Library (videoLibrary)

### Category Cards (`#categoryList`)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `thumbnail` | `<img>` | `image` | [`videoCategory.thumbnail`](../mongodb-mapping/academy.md#entity-video-categories) | - | - |
| `children.title` | `<span>` | `string` | [`videoCategory.title`](../mongodb-mapping/academy.md#entity-video-categories) | - | - |
| `children.totalTime` | `<span>` | `number` | *Workflow: Computed total time* | - | - |
| `children.description` | `<p>` | `string` | [`videoCategory.description`](../mongodb-mapping/academy.md#entity-video-categories) | - | - |
| `pojo.seen` | `<i>` | `boolean` | *Workflow: Computed (has seen all)* | - | - |

### Video Cards (`#videoList`)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `thumbnail` | `<img>` | `image` | [`video.preview`](../mongodb-mapping/academy.md#entity-videos) | - | - |
| `videos.title` | `<span>` | `string` | [`video.name`](../mongodb-mapping/academy.md#entity-videos) | - | - |
| `videos.length` | `<span>` | `number` | [`video.lengthInSeconds`](../mongodb-mapping/academy.md#entity-videos) | - | - |
| `videos.description` | `<p>` | `string` | *Workflow: Computed/API* | - | - |
| `pojo.seen` | `<i>` | `boolean` | *Workflow: Computed* | - | - |

## Video Category (videoCategory)

### Grid Columns

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `text` | `number` | [`videoCategory._id`](../mongodb-mapping/academy.md#entity-video-categories) | ID | ID |
| `title` | `text` | `string` | [`videoCategory.title`](../mongodb-mapping/academy.md#entity-video-categories) | Titel | Title |
| `description` | `text` | `string` | [`videoCategory.description`](../mongodb-mapping/academy.md#entity-video-categories) | Beschreibung | Description |
| `priority` | `text` | `number` | *Workflow: Implicit field* | Prioritaet | Priority |

### Detail Panel (Create / Edit)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `data.title` | `<input>` | `string` | [`videoCategory.title`](../mongodb-mapping/academy.md#entity-video-categories) | Titel | Title |
| `data.parentCategory` | `<input>` (autocomplete) | `reference:VideoCategory` | [`videoCategory.parent`](../mongodb-mapping/academy.md#entity-video-categories) | Uebergeordnete Kategorie | Parent Category |
| `data.priority` | `<input>` | `number` | *Workflow: VideoCategoryService.update* | Prioritaet | Priority |
| `data.thumbnail` | `<input type="file">` | `file` | [`videoCategory.thumbnail`](../mongodb-mapping/academy.md#entity-video-categories) | Vorschaubild | Thumbnail |
| `data.id` (preview) | `<img>` | `image` | [`videoCategory._id`](../mongodb-mapping/academy.md#entity-video-categories) | - | - |
| `data.description` | `<textarea>` | `string` | [`videoCategory.description`](../mongodb-mapping/academy.md#entity-video-categories) | Beschreibung | Description |
| `data.jobs` (insert) | `<input>` (autocomplete) | `reference:Job` | *Workflow: VideoCategoryService.update* | Job | Job |
| `data.jobs` (list) | `collection` | `array` | *Workflow: VideoCategoryService.update* | - | - |

### Add Video/Stream Dialog (`#addVideoToCategory`)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `videoUpload` | `<input type="file">` | `file` | *Workflow: VideoCategoryService.uploadFile* | Upload | Upload |
| `data.title` | `<input>` | `string` | *Workflow: VideoCategoryService.addStream* | Titel | Title |
| `data.lengthInSeconds` | `<input>` | `number` | *Workflow: VideoCategoryService.addStream* | Laenge (in s) | Length (in s) |
| `data.description` | `<input>` | `string` | *Workflow: VideoCategoryService.addStream* | Beschreibung | Description |
| `data.previewPath` | `<input>` | `string` | *Workflow: VideoCategoryService.addStream* | Vorschau URL | Preview URL |
| `data.path` | `<input>` | `string` | *Workflow: VideoCategoryService.addStream* | URL | URL |
| `data.videos` | `collection` | `array` | *Workflow: VideoCategoryService.deleteVideo* | - | - |

## User Video History (userVideoHistory)

### Grid Columns

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `text` | `number` | [`userVideoHistory._id`](../mongodb-mapping/academy.md#entity-user-video-history) | ID | ID |
| `user` | `text` | `reference:User` | [`userVideoHistory.user`](../mongodb-mapping/academy.md#entity-user-video-history) | Benutzer | User |
| `video` | `text` | `reference:Video` | [`userVideoHistory.video`](../mongodb-mapping/academy.md#entity-user-video-history) | Video | Video |
| `dateStart` | `text` | `datetime` | [`userVideoHistory.dateStart`](../mongodb-mapping/academy.md#entity-user-video-history) | Startdatum | Start Date |
| `dateLast` | `text` | `datetime` | [`userVideoHistory.dateLast`](../mongodb-mapping/academy.md#entity-user-video-history) | Letztes Datum | Last Date |
| `timeWatched` | `text` | `number` | [`userVideoHistory.timeWatched`](../mongodb-mapping/academy.md#entity-user-video-history) | Ansichtszeit | Time Watched |
| `dateDone` | `text` | `datetime` | *Workflow: implicit/computed* | Abschlussdatum | Done Date |
| `sessions` | `text` | `number` | [`userVideoHistory.sessions`](../mongodb-mapping/academy.md#entity-user-video-history) | Sitzungen | Sessions |

### Detail Panel (Create / Edit)

| UI Field / Label | UI Element | Abstract Type | DB Collection.Field | German | English |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `data.video` | `autocomplete` | `reference:Video` | [`userVideoHistory.video`](../mongodb-mapping/academy.md#entity-user-video-history) | Video | Video |
| `data.dateStart` | `<input type="date">` | `datetime` | [`userVideoHistory.dateStart`](../mongodb-mapping/academy.md#entity-user-video-history) | Startdatum | Start Date |
| `data.dateLast` | `<input type="date">` | `datetime` | [`userVideoHistory.dateLast`](../mongodb-mapping/academy.md#entity-user-video-history) | Letztes Datum | Last Date |
| `data.timeWatched` | `<input type="number">` | `number` | [`userVideoHistory.timeWatched`](../mongodb-mapping/academy.md#entity-user-video-history) | Ansichtszeit | Time Watched |
| `data.dateDone` | `<input type="date">` | `datetime` | *Workflow: implicit/computed* | Abschlussdatum | Done Date |
