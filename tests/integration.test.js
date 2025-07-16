/**
 * @jest-environment jsdom
 */

describe('Integration Tests', () => {
  let fullPageHTML;

  beforeEach(() => {
    // Create a more complete page structure for integration testing
    fullPageHTML = `
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
            <li class="nav-item">
              <a href="#contact" class="nav-link">Contact</a>
            </li>
          </ul>
          <div class="hamburger">
            <span class="bar"></span>
            <span class="bar"></span>
            <span class="bar"></span>
          </div>
        </div>
      </nav>

      <section id="home" class="hero">
        <div class="hero-content">
          <h1 class="hero-title">Capturing the Summit</h1>
          <p class="hero-subtitle">Where earth meets sky, adventure begins</p>
          <a href="#gallery" class="cta-button">Explore My Work</a>
        </div>
      </section>

      <section id="gallery" class="gallery">
        <h2 class="section-title">Gallery</h2>
        <div class="gallery-filters">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="peaks">Peaks</button>
          <button class="filter-btn" data-filter="climbing">Climbing</button>
          <button class="filter-btn" data-filter="landscape">Landscape</button>
        </div>
        
        <div class="gallery-grid">
          <div class="gallery-item featured-item" data-category="peaks">
            <img src="peak1.jpg" alt="Mountain Peak 1">
          </div>
          <div class="gallery-item featured-item" data-category="climbing">
            <img src="climb1.jpg" alt="Climbing Photo 1">
          </div>
          <div class="gallery-item" data-category="landscape">
            <img src="landscape1.jpg" alt="Landscape Photo 1">
          </div>
        </div>
      </section>

      <section id="about" class="about">
        <h2 class="section-title">About</h2>
        <div class="about-content">
          <div class="stats">
            <div class="stat">
              <span class="stat-number">150</span>
              <span class="stat-label">Peaks Climbed</span>
            </div>
            <div class="stat">
              <span class="stat-number">50</span>
              <span class="stat-label">Countries Visited</span>
            </div>
            <div class="stat">
              <span class="stat-number">1000</span>
              <span class="stat-label">Photos Taken</span>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" class="contact">
        <h2 class="section-title">Contact</h2>
        <div class="contact-content">
          <form class="contact-form">
            <div class="form-group">
              <label for="name">Name</label>
              <input type="text" id="name" name="name" required>
            </div>
            <div class="form-group">
              <label for="email">Email</label>
              <input type="email" id="email" name="email" required>
            </div>
            <div class="form-group">
              <label for="message">Message</label>
              <textarea id="message" name="message" required></textarea>
            </div>
            <button type="submit" class="submit-btn">Send Message</button>
          </form>
        </div>
      </section>
    `;
    
    document.body.innerHTML = fullPageHTML;
  });

  describe('Full Page Navigation Flow', () => {
    test('should navigate from hero to gallery when CTA is clicked', () => {
      const ctaButton = document.querySelector('.cta-button');
      const gallerySection = document.querySelector('#gallery');
      
      // Mock the navigation behavior
      const mockNavigateToGallery = () => {
        // Simulate smooth scroll to gallery
        const offsetTop = gallerySection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // Close mobile menu if open
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      };

      expect(ctaButton.getAttribute('href')).toBe('#gallery');
      expect(gallerySection).toBeInTheDocument();
      
      mockNavigateToGallery();
      expect(window.scrollTo).toHaveBeenCalled();
    });

    test('should handle mobile menu navigation flow', () => {
      const hamburger = document.querySelector('.hamburger');
      const navMenu = document.querySelector('.nav-menu');
      const navLinks = document.querySelectorAll('.nav-link');

      // Mock complete mobile navigation flow
      const mockMobileNavFlow = () => {
        // 1. Open mobile menu
        hamburger.classList.add('active');
        navMenu.classList.add('active');
        
        // 2. Click a nav link
        const aboutLink = document.querySelector('a[href="#about"]');
        const aboutSection = document.querySelector('#about');
        
        // 3. Navigate to section
        const offsetTop = aboutSection.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
        
        // 4. Close mobile menu
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
      };

      mockMobileNavFlow();
      
      expect(hamburger.classList.contains('active')).toBe(false);
      expect(navMenu.classList.contains('active')).toBe(false);
      expect(window.scrollTo).toHaveBeenCalled();
    });
  });

  describe('Gallery Filter and Lightbox Integration', () => {
    test('should filter gallery and open lightbox for filtered items', () => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const galleryItems = document.querySelectorAll('.gallery-item');
      
      // Mock complete gallery interaction flow
      const mockGalleryFlow = () => {
        // 1. Filter by "peaks"
        const peaksButton = document.querySelector('[data-filter="peaks"]');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        peaksButton.classList.add('active');
        
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          if (itemCategory === 'peaks') {
            item.style.display = 'block';
            item.classList.add('show');
          } else {
            item.style.display = 'none';
            item.classList.add('hide');
          }
        });
        
        // 2. Click on a visible "peaks" item to open lightbox
        const peaksItem = document.querySelector('[data-category="peaks"]');
        const img = peaksItem.querySelector('img');
        
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `
          <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${img.src}" alt="${img.alt}">
            <div class="lightbox-caption">${img.alt}</div>
          </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        return lightbox;
      };

      const lightbox = mockGalleryFlow();
      
      // Verify filter worked
      const peaksButton = document.querySelector('[data-filter="peaks"]');
      expect(peaksButton.classList.contains('active')).toBe(true);
      
      const peaksItems = document.querySelectorAll('[data-category="peaks"]');
      const nonPeaksItems = document.querySelectorAll('[data-category]:not([data-category="peaks"])');
      
      peaksItems.forEach(item => {
        expect(item.style.display).toBe('block');
      });
      
      nonPeaksItems.forEach(item => {
        expect(item.style.display).toBe('none');
      });
      
      // Verify lightbox opened
      expect(lightbox).toBeInTheDocument();
      expect(document.body.style.overflow).toBe('hidden');
    });
  });

  describe('Form Submission and Navigation Integration', () => {
    test('should handle contact form submission from navigation', () => {
      const contactForm = document.querySelector('.contact-form');
      const nameInput = document.querySelector('#name');
      const emailInput = document.querySelector('#email');
      const messageInput = document.querySelector('#message');
      const submitBtn = document.querySelector('.submit-btn');

      // Mock complete contact flow
      const mockContactFlow = () => {
        // 1. Navigate to contact section
        const contactLink = document.querySelector('a[href="#contact"]');
        const contactSection = document.querySelector('#contact');
        
        // 2. Fill and submit form
        nameInput.value = 'John Doe';
        emailInput.value = 'john@example.com';
        messageInput.value = 'Great photography work!';
        
        // 3. Submit form
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        // 4. Simulate successful submission
        setTimeout(() => {
          global.alert('Thank you for your message! I\'ll get back to you soon.');
          contactForm.reset();
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
        }, 0);
      };

      mockContactFlow();
      
      expect(nameInput.value).toBe('John Doe');
      expect(emailInput.value).toBe('john@example.com');
      expect(messageInput.value).toBe('Great photography work!');
      expect(submitBtn.textContent).toBe('Sending...');
      expect(submitBtn.disabled).toBe(true);
    });
  });

  describe('Scroll Effects Integration', () => {
    test('should handle multiple scroll effects simultaneously', () => {
      const navbar = document.querySelector('.navbar');
      const hero = document.querySelector('.hero');
      
      // Mock scroll progress element creation
      const scrollProgress = document.createElement('div');
      scrollProgress.classList.add('scroll-progress');
      document.body.appendChild(scrollProgress);
      
      // Mock combined scroll effects
      const mockScrollEffects = (scrollY) => {
        // 1. Navbar effect
        if (scrollY > 100) {
          navbar.style.background = 'rgba(255, 255, 255, 0.98)';
          navbar.style.boxShadow = '0 2px 20px rgba(0,0,0,0.1)';
        } else {
          navbar.style.background = 'rgba(255, 255, 255, 0.95)';
          navbar.style.boxShadow = 'none';
        }
        
        // 2. Parallax effect
        const rate = scrollY * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
        
        // 3. Scroll progress
        const scrollTotal = 2000; // Mock total height
        const scrollPercentage = (scrollY / scrollTotal) * 100;
        scrollProgress.style.width = scrollPercentage + '%';
      };

      // Test at different scroll positions
      mockScrollEffects(50); // Below navbar threshold
      expect(navbar.style.background).toBe('rgba(255, 255, 255, 0.95)');
      expect(hero.style.transform).toBe('translateY(-25px)');
      expect(scrollProgress.style.width).toBe('2.5%');

      mockScrollEffects(150); // Above navbar threshold
      expect(navbar.style.background).toBe('rgba(255, 255, 255, 0.98)');
      expect(navbar.style.boxShadow).toBe('0 2px 20px rgba(0,0,0,0.1)');
      expect(hero.style.transform).toBe('translateY(-75px)');
      expect(scrollProgress.style.width).toBe('7.5%');
    });
  });

  describe('Animation and Interaction Integration', () => {
    test('should handle featured item animations and hover effects together', () => {
      const featuredItems = document.querySelectorAll('.featured-item');
      
      // Mock combined animation and interaction effects
      const mockCombinedEffects = () => {
        featuredItems.forEach(item => {
          // 1. Setup scroll animation
          item.style.opacity = '0';
          item.style.transform = 'translateY(50px)';
          item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
          
          // 2. Trigger intersection observer (item becomes visible)
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
          
          // 3. Apply hover effect
          item.style.zIndex = '10';
        });
      };

      mockCombinedEffects();
      
      featuredItems.forEach(item => {
        expect(item.style.opacity).toBe('1');
        expect(item.style.transform).toBe('translateY(0)');
        expect(item.style.zIndex).toBe('10');
      });
    });
  });

  describe('Statistics Counter Integration', () => {
    test('should trigger stats counter when about section becomes visible', () => {
      const stats = document.querySelectorAll('.stat-number');
      
      // Mock stats counter integration with intersection observer
      const mockStatsCounterFlow = () => {
        stats.forEach(stat => {
          const finalValue = stat.textContent;
          const numericValue = parseInt(finalValue.replace(/\D/g, ''));
          
          // Simulate counter animation
          let current = 0;
          const increment = numericValue / 10;
          
          while (current < numericValue) {
            current += increment;
            if (current >= numericValue) {
              stat.textContent = numericValue;
              break;
            }
          }
        });
      };

      mockStatsCounterFlow();
      
      expect(stats[0].textContent).toBe('200'); // BROKEN - wrong expected value
      expect(stats[1].textContent).toBe('75'); // BROKEN - wrong expected value  
      expect(stats[2].textContent).toBe('1500'); // BROKEN - wrong expected value
    });
  });

  describe('Complete Page Structure Validation', () => {
    test('should have all sections and main interactive elements', () => {
      // Verify all main sections exist
      const navbar = document.querySelector('.navbar');
      const hero = document.querySelector('#home');
      const gallery = document.querySelector('#gallery');
      const about = document.querySelector('#about');
      const contact = document.querySelector('#contact');

      expect(navbar).toBeInTheDocument();
      expect(hero).toBeInTheDocument();
      expect(gallery).toBeInTheDocument();
      expect(about).toBeInTheDocument();
      expect(contact).toBeInTheDocument();

      // Verify interactive elements
      const hamburger = document.querySelector('.hamburger');
      const filterButtons = document.querySelectorAll('.filter-btn');
      const galleryItems = document.querySelectorAll('.gallery-item');
      const contactForm = document.querySelector('.contact-form');
      const sectionTitles = document.querySelectorAll('.section-title');

      expect(hamburger).toBeInTheDocument();
      expect(filterButtons.length).toBeGreaterThan(0);
      expect(galleryItems.length).toBeGreaterThan(0);
      expect(contactForm).toBeInTheDocument();
      expect(sectionTitles.length).toBeGreaterThan(0);
    });
  });
}); 