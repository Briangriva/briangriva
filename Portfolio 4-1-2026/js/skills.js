document.addEventListener('DOMContentLoaded', () => {
    const skillItems = document.querySelectorAll('.skill-item');

    const skillWaveColors = [
        '#00bcd4','#26c6da','#29b6f6','#42a5f5','#673ab7','#9575cd','#8bc34a','#ffc107',
        '#f44336','#e91e63','#9c27b0','#3f51b5','#03a9f4','#009688','#4caf50','#cddc39',
        '#ffeb3b','#ff9800','#ff5722','#795548','#607d8b','#9e9e9e','#e0e0e0'
    ];

    let skillAnimationTimeline = null;

    function animateSkillsWave() {
        if (skillAnimationTimeline) {
            skillAnimationTimeline.pause();
            skillAnimationTimeline = null;
        }

        skillAnimationTimeline = anime.timeline({
            easing: 'easeInOutQuad',
            loop: true,
            duration: 12000
        })
        .add({
            targets: skillItems,
            backgroundColor: {
                value: (el, i, l) => skillWaveColors[anime.random(0, skillWaveColors.length - 1)],
                easing: 'easeOutExpo',
                duration: 2500
            },
            scale: [
                { value: 1.1, easing: 'easeOutExpo', duration: 1500 },
                { value: 1, easing: 'easeOutQuad', duration: 3000 }
            ],
            rotateZ: [
                { value: 4, easing: 'easeOutExpo', duration: 1500 },
                { value: 0, easing: 'easeOutQuad', duration: 3000 }
            ],
            delay: anime.stagger(1200, {grid: [5, 4], from: 'last'})
        });
    }

    function stopSkillsAnimation() {
        if (skillAnimationTimeline) {
            skillAnimationTimeline.pause();
            skillAnimationTimeline = null;
        }
        anime.remove(skillItems);
        skillItems.forEach(item => {
            item.style.backgroundColor = '';
            item.style.color = 'var(--bg-color)';
            item.style.filter = '';
            item.style.boxShadow = '';
        });
    }

    window.animateSkillsWave = animateSkillsWave;
    window.stopSkillsAnimation = stopSkillsAnimation;
});
