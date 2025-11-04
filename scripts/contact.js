// Contact Form Functionality

class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }
    
    init() {
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
            this.initializeRealTimeValidation();
        }
    }
    
    initializeRealTimeValidation() {
        const inputs = this.form.querySelectorAll('input, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => this.validateField(input));
            input.addEventListener('input', () => this.clearFieldError(input));
        });
    }
    
    validateField(field) {
        const value = field.value.trim();
        let errors = [];
        
        switch(field.type) {
            case 'text':
                if (field.name === 'name' && !value) {
                    errors.push('Name is required');
                }
                break;
            case 'email':
                if (!value) {
                    errors.push('Email is required');
                } else if (!window.portfolio.validateEmail(value)) {
                    errors.push('Please enter a valid email address');
                }
                break;
            case 'textarea':
                if (!value) {
                    errors.push('Message is required');
                } else if (value.length < 10) {
                    errors.push('Message should be at least 10 characters long');
                }
                break;
        }
        
        if (errors.length > 0) {
            this.showFieldError(field, errors[0]);
            return false;
        } else {
            this.clearFieldError(field);
            return true;
        }
    }
    
    showFieldError(field, message) {
        this.clearFieldError(field);
        
        field.classList.add('error');
        
        const errorElement = document.createElement('div');
        errorElement.className = 'field-error';
        errorElement.style.color = '#e53e3e';
        errorElement.style.fontSize = '0.875rem';
        errorElement.style.marginTop = '0.25rem';
        errorElement.textContent = message;
        
        field.parentNode.appendChild(errorElement);
    }
    
    clearFieldError(field) {
        field.classList.remove('error');
        
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) {
            existingError.remove();
        }
    }
    
    async handleSubmit(e) {
        e.preventDefault();
        
        // Validate all fields
        const fields = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            this.showMessage('Please fix the errors above.', 'error');
            return;
        }
        
        // Get form data
        const formData = new FormData(this.form);
        const data = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };
        
        // Show loading state
        this.setLoadingState(true);
        
        try {
            // Simulate API call - replace with actual endpoint
            await this.sendFormData(data);
            this.showSuccessMessage();
            this.form.reset();
        } catch (error) {
            this.showMessage('Sorry, there was an error sending your message. Please try again.', 'error');
            console.error('Form submission error:', error);
        } finally {
            this.setLoadingState(false);
        }
    }
    
    async sendFormData(data) {
        // Simulate API call - replace this with your actual form submission
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Simulate random success/failure for demo
                if (Math.random() > 0.2) { // 80% success rate for demo
                    resolve({ success: true });
                } else {
                    reject(new Error('Network error'));
                }
            }, 2000);
        });
    }
    
    setLoadingState(loading) {
        const submitButton = this.form.querySelector('button[type="submit"]');
        
        if (loading) {
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            submitButton.style.opacity = '0.7';
        } else {
            submitButton.disabled = false;
            submitButton.textContent = 'Send Message';
            submitButton.style.opacity = '1';
        }
    }
    
    showSuccessMessage() {
        this.showMessage('Thank you! Your message has been sent successfully.', 'success');
        
        // Add celebration effect
        this.celebrate();
    }
    
    showMessage(message, type) {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.form-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const messageElement = document.createElement('div');
        messageElement.className = `form-message ${type}`;
        messageElement.style.padding = '1rem';
        messageElement.style.borderRadius = '0.5rem';
        messageElement.style.marginTop = '1rem';
        messageElement.style.textAlign = 'center';
        messageElement.style.fontWeight = '500';
        
        if (type === 'success') {
            messageElement.style.background = '#c6f6d5';
            messageElement.style.color = '#2d3748';
            messageElement.style.border = '1px solid #9ae6b4';
        } else {
            messageElement.style.background = '#fed7d7';
            messageElement.style.color = '#2d3748';
            messageElement.style.border = '1px solid #feb2b2';
        }
        
        messageElement.textContent = message;
        
        this.form.appendChild(messageElement);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            messageElement.remove();
        }, 5000);
    }
    
    celebrate() {
        // Simple celebration effect
        const button = this.form.querySelector('button[type="submit"]');
        button.style.background = 'linear-gradient(135deg, #48bb78, #38a169)';
        
        setTimeout(() => {
            button.style.background = '';
        }, 2000);
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ContactForm();
});

// Additional contact page enhancements
function enhanceContactPage() {
    // Add click-to-copy functionality for contact methods
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.style.cursor = 'pointer';
        method.addEventListener('click', function() {
            const text = this.querySelector('span').textContent;
            copyToClipboard(text);
            showCopyFeedback(this);
        });
    });
}

function copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
}

function showCopyFeedback(element) {
    const originalContent = element.innerHTML;
    element.innerHTML = '<i class="fas fa-check"></i> <span>Copied!</span>';
    element.style.color = '#48bb78';
    
    setTimeout(() => {
        element.innerHTML = originalContent;
        element.style.color = '';
    }, 2000);
}

// Initialize contact page enhancements
document.addEventListener('DOMContentLoaded', enhanceContactPage);