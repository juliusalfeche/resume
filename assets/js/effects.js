// The "alive" touches: reveal on scroll, count-up numbers, active menu link, progress bar.
// Everything switches off when the visitor prefers reduced motion.

import { reducedMotion } from './motion.js';

function reveal() {
    const items = [...document.querySelectorAll('.reveal')];
    if (reducedMotion() || !('IntersectionObserver' in window)) {
        items.forEach((item) => item.classList.add('is-visible'));
        return;
    }
    // Hero items arrive one after another.
    document.querySelectorAll('.hero .reveal').forEach((item, i) => item.style.setProperty('--delay', `${i * 0.08}s`));
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    items.forEach((item) => observer.observe(item));
}

function countUp() {
    const numbers = [...document.querySelectorAll('.stat__num')];
    const targets = numbers.map((el) => {
        const source = el.dataset.countOf;
        return source ? document.querySelectorAll(source).length : Number(el.dataset.count);
    });
    if (reducedMotion()) {
        numbers.forEach((el, i) => { el.textContent = String(targets[i]); });
        return;
    }
    numbers.forEach((el) => { el.textContent = '0'; });
    const duration = 1200;
    const begin = performance.now() + 350;
    const frame = (now) => {
        const t = Math.max(0, Math.min(1, (now - begin) / duration));
        const eased = 1 - (1 - t) ** 3;
        numbers.forEach((el, i) => { el.textContent = String(Math.round(targets[i] * eased)); });
        if (t < 1) requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
}

function activeLink() {
    const links = new Map([...document.querySelectorAll('[data-nav]')].map((a) => [a.dataset.nav, a]));
    const watched = [['top', document.querySelector('.hero')], ...[...document.querySelectorAll('details.card')].map((s) => [s.id, s])];
    const menu = document.querySelector('.top-nav');
    const mark = (id) => {
        links.forEach((link, key) => {
            link.classList.toggle('is-active', key === id);
            if (key === id) link.setAttribute('aria-current', 'true'); else link.removeAttribute('aria-current');
        });
        // On phones the menu scrolls sideways: keep the active link in the middle.
        const active = links.get(id);
        if (active && menu && menu.scrollWidth > menu.clientWidth) {
            menu.scrollTo({ left: active.offsetLeft - (menu.clientWidth - active.offsetWidth) / 2, behavior: reducedMotion() ? 'auto' : 'smooth' });
        }
    };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            const found = watched.find(([, el]) => el === entry.target);
            if (found) mark(found[0]);
        });
    }, { rootMargin: '-30% 0px -60% 0px' });
    watched.forEach(([, el]) => el && observer.observe(el));
    mark('top');
}

function scrollFeedback() {
    const bar = document.querySelector('.progress span');
    const nav = document.querySelector('.nav-wrap');
    const top = document.getElementById('scroll-top');
    let ticking = false;
    const update = () => {
        ticking = false;
        const root = document.documentElement;
        const max = root.scrollHeight - root.clientHeight;
        bar?.style.setProperty('--progress', (max > 0 ? root.scrollTop / max : 0).toFixed(4));
        nav?.classList.toggle('is-stuck', root.scrollTop > 8);
        top?.classList.toggle('is-visible', root.scrollTop > 500);
    };
    window.addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    window.addEventListener('resize', update);
    update();
    top?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: reducedMotion() ? 'auto' : 'smooth' }));
}

export function initEffects() {
    document.getElementById('year').textContent = String(new Date().getFullYear());
    reveal();
    countUp();
    activeLink();
    scrollFeedback();
}
