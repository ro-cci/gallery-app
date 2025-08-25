/**
 * @jest-environment jsdom
 */

describe('Flaky DOM-Dependent Tests', () => {
  let mockHTML;

  beforeEach(() => {
    mockHTML = `
      <div class="dynamic-container">
        <button id="add-element">Add Element</button>
        <div id="element-list"></div>
      </div>
      <div class="render-target"></div>
      <div class="measurement-box" style="width: 100px; height: 50px;"></div>
    `;
    document.body.innerHTML = mockHTML;
  });

  // FLAKY TEST 6: DOM element availability timing
  test('should find dynamically created elements (FLAKY: DOM timing)', () => {
    const container = document.getElementById('element-list');
    const addButton = document.getElementById('add-element');
    
    // Mock dynamic element creation with variable timing
    const mockAddElement = () => {
      const delay = Math.random() * 50; // 0-50ms delay
      setTimeout(() => {
        const newElement = document.createElement('div');
        newElement.className = 'dynamic-item';
        newElement.textContent = 'Dynamic Item';
        container.appendChild(newElement);
      }, delay);
    };

    mockAddElement();
    
    // Immediately check for element - might not exist yet due to setTimeout
    const dynamicElement = document.querySelector('.dynamic-item');
    expect(dynamicElement).toBeInTheDocument(); // FLAKY: element might not exist yet
    expect(dynamicElement.textContent).toBe('Dynamic Item'); // FLAKY: might throw if element is null
  });

  // FLAKY TEST 7: Element dimensions and rendering
  test('should measure element dimensions correctly (FLAKY: rendering timing)', () => {
    const measurementBox = document.querySelector('.measurement-box');
    const renderTarget = document.querySelector('.render-target');
    
    // Mock dynamic styling that affects measurements
    const mockApplyStyles = () => {
      // Simulate CSS loading/application delay
      setTimeout(() => {
        measurementBox.style.padding = '10px';
        measurementBox.style.border = '2px solid black';
        renderTarget.style.display = 'block';
        renderTarget.style.width = '200px';
        renderTarget.style.height = '100px';
      }, Math.random() * 30); // 0-30ms delay
    };

    mockApplyStyles();
    
    // Measure immediately - styles might not be applied yet
    const boxRect = measurementBox.getBoundingClientRect();
    const targetRect = renderTarget.getBoundingClientRect();
    
    // These assertions depend on styles being applied
    expect(boxRect.width).toBe(124); // FLAKY: 100 + 20 padding + 4 border, but styles might not be applied
    expect(boxRect.height).toBe(74); // FLAKY: 50 + 20 padding + 4 border, but styles might not be applied
    expect(targetRect.width).toBe(200); // FLAKY: might be 0 if styles not applied
    expect(targetRect.height).toBe(100); // FLAKY: might be 0 if styles not applied
  });

  // FLAKY TEST 8: Event listener attachment timing
  test('should handle events on dynamically created elements (FLAKY: event timing)', () => {
    const container = document.getElementById('element-list');
    let clickCount = 0;
    
    // Mock creating element with event listener
    const mockCreateClickableElement = () => {
      const element = document.createElement('button');
      element.className = 'clickable-item';
      element.textContent = 'Click me';
      
      // Add to DOM first
      container.appendChild(element);
      
      // Add event listener with slight delay (simulating framework behavior)
      setTimeout(() => {
        element.addEventListener('click', () => {
          clickCount++;
        });
      }, Math.random() * 20); // 0-20ms delay for event listener attachment
      
      return element;
    };

    const clickableElement = mockCreateClickableElement();
    
    // Try to click immediately - event listener might not be attached yet
    clickableElement.click();
    
    expect(clickCount).toBe(1); // FLAKY: might be 0 if event listener not attached yet
    expect(clickableElement).toBeInTheDocument();
  });

  // FLAKY TEST 9: CSS class application timing
  test('should apply CSS classes correctly (FLAKY: class timing)', () => {
    const renderTarget = document.querySelector('.render-target');
    let transitionCompleted = false;
    
    // Mock CSS class application with transition
    const mockApplyTransition = () => {
      renderTarget.classList.add('fade-in');
      
      // Simulate CSS transition completion detection
      setTimeout(() => {
        transitionCompleted = true;
      }, Math.random() * 100 + 50); // 50-150ms
    };

    mockApplyTransition();
    
    // Check class application immediately
    expect(renderTarget.classList.contains('fade-in')).toBe(true);
    
    // Check transition completion at fixed time
    setTimeout(() => {
      expect(transitionCompleted).toBe(true); // FLAKY: transition might not be complete
    }, 75); // Fixed 75ms - might be before or after random completion time
  });

  // FLAKY TEST 10: Multiple DOM mutations
  test('should handle multiple DOM mutations correctly (FLAKY: mutation timing)', () => {
    const container = document.getElementById('element-list');
    const mutations = [];
    
    // Mock MutationObserver-like behavior
    const mockObserveMutations = () => {
      // Simulate multiple DOM changes with different timing
      setTimeout(() => {
        const div1 = document.createElement('div');
        div1.textContent = 'First';
        container.appendChild(div1);
        mutations.push('added-first');
      }, Math.random() * 20);
      
      setTimeout(() => {
        const div2 = document.createElement('div');
        div2.textContent = 'Second';
        container.appendChild(div2);
        mutations.push('added-second');
      }, Math.random() * 40 + 10);
      
      setTimeout(() => {
        const firstChild = container.firstElementChild;
        if (firstChild) {
          container.removeChild(firstChild);
          mutations.push('removed-first');
        }
      }, Math.random() * 60 + 20);
    };

    mockObserveMutations();
    
    // Check mutations at fixed time - some might not have occurred yet
    setTimeout(() => {
      expect(mutations).toContain('added-first'); // FLAKY: might not be added yet
      expect(mutations).toContain('added-second'); // FLAKY: might not be added yet
      expect(mutations).toContain('removed-first'); // FLAKY: might not be removed yet
      expect(container.children.length).toBe(1); // FLAKY: depends on timing of all operations
    }, 50); // Fixed 50ms check
  });
});
