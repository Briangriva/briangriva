// Particle game (interactive background)
/* Depends on utils.hexToRgb being available (loaded before this file) */
let canvas, ctx;
let particles = [];
let mouse = { x: null, y: null, radius: 150 };

const NUM_PARTICLES = 30;
const PARTICLE_COLORS_HEX = [
    '#FF6347',
    '#6A5ACD',
    '#3CB371',
    '#FFD700',
    '#8A2BE2',
    '#00CED1'
];
const PARTICLE_COLORS_RGB = PARTICLE_COLORS_HEX.map(hexToRgb);

function hexToRgbFallback(h) {
    return typeof hexToRgb === 'function' ? hexToRgb(h) : '0, 0, 0';
}

// Colores para el aura y fuegos artificiales
let currentParticleAuraColors = [];
function updateParticleAuraColors() {
    currentParticleAuraColors = PARTICLE_COLORS_HEX.map(hex => {
        const rgb = hexToRgbFallback(hex);
        return {
            base: `rgba(${rgb}, 0.6)`,
            glow: `rgba(${rgb}, 0.2)`
        };
    });
}
updateParticleAuraColors();

class Particle {
    constructor(x, y, radius, colorIndex) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.baseRadius = radius;
        this.colorIndex = colorIndex;
        this.color = PARTICLE_COLORS_HEX[colorIndex];
        this.rgbColor = PARTICLE_COLORS_RGB[colorIndex];
        this.velocity = { x: (Math.random() - 0.5) * 2, y: (Math.random() - 0.5) * 2 };
        this.fusionCount = 1;
        this.isExploding = false;
        this.explosionTimer = 0;
        this.explosionParticles = [];
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

        const gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.5, this.x, this.y, this.radius * 2);
        const auraColor = currentParticleAuraColors[this.colorIndex];
        if (auraColor) {
            gradient.addColorStop(0, auraColor.base);
            gradient.addColorStop(1, auraColor.glow);
        } else {
            gradient.addColorStop(0, `rgba(${this.rgbColor}, 0.6)`);
            gradient.addColorStop(1, `rgba(${this.rgbColor}, 0.2)`);
        }
        ctx.globalAlpha = 0.5;
        ctx.fillStyle = gradient;
        ctx.fill();
        ctx.globalAlpha = 1;

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }

    update() {
        if (this.isExploding) {
            this.updateExplosion();
            return;
        }

        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.velocity.x *= -1;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.velocity.y *= -1;
        }

        if (mouse.x && mouse.y) {
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < mouse.radius) {
                const angle = Math.atan2(dy, dx);
                const force = (mouse.radius - distance) / mouse.radius;
                this.velocity.x += Math.cos(angle) * force * 2;
                this.velocity.y += Math.sin(angle) * force * 2;
            }
        }
    }

    startExplosion() {
        this.isExploding = true;
        this.explosionTimer = 3 * 60;
        for (let i = 0; i < 50; i++) {
            this.explosionParticles.push({
                x: this.x,
                y: this.y,
                vx: (Math.random() - 0.5) * 10,
                vy: (Math.random() - 0.5) * 10,
                alpha: 1,
                radius: Math.random() * 2 + 1,
                color: `rgba(${this.rgbColor}, 1)`
            });
        }
    }

    updateExplosion() {
        if (this.explosionTimer > 0) {
            this.explosionTimer--;
            this.radius = this.baseRadius + Math.sin((3 * 60 - this.explosionTimer) / 10) * 5;

            this.explosionParticles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.1;
                p.alpha -= 0.015;
                if (p.alpha < 0) p.alpha = 0;
            });
        }
    }

    drawExplosion() {
        if (this.explosionTimer > 0) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            const pulseAlpha = Math.sin((3 * 60 - this.explosionTimer) / 5) * 0.5 + 0.5;
            const pulseRadius = this.radius * (1 + Math.sin((3 * 60 - this.explosionTimer) / 10) * 0.2);
            const pulseGradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.5, this.x, this.y, pulseRadius);
            pulseGradient.addColorStop(0, `rgba(255, 255, 255, ${pulseAlpha * 0.8})`);
            pulseGradient.addColorStop(1, `rgba(${this.rgbColor}, 0)`);
            ctx.fillStyle = pulseGradient;
            ctx.fill();
        }

        this.explosionParticles.forEach(p => {
            if (p.alpha > 0) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${this.rgbColor}, ${p.alpha})`;
                ctx.fill();
            }
        });
    }
}

function initParticleGame() {
    canvas = document.createElement('canvas');
    canvas.id = 'particle-game-canvas';
    document.body.prepend(canvas);

    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < NUM_PARTICLES; i++) {
        const colorIndex = Math.floor(i / (NUM_PARTICLES / PARTICLE_COLORS_HEX.length));
        particles.push(new Particle(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            7,
            colorIndex
        ));
    }

    canvas.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });
    canvas.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    animateParticleGame();
}

function resizeCanvas() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function updateParticleColors() {
    updateParticleAuraColors();
}

function animateParticleGame() {
    requestAnimationFrame(animateParticleGame);
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        p1.update();
        p1.draw();

        for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            const minDistanceForCollision = p1.radius + p2.radius;

            if (distance < minDistanceForCollision) {
                if (p1.colorIndex === p2.colorIndex) {
                    if (!p1.isExploding && !p2.isExploding) {
                        const totalFusionCount = p1.fusionCount + p2.fusionCount;
                        const newRadius = Math.sqrt(p1.radius * p1.radius + p2.radius * p2.radius);
                        const newX = (p1.x * p1.fusionCount + p2.x * p2.fusionCount) / totalFusionCount;
                        const newY = (p1.y * p1.fusionCount + p2.y * p2.fusionCount) / totalFusionCount;

                        const mergedParticle = new Particle(newX, newY, newRadius, p1.colorIndex);
                        mergedParticle.fusionCount = totalFusionCount;
                        mergedParticle.velocity = {
                            x: (p1.velocity.x * p1.fusionCount + p2.velocity.x * p2.fusionCount) / totalFusionCount,
                            y: (p1.velocity.y * p1.fusionCount + p2.velocity.y * p2.fusionCount) / totalFusionCount
                        };

                        particles.splice(j, 1);
                        particles.splice(i, 1);
                        particles.push(mergedParticle);

                        if (mergedParticle.fusionCount >= 5) {
                            mergedParticle.startExplosion();
                        }
                        i--;
                        break;
                    }
                } else {
                    const angle = Math.atan2(dy, dx);
                    const overlap = minDistanceForCollision - distance;
                    const pushForce = overlap * 0.5;

                    p1.x += Math.cos(angle) * pushForce;
                    p1.y += Math.sin(angle) * pushForce;
                    p2.x -= Math.cos(angle) * pushForce;
                    p2.y -= Math.sin(angle) * pushForce;

                    const p1NewVx = p2.velocity.x;
                    const p1NewVy = p2.velocity.y;
                    p2.velocity.x = p1.velocity.x;
                    p2.velocity.y = p1.velocity.y;
                    p1.velocity.x = p1NewVx;
                    p1.velocity.y = p1NewVy;

                    p1.velocity.x *= -1;
                    p1.velocity.y *= -1;
                    p2.velocity.x *= -1;
                    p2.velocity.y *= -1;
                }
            }
        }
    }

    particles = particles.filter(p => !p.isExploding || p.explosionTimer > 0);

    PARTICLE_COLORS_HEX.forEach((colorHex, colorIdx) => {
        const count = particles.filter(p => p.colorIndex === colorIdx && !p.isExploding).length;
        if (count === 0) {
            setTimeout(() => {
                for (let i = 0; i < 5; i++) {
                    particles.push(new Particle(
                        Math.random() * canvas.width,
                        Math.random() * canvas.height,
                        7,
                        colorIdx
                    ));
                }
            }, 1000);
        }
    });
}

// Expose functions globally so other split files can call them
window.initParticleGame = initParticleGame;
window.updateParticleColors = updateParticleColors;
