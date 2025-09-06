// AgriSense - Main JavaScript File
// Common functionality across all pages

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeCommonFeatures();
});

// Navigation functionality
function initializeNavigation() {
    // Mobile menu toggle (if you add a hamburger menu)
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileMenuBtn && navLinks) {
        mobileMenuBtn.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Common features initialization
function initializeCommonFeatures() {
    // Add loading animations to buttons
    addButtonLoadingStates();

    // Initialize form validation
    initializeFormValidation();

    // Add hover effects to cards
    addCardInteractions();
}

// Button loading states
function addButtonLoadingStates() {
    document.querySelectorAll('button, .btn').forEach(button => {
        button.addEventListener('click', function(e) {
            // Don't add loading to certain buttons
            if (this.classList.contains('no-loading') || this.type === 'button') {
                return;
            }

            // Add loading state
            const originalText = this.textContent;
            this.classList.add('loading');
            this.textContent = 'Loading...';
            this.disabled = true;

            // Remove loading state after 2 seconds (or when form is processed)
            setTimeout(() => {
                this.classList.remove('loading');
                this.textContent = originalText;
                this.disabled = false;
            }, 2000);
        });
    });
}

// Form validation
function initializeFormValidation() {
    const forms = document.querySelectorAll('form');

    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            validateForm(this);
        });
    });
}

// Validate form function
function validateForm(form) {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');

    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        } else {
            clearFieldError(field);
        }

        // Email validation
        if (field.type === 'email' && field.value) {
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                isValid = false;
            }
        }

        // Number validation
        if (field.type === 'number' && field.value) {
            if (isNaN(field.value) || field.value < 0) {
                showFieldError(field, 'Please enter a valid positive number');
                isValid = false;
            }
        }
    });

    if (isValid) {
        // Form is valid, process it
        processForm(form);
    }

    return isValid;
}

// Show field error
function showFieldError(field, message) {
    clearFieldError(field);

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#dc2626';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';

    field.parentNode.insertBefore(errorDiv, field.nextSibling);
    field.style.borderColor = '#dc2626';
}

// Clear field error
function clearFieldError(field) {
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
    field.style.borderColor = '';
}

// Process form (override in specific pages)
function processForm(form) {
    console.log('Form submitted:', form);
    showNotification('Form submitted successfully!', 'success');
}

// Card interactions
function addCardInteractions() {
    document.querySelectorAll('.card, .feature-card, .recommendation-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span>${message}</span>
        <button onclick="this.parentElement.remove()">&times;</button>
    `;

    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '8px',
        color: 'white',
        fontSize: '14px',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        minWidth: '300px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
    });

    // Set background color based on type
    const colors = {
        success: '#16a34a',
        error: '#dc2626',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    notification.style.backgroundColor = colors[type] || colors.info;

    // Add to page
    document.body.appendChild(notification);

    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
}

// Utility functions
function formatCurrency(amount, currency = '₹') {
    return currency + new Intl.NumberFormat('en-IN').format(amount);
}

function formatDate(date) {
    return new Intl.DateTimeFormat('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    }).format(new Date(date));
}

function generateId() {
    return 'id_' + Math.random().toString(36).substr(2, 9);
}

// Export functions for use in other files
window.AgriSense = {
    showNotification,
    formatCurrency,
    formatDate,
    generateId,
    validateForm,
    processForm
};
