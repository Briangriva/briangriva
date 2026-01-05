document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const navItems = document.querySelectorAll('.main-nav a');

    // Initialize theme from localStorage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
    } else {
        body.classList.add('light-mode');
        body.classList.remove('dark-mode');
    }

    themeToggle.addEventListener('click', () => {
        if (body.classList.contains('light-mode')) {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            localStorage.setItem('theme', 'light');
        }
        anime({ targets: themeToggle, scale: [1, 1.2, 1], rotate: [0, 15, -15, 0], duration: 400, easing: 'easeInOutQuad' });

        if (typeof updateParticleColors === 'function') {
            updateParticleColors();
        }
    });

    // Global language toggle
    const savedLang = localStorage.getItem('language') || 'es';
    window.currentLanguage = savedLang;
    
    // Apply saved language on page load
    if (typeof translatePage === 'function') {
        translatePage(window.currentLanguage);
    }
    
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        const langBtns = languageToggle.querySelectorAll('.lang-btn');
        langBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                langBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                window.currentLanguage = btn.getAttribute('data-lang');
                localStorage.setItem('language', window.currentLanguage);
                
                // Translate entire page
                if (typeof translatePage === 'function') {
                    translatePage(window.currentLanguage);
                }
                
                anime({ targets: btn, scale: [1, 1.05, 1], duration: 300, easing: 'easeInOutQuad' });
            });
        });

        // Set active button based on saved language
        const activeBtn = languageToggle.querySelector(`[data-lang="${savedLang}"]`);
        if (activeBtn) {
            langBtns.forEach(b => b.classList.remove('active'));
            activeBtn.classList.add('active');
        }
    }

    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            anime({ targets: item, color: 'var(--primary-accent)', scale: [1, 1.05], translateX: [0, 5], easing: 'easeOutQuad', duration: 300 });
        });
        item.addEventListener('mouseleave', () => {
            anime({ targets: item, color: 'var(--text-color)', scale: [1.05, 1], translateX: [5, 0], easing: 'easeOutQuad', duration: 300 });
        });
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            if (targetSection) {
                anime({ targets: document.documentElement, scrollTop: targetSection.offsetTop - 50, duration: 800, easing: 'easeInOutQuint' });
            }
        });
    });
});
