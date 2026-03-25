// ========== COPY TO CLIPBOARD ==========
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast(`Copied: ${text}`);
    }, (err) => {
        console.error('Could not copy text: ', err);
    });
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastText = document.getElementById('toast-text');
    toastText.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => toast.classList.remove('show'), 2500);
}

// ========== DOM READY ==========
document.addEventListener('DOMContentLoaded', () => {

    // --- Swatch click + ripple ---
    const swatches = document.querySelectorAll('.swatch');
    swatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            const color = swatch.dataset.color;
            if (color) copyToClipboard(color);

            // Create ripple
            const ripple = document.createElement('div');
            ripple.classList.add('swatch-ripple');
            const rect = swatch.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
            ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
            swatch.appendChild(ripple);
            ripple.addEventListener('animationend', () => ripple.remove());
        });
    });

    // --- Scroll Reveal (IntersectionObserver) ---
    const revealElements = document.querySelectorAll('.reveal, .stagger-children');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Don't unobserve — keep it visible once shown
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Active Nav Tracking ---
    const sections = document.querySelectorAll('.section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    const navObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }, { threshold: 0.15, rootMargin: '-10% 0px -60% 0px' });

    sections.forEach(section => navObserver.observe(section));

    // --- Scroll Progress Bar ---
    const progressBar = document.getElementById('scroll-progress');
    function updateProgress() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = progress + '%';
    }

    // --- Back to Top Button ---
    const backToTop = document.getElementById('back-to-top');
    function updateBackToTop() {
        if (window.scrollY > 600) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Throttled scroll handler
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateProgress();
                updateBackToTop();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    // --- Mobile Nav Toggle ---
    const navToggle = document.getElementById('navToggle');
    const sidebar = document.getElementById('sidebarNav');
    const navOverlay = document.getElementById('navOverlay');

    function toggleNav() {
        navToggle.classList.toggle('active');
        sidebar.classList.toggle('open');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleNav);
    navOverlay.addEventListener('click', toggleNav);

    // Close nav when clicking a link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (sidebar.classList.contains('open')) {
                toggleNav();
            }
        });
    });

    // Initial calls
    updateProgress();
    updateBackToTop();
});
