// Formspree Contact Form with Enhanced UX
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
                } else if (field.name === 'subject' && !value) {
                    errors.push('Subject is required');
                }
                break;
            case 'email':
                if (!value) {
                    errors.push('Email is required');
                } else if (!this.validateEmail(value)) {
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
    
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
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
        // Validate all fields before allowing Formspree to submit
        const fields = this.form.querySelectorAll('input, textarea');
        let isValid = true;
        
        fields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });
        
        if (!isValid) {
            e.preventDefault();
            this.showMessage('Please fix the errors above.', 'error');
            return;
        }
        
        // If validation passes, Formspree will handle the submission
        // We just show a loading state
        this.setLoadingState(true);
        this.showMessage('Sending your message...', 'info');
        
        // Formspree will handle the actual submission
        // The page will redirect to their success page or your custom page
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
        } else if (type === 'error') {
            messageElement.style.background = '#fed7d7';
            messageElement.style.color = '#2d3748';
            messageElement.style.border = '1px solid #feb2b2';
        } else {
            messageElement.style.background = '#bee3f8';
            messageElement.style.color = '#2d3748';
            messageElement.style.border = '1px solid #90cdf4';
        }
        
        messageElement.textContent = message;
        
        this.form.appendChild(messageElement);
        
        // Auto-remove after 5 seconds (except for loading messages)
        if (type !== 'info') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
        }
    }
}

// Initialize contact form when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new ContactForm();
});