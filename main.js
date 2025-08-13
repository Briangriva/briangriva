document.addEventListener('DOMContentLoaded', () => {

    const loaderOverlay = document.getElementById('loader-overlay');
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;
    const navItems = document.querySelectorAll('.main-nav a');
    const contentSections = document.querySelectorAll('.content-section');
    const projectCards = document.querySelectorAll('.project-card');
    const certificateCards = document.querySelectorAll('.certificate-card');
    const skillItems = document.querySelectorAll('.skill-item');
    let idleAnimationTimeout;
    let currentFlippedCard = null;
    let skillAnimationTimeline = null;

    // --- Loader Elements ---
    const progressBar = loaderOverlay.querySelector('.progress-bar');
    const progressPercentage = loaderOverlay.querySelector('.progress-percentage');
    let loadingProgress = 0;

    function updateLoader() {
        loadingProgress += Math.random() * 15 + 10;
        if (loadingProgress > 100) loadingProgress = 100;

        anime({
            targets: progressBar,
            width: `${loadingProgress}%`,
            duration: 200,
            easing: 'linear'
        });

        anime({
            targets: progressPercentage,
            textContent: `${Math.round(loadingProgress)}%`,
            round: 1,
            duration: 200,
            easing: 'linear'
        });

        if (loadingProgress < 100) {
            setTimeout(updateLoader, 300);
        } else {
            anime.timeline({
                easing: 'easeOutQuad',
                duration: 800
            })
            .add({
                targets: '#loader-overlay .loader-letter',
                translateY: [0, -50],
                opacity: [1, 0],
                delay: anime.stagger(50, { direction: 'reverse' })
            })
            .add({
                targets: ['.progress-bar-container', '.progress-percentage'],
                opacity: [1, 0],
                translateY: [0, -20],
                duration: 300,
                offset: '-=500'
            })
            .add({
                targets: '#loader-overlay',
                opacity: 0,
                visibility: 'hidden',
                delay: 300,
                complete: function(anim) {
                    loaderOverlay.style.display = 'none';
                    animateHeroTitle();
                    animateHeroSubtitle();
                    // --- AQUÍ INICIAMOS EL JUEGO DE PARTÍCULAS ---
                    initParticleGame();
                    startIdleAnimation(); // Puede que quieras ajustar cuándo inicia esta si choca con el juego
                }
            }, '+=200');
        }
    }

    anime.timeline({
        easing: 'easeOutExpo',
        duration: 1200
    })
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

    // --- Hero Section Animations ---
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

    // --- Dark Mode Toggle ---
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
        anime({
            targets: themeToggle,
            scale: [1, 1.2, 1],
            rotate: [0, 15, -15, 0],
            duration: 400,
            easing: 'easeInOutQuad'
        });
        // --- Actualizar colores de las partículas al cambiar el tema ---
        if (typeof updateParticleColors === 'function') {
            updateParticleColors();
        }
    });

    // --- Navigation Menu Animations ---
    navItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            // Se asume que el `::after` está siendo manejado por CSS para el subrayado
            // Si no, esta parte del código puede necesitar ajustes o ser eliminada si solo usa CSS puro.
            // Para pseudoelementos, necesitas CSS para animarlos directamente.
            // Si '::after' es un elemento real, entonces estaría bien.
            // Por el momento lo dejaré como está en tu código.

            anime({
                targets: item,
                color: 'var(--primary-accent)',
                scale: [1, 1.05],
                translateX: [0, 5],
                easing: 'easeOutQuad',
                duration: 300
            });
        });

        item.addEventListener('mouseleave', () => {
            // Similar al mouseenter, manejo de pseudoelementos.
            anime({
                targets: item,
                color: 'var(--text-color)',
                scale: [1.05, 1],
                translateX: [5, 0],
                easing: 'easeOutQuad',
                duration: 300
            });
        });

        item.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = item.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                anime({
                    targets: document.documentElement,
                    scrollTop: targetSection.offsetTop - 50,
                    duration: 800,
                    easing: 'easeInOutQuint'
                });
            }
        });
    });

    // --- Content Section Scroll Reveal ---
    const sectionObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const sectionObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('is-visible')) {
                if (entry.target.id === 'about' || entry.target.id === 'contact') {
                    anime({
                        targets: entry.target,
                        translateY: [60, 0],
                        opacity: [0, 1],
                        duration: 1000,
                        easing: 'easeOutExpo',
                        delay: 200,
                        complete: () => entry.target.classList.add('is-visible')
                    });
                } else if (entry.target.id === 'skills') {
                    anime.timeline({
                        targets: entry.target,
                        duration: 1000,
                        easing: 'easeOutExpo',
                        delay: 100,
                        complete: () => {
                            entry.target.classList.add('is-visible');
                            animateSkillsWave();
                        }
                    })
                    .add({
                        translateY: [60, 0],
                        opacity: [0, 1],
                        duration: 800
                    }, 0)
                    .add({
                        targets: '.skill-item',
                        scale: [0, 1],
                        rotateZ: [-30, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(80, {start: 300}),
                        duration: 600,
                        easing: 'easeOutBack'
                    }, '-=700');
                } else if (entry.target.id === 'projects') {
                    const cards = entry.target.querySelectorAll('.project-card');
                    anime.timeline({
                        targets: entry.target,
                        duration: 1000,
                        easing: 'easeOutExpo',
                        delay: 100,
                        complete: () => entry.target.classList.add('is-visible')
                    })
                    .add({
                        translateY: [60, 0],
                        opacity: [0, 1],
                        duration: 800
                    }, 0)
                    .add({
                        targets: cards,
                        scale: [0.8, 1],
                        translateY: [50, 0],
                        opacity: [0, 1],
                        delay: anime.stagger(100, {start: 300}),
                        duration: 700,
                        easing: 'easeOutCubic'
                    }, '-=700');
                } else if (entry.target.id === 'certificates') {
                    anime.timeline({
                        targets: entry.target,
                        duration: 1000,
                        easing: 'easeOutExpo',
                        delay: 100,
                        complete: () => entry.target.classList.add('is-visible')
                    })
                    .add({
                        translateY: [60, 0],
                        opacity: [0, 1],
                        duration: 800
                    }, 0)
                    .add({
                        targets: '.certificate-card',
                        scale: [0.5, 1],
                        opacity: [0, 1],
                        translateY: [50, 0],
                        delay: anime.stagger(100, {start: 300, from: 'random'}),
                        duration: 700,
                        easing: 'easeOutBack'
                    }, '-=700');
                }
            } else if (!entry.isIntersecting && entry.target.id === 'skills' && entry.target.classList.contains('is-visible')) {
                stopSkillsAnimation();
                entry.target.classList.remove('is-visible');
            }
        });
    }, sectionObserverOptions);

    contentSections.forEach(section => {
        sectionObserver.observe(section);
    });

    // Colores vibrantes para la onda de Habilidades (nueva paleta extendida)
    const skillWaveColors = [
        '#00bcd4', // Cian (primary-accent)
        '#26c6da', // Cian más claro
        '#29b6f6', // Azul cielo
        '#42a5f5', // Azul medio
        '#673ab7', // Púrpura oscuro (secondary-accent)
        '#9575cd', // Púrpura medio
        '#8bc34a', // Verde lima (acento extra)
        '#ffc107', // Ámbar (acento extra para contraste)
        '#f44336', // Rojo
        '#e91e63', // Rosa
        '#9c27b0', // Púrpura
        '#3f51b5', // Índigo
        '#03a9f4', // Azul claro
        '#009688', // Teal
        '#4caf50', // Verde
        '#cddc39', // Lima
        '#ffeb3b', // Amarillo
        '#ff9800', // Naranja
        '#ff5722', // Naranja oscuro
        '#795548', // Marrón
        '#607d8b', // Azul gris
        '#9e9e9e', // Gris
        '#e0e0e0'  // Gris claro
    ];

    function animateSkillsWave() {
        stopSkillsAnimation();

        skillAnimationTimeline = anime.timeline({
            easing: 'easeInOutQuad',
            loop: true,
            duration: 12000 // Duración total del ciclo para todos los elementos
        })
        .add({
            targets: skillItems,
            backgroundColor: {
                value: (el, i, l) => skillWaveColors[anime.random(0, skillWaveColors.length - 1)],
                easing: 'easeOutExpo',
                duration: 2500 // Duración de la transición de color para cada elemento
            },
            scale: [
                { value: 1.1, easing: 'easeOutExpo', duration: 1500 },
                { value: 1, easing: 'easeOutQuad', duration: 3000 }
            ],
            rotateZ: [
                { value: 4, easing: 'easeOutExpo', duration: 1500 },
                { value: 0, easing: 'easeOutQuad', duration: 3000 }
            ],
            delay: anime.stagger(1200, {grid: [5, 4], from: 'last'}), // Retraso escalonado para la onda
        });
    }

    function stopSkillsAnimation() {
        if (skillAnimationTimeline) {
            skillAnimationTimeline.pause();
            skillAnimationTimeline = null;
        }
        // Asegúrate de que Anime.js detenga cualquier animación activa en skillItems
        anime.remove(skillItems);
        skillItems.forEach(item => {
            item.style.backgroundColor = '';
            item.style.color = 'var(--bg-color)';
            item.style.filter = '';
            item.style.boxShadow = '';
        });
    }

    // --- Eliminada la función addSkillHoverEffects() ---
    // Ya no es necesaria porque el hover se gestionará con CSS.


    // --- Project Gallery Hover Effects ---
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

            anime.timeline({
                targets: overlay,
                easing: 'easeOutExpo'
            })
            .add({
                opacity: 1,
                duration: 300
            })
            .add({
                targets: titleOverlay,
                translateY: [20,0],
                opacity: [0,1],
                duration: 300,
                offset: '-=150'
            })
            .add({
                targets: descOverlay,
                translateY: [20,0],
                opacity: [0,1],
                duration: 300,
                offset: '-=200'
            })
            .add({
                targets: projectLink,
                translateY: [20,0],
                opacity: [0,1],
                duration: 300,
                offset: '-=250'
            });
        });

        card.addEventListener('mouseleave', () => {
            anime({
                targets: img,
                scale: 1,
                rotateZ: '0deg',
                duration: 400,
                easing: 'easeOutExpo'
            });

            anime.timeline({
                targets: overlay,
                easing: 'easeOutExpo'
            })
            .add({
                opacity: 0,
                duration: 300
            })
            .add({
                targets: [titleOverlay, descOverlay, projectLink],
                translateY: [0, 20],
                opacity: [1, 0],
                duration: 200,
                offset: '-=200'
            });
        });
    });

    // --- Certificate Gallery (Card Flip) Logic ---

    certificateCards.forEach(card => {
        const cardInner = card.querySelector('.card-inner');
        const cardBackElements = card.querySelectorAll('.card-back h3, .card-back p, .card-back a');

        let isFlipped = false;

        card.addEventListener('mouseenter', () => {
            if (currentFlippedCard && currentFlippedCard !== card) {
                const otherCardInner = currentFlippedCard.querySelector('.card-inner');
                const otherCardBackElements = currentFlippedCard.querySelectorAll('.card-back h3, .card-back p, .card-back a');

                anime.timeline({ easing: 'easeInOutQuad' })
                .add({
                    targets: otherCardBackElements,
                    opacity: [1, 0],
                    translateY: [0, 20],
                    duration: 200,
                    delay: anime.stagger(50, {direction: 'reverse'})
                })
                .add({
                    targets: otherCardInner,
                    rotateY: 0,
                    duration: 600
                }, '-=100');
                currentFlippedCard.classList.remove('is-flipped');
            }

            anime.timeline({ easing: 'easeInOutQuad' })
            .add({
                targets: cardInner,
                rotateY: 180,
                duration: 600,
                complete: () => {
                    card.classList.add('is-flipped');
                    isFlipped = true;
                    currentFlippedCard = card;
                }
            })
            .add({
                targets: cardBackElements,
                opacity: [0, 1],
                translateY: [20, 0],
                duration: 300,
                delay: anime.stagger(100)
            }, '-=300');

            stopIdleAnimation();
        });

        card.addEventListener('mouseleave', () => {
            startIdleAnimation();
        });
    });

    // --- Idle Animation for Certificates ---
    function startIdleAnimation() {
        stopIdleAnimation();

        idleAnimationTimeout = setTimeout(() => {
            const randomCardIndex = Math.floor(Math.random() * certificateCards.length);
            const randomCard = certificateCards[randomCardIndex];

            if (randomCard && !randomCard.classList.contains('is-flipped')) {
                anime.timeline({
                    easing: 'easeInOutQuad',
                    duration: 500,
                    complete: () => {
                        startIdleAnimation();
                    }
                })
                .add({
                    targets: randomCard,
                    scale: [1, 1.03, 1],
                    rotateZ: [-1, 1, 0],
                    duration: 400
                })
                .add({
                    targets: randomCard.querySelector('.card-inner'),
                    rotateY: [0, 10, -10, 0],
                    duration: 800,
                    delay: 200,
                    loopComplete: (anim) => {
                         anim.seek(anim.duration);
                    }
                }, '-=300');
            } else {
                startIdleAnimation();
            }
        }, Math.random() * 4000 + 3000);
    }

    function stopIdleAnimation() {
        clearTimeout(idleAnimationTimeout);
        anime.remove(certificateCards.forEach(card => card));
    }

    const certificatesSection = document.getElementById('certificates');
    if (certificatesSection) {
        certificatesSection.addEventListener('mouseleave', () => {
            if (currentFlippedCard) {
                const otherCardInner = currentFlippedCard.querySelector('.card-inner');
                const otherCardBackElements = currentFlippedCard.querySelectorAll('.card-back h3, .card-back p, .card-back a');

                anime.timeline({ easing: 'easeInOutQuad' })
                .add({
                    targets: otherCardBackElements,
                    opacity: [1, 0],
                    translateY: [0, 20],
                    duration: 200,
                    delay: anime.stagger(50, {direction: 'reverse'})
                })
                .add({
                    targets: otherCardInner,
                    rotateY: 0,
                    duration: 600,
                    complete: () => {
                        currentFlippedCard.classList.remove('is-flipped');
                        currentFlippedCard = null;
                    }
                }, '-=100');
            }
            startIdleAnimation();
        });
    }

    // --- Animación del Aura para el Email ---
    const contactEmail = document.getElementById('contact-email');

    if (contactEmail) {
        function getCurrentAccentColorRGBForAura() {
            const accentColor = getComputedStyle(document.documentElement).getPropertyValue('--primary-accent-rgb');
            return accentColor.trim() === '' ? '0, 188, 212' : accentColor;
        }

        anime({
            targets: contactEmail,
            textShadow: [
                {
                    value: (el) => {
                        const rgb = getCurrentAccentColorRGBForAura();
                        return `
                            0 0 8px rgba(${rgb}, 0.7),
                            0 0 15px rgba(${rgb}, 0.5),
                            0 0 25px rgba(${rgb}, 0.3),
                            0 0 40px rgba(${rgb}, 0.1)
                        `;
                    }
                },
                {
                    value: (el) => {
                        const rgb = getCurrentAccentColorRGBForAura();
                        return `
                            0 0 15px rgba(${rgb}, 0.9),
                            0 0 25px rgba(${rgb}, 0.7),
                            0 0 40px rgba(${rgb}, 0.5),
                            0 0 60px rgba(${rgb}, 0.3)
                        `;
                    },
                    duration: 1000,
                    easing: 'easeOutQuad'
                },
                {
                    value: (el) => {
                        const rgb = getCurrentAccentColorRGBForAura();
                        return `
                            0 0 8px rgba(${rgb}, 0.7),
                            0 0 15px rgba(${rgb}, 0.5),
                            0 0 25px rgba(${rgb}, 0.3),
                            0 0 40px rgba(${rgb}, 0.1)
                        `;
                    },
                    duration: 1500,
                    easing: 'easeInOutQuad'
                }
            ],
            scale: [
                { value: 1.02, duration: 800, easing: 'easeOutSine' },
                { value: 1, duration: 1200, easing: 'easeInSine' }
            ],
            loop: true,
            direction: 'alternate',
            autoplay: true,
            duration: 2500
        });
    }


    // ==========================================================
    // --- NUEVO CÓDIGO DEL JUEGO DE PARTÍCULAS INTERACTIVO ---
    // ==========================================================

    let canvas, ctx;
    let particles = [];
    let mouse = { x: null, y: null, radius: 150 }; // Radio de repulsión del mouse

    const NUM_PARTICLES = 30;
    const PARTICLE_COLORS_HEX = [
        '#FF6347', // Tomato
        '#6A5ACD', // SlateBlue
        '#3CB371', // MediumSeaGreen
        '#FFD700', // Gold
        '#8A2BE2', // BlueViolet
        '#00CED1'  // DarkTurquoise
    ];
    const PARTICLE_COLORS_RGB = PARTICLE_COLORS_HEX.map(hexToRgb); // Convertir a RGB para el aura y fuegos artificiales

    // Función auxiliar para convertir HEX a RGB
    function hexToRgb(hex) {
        let r = 0, g = 0, b = 0;
        // 3 caracteres hex
        if (hex.length == 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        }
        // 6 caracteres hex
        else if (hex.length == 7) {
            r = parseInt(hex.substring(1, 3), 16);
            g = parseInt(hex.substring(3, 5), 16);
            b = parseInt(hex.substring(5, 7), 16);
        }
        return `${r}, ${g}, ${b}`;
    }

    // Colores para el aura y fuegos artificiales, serán dinámicos
    let currentParticleAuraColors = [];
    function updateParticleAuraColors() {
        currentParticleAuraColors = PARTICLE_COLORS_HEX.map(hex => {
            const rgb = hexToRgb(hex);
            return {
                base: `rgba(${rgb}, 0.6)`,
                glow: `rgba(${rgb}, 0.2)`
            };
        });
    }
    updateParticleAuraColors(); // Inicializar colores al cargar

    // Clase para representar cada partícula
    class Particle {
        constructor(x, y, radius, colorIndex) {
            this.x = x;
            this.y = y;
            this.radius = radius;
            this.baseRadius = radius; // Radio original para reajuste
            this.colorIndex = colorIndex;
            this.color = PARTICLE_COLORS_HEX[colorIndex];
            this.rgbColor = PARTICLE_COLORS_RGB[colorIndex];
            this.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 }; // Velocidad inicial aleatoria
            this.fusionCount = 1; // Cuántas partículas se han fusionado en esta
            this.isExploding = false; // Estado para la animación de explosión
            this.explosionTimer = 0; // Temporizador para la explosión
            this.explosionParticles = []; // Partículas para el efecto de fuego artificial
        }

        draw() {
            if (this.isExploding) {
                this.drawExplosion();
                return;
            }

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();

            // Dibujar aura de resplandor
            const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.5, this.x, this.y, this.radius * 2);
            const auraColor = currentParticleAuraColors[this.colorIndex];
            if (auraColor) { // Asegura que el color exista
                gradient.addColorStop(0, auraColor.base);
                gradient.addColorStop(1, auraColor.glow);
            } else {
                // Fallback si por alguna razón no se encuentra el color
                gradient.addColorStop(0, `rgba(${this.rgbColor}, 0.6)`);
                gradient.addColorStop(1, `rgba(${this.rgbColor}, 0.2)`);
            }
            
            ctx.globalAlpha = 0.5; // Transparencia para el aura
            ctx.fillStyle = gradient;
            ctx.fill();
            ctx.globalAlpha = 1; // Restaurar opacidad

            // Dibujar un borde blanco para mayor visibilidad, especialmente en Dark Mode
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.lineWidth = 1;
            ctx.stroke();
        }

        update() {
            if (this.isExploding) {
                this.updateExplosion();
                return;
            }

            // Mover la partícula
            this.x += this.velocity.x;
            this.y += this.velocity.y;

            // Rebotar en los bordes de la pantalla
            if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
                this.velocity.x *= -1;
            }
            if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
                this.velocity.y *= -1;
            }

            // Repulsión del mouse
            if (mouse.x && mouse.y) {
                const dx = this.x - mouse.x;
                const dy = this.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouse.radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (mouse.radius - distance) / mouse.radius; // Fuerza inversamente proporcional a la distancia
                    this.velocity.x += Math.cos(angle) * force * 2; // Multiplicador para la fuerza
                    this.velocity.y += Math.sin(angle) * force * 2;
                }
            }
        }

        // Método para iniciar la explosión
        startExplosion() {
            this.isExploding = true;
            this.explosionTimer = 3 * 60; // 3 segundos * 60 fps
            // Generar partículas de fuego artificial
            for (let i = 0; i < 50; i++) { // 50 partículas para el fuego artificial
                this.explosionParticles.push({
                    x: this.x,
                    y: this.y,
                    vx: (Math.random() - 0.5) * 10,
                    vy: (Math.random() - 0.5) * 10,
                    alpha: 1,
                    radius: Math.random() * 2 + 1,
                    color: `rgba(${this.rgbColor}, 1)` // Color sólido para las partículas de la explosión
                });
            }
        }

        // Método para actualizar la animación de explosión
        updateExplosion() {
            if (this.explosionTimer > 0) {
                this.explosionTimer--;
                this.radius = this.baseRadius + Math.sin((3 * 60 - this.explosionTimer) / 10) * 5; // Efecto vibrante

                this.explosionParticles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;
                    p.vy += 0.1; // Gravedad
                    p.alpha -= 0.015; // Desvanecimiento
                    if (p.alpha < 0) p.alpha = 0; // Asegurar que no sea negativo
                });

            } else {
                // Cuando el temporizador llega a cero, la explosión termina
                // La partícula principal simplemente desaparecerá al ser filtrada
                // No necesitamos hacer nada más aquí, ya que será removida del array `particles`
            }
        }

        // Método para dibujar la animación de explosión
        drawExplosion() {
            // Dibujar la "bomba" central vibrante antes de la explosión final
            if (this.explosionTimer > 0) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.color;
                ctx.fill();
                // Añadir un pulso de luz a la bomba
                const pulseAlpha = Math.sin((3 * 60 - this.explosionTimer) / 5) * 0.5 + 0.5;
                const pulseRadius = this.radius * (1 + Math.sin((3 * 60 - this.explosionTimer) / 10) * 0.2);
                const pulseGradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.5, this.x, this.y, pulseRadius);
                pulseGradient.addColorStop(0, `rgba(255, 255, 255, ${pulseAlpha * 0.8})`);
                pulseGradient.addColorStop(1, `rgba(${this.rgbColor}, 0)`);
                ctx.fillStyle = pulseGradient;
                ctx.fill();
            }

            // Dibujar partículas del fuego artificial
            this.explosionParticles.forEach(p => {
                if (p.alpha > 0) {
                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(${this.rgbColor}, ${p.alpha})`; // Usar el color RGB de la partícula original
                    ctx.fill();
                }
            });
        }
    }

    // Función principal de inicialización del juego
    function initParticleGame() {
        canvas = document.createElement('canvas');
        canvas.id = 'particle-game-canvas'; // Asigna el ID para el CSS
        document.body.prepend(canvas); // Añade el canvas al principio del body

        ctx = canvas.getContext('2d');
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Crear partículas
        for (let i = 0; i < NUM_PARTICLES; i++) {
            const colorIndex = Math.floor(i / (NUM_PARTICLES / PARTICLE_COLORS_HEX.length)); // Divide en grupos de 5
            particles.push(new Particle(
                Math.random() * canvas.width, // Posición X aleatoria
                Math.random() * canvas.height, // Posición Y aleatoria
                7, // Radio base
                colorIndex // Índice de color
            ));
        }

        // Eventos del mouse
        canvas.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        canvas.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Iniciar el bucle de animación
        animateParticleGame();
    }

    // Ajustar tamaño del canvas
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // Función para actualizar los colores del aura y fuegos artificiales al cambiar el tema
    // Esta función se llama desde el toggle de dark mode
    window.updateParticleColors = function() {
        updateParticleAuraColors();
        // Opcional: Re-renderizar o forzar actualización para aplicar el cambio inmediatamente
        // Esto puede ser complejo si las partículas están en medio de una animación.
        // Lo más simple es que el cambio se vea reflejado en las nuevas partículas o en la siguiente explosión.
        // Para las partículas existentes, ya usan currentParticleAuraColors
    };

    // Bucle principal de animación del juego de partículas
    function animateParticleGame() {
        requestAnimationFrame(animateParticleGame);
        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpiar canvas

        // Actualizar y dibujar cada partícula
        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();
            p1.draw();

            // Lógica de colisión y fusión con otras partículas
            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];

                // Calcular distancia
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const minDistanceForCollision = p1.radius + p2.radius;

                if (distance < minDistanceForCollision) {
                    if (p1.colorIndex === p2.colorIndex) {
                        // Mismo color: Imantación y Fusión
                        if (!p1.isExploding && !p2.isExploding) { // No fusionar si alguna ya está explotando
                            const totalFusionCount = p1.fusionCount + p2.fusionCount;
                            const newRadius = Math.sqrt(p1.radius * p1.radius + p2.radius * p2.radius); // Aumentar tamaño
                            const newX = (p1.x * p1.fusionCount + p2.x * p2.fusionCount) / totalFusionCount;
                            const newY = (p1.y * p1.fusionCount + p2.y * p2.fusionCount) / totalFusionCount;

                            // Crear una nueva partícula fusionada
                            const mergedParticle = new Particle(newX, newY, newRadius, p1.colorIndex);
                            mergedParticle.fusionCount = totalFusionCount;
                            mergedParticle.velocity = {
                                x: (p1.velocity.x * p1.fusionCount + p2.velocity.x * p2.fusionCount) / totalFusionCount,
                                y: (p1.velocity.y * p1.fusionCount + p2.velocity.y * p2.fusionCount) / totalFusionCount
                            };

                            // Eliminar las dos partículas originales
                            particles.splice(j, 1); // Eliminar p2 primero para no afectar el índice de p1
                            particles.splice(i, 1);

                            // Añadir la partícula fusionada
                            particles.push(mergedParticle);

                            // Si se han fusionado las 5, iniciar explosión
                            if (mergedParticle.fusionCount >= 5) {
                                mergedParticle.startExplosion();
                            }
                            // Reajustar i y j para el siguiente ciclo ya que el array ha cambiado
                            i--; // para reevaluar la partícula actual (si se fusionó con la anterior)
                            break; // Salir del bucle interno ya que p2 fue eliminada
                        }
                    } else {
                        // Diferente color: Rebote
                        const angle = Math.atan2(dy, dx);
                        const overlap = minDistanceForCollision - distance;
                        const pushForce = overlap * 0.5; // Fuerza de empuje para separarlas

                        // Mover partículas para resolver la superposición
                        p1.x += Math.cos(angle) * pushForce;
                        p1.y += Math.sin(angle) * pushForce;
                        p2.x -= Math.cos(angle) * pushForce;
                        p2.y -= Math.sin(angle) * pushForce;

                        // Calcular nuevas velocidades (rebote elástico simple)
                        const p1NewVx = p2.velocity.x;
                        const p1NewVy = p2.velocity.y;
                        p2.velocity.x = p1.velocity.x;
                        p2.velocity.y = p1.velocity.y;
                        p1.velocity.x = p1NewVx;
                        p1.velocity.y = p1NewVy;

                        // Ajustar la dirección de la velocidad para que reboten
                        p1.velocity.x *= -1;
                        p1.velocity.y *= -1;
                        p2.velocity.x *= -1;
                        p2.velocity.y *= -1;
                    }
                }
            }
        }

        // Filtrar partículas que han terminado de explotar
        particles = particles.filter(p => !p.isExploding || p.explosionTimer > 0);

        // Si todas las partículas de un color han explotado y desaparecido, recrearlas
        // Este es el "reset" del juego por color
        PARTICLE_COLORS_HEX.forEach((colorHex, colorIdx) => {
            const count = particles.filter(p => p.colorIndex === colorIdx && !p.isExploding).length;
            if (count === 0) { // Si no quedan partículas de este color (o todas explotaron)
                // Esperar un momento antes de recrearlas para que el efecto de explosión termine
                setTimeout(() => {
                    for (let i = 0; i < 5; i++) { // Recrear las 5 partículas originales de ese color
                        particles.push(new Particle(
                            Math.random() * canvas.width,
                            Math.random() * canvas.height,
                            7, // Radio base
                            colorIdx
                        ));
                    }
                }, 1000); // Pequeño retraso antes de reaparecer
            }
        });
    }

});