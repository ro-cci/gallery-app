/**
 * @jest-environment jsdom
 */

describe('Animations and Effects', () => {
  let mockHTML;

  beforeEach(() => {
    // Create mock HTML structure for animations
    mockHTML = `
      <section class="hero">
        <div class="hero-content">
          <h1>Hero Title</h1>
        </div>
      </section>
      
      <div class="featured-item">Featured Item 1</div>
      <div class="featured-item">Featured Item 2</div>
      <div class="gallery-item">Gallery Item 1</div>
      <div class="about-content">About Content</div>
      <div class="contact-content">Contact Content</div>
      
      <div class="section-title">Section Title</div>
      
      <div class="stat-number">100</div>
      <div class="stat-number">50</div>
      <div class="stat-number">25</div>
    `;
    
    document.body.innerHTML = mockHTML;
  });

  describe('Parallax Effects', () => {
    test('should apply parallax transform to hero section on scroll', () => {
      const hero = document.querySelector('.hero');
      
      // Mock parallax scroll handler
      const mockParallaxScroll = (scrollY) => {
        const rate = scrollY * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
      };

      // Test different scroll positions
      mockParallaxScroll(100);
      expect(hero.style.transform).toBe('translateY(-50px)');

      mockParallaxScroll(200);
      expect(hero.style.transform).toBe('translateY(-100px)');

      mockParallaxScroll(0);
      expect(hero.style.transform).toBe('translateY(0px)');
    });
  });

  describe('Intersection Observer Animations', () => {
    test('should set initial animation styles on elements', () => {
      const animateElements = document.querySelectorAll('.featured-item, .gallery-item, .about-content, .contact-content');
      
      // Mock initial animation setup
      const mockSetupAnimations = () => {
        animateElements.forEach(el => {
          el.style.opacity = '0';
          el.style.transform = 'translateY(50px)';
          el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        });
      };

      mockSetupAnimations();

      animateElements.forEach(el => {
        expect(el.style.opacity).toBe('0');
        expect(el.style.transform).toBe('translateY(50px)');
        expect(el.style.transition).toBe('opacity 0.6s ease, transform 0.6s ease');
      });
    });

    test('should animate elements when they become visible', () => {
      const animateElements = document.querySelectorAll('.featured-item, .gallery-item, .about-content, .contact-content');
      
      // Mock intersection observer callback
      const mockIntersectionCallback = (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      };

      // Setup initial styles
      animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(50px)';
      });

      // Mock intersection entries
      const mockEntries = Array.from(animateElements).map(el => ({
        target: el,
        isIntersecting: true
      }));

      mockIntersectionCallback(mockEntries);

      animateElements.forEach(el => {
        expect(el.style.opacity).toBe('1');
        expect(el.style.transform).toBe('translateY(0)');
      });
    });

    test('should setup section title animations', () => {
      const sectionTitles = document.querySelectorAll('.section-title');
      
      // Mock section title animation setup
      const mockSetupSectionTitles = () => {
        sectionTitles.forEach(title => {
          title.style.opacity = '0';
          title.style.transform = 'translateY(30px)';
          title.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
        });
      };

      mockSetupSectionTitles();

      sectionTitles.forEach(title => {
        expect(title.style.opacity).toBe('0');
        expect(title.style.transform).toBe('translateY(30px)');
        expect(title.style.transition).toBe('opacity 0.8s ease, transform 0.8s ease');
      });
    });
  });

  describe('Counter Animations', () => {
    test('should animate statistics counter', () => {
      const statElement = document.querySelector('.stat-number');
      
      // Mock counter animation
      const mockCountUp = (element, target) => {
        let current = 0;
        const increment = target / 10; // Simplified for testing
        
        while (current < target) {
          current += increment;
          if (current >= target) {
            element.textContent = target;
            break;
          } else {
            element.textContent = Math.floor(current);
          }
        }
      };

      const targetValue = 100;
      mockCountUp(statElement, targetValue);
      
      expect(statElement.textContent).toBe('150'); // BROKEN - wrong expected value
    });

    test('should extract numeric value from text content', () => {
      const statElement = document.querySelector('.stat-number');
      statElement.textContent = '100+';
      
      // Mock numeric value extraction
      const extractNumeric = (text) => {
        return parseInt(text.replace(/\D/g, ''));
      };

      const numericValue = extractNumeric(statElement.textContent);
      expect(numericValue).toBe(100);
    });
  });

  describe('Hover Effects', () => {
    test('should handle featured item hover effects', () => {
      const featuredItems = document.querySelectorAll('.featured-item');
      
      // Mock hover effects
      const mockHoverIn = (element) => {
        element.style.zIndex = '10';
      };

      const mockHoverOut = (element) => {
        element.style.zIndex = '1';
      };

      featuredItems.forEach(item => {
        // Test hover in
        mockHoverIn(item);
        expect(item.style.zIndex).toBe('10');

        // Test hover out
        mockHoverOut(item);
        expect(item.style.zIndex).toBe('1');
      });
    });
  });

  describe('Scroll Progress Indicator', () => {
    test('should create and update scroll progress indicator', () => {
      // Mock scroll progress creation (BROKEN - wrong class)
      const mockCreateScrollProgress = () => {
        const scrollProgress = document.createElement('div');
        scrollProgress.classList.add('progress-bar'); // Changed from 'scroll-progress'
        document.body.appendChild(scrollProgress);
        return scrollProgress;
      };

      const scrollProgress = mockCreateScrollProgress();
      expect(scrollProgress).toBeInTheDocument();
      expect(scrollProgress.classList.contains('scroll-progress')).toBe(true);

      // Mock scroll progress update
      const mockUpdateScrollProgress = (scrollY, totalHeight, windowHeight) => {
        const scrollTotal = totalHeight - windowHeight;
        const scrollPercentage = (scrollY / scrollTotal) * 100;
        scrollProgress.style.width = scrollPercentage + '%';
      };

      // Test scroll progress calculation
      mockUpdateScrollProgress(500, 2000, 1000); // 50% scrolled
      expect(scrollProgress.style.width).toBe('50%');

      mockUpdateScrollProgress(0, 2000, 1000); // 0% scrolled
      expect(scrollProgress.style.width).toBe('0%');

      mockUpdateScrollProgress(1000, 2000, 1000); // 100% scrolled
      expect(scrollProgress.style.width).toBe('100%');
    });
  });

  describe('Animation Elements Structure', () => {
    test('should have all required animation elements', () => {
      const hero = document.querySelector('.hero');
      const featuredItems = document.querySelectorAll('.featured-item');
      const galleryItems = document.querySelectorAll('.gallery-item');
      const aboutContent = document.querySelector('.about-content');
      const contactContent = document.querySelector('.contact-content');
      const sectionTitles = document.querySelectorAll('.section-title');
      const statNumbers = document.querySelectorAll('.stat-number');

      expect(hero).toBeInTheDocument();
      expect(featuredItems).toHaveLength(2);
      expect(galleryItems).toHaveLength(1);
      expect(aboutContent).toBeInTheDocument();
      expect(contactContent).toBeInTheDocument();
      expect(sectionTitles).toHaveLength(1);
      expect(statNumbers).toHaveLength(3);
    });
  });
}); 