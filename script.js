// DOM Elements
const loginModal = document.getElementById('loginModal');
const signupModal = document.getElementById('signupModal');
const showLoginBtn = document.getElementById('show-login');
const showSignupBtn = document.getElementById('show-signup');
const closeModalBtns = document.querySelectorAll('.close-modal');
const switchToLogin = document.getElementById('switchToLogin');
const switchToSignup = document.getElementById('switchToSignup');
const ctaSignupBtn = document.getElementById('cta-signup');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const coursesContainer = document.getElementById('coursesContainer');
const contactForm = document.getElementById('contactForm');
const mobileMenu = document.getElementById("mobileMenu");
const navLinks = document.getElementById("navLinks");
const authButtons = document.querySelector(".auth-buttons");
const menuIcon = document.getElementById("menuIcon");

// Use relative URL for API
const API_BASE_URL = './api.php';

// Demo courses data
const demoCourses = [
    {
        id: 1,
        title: 'HTML5 & CSS3 Mastery',
        category: 'Web Development',
        description: 'Master the fundamentals of modern web development with HTML5 and CSS3. Learn to build responsive websites from scratch.',
        price: 0,
        duration: '40 Hours',
        difficulty: 'Beginner',
        students: 1250,
        rating: 4.8
    },
    {
        id: 2,
        title: 'JavaScript Fundamentals',
        category: 'Programming',
        description: 'Learn JavaScript from scratch to advanced concepts. Build interactive web applications with real-world projects.',
        price: 49.99,
        duration: '60 Hours',
        difficulty: 'Beginner',
        students: 980,
        rating: 4.9
    },
    {
        id: 3,
        title: 'Python for Data Science',
        category: 'Data Science',
        description: 'Master data analysis, visualization, and machine learning with Python. Hands-on projects with real datasets.',
        price: 79.99,
        duration: '80 Hours',
        difficulty: 'Intermediate',
        students: 750,
        rating: 4.7
    },
    {
        id: 4,
        title: 'React Native Mobile Development',
        category: 'Mobile Development',
        description: 'Build cross-platform mobile applications with React Native. Create professional apps for iOS and Android.',
        price: 69.99,
        duration: '70 Hours',
        difficulty: 'Intermediate',
        students: 620,
        rating: 4.8
    },
    {
        id: 5,
        title: 'Database Design & SQL',
        category: 'Database',
        description: 'Learn database design principles and SQL queries. Master MySQL, PostgreSQL, and database optimization.',
        price: 59.99,
        duration: '50 Hours',
        difficulty: 'Beginner',
        students: 890,
        rating: 4.6
    },
    {
        id: 6,
        title: 'UI/UX Design Fundamentals',
        category: 'Design',
        description: 'Learn user interface and user experience design principles. Create beautiful and functional digital products.',
        price: 49.99,
        duration: '45 Hours',
        difficulty: 'Beginner',
        students: 540,
        rating: 4.5
    }
];

// Modal Functions
function openModal(modal) {
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Event Listeners for Modals
showLoginBtn?.addEventListener('click', () => openModal(loginModal));
showSignupBtn?.addEventListener('click', () => openModal(signupModal));
ctaSignupBtn?.addEventListener('click', () => openModal(signupModal));

switchToLogin?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(signupModal);
    openModal(loginModal);
});

switchToSignup?.addEventListener('click', (e) => {
    e.preventDefault();
    closeModal(loginModal);
    openModal(signupModal);
});

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

// Mobile Menu Toggle
mobileMenu?.addEventListener('click', () => {
    navLinks.classList.toggle('show');
    authButtons.classList.toggle('show');
    
    // Toggle menu icon
    if (navLinks.classList.contains('show')) {
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
    } else {
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    }
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-links a, .auth-buttons .btn, .auth-buttons a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('show');
        authButtons.classList.remove('show');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
    });
});

// Load Courses
function loadCourses() {
    if (!coursesContainer) return;
    
    coursesContainer.innerHTML = demoCourses.map(course => `
        <div class="course-card fade-in">
            <div class="course-header">
                <span class="course-category">${course.category}</span>
                <h3>${course.title}</h3>
                <div class="course-rating">
                    ${'★'.repeat(Math.floor(course.rating))}${'☆'.repeat(5 - Math.floor(course.rating))}
                    <span>${course.rating} (${course.students}+ students)</span>
                </div>
            </div>
            <div class="course-content">
                <p>${course.description}</p>
                <div class="course-meta">
                    <span><i class="fas fa-clock"></i> ${course.duration}</span>
                    <span><i class="fas fa-user-graduate"></i> ${course.difficulty}</span>
                </div>
            </div>
            <div class="course-footer">
                <button class="btn btn-primary enroll-btn" data-course-id="${course.id}">
                    ${course.price === 0 ? 'Enroll Free' : `Enroll Now - $${course.price}`}
                </button>
                <span class="course-price">
                    ${course.price === 0 ? 'Free' : `$${course.price}`}
                </span>
            </div>
        </div>
    `).join('');
}

// Password Strength Checker
const passwordInput = document.getElementById('signupPassword');
const strengthBar = document.querySelector('.strength-level');
const strengthText = document.querySelector('.strength-text');

passwordInput?.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;
    
    // Length check
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 10;
    
    // Character variety checks
    if (/[a-z]/.test(password)) strength += 20;
    if (/[A-Z]/.test(password)) strength += 20;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    
    // Update UI
    strengthBar.style.width = Math.min(strength, 100) + '%';
    
    if (strength < 40) {
        strengthBar.style.background = '#e74c3c';
        strengthText.textContent = 'Password strength: Weak';
        strengthText.style.color = '#e74c3c';
    } else if (strength < 70) {
        strengthBar.style.background = '#f39c12';
        strengthText.textContent = 'Password strength: Fair';
        strengthText.style.color = '#f39c12';
    } else if (strength < 90) {
        strengthBar.style.background = '#3498db';
        strengthText.textContent = 'Password strength: Good';
        strengthText.style.color = '#3498db';
    } else {
        strengthBar.style.background = '#27ae60';
        strengthText.textContent = 'Password strength: Strong';
        strengthText.style.color = '#27ae60';
    }
});

// API Functions
async function callAPI(action, method = 'GET', data = null) {
    try {
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };
        
        if (data) {
            options.body = JSON.stringify(data);
        }
        
        const response = await fetch(`${API_BASE_URL}?action=${action}`, options);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return { error: 'Network error' };
    }
}

// Login Form Submission
loginForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // For demo purposes - check hardcoded credentials
    if (email === 'admin@sakhaed.com' && password === 'password123') {
        // Store user data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userData', JSON.stringify({
            name: 'Administrator',
            email: email,
            role: 'admin'
        }));
        localStorage.setItem('authToken', 'demo_token_12345');
        
        // Show success message
        showNotification('Login successful! Redirecting to dashboard...', 'success');
        
        // Close modal and redirect
        setTimeout(() => {
            closeModal(loginModal);
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        // Simulate API call for other users
        const result = await callAPI('login', 'POST', { email, password });
        
        if (result.success) {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userData', JSON.stringify(result.user));
            localStorage.setItem('authToken', result.token);
            
            showNotification('Login successful! Redirecting to dashboard...', 'success');
            
            setTimeout(() => {
                closeModal(loginModal);
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            showNotification(result.error || 'Invalid email or password', 'error');
        }
    }
});

// Signup Form Submission
signupForm?.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const role = document.getElementById('userRole').value;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long', 'error');
        return;
    }
    
    const userData = { name, email, password, role };
    const result = await callAPI('register', 'POST', userData);
    
    if (result.success) {
        // Store user data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userId', result.user_id);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', name);
        
        showNotification('Account created successfully!', 'success');
        
        setTimeout(() => {
            closeModal(signupModal);
            window.location.href = 'dashboard.html';
        }, 1500);
    } else {
        showNotification(result.error || 'Registration failed', 'error');
    }
});

// Contact Form Submission
contactForm?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    showNotification('Thank you for your message! We will get back to you soon.', 'success');
    this.reset();
    
    // In real application, send to API
    // callAPI('contact', 'POST', data);
});

// Course Enrollment
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('enroll-btn')) {
        const courseId = e.target.getAttribute('data-course-id');
        const course = demoCourses.find(c => c.id == courseId);
        
        if (!course) return;
        
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        
        if (isLoggedIn === 'true') {
            if (course.price > 0) {
                // Redirect to payment page
                window.location.href = `payment.html?course=${courseId}`;
            } else {
                // Free course - enroll directly
                enrollFreeCourse(courseId);
            }
        } else {
            showNotification('Please login or sign up to enroll in courses.', 'warning');
            openModal(signupModal);
        }
    }
});

async function enrollFreeCourse(courseId) {
    const userId = localStorage.getItem('userId');
    
    if (!userId) {
        showNotification('Please login first', 'error');
        return;
    }
    
    const result = await callAPI('enroll', 'POST', {
        user_id: userId,
        course_id: courseId
    });
    
    if (result.success) {
        showNotification('Successfully enrolled in course!', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1000);
    } else {
        showNotification(result.error || 'Enrollment failed', 'error');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    
    notification.innerHTML = `
        <i class="fas ${icons[type] || 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="notification-close">&times;</button>
    `;
    
    document.body.appendChild(notification);
    
    // Add styles if not already added
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border-radius: var(--border-radius);
                box-shadow: var(--shadow-lg);
                padding: 1rem 1.5rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                z-index: 3000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
                border-left: 4px solid;
            }
            
            .notification-success {
                border-left-color: var(--success);
            }
            
            .notification-error {
                border-left-color: var(--danger);
            }
            
            .notification-warning {
                border-left-color: var(--warning);
            }
            
            .notification-info {
                border-left-color: var(--primary);
            }
            
            .notification i {
                font-size: 1.5rem;
            }
            
            .notification-success i {
                color: var(--success);
            }
            
            .notification-error i {
                color: var(--danger);
            }
            
            .notification-warning i {
                color: var(--warning);
            }
            
            .notification-info i {
                color: var(--primary);
            }
            
            .notification-close {
                background: none;
                border: none;
                font-size: 1.5rem;
                cursor: pointer;
                color: var(--gray);
                margin-left: auto;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        notification.remove();
    }, 5000);
    
    // Close button
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.remove();
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        
        if (href === '#' || href.includes('.html')) return;
        
        e.preventDefault();
        const targetElement = document.querySelector(href);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar active state on scroll
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    const scrollPosition = window.scrollY;
    
    // Add shadow to header when scrolling
    if (scrollPosition > 50) {
        header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.boxShadow = 'var(--shadow)';
    }
    
    // Update active nav link
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    // Load courses
    loadCourses();
    
    // Add floating animation to features
    setTimeout(() => {
        document.querySelectorAll('.feature-card').forEach((card, index) => {
            card.style.animationDelay = `${index * 0.1}s`;
            card.classList.add('fade-in');
        });
    }, 100);
    
    // Check if user is logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = JSON.parse(localStorage.getItem('userData') || 'null');
    
    if (isLoggedIn === 'true' && userData) {
        // Update UI for logged in user
        showLoginBtn.textContent = `Hi, ${userData.name}`;
        showSignupBtn.textContent = 'Dashboard';
        showSignupBtn.onclick = () => window.location.href = 'dashboard.html';
    }
    
    // Initialize any other components
    console.log('SakhaED Platform Initialized');
});

// Forgot Password Functionality
document.querySelector('.forgot-password')?.addEventListener('click', function(e) {
    e.preventDefault();
    const email = prompt('Enter your email address to reset password:');
    
    if (email) {
        // Simulate password reset request
        showNotification(`Password reset link sent to ${email}. Check your email.`, 'info');
        
        // In real application: callAPI('forgot-password', 'POST', { email });
    }
});

// Newsletter subscription
document.querySelector('.newsletter .btn')?.addEventListener('click', function() {
    const emailInput = document.querySelector('.newsletter input');
    if (emailInput.value) {
        showNotification(`Thank you for subscribing with ${emailInput.value}!`, 'success');
        emailInput.value = '';
    } else {
        showNotification('Please enter your email address', 'warning');
    }
});