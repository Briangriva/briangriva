document.addEventListener('DOMContentLoaded', () => {
    const contentSections = document.querySelectorAll('.content-section');

    const sectionObserverOptions = { root: null, rootMargin: '0px', threshold: 0.15 };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('is-visible')) {
                if (entry.target.id === 'about' || entry.target.id === 'contact') {
                    anime({ targets: entry.target, translateY: [60, 0], opacity: [0, 1], duration: 1000, easing: 'easeOutExpo', delay: 200, complete: () => entry.target.classList.add('is-visible') });
                } else if (entry.target.id === 'skills') {
                    anime.timeline({ targets: entry.target, duration: 1000, easing: 'easeOutExpo', delay: 100, complete: () => { entry.target.classList.add('is-visible'); if (typeof animateSkillsWave === 'function') animateSkillsWave(); } })
                    .add({ translateY: [60, 0], opacity: [0, 1], duration: 800 }, 0)
                    .add({ targets: '.skill-item', scale: [0, 1], rotateZ: [-30, 0], opacity: [0, 1], delay: anime.stagger(80, {start: 300}), duration: 600, easing: 'easeOutBack' }, '-=700');
                } else if (entry.target.id === 'projects') {
                    const cards = entry.target.querySelectorAll('.project-card');
                    anime.timeline({ targets: entry.target, duration: 1000, easing: 'easeOutExpo', delay: 100, complete: () => entry.target.classList.add('is-visible') })
                    .add({ translateY: [60, 0], opacity: [0, 1], duration: 800 }, 0)
                    .add({ targets: cards, scale: [0.8, 1], translateY: [50, 0], opacity: [0, 1], delay: anime.stagger(100, {start: 300}), duration: 700, easing: 'easeOutCubic' }, '-=700');
                } else if (entry.target.id === 'certificates') {
                    anime.timeline({ targets: entry.target, duration: 1000, easing: 'easeOutExpo', delay: 100, complete: () => entry.target.classList.add('is-visible') })
                    .add({ translateY: [60, 0], opacity: [0, 1], duration: 800 }, 0)
                    .add({ targets: '.certificate-card', scale: [0.5, 1], opacity: [0, 1], translateY: [50, 0], delay: anime.stagger(100, {start: 300, from: 'random'}), duration: 700, easing: 'easeOutBack' }, '-=700');
                }
            } else if (!entry.isIntersecting && entry.target.id === 'skills' && entry.target.classList.contains('is-visible')) {
                if (typeof stopSkillsAnimation === 'function') stopSkillsAnimation();
                entry.target.classList.remove('is-visible');
            }
        });
    }, sectionObserverOptions);

    contentSections.forEach(section => {
        sectionObserver.observe(section);
    });
});
