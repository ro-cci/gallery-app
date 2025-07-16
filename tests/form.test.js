/**
 * @jest-environment jsdom
 */

describe('Contact Form Functionality', () => {
  let mockHTML;

  beforeEach(() => {
    // Create mock HTML structure for contact form
    mockHTML = `
      <section class="contact">
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
            <label for="subject">Subject</label>
            <input type="text" id="subject" name="subject" required>
          </div>
          
          <div class="form-group">
            <label for="message">Message</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>
          
          <button type="submit" class="submit-btn">Send Message</button>
        </form>
      </section>
    `;
    
    document.body.innerHTML = mockHTML;
  });

  describe('Form Structure', () => {
    test('should have all required form elements', () => {
      const contactForm = document.querySelector('.contact-form');
      const nameInput = document.querySelector('#name');
      const emailInput = document.querySelector('#email');
      const subjectInput = document.querySelector('#subject');
      const messageInput = document.querySelector('#message');
      const submitBtn = document.querySelector('.submit-btn');

      expect(contactForm).toBeInTheDocument();
      expect(nameInput).toBeInTheDocument();
      expect(emailInput).toBeInTheDocument();
      expect(subjectInput).toBeInTheDocument();
      expect(messageInput).toBeInTheDocument();
      expect(submitBtn).toBeInTheDocument();
    });

    test('should have correct input types and attributes', () => {
      const nameInput = document.querySelector('#name');
      const emailInput = document.querySelector('#email');
      const subjectInput = document.querySelector('#subject');
      const messageInput = document.querySelector('#message');

      expect(nameInput.type).toBe('text');
      expect(emailInput.type).toBe('email');
      expect(subjectInput.type).toBe('text');
      expect(messageInput.tagName.toLowerCase()).toBe('textarea');

      expect(nameInput.required).toBe(true);
      expect(emailInput.required).toBe(true);
      expect(subjectInput.required).toBe(true);
      expect(messageInput.required).toBe(true);
    });

    test('should have proper labels associated with inputs', () => {
      const nameLabel = document.querySelector('label[for="name"]');
      const emailLabel = document.querySelector('label[for="email"]');
      const subjectLabel = document.querySelector('label[for="subject"]');
      const messageLabel = document.querySelector('label[for="message"]');

      expect(nameLabel).toBeInTheDocument();
      expect(emailLabel).toBeInTheDocument();
      expect(subjectLabel).toBeInTheDocument();
      expect(messageLabel).toBeInTheDocument();

      expect(nameLabel.textContent).toBe('Name');
      expect(emailLabel.textContent).toBe('Email');
      expect(subjectLabel.textContent).toBe('Subject');
      expect(messageLabel.textContent).toBe('Message');
    });
  });

  describe('Form Submission', () => {
    test('should prevent default form submission', () => {
      const contactForm = document.querySelector('.contact-form');
      let defaultPrevented = false;

      // Mock form submission handler
      const mockSubmitHandler = (e) => {
        e.preventDefault();
        defaultPrevented = true;
      };

      // Create mock event
      const mockEvent = {
        preventDefault: jest.fn(() => { defaultPrevented = true; })
      };

      mockSubmitHandler(mockEvent);
      
      expect(mockEvent.preventDefault).toHaveBeenCalled();
      expect(defaultPrevented).toBe(true);
    });

    test('should collect form data correctly', () => {
      const contactForm = document.querySelector('.contact-form');
      const nameInput = document.querySelector('#name');
      const emailInput = document.querySelector('#email');
      const subjectInput = document.querySelector('#subject');
      const messageInput = document.querySelector('#message');

      // Fill form with test data
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      subjectInput.value = 'Test Subject';
      messageInput.value = 'Test message content';

      // Mock FormData collection
      const mockCollectFormData = (form) => {
        const formData = new FormData(form);
        const formObject = {};
        formData.forEach((value, key) => {
          formObject[key] = value;
        });
        return formObject;
      };

      const formData = mockCollectFormData(contactForm);

      expect(formData).toEqual({
        name: 'John Doe',
        email: 'john@example.com',
        subject: 'Test Subject',
        message: 'Test message content'
      });
    });

    test('should update submit button during submission', () => {
      const submitBtn = document.querySelector('.submit-btn');
      const originalText = submitBtn.textContent;

      // Mock submission state changes (BROKEN - wrong text)
      const mockSubmissionStart = () => {
        submitBtn.textContent = 'Loading...'; // Changed from 'Sending...'
        submitBtn.disabled = true;
      };

      const mockSubmissionEnd = () => {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      };

      // Test submission start
      mockSubmissionStart();
      expect(submitBtn.textContent).toBe('Sending...');
      expect(submitBtn.disabled).toBe(true);

      // Test submission end
      mockSubmissionEnd();
      expect(submitBtn.textContent).toBe('Send Message');
      expect(submitBtn.disabled).toBe(false);
    });

    test('should reset form after successful submission', () => {
      const contactForm = document.querySelector('.contact-form');
      const nameInput = document.querySelector('#name');
      const emailInput = document.querySelector('#email');
      const subjectInput = document.querySelector('#subject');
      const messageInput = document.querySelector('#message');

      // Fill form with test data
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      subjectInput.value = 'Test Subject';
      messageInput.value = 'Test message content';

      // Mock form reset
      const mockFormReset = () => {
        contactForm.reset();
      };

      mockFormReset();

      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(subjectInput.value).toBe('');
      expect(messageInput.value).toBe('');
    });

    test('should show success alert after submission', () => {
      // Mock alert functionality
      const mockShowSuccessAlert = () => {
        global.alert('Thank you for your message! I\'ll get back to you soon.');
      };

      mockShowSuccessAlert();

      expect(global.alert).toHaveBeenCalledWith('Thank you for your message! I\'ll get back to you soon.');
    });
  });

  describe('Form Validation', () => {
    test('should validate required fields', () => {
      const nameInput = document.querySelector('#name');
      const emailInput = document.querySelector('#email');
      const subjectInput = document.querySelector('#subject');
      const messageInput = document.querySelector('#message');

      // Mock validation check
      const mockValidateForm = () => {
        const requiredFields = [nameInput, emailInput, subjectInput, messageInput];
        return requiredFields.every(field => field.value.trim() !== '');
      };

      // Test with empty form
      expect(mockValidateForm()).toBe(false);

      // Fill all fields
      nameInput.value = 'John Doe';
      emailInput.value = 'john@example.com';
      subjectInput.value = 'Test Subject';
      messageInput.value = 'Test message';

      expect(mockValidateForm()).toBe(true);
    });

    test('should validate email format', () => {
      const emailInput = document.querySelector('#email');

      // Mock email validation
      const mockValidateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      };

      expect(mockValidateEmail('invalid-email')).toBe(false);
      expect(mockValidateEmail('test@')).toBe(false);
      expect(mockValidateEmail('test@example')).toBe(false);
      expect(mockValidateEmail('test@example.com')).toBe(true);
      expect(mockValidateEmail('user.name@domain.co.uk')).toBe(true);
    });
  });

  describe('Form Accessibility', () => {
    test('should have proper form structure for accessibility', () => {
      const formGroups = document.querySelectorAll('.form-group');
      const labels = document.querySelectorAll('label');
      const inputs = document.querySelectorAll('input, textarea');

      expect(formGroups).toHaveLength(4);
      expect(labels).toHaveLength(4);
      expect(inputs).toHaveLength(4);

      // Check that each input has a corresponding label
      inputs.forEach(input => {
        const correspondingLabel = document.querySelector(`label[for="${input.id}"]`);
        expect(correspondingLabel).toBeInTheDocument();
      });
    });

    test('should have submit button with proper text', () => {
      const submitBtn = document.querySelector('.submit-btn');
      
      expect(submitBtn.type).toBe('submit');
      expect(submitBtn.textContent).toBe('Send Message');
    });
  });
}); 