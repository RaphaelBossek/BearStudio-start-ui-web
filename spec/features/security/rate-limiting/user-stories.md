# Feature: Rate Limiting Implementation

## Status: Planned
**Created:** 2026-02-22
**Last Updated:** 2026-02-22

## Dependencies
- `src/server/orpc.ts`: Central oRPC configuration to integrate middleware.
- `src/server/auth.ts`: Identification of users for personalized limits.

## Timeline & Resources
- **Timeline:** 2-3 Days
- **Required Resources:** 1 Backend Engineer (oRPC/Nitro).

## Functional Requirements
- **FR-1:** Track requests by Client IP address (default).
- **FR-2:** Track requests by User ID (authenticated users).
- **FR-3:** Implement a sliding window algorithm to avoid "burst" resets.
- **FR-4:** Return HTTP 429 (Too Many Requests) when limits are exceeded.
- **FR-5:** Include `Retry-After` header indicating when the user can try again.

## Technical Requirements
- **TR-1:** Create oRPC middleware to handle rate limiting for specific procedures.
- **TR-2:** Utilize `@upstash/ratelimit` for an efficient and distributed (Redis-backed) implementation.
- **TR-3:** Configure Nitro `routeRules` for global limits on non-oRPC endpoints (e.g., static/public assets).
- **TR-4:** Ensure zero latency impact for requests within limits (use asynchronous incrementing if possible, but blocking check for correctness).

## User Interface/Experience Requirements
- **UI-1:** Standardized error message for 429 errors (e.g., "Too many requests. Please try again in X seconds").

## User Stories

- **As a System Administrator, I want to protect sensitive authentication endpoints so that we can prevent automated brute-force attacks.**
    - **Acceptance Criteria**:
        - [ ] Login and password reset procedures have a strict limit (e.g., 5 attempts per 5 minutes per IP).
        - [ ] After exceeding the limit, subsequent attempts return a 429 status code.
        - [ ] The `Retry-After` header is correctly calculated and returned.
    - **Definition of Done** (ISO/IEC 25010):
        - Verified by automated security test.
        - Performance impact < 10ms for non-limited requests.

- **As a Developer, I want a reusable oRPC middleware for rate limiting so that I can easily apply different limits to different procedures.**
    - **Acceptance Criteria**:
        - [ ] Middleware can be applied globally or to specific procedure chains.
        - [ ] Limit and Window parameters are configurable per procedure.
        - [ ] Middleware correctly distinguishes between guests (IP-based) and users (ID-based).
    - **Definition of Done** (ISO/IEC 25010):
        - Code review passed for modularity and maintainability.
        - Unit tests for sliding window logic.

## Edge Cases
- **Shared IP Addresses:** How do we handle large organizations behind a single IP? (Mitigation: Use User ID when authenticated).
- **Client Clock Skew:** Does the sliding window rely on server-side time? (Must be server-side).
- **Redis Connection Failure:** What happens if the rate limit store (Upstash/Redis) is unavailable? (Strategy: Fail-open to avoid service disruption, but log a high-priority warning).

---
