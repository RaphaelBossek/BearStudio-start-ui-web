# Common Acceptance Criteria

## Summary
The rate limiting system must effectively throttle excessive requests while providing clear feedback to the client and ensuring system stability.

## Specific Criteria
- [ ] **HTTP 429 Response:** All throttled requests must return a 429 status code.
- [ ] **Retry-After Header:** The response must include a `Retry-After` header with the number of seconds to wait.
- [ ] **IP-Based Tracking:** Unauthenticated requests are tracked by the `x-forwarded-for` header or direct IP.
- [ ] **User-Based Tracking:** Authenticated requests are tracked by the User ID, regardless of the IP address.
- [ ] **Sliding Window:** Limits are calculated using a sliding window to prevent "bursting" at the edge of fixed intervals.
- [ ] **Monitoring/Logging:** Every throttled request is logged with the reason and identifier (IP/User) for security monitoring.
- [ ] **Fail-Open:** If the rate limit store (Redis) is unreachable, the system allows the request to proceed (logged as an error).

## ISO/IEC 25010 Verification
- **Security:** Does the system effectively prevent brute-force attacks on auth endpoints? (Tested via automated scripts).
- **Functional Suitability:** Are the limits applied correctly as configured in the oRPC procedures?
- **Performance Efficiency:** Does the rate limiting check add less than 10ms of overhead to standard requests?
- **Reliability:** Does the system handle Redis failures gracefully without crashing the whole application?

## Further Suggestions
- **Further Suggestions for Acceptance Criteria:** Consider implementing an "allowlist" for trusted internal services or specific administrative IPs.
- **Further Suggestions for Hypotheses:** Explore using Vercel's KV or Edge Config for even lower latency rate limiting if Upstash becomes a bottleneck.
