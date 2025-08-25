/**
 * @jest-environment jsdom
 */

describe('Flaky Timing-Based Tests', () => {
  let mockHTML;

  beforeEach(() => {
    mockHTML = `
      <div class="async-container">
        <button id="load-data-btn">Load Data</button>
        <div id="data-display"></div>
        <div class="spinner" style="display: none;">Loading...</div>
      </div>
      <div class="animation-target"></div>
      <div class="delayed-element" style="opacity: 0;"></div>
    `;
    document.body.innerHTML = mockHTML;
  });

  // FLAKY TEST 1: Race condition with setTimeout
  test('should load data with proper timing (FLAKY: race condition)', async () => {
    const button = document.getElementById('load-data-btn');
    const display = document.getElementById('data-display');
    const spinner = document.querySelector('.spinner');
    
    // Mock async data loading with random delay
    const mockLoadData = () => {
      return new Promise((resolve) => {
        // Random delay between 50-150ms - creates race condition
        const delay = Math.random() * 100 + 50;
        setTimeout(() => {
          display.textContent = 'Data loaded!';
          spinner.style.display = 'none';
          resolve('success');
        }, delay);
      });
    };

    spinner.style.display = 'block';
    
    // Start loading
    const loadPromise = mockLoadData();
    
    // This assertion might run before data is loaded due to race condition
    setTimeout(() => {
      expect(display.textContent).toBe('Data loaded!');
      expect(spinner.style.display).toBe('none');
    }, 75); // Fixed 75ms - sometimes faster, sometimes slower than random delay
    
    await loadPromise;
  });

  // FLAKY TEST 2: Animation timing dependency
  test('should complete animation within expected time (FLAKY: animation timing)', (done) => {
    const target = document.querySelector('.animation-target');
    let animationStarted = false;
    let animationCompleted = false;
    
    // Mock animation with variable duration
    const mockAnimate = () => {
      animationStarted = true;
      target.style.transition = 'transform 0.3s ease';
      target.style.transform = 'translateX(100px)';
      
      // Animation completion detection with timing issues
      setTimeout(() => {
        animationCompleted = true;
      }, 250 + Math.random() * 100); // 250-350ms - inconsistent timing
    };

    mockAnimate();
    
    // Check animation state at fixed time - may fail due to variable completion time
    setTimeout(() => {
      expect(animationStarted).toBe(true);
      expect(animationCompleted).toBe(true); // FLAKY: might not be completed yet
      expect(target.style.transform).toBe('translateX(100px)');
      done();
    }, 300); // Fixed 300ms check
  });

  // FLAKY TEST 3: Async/await with insufficient waiting
  test('should handle multiple async operations (FLAKY: insufficient waiting)', async () => {
    const results = [];
    
    // Mock multiple async operations with different delays
    const asyncOp1 = () => new Promise(resolve => {
      setTimeout(() => {
        results.push('op1');
        resolve('op1');
      }, Math.random() * 50 + 10); // 10-60ms
    });
    
    const asyncOp2 = () => new Promise(resolve => {
      setTimeout(() => {
        results.push('op2');
        resolve('op2');
      }, Math.random() * 80 + 20); // 20-100ms
    });
    
    const asyncOp3 = () => new Promise(resolve => {
      setTimeout(() => {
        results.push('op3');
        resolve('op3');
      }, Math.random() * 30 + 5); // 5-35ms
    });

    // Start all operations
    const promises = [asyncOp1(), asyncOp2(), asyncOp3()];
    
    // Wait for first two only - third might not complete
    await Promise.all(promises.slice(0, 2));
    
    // This assertion is flaky - op3 might not be in results yet
    expect(results).toContain('op1');
    expect(results).toContain('op2');
    expect(results).toContain('op3'); // FLAKY: op3 might not be done
    expect(results).toHaveLength(3); // FLAKY: might only have 2 elements
  });

  // FLAKY TEST 4: Event timing with debounce
  test('should handle debounced events correctly (FLAKY: debounce timing)', (done) => {
    let eventCount = 0;
    let lastEventTime = 0;
    
    // Mock debounced event handler
    const mockDebouncedHandler = (() => {
      let timeout;
      return () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          eventCount++;
          lastEventTime = Date.now();
        }, 100); // 100ms debounce
      };
    })();

    // Trigger multiple events rapidly
    mockDebouncedHandler();
    setTimeout(() => mockDebouncedHandler(), 50);
    setTimeout(() => mockDebouncedHandler(), 80);
    setTimeout(() => mockDebouncedHandler(), 120);

    // Check results too early - debounce might not have fired
    setTimeout(() => {
      expect(eventCount).toBe(1); // FLAKY: might be 0 if debounce hasn't fired
      expect(lastEventTime).toBeGreaterThan(0); // FLAKY: might still be 0
      done();
    }, 150); // Check at 150ms - close to debounce timing
  });

  // FLAKY TEST 5: Promise resolution order
  test('should resolve promises in expected order (FLAKY: promise timing)', async () => {
    const resolveOrder = [];
    
    // Create promises with random delays
    const promise1 = new Promise(resolve => {
      setTimeout(() => {
        resolveOrder.push('first');
        resolve('first');
      }, Math.random() * 20 + 10); // 10-30ms
    });
    
    const promise2 = new Promise(resolve => {
      setTimeout(() => {
        resolveOrder.push('second');
        resolve('second');
      }, Math.random() * 25 + 15); // 15-40ms
    });
    
    const promise3 = new Promise(resolve => {
      setTimeout(() => {
        resolveOrder.push('third');
        resolve('third');
      }, Math.random() * 15 + 5); // 5-20ms
    });

    await Promise.all([promise1, promise2, promise3]);
    
    // These assertions assume a specific order, but timing is random
    expect(resolveOrder[0]).toBe('third'); // FLAKY: order depends on random timing
    expect(resolveOrder[1]).toBe('first'); // FLAKY: order depends on random timing
    expect(resolveOrder[2]).toBe('second'); // FLAKY: order depends on random timing
  });
});
