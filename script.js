/* ===== Momentum Tutoring — Professional Script ===== */

document.addEventListener('DOMContentLoaded', () => {

    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // Hide page loader
    const pageLoader = document.getElementById('page-loader');
    if (pageLoader) {
        setTimeout(() => {
            pageLoader.classList.add('hidden');
        }, 600);
    }

    /* =============================================
       TOAST NOTIFICATION SYSTEM
    ============================================= */
    const toastContainer = document.getElementById('toast-container');

    function showToast(type, title, message, duration = 4000) {
        const icons = {
            success: '✅',
            error: '❌',
            info: 'ℹ️'
        };

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
            <div class="toast-body">
                <div class="toast-title">${title}</div>
                <div class="toast-message">${message}</div>
            </div>
        `;

        toastContainer.appendChild(toast);

        setTimeout(() => {
            toast.classList.add('leaving');
            toast.addEventListener('animationend', () => toast.remove());
        }, duration);
    }

    /* =============================================
       NAVBAR — Scroll Effect & Active Link
    ============================================= */
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.getElementById('back-to-top');

    function onScroll() {
        const scrollY = window.scrollY;

        // Navbar solid on scroll
        if (scrollY > 60) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top visibility
        if (backToTopBtn) {
            if (scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }

        // Scrollspy
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.includes(current) && current !== '') {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // initial call

    // Back to top click
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* =============================================
       SMOOTH SCROLLING
    ============================================= */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            // Don't interfere with modal triggers
            if (this.classList.contains('open-request-modal') || this.classList.contains('open-volunteer-modal')) {
                return;
            }

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const headerOffset = 90;
                const elementPos = target.getBoundingClientRect().top;
                const offsetPos = elementPos + window.pageYOffset - headerOffset;
                window.scrollTo({ top: offsetPos, behavior: 'smooth' });
            }
        });
    });

    /* =============================================
       MOBILE MENU
    ============================================= */
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileOverlay = document.getElementById('mobile-menu-overlay');
    const mobileCloseBtn = document.getElementById('mobile-close-btn');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    function openMobileMenu() {
        hamburger.classList.add('active');
        hamburger.setAttribute('aria-expanded', 'true');
        mobileMenu.classList.add('active');
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('active');
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            if (mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });
    }

    if (mobileCloseBtn) mobileCloseBtn.addEventListener('click', closeMobileMenu);
    if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            closeMobileMenu();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                setTimeout(() => {
                    const headerOffset = 90;
                    const elementPos = target.getBoundingClientRect().top;
                    const offsetPos = elementPos + window.pageYOffset - headerOffset;
                    window.scrollTo({ top: offsetPos, behavior: 'smooth' });
                }, 300);
            }
        });
    });

    // Escape key to close
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
            // Also close modals
            document.querySelectorAll('.modal.active').forEach(m => m.classList.remove('active'));
            document.body.style.overflow = '';
        }
    });

    /* =============================================
       REVEAL ANIMATIONS ON SCROLL
    ============================================= */
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* =============================================
       ANIMATED COUNTER (Stats Section)
    ============================================= */
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');

    function animateCounter(el) {
        const target = parseInt(el.getAttribute('data-target'), 10);
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(target * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                el.textContent = target;
            }
        }

        requestAnimationFrame(update);
    }

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                counterObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });

    statNumbers.forEach(el => counterObserver.observe(el));

    /* =============================================
       TESTIMONIALS CAROUSEL
    ============================================= */
    const track = document.getElementById('testimonials-track');
    const dotsContainer = document.getElementById('carousel-dots');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    if (track && dotsContainer) {
        const cards = track.querySelectorAll('.testimonial-card');
        let currentSlide = 0;
        const totalSlides = cards.length;
        let autoPlayTimer = null;

        // Create dots
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot${i === 0 ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Go to testimonial ${i + 1}`);
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }

        const dots = dotsContainer.querySelectorAll('.carousel-dot');

        function goToSlide(index) {
            currentSlide = index;
            track.style.transform = `translateX(-${currentSlide * 100}%)`;

            dots.forEach((d, i) => {
                d.classList.toggle('active', i === currentSlide);
            });
        }

        function nextSlide() {
            goToSlide((currentSlide + 1) % totalSlides);
        }

        function prevSlide() {
            goToSlide((currentSlide - 1 + totalSlides) % totalSlides);
        }

        if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
        if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

        function startAutoPlay() {
            autoPlayTimer = setInterval(nextSlide, 5000);
        }

        function resetAutoPlay() {
            clearInterval(autoPlayTimer);
            startAutoPlay();
        }

        startAutoPlay();

        // Pause on hover
        const carousel = document.getElementById('testimonials-carousel');
        if (carousel) {
            carousel.addEventListener('mouseenter', () => clearInterval(autoPlayTimer));
            carousel.addEventListener('mouseleave', startAutoPlay);
        }

        // Touch swipe
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) nextSlide();
                else prevSlide();
                resetAutoPlay();
            }
        }, { passive: true });
    }

    /* =============================================
       FAQ ACCORDION
    ============================================= */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const btn = item.querySelector('.faq-question');
        const answer = item.querySelector('.faq-answer');

        if (btn && answer) {
            btn.addEventListener('click', () => {
                const isOpen = item.classList.contains('active');

                // Close all others
                faqItems.forEach(other => {
                    if (other !== item) {
                        other.classList.remove('active');
                        const otherAnswer = other.querySelector('.faq-answer');
                        if (otherAnswer) otherAnswer.style.maxHeight = null;
                        const otherBtn = other.querySelector('.faq-question');
                        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
                    }
                });

                if (isOpen) {
                    item.classList.remove('active');
                    answer.style.maxHeight = null;
                    btn.setAttribute('aria-expanded', 'false');
                } else {
                    item.classList.add('active');
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                    btn.setAttribute('aria-expanded', 'true');
                }
            });
        }
    });

    /* =============================================
       3D TILT EFFECT FOR HERO IMAGE
    ============================================= */
    const heroSection = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero-img-placeholder');

    if (heroSection && heroImage) {
        // Only on non-touch devices
        if (!('ontouchstart' in window)) {
            heroSection.addEventListener('mousemove', (e) => {
                const rect = heroSection.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const xAxis = (centerX - x) / 35;
                const yAxis = (y - centerY) / 35;

                heroImage.style.transform = `rotateY(${xAxis}deg) rotateX(${yAxis}deg)`;
            });

            heroSection.addEventListener('mouseleave', () => {
                heroImage.style.transform = 'rotateY(0) rotateX(0)';
            });
        }
    }

    /* =============================================
       MODAL LOGIC
    ============================================= */
    const volunteerModal = document.getElementById('volunteer-modal');
    const requestModal = document.getElementById('request-modal');

    // Open triggers
    document.querySelectorAll('.open-volunteer-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            volunteerModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    document.querySelectorAll('.open-request-modal').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            closeMobileMenu();
            requestModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    // Close buttons
    document.querySelectorAll('.close-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            volunteerModal.classList.remove('active');
            requestModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Click outside to close
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            e.target.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    /* =============================================
       FORM VALIDATION & SUBMISSION
    ============================================= */

    function validateField(input) {
        const value = input.value.trim();
        const errorId = input.id + '-error';
        const errorEl = document.getElementById(errorId);

        if (input.required && !value) {
            input.classList.add('error');
            input.classList.remove('valid');
            if (errorEl) errorEl.textContent = 'This field is required';
            return false;
        }

        if (input.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                input.classList.add('error');
                input.classList.remove('valid');
                if (errorEl) errorEl.textContent = 'Please enter a valid email';
                return false;
            }
        }

        input.classList.remove('error');
        if (value) input.classList.add('valid');
        if (errorEl) errorEl.textContent = '';
        return true;
    }

    // Live validation on blur
    document.querySelectorAll('.modal input[required], .modal textarea[required]').forEach(input => {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            if (input.classList.contains('error')) {
                validateField(input);
            }
        });
    });

    function validateForm(form) {
        const inputs = form.querySelectorAll('input[required]');
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) isValid = false;
        });
        return isValid;
    }

    function resetForm(form) {
        form.reset();
        form.querySelectorAll('input').forEach(input => {
            input.classList.remove('error', 'valid');
        });
        form.querySelectorAll('.form-error').forEach(el => {
            el.textContent = '';
        });
    }

    // Volunteer Form
    const volForm = document.getElementById('volunteer-form');
    if (volForm) {
        volForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateForm(volForm)) {
                showToast('error', 'Oops!', 'Please fill in all required fields correctly.');
                return;
            }

            const name = document.getElementById('vol-name').value;
            const email = document.getElementById('vol-email').value;
            const grade = document.getElementById('vol-grade').value;
            const subjects = document.getElementById('vol-subjects').value;
            const phone = document.getElementById('vol-phone')?.value || 'Not provided';
            const message = document.getElementById('vol-message')?.value || 'Not provided';

            const body = `Volunteer Application\n\nName: ${name}\nEmail: ${email}\nGrade/Age: ${grade}\nPhone: ${phone}\nSubjects: ${subjects}\nMessage: ${message}\n\nI am interested in volunteering with Momentum Tutoring!`;

            const mailtoLink = `mailto:momentumtotutoring@gmail.com?subject=${encodeURIComponent(`New Volunteer Application: ${name}`)}&body=${encodeURIComponent(body)}`;

            showToast('info', 'Opening Email Client', 'Your email app will open with a pre-filled draft. Please click Send to complete your application.');

            setTimeout(() => {
                window.open(mailtoLink, '_blank');
            }, 800);

            // Close modal and reset
            volunteerModal.classList.remove('active');
            document.body.style.overflow = '';
            resetForm(volForm);

            setTimeout(() => {
                showToast('success', 'Draft Created!', 'Please check your email app and click Send to finish your application.');
            }, 2000);
        });
    }

    // Request Form
    const reqForm = document.getElementById('request-form');
    if (reqForm) {
        reqForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateForm(reqForm)) {
                showToast('error', 'Oops!', 'Please fill in all required fields correctly.');
                return;
            }

            const studentName = document.getElementById('req-name').value;
            const parentName = document.getElementById('req-parent').value;
            const email = document.getElementById('req-email').value;
            const grade = document.getElementById('req-grade').value;
            const subjects = document.getElementById('req-subjects').value;
            const availability = document.getElementById('req-availability').value;
            const phone = document.getElementById('req-phone')?.value || 'Not provided';
            const notes = document.getElementById('req-notes')?.value || 'None';

            const body = `Tutoring Request\n\nStudent Name: ${studentName}\nParent Name: ${parentName}\nContact Email: ${email}\nPhone: ${phone}\nGrade: ${grade}\nSubjects Needed: ${subjects}\nAvailability: ${availability}\nAdditional Notes: ${notes}\n\nI would like to request tutoring support.`;

            const mailtoLink = `mailto:momentumtotutoring@gmail.com?subject=${encodeURIComponent(`Tutoring Request: ${studentName}`)}&body=${encodeURIComponent(body)}`;

            showToast('info', 'Opening Email Client', 'Your email app will open with a pre-filled draft.');

            setTimeout(() => {
                window.open(mailtoLink, '_blank');
            }, 800);

            // Close modal and reset
            requestModal.classList.remove('active');
            document.body.style.overflow = '';
            resetForm(reqForm);

            setTimeout(() => {
                showToast('success', 'Draft Created!', 'Please check your email app and click Send to submit your request.');
            }, 2000);
        });
    }

});
