/* OMNES - Institutional Pages Engine */
import { supabase } from './supabaseClient.js';

document.addEventListener('DOMContentLoaded', () => {
    initGlobalAuth();
    initCursor();
    initNeuralField();
    initScrollProgress();
    initReveals();
    initHeader();
    initWelcomeAudio();
    initStats();
});

/**
 * Custom Cursor System - Optimized for Performance
 */
function initCursor() {
    if (window.matchMedia("(hover: none)").matches) return;

    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    const animate = () => {
        cursorX += (mouseX - cursorX) * 0.15;
        cursorY += (mouseY - cursorY) * 0.15;
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;

        cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
        follower.style.transform = `translate3d(${followerX}px, ${followerY}px, 0)`;

        // Essential for the hovering class in CSS to not break movement
        follower.style.setProperty('--f-x', `${followerX}px`);
        follower.style.setProperty('--f-y', `${followerY}px`);

        requestAnimationFrame(animate);
    };
    animate();

    // Hover logic
    const interactives = document.querySelectorAll('a, button, .pillar-card, .service-card-3d, .perspective-card');
    interactives.forEach(el => {
        el.addEventListener('mouseenter', () => {
            follower.classList.add('hovering');
        });
        el.addEventListener('mouseleave', () => {
            follower.classList.remove('hovering');
        });
    });
}



/**
 * Intersection Observer for Reveals
 */
function initReveals() {
    const options = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    }, options);

    document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => observer.observe(el));
}

/**
 * Header Scroll Effect
 */
function initHeader() {
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 50);
    });

    // Smooth Scroll Logic
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                const headerOffset = 100;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: "smooth"
                });

                // Close mobile menu if open (future proofing)
                const nav = document.querySelector('.nav-desktop');
                if (nav) nav.classList.remove('active');
            }
        });
    });

    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const nav = document.querySelector('.nav-desktop');
            if (nav) nav.classList.toggle('active');
        });
    }
}



/**
 * Stats Counter - One-time activation
 */
function initStats() {
    const stats = document.querySelectorAll('.stat-item');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const valEl = entry.target.querySelector('.stat-value');
                if (valEl && !entry.target.classList.contains('counted')) {
                    const target = parseInt(valEl.getAttribute('data-target'));
                    animateCount(valEl, target);
                    entry.target.classList.add('active');
                    entry.target.classList.add('counted');
                }
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(s => observer.observe(s));
}

function animateCount(el, target) {
    let current = 0;
    const duration = 2000;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = target / steps;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            el.innerText = target + '+';
            clearInterval(timer);
        } else {
            el.innerText = Math.floor(current) + '+';
        }
    }, stepTime);
}

/**
 * Scroll Progress Bar - Neural Aesthetic
 */
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'neural-progress-bar';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    });
}



/**
 * Neural Field - Cinematic Background Connectivity
 */
function initNeuralField() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let w, h;
    let particles = [];
    const particleCount = 60;
    const connectDistance = 180;

    function resize() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * w;
            this.y = Math.random() * h;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > w) this.vx *= -1;
            if (this.y < 0 || this.y > h) this.vy *= -1;
        }
    }

    function init() {
        resize();
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animate() {
        ctx.clearRect(0, 0, w, h);

        for (let i = 0; i < particles.length; i++) {
            const p1 = particles[i];
            p1.update();

            ctx.beginPath();
            ctx.arc(p1.x, p1.y, p1.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 236, 255, 0.4)';
            ctx.fill();

            for (let j = i + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectDistance) {
                    ctx.beginPath();
                    ctx.moveTo(p1.x, p1.y);
                    ctx.lineTo(p2.x, p2.y);
                    const alpha = (1 - dist / connectDistance) * 0.2;
                    ctx.strokeStyle = `rgba(0, 236, 255, ${alpha})`;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }

    window.addEventListener('resize', resize);
    init();
    animate();
}



// ─────────────────────────────────────────────────────────────────────────────
// AUTH GLOBAL (Acceso / Dashboard / Salir)
// ─────────────────────────────────────────────────────────────────────────────
async function initGlobalAuth() {
    const authLink = document.getElementById('auth-link');
    const logoutBtn = document.getElementById('global-logout-btn');

    try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session) {
            // Usuario está logueado
            if (authLink) {
                authLink.innerText = 'MI DASHBOARD';
                authLink.href = '/dashboard.html';
            }
            if (logoutBtn) {
                logoutBtn.style.display = 'flex';
                logoutBtn.addEventListener('click', async () => {
                    await supabase.auth.signOut();
                    window.location.reload(); // Recargar para limpiar estado
                });
            }
        } else {
            // Usuario NO está logueado
            if (logoutBtn) logoutBtn.style.display = 'none';
        }
    } catch (err) {
        console.error('Error in global auth:', err);
    }
}
