# Feature: Sentry Integration for TanStack Start

## Status: In Progress
**Created:** 2026-02-22
**Last Updated:** 2026-02-22

## Dependencies
- `@sentry/tanstack-start-react` (Alpha/RC)
- `TanStack Start 1.0 RC` or later
- Sentry Account and DSN

## Timeline & Resources
- **Timeline:** 1-2 days (setup, configuration, validation)
- **Required Resources:** Sentry Project, Frontend/Backend Developer access to Vercel/CI secrets.

## Functional Requirements
- **Automatic Error Capture:** Capture all uncaught exceptions in client components, server functions, and server-side rendering (SSR) lifecycle.
- **Breadcrumbs:** Automatically collect user actions (clicks, navigation) and console logs before an error occurs.
- **Distributed Tracing:** Track request spans from client to TanStack Start server functions using Sentry's `tanstackRouterBrowserTracingIntegration`.
- **Session Replay:** Record user sessions for 100% of errors (Replay on Error) and a sample of successful sessions.
- **User Feedback:** Show a feedback widget when a crash occurs to allow users to provide context.

## Technical Requirements
- **Client Configuration:** Initialize Sentry in the client entry point with `browserTracingIntegration`, `replayIntegration`, and `feedbackIntegration`.
- **Server Configuration:** Initialize Sentry in the server entry point to capture errors in server functions.
- **Environment Variables:**
    - `SENTRY_DSN`: Public DSN for error reporting.
    - `SENTRY_AUTH_TOKEN`: Secret token for source map uploads in CI/CD.
- **Build Step:** Configure the Sentry Vite plugin (via `tanstack-start` configuration) to automatically upload source maps and delete them after upload.

## User Interface/Experience Requirements
- **Feedback Widget:** The Sentry User Feedback widget should be themed to match the application's brand (minimalist/professional).
- **Masking:** Ensure sensitive UI elements (e.g., medical records, password fields) are explicitly masked in Session Replays using `data-sentry-mask`.

## User Stories

### Story 1: Global Error Monitoring
**As a** Developer, **I want to** see all production errors in a centralized dashboard **so that** I can fix bugs before they impact more users.
- **Acceptance Criteria**:
    - [ ] Sentry captures errors in client-side React components.
    - [ ] Sentry captures errors in TanStack Start server functions (`createServerFn`).
    - [ ] Error reports include the URL, browser version, and stack trace with source maps.
- **Definition of Done** (ISO/IEC 9126):
    - Error reporting verified by triggering a test error.
    - Source maps correctly link to original `.ts`/`.tsx` files in Sentry.

### Story 2: Full Context Observability (Logs & Replays)
**As a** Developer, **I want to** see the console logs and a video replay of the user's session when an error occurs **so that** I don't have to guess the steps to reproduce.
- **Acceptance Criteria**:
    - [ ] Console logs (`log`, `warn`, `error`) are included as breadcrumbs in Sentry reports.
    - [ ] Session Replay is triggered automatically on every captured error (Replay on Error).
    - [ ] Replay includes DOM interactions, navigation events, and network request summaries.
- **Definition of Done**:
    - Replay successfully renders in the Sentry dashboard for a sample error.
    - Console logs are visible in the Sentry breadcrumb timeline.

### Story 3: Performance Tracing
**As a** Developer, **I want to** trace the journey of a request from the frontend to the server-side logic **so that** I can identify performance bottlenecks.
- **Acceptance Criteria**:
    - [ ] Traces are generated for page loads and client-side navigations.
    - [ ] Traces include the execution time of server functions called during the transaction.
- **Definition of Done**:
    - Distributed tracing view in Sentry shows a parent-child relationship between client and server spans.

### Story 4: Direct User Feedback
**As a** User, **I want to** be able to report what I was doing when an error occurred **so that** the support team can help me faster.
- **Acceptance Criteria**:
    - [ ] A feedback dialog appears automatically or is accessible via a link when an error occurs.
    - [ ] Submitted feedback is linked to the specific error event in Sentry.
- **Definition of Done**:
    - Feedback submission verified and visible in the Sentry "User Feedback" section.

## Edge Cases
- **Network Failure:** If the user is offline or Sentry's ingest endpoint is blocked (e.g., by an ad-blocker), the application should continue to function normally without console noise.
- **SSR Errors:** Errors occurring during the initial server-side render must be captured and reported to Sentry.
- **Incomplete Replay:** Replays might be truncated if the user closes the tab immediately after an error. Ensure `flush` is called if possible.
