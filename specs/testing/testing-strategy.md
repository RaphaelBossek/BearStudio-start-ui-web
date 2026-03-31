# Testing Strategy

> **Purpose**: Comprehensive testing approach for brownfield migration  
> **Date**: 2026-03-31  
> **Status**: Draft  
> **Audience**: Developers, QA Engineers, AI Agents

---

## Test Pyramid

```
         /\
        /  \    E2E Tests (10%)
       /----\   - Critical user journeys
      /      \  - AI generates drafts, humans review
     /--------\ 
    /          \ Integration Tests (30%)
   /            \ - API + component tests
  /--------------\ - AI + human collaboration
 /                \
/------------------\ 
Unit Tests (60%)
- Functions, hooks, utils
- AI autonomous, human spot-check
```

### Coverage Goals

| Domain | Unit | Integration | E2E | Total |
|--------|------|-------------|-----|-------|
| Appointments | 80% | 70% | 50% | 75% |
| Consultations | 80% | 70% | 60% | 75% |
| Dashboard | 70% | 60% | 40% | 65% |
| Administration | 75% | 65% | 50% | 70% |

---

## AI Agent Testing Guidelines

### When to Use Each Test Type

#### E2E Tests — AI as Observer

**Purpose**: Validate complete user workflows

**AI should write E2E tests when:**
- ✅ Validating complete user journeys (create → assign → complete)
- ✅ Testing integration points between modules
- ✅ Verifying state machine transitions end-to-end
- ✅ Checking permission gates in real UI context

**AI Prompt Example:**
```
Write an E2E test for the appointment assignment flow:
1. Admin creates appointment with date/time/location
2. System shows collision warning (Dr. Smith has overlap)
3. Admin resolves collision by setting state to RESERVE
4. Assigned expert receives notification
5. Expert accepts assignment
6. Appointment state changes to AGREED
```

**Limitations:**
- ❌ AI cannot reliably test visual UI (colors, spacing, alignment)
- ❌ AI struggles with timing-dependent tests (animations, debouncing)
- ⚠️ AI needs explicit context about user roles and permissions

---

#### Unit Tests — AI as Executor

**Purpose**: Validate individual functions in isolation

**AI should write unit tests when:**
- ✅ Testing pure functions (state transitions, calculations)
- ✅ Validating business logic (collision detection, pricing)
- ✅ Checking edge cases and boundary conditions
- ✅ Testing utility functions (date formatting, validation)

**AI Prompt Example:**
```
Write unit tests for AppointmentState.transition():

Function signature:
```typescript
function transition(
  currentState: AppointmentState,
  nextState: AppointmentState,
  context: TransitionContext
): ValidationResult
```

Test these scenarios:
- Valid transitions (READY → STARTED, STARTED → ACTIVE)
- Invalid transitions (READY → ARCHIVED, ACTIVE → READY)
- STORNO requires date/time in context
- CANCELED can only transition back to READY
```

**AI Advantages:**
- ✅ Exhaustive edge case coverage (AI never gets tired)
- ✅ Property-based test generation (fast-check, jsverify)
- ✅ Boundary condition testing (min/max values, empty arrays)

---

### Test Ownership Matrix

| Test Type | Owner | AI Role | Human Review Required |
|-----------|-------|---------|----------------------|
| **E2E Critical Paths** | QA Engineer | **Assistant** (generate drafts) | ✅ Always |
| **E2E Edge Cases** | AI Agent | **Primary** (autonomous) | ⚠️ Spot-check |
| **Unit Business Logic** | AI Agent | **Primary** (autonomous) | ⚠️ Spot-check |
| **Unit Utilities** | AI Agent | **Primary** (autonomous) | ❌ Optional |
| **Visual Regression** | Human | **None** | N/A |
| **Integration API** | AI + Human | **Collaborator** | ✅ Always |
| **Performance/Benchmarks** | Human | **Assistant** (generate data) | ✅ Always |

---

## E2E Test Scenarios

### Critical User Journeys (Priority 1)

These scenarios MUST have E2E tests, AI generates drafts, humans review:

#### 1. Appointment Lifecycle

```gherkin
Feature: Appointment Management
  As an admin
  I want to create and manage appointments
  So that experts can see their schedule

  Scenario: Create appointment with collision resolution
    Given I am logged in as admin
    When I navigate to Appointments
    And I click "Add Appointment"
    And I fill in:
      | Date       | 2026-04-15 |
      | Time Start | 09:00      |
      | Time End   | 10:00      |
      | Location   | Room A     |
      | Job        | CONSULT    |
    And I assign Dr. Smith
    And Dr. Smith already has an appointment at 09:00
    Then I see collision warning
    When I select "Reserve" for Dr. Smith
    And I save the appointment
    Then the appointment appears in MonthTable
    And Dr. Smith receives notification
    And appointment state is "READY"
```

#### 2. Consultation Workflow

```gherkin
Feature: Consultation Management
  As a therapist
  I want to create and transmit consultations
  So that patient records are complete

  Scenario: Create Standard consultation with ICD-10 diagnosis
    Given I am logged in as therapist (STANDARD role)
    And I have SELF_ASSIGNMENT permission
    When I navigate to Consultations
    And I click "New Consultation"
    And I select type "Standard"
    And I fill in patient data
    And I search ICD-10 for "F32.1" (Depressive episode)
    And I add diagnosis to consultation
    And I fill in treatment text
    And I click "Transmit"
    Then consultation state changes to "TRANSMITTED"
    And consultation is locked for editing
    And appears in transmitted list
```

#### 3. Permission Gate

```gherkin
Feature: Role-Based Access Control
  As a security auditor
  I want to verify permission gates
  So that unauthorized users cannot access sensitive features

  Scenario: STANDARD user cannot access Appointment Admin
    Given I am logged in as STANDARD user
    When I navigate to Appointment Admin
    Then I see "Access Denied" message
    And I am redirected to Dashboard
    
  Scenario: LEITER_INTERN can access Appointment Admin
    Given I am logged in as LEITER_INTERN
    When I navigate to Appointment Admin
    Then I see the admin grid
    And I can see all action buttons
```

---

### Edge Case Scenarios (Priority 2)

AI can autonomously create these, humans spot-check:

#### State Machine Edge Cases

```typescript
describe('Appointment State Transitions', () => {
  it('allows READY → CANCELED but not READY → ARCHIVED', () => {
    expect(canTransition('READY', 'CANCELED')).toBe(true);
    expect(canTransition('READY', 'ARCHIVED')).toBe(false);
  });

  it('requires date/time for STORNO transition', () => {
    const context = { state: 'ACTIVE', nextState: 'STORNO' };
    
    expect(transition(context, {})).toHaveProperty('error', 'STORNO_DATE_REQUIRED');
    expect(transition(context, { stornoDate: '2026-04-01' })).toBeValid();
  });

  it('prevents CANCELED → ACTIVE (must go through READY)', () => {
    expect(canTransition('CANCELED', 'READY')).toBe(true);
    expect(canTransition('CANCELED', 'ACTIVE')).toBe(false);
  });
});
```

#### Boundary Conditions

```typescript
describe('MonthTable Calendar', () => {
  it('handles month with 5 weeks (October 2026)', () => {
    const weeks = getWeeksInMonth(2026, 9); // October
    expect(weeks).toBe(5);
  });

  it('handles leap year (February 2028)', () => {
    const days = getDaysInMonth(2028, 1); // February
    expect(days).toBe(29);
  });

  it('handles empty appointments array', () => {
    const grid = buildMonthTable([], 2026, 3);
    expect(grid.days).toHaveLength(31);
    expect(grid.appointments).toBeEmpty();
  });
});
```

---

## Unit Test Patterns

### Business Logic Tests

```typescript
describe('AppointmentService', () => {
  describe('createAppointment', () => {
    it('creates appointment in READY state', async () => {
      const appointment = await createAppointment({
        date: '2026-04-15',
        timeStart: '09:00',
        jobId: 'consult-1',
      });
      
      expect(appointment.state).toBe('READY');
    });

    it('detects collision with existing appointment', async () => {
      await createAppointment({
        date: '2026-04-15',
        timeStart: '09:00',
        timeEnd: '10:00',
        userId: 'dr-smith',
      });

      await expect(
        createAppointment({
          date: '2026-04-15',
          timeStart: '09:30',
          timeEnd: '10:30',
          userId: 'dr-smith',
        })
      ).rejects.toThrow('COLLISION_DETECTED');
    });
  });
});
```

### State Machine Tests

```typescript
describe('AppointmentState', () => {
  const validTransitions = [
    ['READY', 'STARTED'],
    ['READY', 'REQUESTED'],
    ['READY', 'LOCKEDIN'],
    ['READY', 'CANCELED'],
    ['READY', 'STORNO'],
    ['STARTED', 'LOCKEDIN'],
    ['STARTED', 'CANCELED'],
    ['ACTIVE', 'DONE'],
    ['DONE', 'CLOSED'],
    ['CLOSED', 'ARCHIVED'],
  ];

  const invalidTransitions = [
    ['READY', 'ARCHIVED'],
    ['READY', 'DONE'],
    ['STARTED', 'ARCHIVED'],
    ['ACTIVE', 'READY'],
    ['DONE', 'READY'],
    ['ARCHIVED', 'READY'], // Terminal state
  ];

  it.each(validTransitions)(
    'allows transition from %s to %s',
    (from, to) => {
      expect(canTransition(from, to)).toBe(true);
    }
  );

  it.each(invalidTransitions)(
    'prevents transition from %s to %s',
    (from, to) => {
      expect(canTransition(from, to)).toBe(false);
    }
  );
});
```

---

## AI Agent Limitations

### What AI Cannot Test

| Test Type | Why AI Struggles | Human Role |
|-----------|------------------|------------|
| **Visual Regression** | Cannot assess aesthetics, spacing, color harmony | Manual review |
| **UX Flow** | Cannot judge user experience intuitiveness | UX designer review |
| **Accessibility** | Can check ARIA but not screen reader experience | Accessibility audit |
| **Performance Perception** | Can measure ms but not "feels fast" | Human perception test |
| **Compliance/Legal** | Cannot interpret regulations | Legal review |

### What AI Excels At

| Test Type | Why AI is Great | Approach |
|-----------|-----------------|----------|
| **Exhaustive Edge Cases** | Never gets tired, checks all combinations | Property-based testing |
| **Boundary Conditions** | Systematic min/max/equivalence partitioning | Generate all boundaries |
| **State Machine Validation** | Can enumerate all state pairs | Generate transition matrix |
| **Data Validation** | Checks all field types, lengths, formats | Schema-based tests |
| **Error Handling** | Tests all error paths systematically | Fault injection |

---

## Test Automation

### CI/CD Integration

```yaml
# .github/workflows/test.yml
name: Tests

on: [push, pull_request]

jobs:
  unit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:unit -- --coverage
      - uses: codecov/codecov-action@v3

  integration:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: test
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:integration

  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm run test:e2e
      - uses: actions/upload-artifact@v3
        if: failure()
        with:
          name: e2e-screenshots
          path: tests/e2e/screenshots/
```

### AI-Generated Test Maintenance

```bash
# scripts/regenerate-tests.sh
# Regenerate AI-generated tests when source changes

echo "Regenerating AI-generated tests..."

# Regenerate unit tests for changed files
git diff --name-only HEAD~1 | grep '\.ts$' | while read file; do
  echo "Regenerating tests for $file"
  npm run ai:generate-tests -- --source "$file" --output "${file%.ts}.test.ts"
done

# Run tests to verify
npm run test:unit
```

---

## Test Data Management

### Fixtures

```typescript
// tests/fixtures/appointments.ts
export const mockAppointment = {
  id: 'appt-123',
  type: 'APPOINTMENT' as const,
  state: 'READY' as const,
  date: '2026-04-15',
  timeStart: '09:00',
  timeEnd: '10:00',
  locationId: 'loc-1',
  jobId: 'job-consult',
  expertOnly: false,
};

export const createAppointment = (overrides: Partial<Appointment> = {}): Appointment => ({
  ...mockAppointment,
  ...overrides,
});
```

### Factories

```typescript
// tests/factories/appointment-factory.ts
export class AppointmentFactory {
  static create(
    type: AppointmentType = 'APPOINTMENT',
    state: AppointmentState = 'READY'
  ): Appointment {
    return {
      id: faker.string.uuid(),
      type,
      state,
      date: faker.date.future().toISOString(),
      // ...
    };
  }

  static withCollision(): Appointment[] {
    const date = '2026-04-15';
    return [
      this.create('APPOINTMENT', 'READY', { date, timeStart: '09:00', timeEnd: '10:00' }),
      this.create('APPOINTMENT', 'READY', { date, timeStart: '09:30', timeEnd: '10:30' }), // Overlaps
    ];
  }
}
```

---

## Related Documents

- [`e2e-scenarios.md`](./e2e-scenarios.md) — Complete E2E test scenarios in Gherkin
- [`component-patterns.md`](./component-patterns.md) — React Testing Library patterns
- [`test-data.md`](./test-data.md) — Fixtures, factories, mock data strategies
- [`../decisions/ADR-007-testing-strategy.md`](../decisions/ADR-007-testing-strategy.md) — Why this test pyramid

---

**Last Updated**: 2026-03-31  
**Next Review**: 2026-06-30
