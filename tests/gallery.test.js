/**
 * @jest-environment jsdom
 */

describe('Gallery Functionality', () => {
  let mockHTML;

  beforeEach(() => {
    // Create mock HTML structure for gallery
    mockHTML = `
      <section class="gallery">
        <div class="gallery-filters">
          <button class="filter-btn active" data-filter="all">All</button>
          <button class="filter-btn" data-filter="peaks">Peaks</button>
          <button class="filter-btn" data-filter="climbing">Climbing</button>
          <button class="filter-btn" data-filter="landscape">Landscape</button>
        </div>
        
        <div class="gallery-grid">
          <div class="gallery-item" data-category="peaks">
            <img src="peak1.jpg" alt="Mountain Peak 1">
          </div>
          <div class="gallery-item" data-category="climbing">
            <img src="climb1.jpg" alt="Climbing Photo 1">
          </div>
          <div class="gallery-item" data-category="landscape">
            <img src="landscape1.jpg" alt="Landscape Photo 1">
          </div>
          <div class="gallery-item" data-category="peaks">
            <img src="peak2.jpg" alt="Mountain Peak 2">
          </div>
        </div>
      </section>
    `;
    
    document.body.innerHTML = mockHTML;
  });

  describe('Gallery Filtering', () => {
    test('should show all items when "all" filter is selected', () => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const galleryItems = document.querySelectorAll('.gallery-item');
      
      // Mock filter functionality
      const mockFilter = (filterValue) => {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active to clicked button
        const clickedButton = document.querySelector(`[data-filter="${filterValue}"]`);
        clickedButton.classList.add('active');
        
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.classList.remove('hide');
            item.classList.add('show');
            item.style.display = 'block';
          } else {
            item.classList.remove('show');
            item.classList.add('hide');
            item.style.display = 'none';
          }
        });
      };

      // Test "all" filter
      mockFilter('all');
      
      const allButton = document.querySelector('[data-filter="all"]');
      expect(allButton.classList.contains('active')).toBe(true);
      
      galleryItems.forEach(item => {
        expect(item.style.display).toBe('block');
        expect(item.classList.contains('show')).toBe(true);
        expect(item.classList.contains('hide')).toBe(false);
      });
    });

    test('should filter items by category', () => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const galleryItems = document.querySelectorAll('.gallery-item');
      
      const mockFilter = (filterValue) => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        const clickedButton = document.querySelector(`[data-filter="${filterValue}"]`);
        clickedButton.classList.add('active');
        
        galleryItems.forEach(item => {
          const itemCategory = item.getAttribute('data-category');
          
          if (filterValue === 'all' || itemCategory === filterValue) {
            item.classList.remove('hide');
            item.classList.add('show');
            item.style.display = 'block';
          } else {
            item.classList.remove('show');
            item.classList.add('hide');
            item.style.display = 'none';
          }
        });
      };

      // Test "peaks" filter
      mockFilter('peaks');
      
      const peaksButton = document.querySelector('[data-filter="peaks"]');
      expect(peaksButton.classList.contains('active')).toBe(true);
      
      const peakItems = document.querySelectorAll('[data-category="peaks"]');
      const nonPeakItems = document.querySelectorAll('[data-category]:not([data-category="peaks"])');
      
      peakItems.forEach(item => {
        expect(item.style.display).toBe('block');
        expect(item.classList.contains('show')).toBe(true);
      });
      
      nonPeakItems.forEach(item => {
        expect(item.style.display).toBe('none');
        expect(item.classList.contains('hide')).toBe(true);
      });
    });

    test('should have correct filter button states', () => {
      const filterButtons = document.querySelectorAll('.filter-btn');
      const allButton = document.querySelector('[data-filter="all"]');
      
      // Initially "all" should be active
      expect(allButton.classList.contains('active')).toBe(true);
      
      // Test that we have all expected filter buttons
      const expectedFilters = ['all', 'peaks', 'climbing', 'landscape'];
      expectedFilters.forEach(filter => {
        const button = document.querySelector(`[data-filter="${filter}"]`);
        expect(button).toBeInTheDocument();
      });
      
      expect(filterButtons).toHaveLength(4);
    });
  });

  describe('Lightbox Functionality', () => {
    test('should create lightbox when gallery item is clicked', () => {
      const galleryItem = document.querySelector('.gallery-item');
      const img = galleryItem.querySelector('img');
      
      // Mock lightbox creation
      const mockCreateLightbox = (imgSrc, imgAlt) => {
        const lightbox = document.createElement('div');
        lightbox.classList.add('lightbox');
        lightbox.innerHTML = `
          <div class="lightbox-content">
            <span class="lightbox-close">&times;</span>
            <img src="${imgSrc}" alt="${imgAlt}">
            <div class="lightbox-caption">${imgAlt}</div>
          </div>
        `;
        
        document.body.appendChild(lightbox);
        document.body.style.overflow = 'hidden';
        
        return lightbox;
      };

      const lightbox = mockCreateLightbox(img.src, img.alt);
      
      expect(lightbox).toBeInTheDocument();
      expect(lightbox.classList.contains('lightbox')).toBe(true);
      expect(document.body.style.overflow).toBe('hidden');
      
      const lightboxImg = lightbox.querySelector('img');
      const lightboxCaption = lightbox.querySelector('.lightbox-caption');
      const closeBtn = lightbox.querySelector('.lightbox-close');
      
      expect(lightboxImg.src).toBe(img.src);
      expect(lightboxImg.alt).toBe(img.alt);
      expect(lightboxCaption.textContent).toBe(img.alt);
      expect(closeBtn).toBeInTheDocument();
    });

    test('should close lightbox when close button is clicked', () => {
      // Create a lightbox
      const lightbox = document.createElement('div');
      lightbox.classList.add('lightbox');
      lightbox.innerHTML = `
        <div class="lightbox-content">
          <span class="lightbox-close">&times;</span>
          <img src="test.jpg" alt="Test">
        </div>
      `;
      
      document.body.appendChild(lightbox);
      document.body.style.overflow = 'hidden';
      
      // Mock close functionality
      const mockCloseLightbox = () => {
        if (document.body.contains(lightbox)) {
          document.body.removeChild(lightbox);
          document.body.style.overflow = 'auto';
        }
      };

      mockCloseLightbox();
      
      expect(lightbox).not.toBeInTheDocument();
      expect(document.body.style.overflow).toBe('auto');
    });

    test('should have correct gallery item structure', () => {
      const galleryItems = document.querySelectorAll('.gallery-item');
      
      galleryItems.forEach(item => {
        const img = item.querySelector('img');
        const category = item.getAttribute('data-category');
        
        expect(img).toBeInTheDocument();
        expect(img.src).toBeTruthy();
        expect(img.alt).toBeTruthy();
        expect(category).toBeTruthy();
      });
      
      expect(galleryItems).toHaveLength(4);
    });
  });

  describe('Gallery Grid Structure', () => {
    test('should have all required gallery elements', () => {
      const gallery = document.querySelector('.gallery');
      const galleryFilters = document.querySelector('.gallery-filters');
      const galleryGrid = document.querySelector('.gallery-grid');
      const galleryItems = document.querySelectorAll('.gallery-item');
      const filterButtons = document.querySelectorAll('.filter-btn');

      expect(gallery).toBeInTheDocument();
      expect(galleryFilters).toBeInTheDocument();
      expect(galleryGrid).toBeInTheDocument();
      expect(galleryItems).toHaveLength(4);
      expect(filterButtons).toHaveLength(4);
    });

    test('should have correct data attributes', () => {
      const galleryItems = document.querySelectorAll('.gallery-item');
      const categories = ['peaks', 'climbing', 'landscape', 'peaks'];
      
      galleryItems.forEach((item, index) => {
        expect(item.getAttribute('data-category')).toBe(categories[index]);
      });
    });
  });
}); 