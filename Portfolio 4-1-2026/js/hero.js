// Hero animations (animateHeroTitle, animateHeroSubtitle)
function animateHeroTitle() {
    anime.timeline({
        easing: 'easeOutQuad',
        duration: 900,
        delay: anime.stagger(120),
        loop: false
    })
    .add({
        targets: '.hero-title .letter',
        translateY: [-100, 0],
        opacity: [0, 1],
        rotateZ: [90, 0],
        scale: [0.5, 1]
    });
}

function animateHeroSubtitle() {
    anime({
        targets: '.hero-subtitle',
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        delay: 1000,
        easing: 'easeOutCubic'
    });
}

window.animateHeroTitle = animateHeroTitle;
window.animateHeroSubtitle = animateHeroSubtitle;
