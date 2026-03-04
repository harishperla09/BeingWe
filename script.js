/* =========================================================
   BV Being We — Interaction & Animation Logic
   ========================================================= */

(() => {
  'use strict';

  /* ---------- Preloader ---------- */
  window.addEventListener('load', () => {
    const pre = document.getElementById('preloader');
    if (pre) {
      pre.classList.add('hidden');
      setTimeout(() => pre.remove(), 600);
    }
  });

  /* ---------- Canvas Particle Hero ---------- */
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, particles;
    const COUNT = 70;

    function resize() {
      w = canvas.width  = canvas.parentElement.offsetWidth;
      h = canvas.height = canvas.parentElement.offsetHeight;
    }
    function init() {
      resize();
      particles = Array.from({ length: COUNT }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + .8,
        dx: (Math.random() - .5) * .4,
        dy: (Math.random() - .5) * .4,
        o: Math.random() * .5 + .15
      }));
    }
    function draw() {
      ctx.clearRect(0, 0, w, h);
      for (const p of particles) {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0 || p.x > w) p.dx *= -1;
        if (p.y < 0 || p.y > h) p.dy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(108,99,255,${p.o})`;
        ctx.fill();
      }
      // connecting lines
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(108,99,255,${.08 * (1 - dist / 140)})`;
            ctx.lineWidth = .6;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(draw);
    }
    init();
    draw();
    window.addEventListener('resize', resize);
  }

  /* ---------- Header scroll class ---------- */
  const header = document.getElementById('header');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Hamburger toggle ---------- */
  const burger = document.getElementById('hamburger');
  const nav    = document.getElementById('nav');

  if (burger && nav) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    // close on link click
    nav.querySelectorAll('.nav__link').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        nav.classList.remove('open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      });
    });
  }

  /* ---------- Active nav link on scroll ---------- */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav__link');

  function setActive() {
    let current = '';
    for (const sec of sections) {
      const top = sec.offsetTop - 120;
      if (scrollY >= top) current = sec.getAttribute('id');
    }
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', setActive, { passive: true });

  /* ---------- Scroll reveal ---------- */
  const reveals = document.querySelectorAll('.reveal');
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        revealObs.unobserve(e.target);
      }
    });
  }, { threshold: .15 });
  reveals.forEach(el => revealObs.observe(el));

  /* ---------- Stat counter ---------- */
  const stats = document.querySelectorAll('.stat[data-target]');
  const countObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target  = +el.dataset.target;
      const suffix  = el.dataset.suffix || '';
      const numEl   = el.querySelector('.stat__num');
      let start = 0;
      const duration = 1600;
      const step = ts => {
        if (!start) start = ts;
        const prog = Math.min((ts - start) / duration, 1);
        numEl.textContent = Math.floor(prog * target) + suffix;
        if (prog < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      countObs.unobserve(el);
    });
  }, { threshold: .5 });
  stats.forEach(s => countObs.observe(s));

  /* ---------- Scroll-to-top button ---------- */
  const totop = document.getElementById('totop');
  if (totop) {
    window.addEventListener('scroll', () => {
      totop.classList.toggle('show', window.scrollY > 600);
    }, { passive: true });
    totop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      showToast('Thank you! We\'ll get back to you soon. 🙏');
      form.reset();
    });
  }

  function showToast(msg) {
    let toast = document.querySelector('.toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => toast.classList.remove('show'), 3500);
  }

  /* ---------- Footer year ---------- */
  const yrEl = document.getElementById('yr');
  if (yrEl) yrEl.textContent = new Date().getFullYear();

})();
