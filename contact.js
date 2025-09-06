// Contact Form JavaScript
// Handles contact form submission and interactions

document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.contact-form') || window.location.pathname.includes('about')) {
        initializeContactForm();
    }
});

function initializeContactForm() {
    console.log('📧 Initializing Contact Form...');

    // Override form processing for contact forms
    const contactForms = document.querySelectorAll('.contact-form');
    contactForms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            processContactForm(this);
        });
    });

    // Add form enhancements
    setupFormEnhancements();
}

function processContactForm(form) {
    const formData = new FormData(form);
    const data = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phone: formData.get('phone'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Validate required fields
    const requiredFields = ['firstName', 'lastName', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        AgriSense.showNotification('Please fill in all required fields', 'warning');
        return;
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(data.email)) {
        AgriSense.showNotification('Please enter a valid email address', 'error');
        return;
    }

    // Show processing message
    AgriSense.showNotification('Sending your message...', 'info');

    // Simulate form submission
    setTimeout(() => {
        saveContactSubmission(data);
        showThankYouMessage(data);
        form.reset();
        AgriSense.showNotification('Message sent successfully!', 'success');
    }, 2000);
}

function saveContactSubmission(data) {
    // Save to local storage for demo purposes
    let submissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
    submissions.unshift({
        ...data,
        id: generateId(),
        timestamp: new Date(),
        status: 'new'
    });

    // Keep only last 50 submissions
    if (submissions.length > 50) {
        submissions = submissions.slice(0, 50);
    }

    localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
}

function showThankYouMessage(data) {
    const modal = createThankYouModal(data);
    document.body.appendChild(modal);

    // Auto close after 5 seconds
    setTimeout(() => {
        modal.remove();
    }, 5000);
}

function createThankYouModal(data) {
    const modal = document.createElement('div');
    modal.className = 'thank-you-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>✅ Thank You!</h3>
                <button onclick="this.closest('.thank-you-modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">🌾</div>
                    <h4>Your message has been received!</h4>
                    <p>Thank you, ${data.firstName}! We've received your inquiry about "${data.subject}" and will get back to you within 24 hours.</p>
                    <p style="font-size: 0.875rem; color: #6b7280; margin-top: 1rem;">
                        A copy of your message has been sent to ${data.email}
                    </p>
                    <div style="margin-top: 2rem;">
                        <button onclick="this.closest('.thank-you-modal').remove()" 
                                style="padding: 0.75rem 2rem; background: #16a34a; color: white; border: none; border-radius: 0.5rem; cursor: pointer;">
                            Continue
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    `;

    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 1.5rem 0;
        border-bottom: 1px solid #e5e7eb;
    `;

    return modal;
}

function setupFormEnhancements() {
    // Character counter for message field
    const messageField = document.getElementById('message');
    if (messageField) {
        const maxLength = 1000;
        const counter = document.createElement('div');
        counter.className = 'character-counter';
        counter.style.cssText = `
            text-align: right;
            font-size: 0.75rem;
            color: #6b7280;
            margin-top: 0.25rem;
        `;

        messageField.parentNode.insertBefore(counter, messageField.nextSibling);

        messageField.addEventListener('input', function() {
            const remaining = maxLength - this.value.length;
            counter.textContent = `${this.value.length}/${maxLength} characters`;

            if (remaining < 50) {
                counter.style.color = '#dc2626';
            } else if (remaining < 100) {
                counter.style.color = '#f59e0b';
            } else {
                counter.style.color = '#6b7280';
            }
        });

        // Initialize counter
        messageField.dispatchEvent(new Event('input'));
    }

    // Subject selection helper
    const subjectSelect = document.getElementById('subject');
    if (subjectSelect) {
        subjectSelect.addEventListener('change', function() {
            const messageField = document.getElementById('message');
            if (messageField && !messageField.value) {
                const templates = {
                    'technical-support': 'I need help with...',
                    'partnership': 'I would like to discuss partnership opportunities for...',
                    'feature-request': 'I would like to suggest a new feature:...',
                    'general': 'I have a question about...',
                    'feedback': 'I wanted to share my feedback about...'
                };

                const template = templates[this.value];
                if (template) {
                    messageField.placeholder = template;
                }
            }
        });
    }

    // Phone number formatting
    const phoneField = document.getElementById('phone');
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            // Simple Indian phone number formatting
            let value = this.value.replace(/\D/g, '');
            if (value.length > 10) {
                value = value.substring(0, 10);
            }

            if (value.length > 5) {
                value = value.replace(/(\d{5})(\d{0,5})/, '$1 $2');
            }

            this.value = value;
        });
    }
}

// Team member interaction
function initializeTeamSection() {
    const teamMembers = document.querySelectorAll('.team-member');

    teamMembers.forEach(member => {
        member.addEventListener('click', function() {
            showTeamMemberDetails(this);
        });
    });
}

function showTeamMemberDetails(memberElement) {
    const name = memberElement.querySelector('.member-name')?.textContent;
    const role = memberElement.querySelector('.member-role')?.textContent;
    const bio = memberElement.querySelector('.member-bio')?.textContent;

    if (!name) return;

    const modal = document.createElement('div');
    modal.className = 'team-modal';
    modal.innerHTML = `
        <div class="modal-overlay" onclick="this.parentElement.remove()"></div>
        <div class="modal-content">
            <div class="modal-header">
                <h3>${name}</h3>
                <button onclick="this.closest('.team-modal').remove()">&times;</button>
            </div>
            <div class="modal-body">
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem;">👨‍💻</div>
                    <h4 style="color: #16a34a; margin-bottom: 1rem;">${role}</h4>
                    <p style="line-height: 1.6; margin-bottom: 2rem;">${bio}</p>
                    <div>
                        <button onclick="startContactWithMember('${name}')"
                                style="padding: 0.75rem 2rem; background: #16a34a; color: white; border: none; border-radius: 0.5rem; cursor: pointer; margin-right: 1rem;">
                            Get in Touch
                        </button>
                        <button onclick="this.closest('.team-modal').remove()"
                                style="padding: 0.75rem 2rem; background: #f3f4f6; color: #374151; border: none; border-radius: 0.5rem; cursor: pointer;">
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Apply modal styles
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
    `;

    const modalContent = modal.querySelector('.modal-content');
    modalContent.style.cssText = `
        background: white;
        border-radius: 1rem;
        max-width: 500px;
        width: 90%;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
    `;

    const modalHeader = modal.querySelector('.modal-header');
    modalHeader.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem 1.5rem 0;
        border-bottom: 1px solid #e5e7eb;
    `;

    document.body.appendChild(modal);
}

function startContactWithMember(memberName) {
    // Close the team modal
    document.querySelector('.team-modal')?.remove();

    // Scroll to contact form
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.scrollIntoView({ behavior: 'smooth' });

        // Pre-fill subject
        const subjectField = document.getElementById('subject');
        if (subjectField) {
            subjectField.value = 'general';
        }

        // Pre-fill message
        const messageField = document.getElementById('message');
        if (messageField) {
            messageField.value = `I would like to connect with ${memberName} regarding...`;
            messageField.focus();
            // Move cursor to end
            messageField.setSelectionRange(messageField.value.length, messageField.value.length);
        }

        AgriSense.showNotification(`Contact form ready for ${memberName}`, 'info');
    }
}

// Initialize team section if on about page
if (window.location.pathname.includes('about')) {
    document.addEventListener('DOMContentLoaded', initializeTeamSection);
}

function generateId() {
    return 'contact_' + Math.random().toString(36).substr(2, 9);
}
