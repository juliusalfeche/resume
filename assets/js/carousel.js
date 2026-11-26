// A swipeable carousel built on the browser's own scroll-snap, so touch, trackpad and
// keyboard all behave like a normal page. We add buttons, picture dots, arrow keys,
// and mouse dragging. There is no auto-play: you are always in control.

import { reducedMotion } from './motion.js';

export function initCarousel(root) {
    if (!root) return;
    const viewport = root.querySelector('.carousel__viewport');
    const slides = [...viewport.children];
    const prev = root.querySelector('[data-prev]');
    const next = root.querySelector('[data-next]');
    const controls = root.querySelector('.carousel__controls');
    const dotsBox = root.querySelector('.carousel__dots');
    const count = root.querySelector('.carousel__count');
    if (slides.length < 2) return;

    let current = 0;
    const clamp = (i) => Math.max(0, Math.min(slides.length - 1, i));
    const width = () => Math.max(1, viewport.clientWidth);
    const indexFromScroll = () => clamp(Math.round(viewport.scrollLeft / width()));

    // One round photo button per slide.
    const dots = slides.map((slide, i) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'dot';
        const name = slide.querySelector('strong')?.textContent ?? `endorsement ${i + 1}`;
        button.setAttribute('aria-label', `Show endorsement from ${name}`);
        const avatar = slide.querySelector('.avatar');
        if (avatar) {
            const photo = document.createElement('img');
            photo.src = avatar.getAttribute('src');
            photo.alt = '';
            photo.width = 40;
            photo.height = 40;
            button.append(photo);
        }
        button.addEventListener('click', () => goTo(i));
        dotsBox.append(button);
        return button;
    });
    controls.hidden = false;
    count.hidden = false;

    // The box is only as tall as the quote you are looking at (not the longest one).
    const fit = () => { viewport.style.height = `${slides[current].offsetHeight}px`; };

    function update(i) {
        current = i;
        fit();
        dots.forEach((dot, k) => (k === i ? dot.setAttribute('aria-current', 'true') : dot.removeAttribute('aria-current')));
        prev.disabled = i === 0;
        next.disabled = i === slides.length - 1;
        count.textContent = `${i + 1} / ${slides.length}`;
    }

    function goTo(i, { instant = false } = {}) {
        const target = clamp(i);
        viewport.scrollTo({ left: target * width(), behavior: instant || reducedMotion() ? 'auto' : 'smooth' });
        update(target);
    }

    prev.addEventListener('click', () => goTo(current - 1));
    next.addEventListener('click', () => goTo(current + 1));

    // Keep the buttons and dots in step with swipes and trackpad scrolling.
    let ticking = false;
    viewport.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => { ticking = false; update(indexFromScroll()); });
    }, { passive: true });

    // Arrow keys when the carousel has focus.
    viewport.addEventListener('keydown', (event) => {
        const keys = { ArrowLeft: current - 1, ArrowRight: current + 1, Home: 0, End: slides.length - 1 };
        if (!(event.key in keys)) return;
        event.preventDefault();
        goTo(keys[event.key]);
    });

    // Mouse drag. (Touch already works natively.) A small movement is ignored so clicks still work.
    let drag = null;
    viewport.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'mouse' || event.button !== 0) return;
        drag = { x: event.clientX, left: viewport.scrollLeft, start: current, moved: false, id: event.pointerId };
    });
    viewport.addEventListener('pointermove', (event) => {
        if (!drag) return;
        const dx = event.clientX - drag.x;
        if (!drag.moved && Math.abs(dx) > 5) {
            drag.moved = true;
            viewport.classList.add('is-dragging');
            viewport.setPointerCapture(drag.id);
        }
        if (drag.moved) viewport.scrollLeft = drag.left - dx;
    });
    const endDrag = (event) => {
        if (!drag) return;
        const { moved, start, x } = drag;
        drag = null;
        viewport.classList.remove('is-dragging');
        if (!moved) return;
        const dx = event.clientX - x;
        goTo(Math.abs(dx) > 40 ? start + (dx < 0 ? 1 : -1) : start);
    };
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('dragstart', (event) => event.preventDefault());

    // If the size changes (rotating a phone, opening the section, text reflowing), stay on the same slide.
    let lastWidth = 0;
    const watcher = new ResizeObserver(() => {
        if (viewport.clientWidth !== lastWidth) {
            lastWidth = viewport.clientWidth;
            goTo(current, { instant: true });
        }
        fit();
    });
    watcher.observe(viewport);
    slides.forEach((slide) => watcher.observe(slide));

    update(0);
}
