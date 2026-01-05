document.addEventListener('DOMContentLoaded', () => {
    // WhatsApp quick message button
    const whatsappBtn = document.getElementById('whatsapp-btn');
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentLang = window.currentLanguage || 'es';
            const phone = '541176522153';
            const text = encodeURIComponent(window.translations[currentLang]['email-message']);
            const url = `https://wa.me/${phone}?text=${text}`;
            anime({ targets: whatsappBtn, scale: [1, 0.95, 1], duration: 300, easing: 'easeInOutQuad' });
            window.open(url, '_blank');
        });
    }

    // Email automation button
    const emailBtn = document.getElementById('email-btn');
    if (emailBtn) {
        emailBtn.addEventListener('click', (e) => {
            e.preventDefault();
            const currentLang = window.currentLanguage || 'es';
            const to = 'briangriva@gmail.com';
            const subject = encodeURIComponent(window.translations[currentLang]['email-subject']);
            const body = encodeURIComponent(window.translations[currentLang]['email-message'] + '\n');

            const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

            anime({ targets: emailBtn, scale: [1, 0.96, 1], duration: 280, easing: 'easeInOutQuad' });

            if (isMobile) {
                window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
            } else {
                const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;
                window.open(gmailUrl, '_blank');
            }
        });

        anime({ targets: emailBtn, translateY: [10, 0], opacity: [0, 1], duration: 700, delay: 300, easing: 'easeOutCubic' });
    }
});
