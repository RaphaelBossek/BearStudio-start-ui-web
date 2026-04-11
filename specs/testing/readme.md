# Testing Directory

This directory contains testing strategy and documentation.

## Testing Pyramid

```
        /\
       /  \
      / E2E \
     /--------\
    /Integration\
   /--------------\
  /    Unit Tests   \
 /--------------------\
```

## Contents

- **testing-strategy.md** - Unit/integration/E2E balance, coverage goals
- **e2e-scenarios.md** - Critical user journey tests in Gherkin
- **component-patterns.md** - React Testing Library patterns
- **test-data.md** - Fixtures, factories, mock data strategies

## Coverage Goals

| Test Type | Coverage Goal | Tools |
|-----------|---------------|-------|
| Unit | 80% | Vitest |
| Integration | 70% | Vitest, MSW |
| E2E | Critical paths | Playwright |
