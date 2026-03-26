# Wireframe Creation Plan — Notification Module

> Target directory: `specs/wireframes/notification/`

## Prerequisites

1. Analysis document `specs/analysis/notification/01-notification.md` is reviewed
2. Pencil MCP server available
3. Style guide obtained via `get_guidelines(topic="web-app")`

## Wireframe Inventory

| ID | Wireframe | Complexity | Description |
|:---|:---|:---|:---|
| W1 | `notification-list.pen` | Medium | Inbox list with grid, toolbar (year/month), inline message detail with markdown body |
| W2 | `notification-compose.pen` | Low-Medium | Two compose variants: single recipient (autocomplete + subject + message) and bulk (user checklist + subject + message) |
| W3 | `notification-send-message.pen` | Low | Dashboard-included quick compose: subject + recipient + message |

## Key Design Notes

- Message body supports **Markdown rendering** — wireframe should annotate `[markdown]`
- Bulk compose has a **two-column layout**: user list with search/filter (left) + message form (right)
- Folder navigation: INBOX → SENT → TRASH (toggle via toolbar)
- Important flag shown as star/exclamation icon in grid

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `[markdown]` | Markdown-rendered content |
| `[ADMIN]` | ADMIN role required |
| `[HARDCODED]` | Needs i18n key |
