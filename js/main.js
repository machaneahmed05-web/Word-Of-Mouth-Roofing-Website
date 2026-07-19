/* Word of Mouth Roofing — main.js */
(function () {
    'use strict';

    /* Remove no-js class immediately so CSS fallback doesn't apply */
    document.documentElement.classList.remove('no-js');

    /* ── HERO ENTRANCE ─────────────────────────────────────── */
    /* Double-rAF: fires after the browser has painted frame 1,
       so the CSS initial-hidden state is never actually seen.
       fill-mode:forwards in CSS keeps elements visible after. */
    requestAnimationFrame(function () {
        requestAnimationFrame(function () {
            document.body.classList.add('hero-ready');
        });
    });

    /* ── STICKY HEADER ──────────────────────────────── */
    const header = document.getElementById('siteHeader');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 10);
        }, { passive: true });
    }

    /* ── NAV PROGRESS BAR ───────────────────────────── */
    const progress = document.getElementById('navProgress');
    if (progress) {
        window.addEventListener('scroll', () => {
            const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
            progress.style.width = scrollTop / (scrollHeight - clientHeight) * 100 + '%';
        }, { passive: true });
    }

    /* ── MOBILE MENU ────────────────────────────────── */
    const burger      = document.getElementById('burger');
    const mobileMenu  = document.getElementById('mobileMenu');
    const mobileClose = document.getElementById('mobileClose');
    if (burger && mobileMenu) {
        const openMenu  = () => { mobileMenu.classList.add('open'); burger.classList.add('open'); document.body.style.overflow = 'hidden'; };
        const closeMenu = () => { mobileMenu.classList.remove('open'); burger.classList.remove('open'); document.body.style.overflow = ''; };
        burger.addEventListener('click', openMenu);
        if (mobileClose) mobileClose.addEventListener('click', closeMenu);
        mobileMenu.querySelectorAll('.mob-cta, a:not(.mob-link)').forEach(l => l.addEventListener('click', closeMenu));
        document.addEventListener('keydown', e => e.key === 'Escape' && closeMenu());
    }

    /* ── MOBILE SERVICES SUBMENU ────────────────────── */
    const mobServicesToggle = document.getElementById('mobServicesToggle');
    const mobServicesSub    = document.getElementById('mobServicesSub');
    if (mobServicesToggle && mobServicesSub) {
        mobServicesToggle.addEventListener('click', e => { e.preventDefault(); mobServicesSub.classList.toggle('open'); });
    }

    /* ── FAQ ACCORDION ──────────────────────────────── */
    document.querySelectorAll('.faq-q').forEach(btn => {
        btn.addEventListener('click', () => {
            const item   = btn.closest('.faq-item');
            const isOpen = item.classList.contains('open');
            document.querySelectorAll('.faq-item.open').forEach(el => { el.classList.remove('open'); el.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); });
            if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
        });
    });

    /* ── READ MORE TOGGLE ───────────────────────────── */
    document.querySelectorAll('.read-more-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = document.getElementById(btn.dataset.target);
            if (!target) return;
            const open = target.classList.toggle('open');
            btn.textContent = open ? 'Show Less ↑' : 'Read More →';
        });
    });

    /* ── SCROLL REVEAL ──────────────────────────────── */
    const revealEls = document.querySelectorAll('[data-reveal]');
    if (revealEls.length && 'IntersectionObserver' in window) {
        const io = new IntersectionObserver(entries => {
            entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in-view'); io.unobserve(e.target); } });
        }, { threshold: 0.07, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach(el => io.observe(el));
    } else {
        revealEls.forEach(el => el.classList.add('in-view'));
    }

    /* ── STAGGER GRID ANIMATIONS ────────────────────── */
    if ('IntersectionObserver' in window) {
        const staggerIO = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                entry.target.querySelectorAll('.stagger-child').forEach((child, i) => {
                    setTimeout(() => child.classList.add('in-view'), i * 90);
                });
                staggerIO.unobserve(entry.target);
            });
        }, { threshold: 0.08 });
        document.querySelectorAll('.stagger-parent').forEach(el => staggerIO.observe(el));
    } else {
        document.querySelectorAll('.stagger-child').forEach(el => el.classList.add('in-view'));
    }

    /* ── ANIMATED COUNTERS (eased) ──────────────────── */
    const countEls = document.querySelectorAll('.count[data-target]');
    if (countEls.length && 'IntersectionObserver' in window) {
        const easeOut = t => 1 - Math.pow(1 - t, 3);
        const cio = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (!e.isIntersecting) return;
                cio.unobserve(e.target);
                const el        = e.target;
                const end       = +el.dataset.target;
                const dur       = 2200;
                const startTime = performance.now();
                const statItem  = el.closest('.stat-item');
                if (statItem) statItem.classList.add('counting');
                const tick = now => {
                    const p = Math.min((now - startTime) / dur, 1);
                    el.textContent = Math.round(easeOut(p) * end).toLocaleString();
                    if (p < 1) requestAnimationFrame(tick);
                    else if (statItem) statItem.classList.remove('counting');
                };
                requestAnimationFrame(tick);
            });
        }, { threshold: 0.5 });
        countEls.forEach(el => cio.observe(el));
    }

    /* ── SMOOTH SCROLL ──────────────────────────────── */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            const id = this.getAttribute('href');
            if (!id || id === '#') return;
            const target = document.querySelector(id);
            if (!target) return;
            e.preventDefault();
            const hH = header ? header.offsetHeight : 0;
            window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - hH - 12, behavior: 'smooth' });
        });
    });

    /* ── CONTACT FORM ───────────────────────────────── */
    document.querySelectorAll('.contact-form, .hs-form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const btn  = form.querySelector('.form-submit, .hs-submit');
            if (!btn) return;
            const orig = btn.textContent;
            btn.textContent = 'Sending…';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = 'Sent! We\'ll be in touch. ✓';
                btn.style.background = '#1a7a2e';
                setTimeout(() => { btn.textContent = orig; btn.style.background = ''; btn.disabled = false; form.reset(); }, 3500);
            }, 1200);
        });
    });

    /* ── PHONE FORMATTER ────────────────────────────── */
    document.querySelectorAll('input[type="tel"]').forEach(ph => {
        ph.addEventListener('input', function () {
            let v = this.value.replace(/\D/g, '').slice(0, 10);
            if (v.length >= 7)      v = `(${v.slice(0,3)}) ${v.slice(3,6)}-${v.slice(6)}`;
            else if (v.length >= 4) v = `(${v.slice(0,3)}) ${v.slice(3)}`;
            else if (v.length >= 1) v = `(${v}`;
            this.value = v;
        });
    });

    /* ── HERO PARALLAX ──────────────────────────────── */
    const hsVideoWrap = document.querySelector('.hs-video-wrap');
    if (hsVideoWrap) {
        let rafId = null;
        window.addEventListener('scroll', () => {
            if (rafId) return;
            rafId = requestAnimationFrame(() => {
                const y = window.scrollY;
                if (y < window.innerHeight * 1.5) {
                    hsVideoWrap.style.transform = `translateY(${y * 0.3}px)`;
                }
                rafId = null;
            });
        }, { passive: true });
    }

    /* ── BUTTON RIPPLE ──────────────────────────────── */
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const r    = this.getBoundingClientRect();
            const size = Math.max(r.width, r.height) * 2.2;
            const rip  = document.createElement('span');
            rip.className = 'btn-ripple';
            Object.assign(rip.style, {
                width:  size + 'px',
                height: size + 'px',
                left:   (e.clientX - r.left - size / 2) + 'px',
                top:    (e.clientY - r.top  - size / 2) + 'px'
            });
            this.appendChild(rip);
            rip.addEventListener('animationend', () => rip.remove());
        });
    });

    /* ── 3D CARD TILT ───────────────────────────────── */
    const isTouch = () => window.matchMedia('(hover: none)').matches;
    if (!isTouch()) {
        document.querySelectorAll('.home-svc-card, .comfort-card, .offer-card, .award-circle').forEach(card => {
            card.addEventListener('mousemove', function (e) {
                const r = this.getBoundingClientRect();
                const x = (e.clientX - r.left) / r.width  - 0.5;
                const y = (e.clientY - r.top)  / r.height - 0.5;
                this.style.transform        = `perspective(700px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) translateY(-6px) scale(1.02)`;
                this.style.transition       = 'none';
                this.style.willChange       = 'transform';
            });
            card.addEventListener('mouseleave', function () {
                this.style.transition = 'transform 0.55s cubic-bezier(.22,1,.36,1)';
                this.style.transform  = '';
                this.style.willChange = '';
            });
        });
    }

    /* ── IMAGE SHINE EFFECT ─────────────────────────── */
    if (!isTouch()) {
        document.querySelectorAll('.gallery-item, .home-svc-card, .offer-card').forEach(el => {
            if (!el.querySelector('.img-shine')) {
                const shine = document.createElement('div');
                shine.className = 'img-shine';
                el.appendChild(shine);
            }
            el.addEventListener('mousemove', function (e) {
                const r = this.getBoundingClientRect();
                const x = ((e.clientX - r.left) / r.width)  * 100;
                const y = ((e.clientY - r.top)  / r.height) * 100;
                this.querySelector('.img-shine').style.background =
                    `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,.18) 0%, transparent 65%)`;
            });
            el.addEventListener('mouseleave', function () {
                const s = this.querySelector('.img-shine');
                if (s) s.style.background = 'none';
            });
        });
    }

    /* ── STAT ITEM REVEAL PULSE ─────────────────────── */
    document.querySelectorAll('.stat-item').forEach((el, i) => {
        el.style.transitionDelay = (i * 0.15) + 's';
    });

    /* ── AWARD CIRCLE FLOAT ─────────────────────────── */
    document.querySelectorAll('.award-circle').forEach((el, i) => {
        el.style.animationDelay = (i * 0.4) + 's';
        el.classList.add('float-anim');
    });

})();
