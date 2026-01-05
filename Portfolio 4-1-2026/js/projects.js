document.addEventListener('DOMContentLoaded', () => {
    const projectCards = document.querySelectorAll('.project-card');

    projectCards.forEach(card => {
        const img = card.querySelector('.project-img');
        const overlay = card.querySelector('.project-overlay');
        const titleOverlay = card.querySelector('.project-title-overlay');
        const descOverlay = card.querySelector('.project-desc-overlay');
        const projectLink = card.querySelector('.project-link');

        card.addEventListener('mouseenter', () => {
            anime({
                targets: img,
                scale: 1.1,
                rotateZ: '3deg',
                duration: 400,
                easing: 'easeOutExpo'
            });

            anime.timeline({ targets: overlay, easing: 'easeOutExpo' })
            .add({ opacity: 1, duration: 300 })
            .add({ targets: titleOverlay, translateY: [20,0], opacity: [0,1], duration: 300, offset: '-=150' })
            .add({ targets: descOverlay, translateY: [20,0], opacity: [0,1], duration: 300, offset: '-=200' })
            .add({ targets: projectLink, translateY: [20,0], opacity: [0,1], duration: 300, offset: '-=250' });
        });

        card.addEventListener('mouseleave', () => {
            anime({ targets: img, scale: 1, rotateZ: '0deg', duration: 400, easing: 'easeOutExpo' });
            anime.timeline({ targets: overlay, easing: 'easeOutExpo' })
            .add({ opacity: 0, duration: 300 })
            .add({ targets: [titleOverlay, descOverlay, projectLink], translateY: [0, 20], opacity: [1, 0], duration: 200, offset: '-=200' });
        });
    });
});
