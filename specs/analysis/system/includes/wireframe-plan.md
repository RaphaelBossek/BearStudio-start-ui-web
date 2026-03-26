# Wireframe Creation Plan — Includes Module

> Target directory: `specs/wireframes/includes/`

## Prerequisites

1. Both analysis documents in `specs/analysis/includes/` are reviewed
2. Pencil MCP server available
3. Style guide obtained via `get_guidelines(topic="web-app")`

## Wireframe Inventory

| ID | Wireframe | Source doc(s) | Complexity | Description |
|:---|:---|:---|:---|:---|
| W1 | `includes-navbar.pen` | 01 | Low | Dynamic nav bar with buttons, role gating, filter toggle |
| W2 | `includes-loading-states.pen` | 01 | Low | Preloader (gooey dots), siteloader (spinner + progress), job status (progress modal) |
| W3 | `includes-quick-filter.pen` | 01 | Low | A-Z filter bar: full mode (individual) + short mode (grouped) + search input |
| W4 | `includes-login.pen` | 02 | Medium | Login page: credentials form, TOTP 2FA step (QR + digit input), password reset flow |
| W5 | `includes-bug-report.pen` | 02 | Medium | Bug report dialog: screen capture with annotation tools, description form |
| W6 | `includes-color-palette.pen` | 02 | Low | Visual reference: 14 entity colors + state color mappings |

## Key Design Notes

- **Navbar** is already implemented in modern UI as sidebar — wireframe is for legacy reference only
- **Login** has 3 flows: standard → TOTP 2FA onboarding (QR code) → password reset — should be wireframed as a flow
- **Bug report** has a canvas overlay for screenshot annotation — draw rectangles + freehand + color picker
- **Color palette** wireframe is a visual reference card, not a UI component

## Annotation Legend

| Annotation | Meaning |
|:---|:---|
| `[HARDCODED]` | Needs i18n key |
| `[already-migrated]` | Component already exists in modern UI |
| `[framework]` | Part of corinis:webCore, needs modern equivalent |
