document.addEventListener('DOMContentLoaded', () => {
    const certificateCards = document.querySelectorAll('.certificate-card');
    let idleAnimationTimeout;
    let currentFlippedCard = null;

    certificateCards.forEach(card => {
        const cardInner = card.querySelector('.card-inner');
        const cardBackElements = card.querySelectorAll('.card-back h3, .card-back p, .card-back a');

        let isFlipped = false;

        card.addEventListener('mouseenter', () => {
            if (currentFlippedCard && currentFlippedCard !== card) {
                const otherCardInner = currentFlippedCard.querySelector('.card-inner');
                const otherCardBackElements = currentFlippedCard.querySelectorAll('.card-back h3, .card-back p, .card-back a');

                anime.timeline({ easing: 'easeInOutQuad' })
                .add({ targets: otherCardBackElements, opacity: [1, 0], translateY: [0, 20], duration: 200, delay: anime.stagger(50, {direction: 'reverse'}) })
                .add({ targets: otherCardInner, rotateY: 0, duration: 600 }, '-=100');
                currentFlippedCard.classList.remove('is-flipped');
            }

            anime.timeline({ easing: 'easeInOutQuad' })
            .add({ targets: cardInner, rotateY: 180, duration: 600, complete: () => {
                card.classList.add('is-flipped');
                isFlipped = true;
                currentFlippedCard = card;
            }})
            .add({ targets: cardBackElements, opacity: [0, 1], translateY: [20, 0], duration: 300, delay: anime.stagger(100) }, '-=300');

            stopIdleAnimation();
        });

        card.addEventListener('mouseleave', () => {
            startIdleAnimation();
        });
    });

    function startIdleAnimation() {
        stopIdleAnimation();

        idleAnimationTimeout = setTimeout(() => {
            const randomCardIndex = Math.floor(Math.random() * certificateCards.length);
            const randomCard = certificateCards[randomCardIndex];

            if (randomCard && !randomCard.classList.contains('is-flipped')) {
                anime.timeline({ easing: 'easeInOutQuad', duration: 500, complete: () => { startIdleAnimation(); } })
                .add({ targets: randomCard, scale: [1, 1.03, 1], rotateZ: [-1, 1, 0], duration: 400 })
                .add({ targets: randomCard.querySelector('.card-inner'), rotateY: [0, 10, -10, 0], duration: 800, delay: 200, loopComplete: (anim) => { anim.seek(anim.duration); } }, '-=300');
            } else {
                startIdleAnimation();
            }
        }, Math.random() * 4000 + 3000);
    }

    function stopIdleAnimation() {
        clearTimeout(idleAnimationTimeout);
        anime.remove(Array.from(certificateCards));
    }

    const certificatesSection = document.getElementById('certificates');
    if (certificatesSection) {
        certificatesSection.addEventListener('mouseleave', () => {
            if (currentFlippedCard) {
                const otherCardInner = currentFlippedCard.querySelector('.card-inner');
                const otherCardBackElements = currentFlippedCard.querySelectorAll('.card-back h3, .card-back p, .card-back a');

                anime.timeline({ easing: 'easeInOutQuad' })
                .add({ targets: otherCardBackElements, opacity: [1, 0], translateY: [0, 20], duration: 200, delay: anime.stagger(50, {direction: 'reverse'}) })
                .add({ targets: otherCardInner, rotateY: 0, duration: 600, complete: () => {
                    currentFlippedCard.classList.remove('is-flipped');
                    currentFlippedCard = null;
                } }, '-=100');
            }
            startIdleAnimation();
        });
    }

    window.startIdleAnimation = startIdleAnimation;
    window.stopIdleAnimation = stopIdleAnimation;
});
