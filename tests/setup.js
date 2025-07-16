require('@testing-library/jest-dom');

// Mock window methods that aren't available in jsdom
global.alert = jest.fn();
global.scrollTo = jest.fn();

// Mock IntersectionObserver
global.IntersectionObserver = jest.fn().mockImplementation((callback) => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  trigger: (entries) => callback(entries)
}));

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 0));
global.cancelAnimationFrame = jest.fn();

// Mock window.pageYOffset
Object.defineProperty(window, 'pageYOffset', {
  value: 0,
  writable: true
});

// Mock window.innerHeight
Object.defineProperty(window, 'innerHeight', {
  value: 1024,
  writable: true
});

// Setup DOM before each test
beforeEach(() => {
  // Reset DOM
  document.body.innerHTML = '';
  document.head.innerHTML = '';
  
  // Reset window scroll position
  window.pageYOffset = 0;
  
  // Clear all mocks
  jest.clearAllMocks();
}); 