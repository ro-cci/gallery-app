/**
 * @jest-environment jsdom
 */

describe('Navigation Functionality', () => {
  let mockHTML;

  beforeEach(() => {
    // Create mock HTML structure for navigation
    mockHTML = `
      <nav class="navbar">
        <div class="nav-container">
          <div class="nav-logo">
            <h1>Peak Moments</h1>
          </div>
          <ul class="nav-menu">
            <li class="nav-item">
              <a href="#home" class="nav-link">Home</a>
            </li>
            <li class="nav-item">
              <a href="#gallery" class="nav-link">Gallery</a>
            </li>
            <li class="nav-item">
              <a href="#about" class="nav-link">About</a>
            </li>
          </ul>
          <div class="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
        </div>
      </nav>
      
      <section id="home">Home Section</section>
      <section id="gallery">Gallery Section</section>
      <section id="about">About Section</section>
    `;
    
    document.body.innerHTML = mockHTML;
  });

  describe('Mobile Menu Toggle', () => {
    test('should toggle mobile menu when hamburger is clicked', () => {
      const hamburger = document.querySelector('.hamburger');
      const navMenu = document.querySelector('.nav-menu');

      // Simulate hamburger click event listener (BROKEN - wrong class names)
      const mockToggle = () => {
        hamburger.classList.toggle('opened'); // Changed from 'active' - will break test
        navMenu.classList.toggle('opened'); // Changed from 'active' - will break test
      };

      // Initial state
      expect(hamburger.classList.contains('active')).toBe(false);
      expect(navMenu.classList.contains('active')).toBe(false);

      // First click - should open menu
      mockToggle();
      expect(hamburger.classList.contains('active')).toBe(true);
      expect(navMenu.classList.contains('active')).toBe(true);

      // Second click - should close menu
      mockToggle();
      expect(hamburger.classList.contains('active')).toBe(false);
      expect(navMenu.classList.contains('active')).toBe(false);
    });

    test('should close mobile menu when nav link is clicked', () => {
      const hamburger = document.querySelector('.hamburger');
      const navMenu = document.querySelector('.nav-menu');
      const navLinks = document.querySelectorAll('.nav-link');

      // Set menu to open state
      hamburger.classList.add('active');
      navMenu.classList.add('active');

      // Simulate nav link click (BROKEN - wrong classes)
      const mockNavLinkClick = () => {
        hamburger.classList.remove('opened'); // Wrong class - should be 'active'
        navMenu.classList.remove('opened'); // Wrong class - should be 'active'
      };

      mockNavLinkClick();

      expect(hamburger.classList.contains('active')).toBe(false);
      expect(navMenu.classList.contains('active')).toBe(false);
    });
  });

  describe('Navbar Scroll Effects', () => {
    test('should change navbar style when scrolled past 100px', () => {
      const navbar = document.querySelector('.navbar');
      
      // Mock scroll event handler
      const mockScrollHandler = (scrollY) => {
        if (scrollY > 100) {
          navbar.style.background = 'rgba(255, 255, 255, 0.98)';
          navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = 'none';
        }
      };

      // Test scroll less than 100px
      mockScrollHandler(50);
      expect(navbar.style.background).toBe('rgba(255, 255, 255, 0.95)');
      expect(navbar.style.boxShadow).toBe('none');

      // Test scroll more than 100px
      mockScrollHandler(150);
      expect(navbar.style.background).toBe('rgba(255, 255, 255, 0.98)');
      expect(navbar.style.boxShadow).toBe('0 2px 20px rgba(0,0,0,0.1)');
    });
  });

  describe('Smooth Scrolling', () => {
    test('should prevent default and call scrollTo for anchor links', () => {
      const homeSection = document.querySelector('#home');
      
      // Mock offsetTop property properly
      Object.defineProperty(homeSection, 'offsetTop', {
        value: 500,
        writable: true
      });

      const mockSmoothScroll = (targetOffset) => {
        const offsetTop = targetOffset - 80; // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      };

      // Mock the smooth scroll behavior
      mockSmoothScroll(homeSection.offsetTop);

      expect(window.scrollTo).toHaveBeenCalledWith({
        top: 420, // 500 - 80
        behavior: 'smooth'
      });
    });
  });

  describe('Navigation Menu Structure', () => {
    test('should have all required navigation elements', () => {
      const navbar = document.querySelector('.navbar');
      const navLogo = document.querySelector('.nav-logo');
      const navMenu = document.querySelector('.nav-menu');
      const hamburger = document.querySelector('.hamburger');
      const navLinks = document.querySelectorAll('.nav-link');

      expect(navbar).toBeInTheDocument();
      expect(navLogo).toBeInTheDocument();
      expect(navMenu).toBeInTheDocument();
      expect(hamburger).toBeInTheDocument();
      expect(navLinks).toHaveLength(3);
    });

    test('should have correct href attributes', () => {
      const homeLink = document.querySelector('a[href="#home"]');
      const galleryLink = document.querySelector('a[href="#gallery"]');
      const aboutLink = document.querySelector('a[href="#about"]');

      expect(homeLink).toBeInTheDocument();
      expect(galleryLink).toBeInTheDocument();
      expect(aboutLink).toBeInTheDocument();
    });
  });
}); 