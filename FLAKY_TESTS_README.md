# Flaky Tests Documentation

This repository contains 44 intentionally flaky tests designed to challenge automated flaky test detection and fixing agents. These tests are categorized into different types of flakiness that are commonly found in real-world applications.

## Test Categories

### 1. Timing-Based Flaky Tests (`flaky-timing.test.js`)
**Tests 1-5**: Race conditions, async timing issues, and animation timing dependencies
- Race condition with setTimeout
- Animation timing dependency  
- Async/await with insufficient waiting
- Event timing with debounce
- Promise resolution order

### 2. DOM-Dependent Flaky Tests (`flaky-dom.test.js`)
**Tests 6-10**: DOM element availability, rendering timing, and mutation issues
- DOM element availability timing
- Element dimensions and rendering
- Event listener attachment timing
- CSS class application timing
- Multiple DOM mutations

### 3. Randomness-Based Flaky Tests (`flaky-randomness.test.js`)
**Tests 11-18**: Math.random(), date/time dependent behavior, and probability-based outcomes
- Math.random() dependent logic
- Date/time dependent behavior
- Array shuffling and ordering
- Probability-based outcomes
- Random ID generation collision
- Random selection from array
- Random delay simulation
- Weighted random selection

### 4. Network-Dependent Flaky Tests (`flaky-network.test.js`)
**Tests 19-24**: Network timing, concurrent requests, and external dependencies
- Network request with variable response time
- Multiple concurrent requests
- Retry logic with intermittent failures
- Cache behavior with expiration
- WebSocket connection simulation
- File upload with progress

### 5. Memory and State Pollution Tests (`flaky-memory.test.js`)
**Tests 25-34**: Shared state pollution, memory leaks, and cleanup issues
- Shared counter state pollution
- Cache pollution between tests
- Event listener accumulation
- DOM pollution from previous tests
- Global variable pollution
- Timer pollution
- Module state pollution
- CSS class pollution
- Local storage pollution
- Async state pollution

### 6. Environment-Dependent Flaky Tests (`flaky-environment.test.js`)
**Tests 35-44**: Browser, OS, hardware, and system-dependent behavior
- User Agent detection
- Screen resolution dependent
- Timezone dependent behavior
- Language/locale dependent
- Available features detection
- Canvas rendering capabilities
- Memory and performance dependent
- Network connectivity dependent
- File system access dependent
- Hardware acceleration dependent

## Running the Flaky Tests

```bash
# Run all tests
npm test

# Run only flaky tests
npm run test:flaky

# Run with coverage
npm run test:coverage

# Run in watch mode
npm run test:watch
```

## Common Flakiness Patterns

### 1. **Race Conditions**
Tests that depend on timing between asynchronous operations without proper synchronization.

### 2. **Hard-coded Delays**
Tests using fixed `setTimeout` values that may not account for system performance variations.

### 3. **Random Values**
Tests that use `Math.random()` or other non-deterministic functions in assertions.

### 4. **External Dependencies**
Tests that depend on network, file system, or other external resources.

### 5. **State Pollution**
Tests that don't properly clean up shared state between test runs.

### 6. **Environment Dependencies**
Tests that assume specific browser features, screen sizes, or system configurations.

### 7. **Timing Assumptions**
Tests that assume operations complete within specific time windows.

### 8. **Order Dependencies**
Tests that depend on the order of execution or completion of parallel operations.

## Detection Challenges

These flaky tests are designed to be particularly challenging because:

1. **Intermittent Failures**: They don't fail consistently, making them hard to reproduce
2. **Environment Sensitivity**: Failures may only occur in specific environments
3. **Timing Sensitivity**: Small changes in system load can affect outcomes
4. **Hidden Dependencies**: Some dependencies on external state are not obvious
5. **False Positives**: Some tests may pass by coincidence even when logic is flawed

## Expected Agent Behavior

A good flaky test detection and fixing agent should be able to:

1. **Identify** flaky patterns in the test code
2. **Categorize** the type of flakiness
3. **Suggest** appropriate fixes (e.g., proper waiting, mocking, cleanup)
4. **Implement** fixes that make tests deterministic
5. **Verify** that fixes don't break test intent

## Notes for Agent Testing

- Run tests multiple times to observe flaky behavior
- Pay attention to tests that sometimes pass and sometimes fail
- Look for patterns in failure modes
- Consider the test environment when analyzing failures
- Some tests may appear to pass consistently in certain environments but fail in others
