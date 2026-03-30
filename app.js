/* ============================================
   O.D.O.L.E.H. — Main Application
   ============================================ */

(function () {
  'use strict';

  // ---- Mobile Navigation ----
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');

  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  // Close menu on link click
  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
    });
  });

  // ---- Fleurtijd wisselknop ----
  const themeToggle = document.getElementById('themeToggle');
  const themeLabel = themeToggle.querySelector('.theme-toggle-label');
  const themeDot1 = themeToggle.querySelector('.theme-dot-1');
  const themeDot2 = themeToggle.querySelector('.theme-dot-2');
  let isFleurtijd = false;

  function updateToggleButton() {
    if (isFleurtijd) {
      // Nu in fleurtijd — knop toont "Klassiek" met paars/groen bolletjes
      themeLabel.textContent = 'Klassiek';
      themeDot1.style.background = '#4A1A6B';
      themeDot2.style.background = '#1B5E20';
      themeToggle.title = 'Wissel naar klassiek';
    } else {
      // Nu in klassiek — knop toont "Fleurtijd" met rood/zwart bolletjes
      themeLabel.textContent = 'Fleurtijd';
      themeDot1.style.background = '#8B1A1A';
      themeDot2.style.background = '#1A1A1A';
      themeToggle.title = 'Wissel naar fleurtijd';
    }
  }

  themeToggle.addEventListener('click', () => {
    isFleurtijd = !isFleurtijd;
    document.body.classList.toggle('fleurtijd', isFleurtijd);
    updateToggleButton();

    // Herkleur deeltjes
    particles.forEach(p => recolorParticle(p));
  });

  function recolorParticle(p) {
    const r = Math.random();
    if (isFleurtijd) {
      if (r < 0.4) {
        // Warm kaarslicht
        p.r = 200 + Math.random() * 55;
        p.g = 140 + Math.random() * 60;
        p.b = 40 + Math.random() * 30;
      } else if (r < 0.7) {
        // Rood
        p.r = 139 + Math.random() * 40;
        p.g = 20 + Math.random() * 15;
        p.b = 20 + Math.random() * 15;
      } else if (r < 0.85) {
        // Zwart/donkergrijs
        const v = 20 + Math.random() * 30;
        p.r = v; p.g = v; p.b = v;
      } else {
        // Goud
        p.r = 201; p.g = 168; p.b = 76;
      }
    } else {
      if (r < 0.4) {
        p.r = 200 + Math.random() * 55;
        p.g = 140 + Math.random() * 60;
        p.b = 40 + Math.random() * 30;
      } else if (r < 0.65) {
        p.r = 74 + Math.random() * 40;
        p.g = 26 + Math.random() * 20;
        p.b = 107 + Math.random() * 40;
      } else if (r < 0.85) {
        p.r = 27 + Math.random() * 20;
        p.g = 94 + Math.random() * 40;
        p.b = 32 + Math.random() * 20;
      } else {
        const w = 200 + Math.random() * 55;
        p.r = w; p.g = w; p.b = w - 20;
      }
    }
  }

  // ---- Candle Particle Effect (Hero) ----
  const canvas = document.getElementById('candleCanvas');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let width, height;

  function resizeCanvas() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * width;
      this.y = height + Math.random() * 50;
      this.size = Math.random() * 3 + 1;
      this.speedY = -(Math.random() * 0.8 + 0.2);
      this.speedX = (Math.random() - 0.5) * 0.3;
      this.opacity = Math.random() * 0.6 + 0.1;
      this.fadeRate = Math.random() * 0.003 + 0.001;
      this.wobble = Math.random() * Math.PI * 2;
      this.wobbleSpeed = Math.random() * 0.02 + 0.005;

      recolorParticle(this);
    }

    update() {
      this.wobble += this.wobbleSpeed;
      this.x += this.speedX + Math.sin(this.wobble) * 0.3;
      this.y += this.speedY;
      this.opacity -= this.fadeRate;

      if (this.opacity <= 0 || this.y < -20) {
        this.reset();
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity})`;
      ctx.fill();

      // Glow
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.r}, ${this.g}, ${this.b}, ${this.opacity * 0.15})`;
      ctx.fill();
    }
  }

  // Init particles
  const particleCount = window.innerWidth < 768 ? 60 : 120;
  for (let i = 0; i < particleCount; i++) {
    const p = new Particle();
    p.y = Math.random() * height; // Start spread across screen
    particles.push(p);
  }

  function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    particles.forEach(p => {
      p.update();
      p.draw();
    });
    requestAnimationFrame(animateParticles);
  }
  animateParticles();

  // ---- Scroll Animations (Intersection Observer) ----
  const observerOptions = {
    threshold: 0.15,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Add animation classes and observe
  document.querySelectorAll('.section-title, .section-subtitle').forEach(el => {
    el.classList.add('animate-fade-up');
    observer.observe(el);
  });

  document.querySelectorAll('.over-text p, .over-lead').forEach((el, i) => {
    el.classList.add('animate-fade-up');
    el.style.transitionDelay = (i * 0.1) + 's';
    observer.observe(el);
  });

  document.querySelectorAll('.fact-card').forEach((el, i) => {
    el.classList.add('animate-fade-up');
    el.style.transitionDelay = (i * 0.15) + 's';
    observer.observe(el);
  });

  document.querySelectorAll('.cultuur-card').forEach((el, i) => {
    el.classList.add('animate-fade-up');
    el.style.transitionDelay = (i * 0.1) + 's';
    observer.observe(el);
  });

  document.querySelectorAll('.agenda-item').forEach((el, i) => {
    el.classList.add('animate-slide-right');
    el.style.transitionDelay = (i * 0.1) + 's';
    observer.observe(el);
  });

  document.querySelectorAll('.jenny-description, .jenny-player').forEach((el, i) => {
    el.classList.add('animate-fade-up');
    el.style.transitionDelay = (i * 0.15) + 's';
    observer.observe(el);
  });

  document.querySelectorAll('.contact-content').forEach(el => {
    el.classList.add('animate-fade-up');
    observer.observe(el);
  });

  // ---- Add animation CSS dynamically ----
  const style = document.createElement('style');
  style.textContent = `
    .animate-fade-up {
      opacity: 0;
      transform: translateY(24px);
      transition: opacity 0.7s ease, transform 0.7s ease;
    }
    .animate-fade-up.visible {
      opacity: 1;
      transform: translateY(0);
    }
    .animate-slide-right {
      opacity: 0;
      transform: translateX(-20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    .animate-slide-right.visible {
      opacity: 1;
      transform: translateX(0);
    }
  `;
  document.head.appendChild(style);

  // ---- Nav background on scroll ----
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      nav.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
      nav.style.background = 'rgba(10, 10, 10, 0.85)';
    }
  });

})();
