document.addEventListener('DOMContentLoaded', () => {
    const loaderOverlay = document.getElementById('loader-overlay');
    const progressBar = loaderOverlay.querySelector('.progress-bar');
    const progressPercentage = loaderOverlay.querySelector('.progress-percentage');
    let loadingProgress = 0;

    function updateLoader() {
        loadingProgress += Math.random() * 15 + 10;
        if (loadingProgress > 100) loadingProgress = 100;

        anime({ targets: progressBar, width: `${loadingProgress}%`, duration: 200, easing: 'linear' });
        anime({ targets: progressPercentage, textContent: `${Math.round(loadingProgress)}%`, round: 1, duration: 200, easing: 'linear' });

        if (loadingProgress < 100) {
            setTimeout(updateLoader, 300);
        } else {
            anime.timeline({ easing: 'easeOutQuad', duration: 800 })
            .add({ targets: '#loader-overlay .loader-letter', translateY: [0, -50], opacity: [1, 0], delay: anime.stagger(50, { direction: 'reverse' }) })
            .add({ targets: ['.progress-bar-container', '.progress-percentage'], opacity: [1, 0], translateY: [0, -20], duration: 300, offset: '-=500' })
            .add({ targets: '#loader-overlay', opacity: 0, visibility: 'hidden', delay: 300, complete: function() {
                loaderOverlay.style.display = 'none';
                if (typeof animateHeroTitle === 'function') animateHeroTitle();
                if (typeof animateHeroSubtitle === 'function') animateHeroSubtitle();
                if (typeof initParticleGame === 'function') initParticleGame();
                if (typeof startIdleAnimation === 'function') startIdleAnimation();
            } }, '+=200');
        }
    }

    anime.timeline({ easing: 'easeOutExpo', duration: 1200 })
    .add({
        targets: '#loader-overlay .loader-letter',
        translateY: [100,0],
        opacity: [0,1],
        rotate: [30,0],
        delay: anime.stagger(80),
        begin: function(anim) {
            loaderOverlay.style.opacity = '1';
            loaderOverlay.style.visibility = 'visible';
            setTimeout(updateLoader, 500);
        }
    });
});
