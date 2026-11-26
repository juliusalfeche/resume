// Accordion sections: one open at a time, nav links that open + scroll, deep links, printing.

import { reducedMotion } from './motion.js';

const behavior = () => (reducedMotion() ? 'auto' : 'smooth');
const navHeight = () => document.querySelector('.nav-wrap')?.offsetHeight ?? 0;

let sections = [];

// Browsers that support <details name="..."> already do this. This covers the rest.
function keepOneOpen(list) {
    list.forEach((item) => {
        item.addEventListener('toggle', () => {
            if (!item.open || printing) return;
            list.forEach((other) => { if (other !== item) other.open = false; });
        });
    });
}

// After a section opens, make sure its heading is not hidden under the sticky menu.
function keepInView(item) {
    requestAnimationFrame(() => {
        if (item.getBoundingClientRect().top < navHeight()) {
            item.scrollIntoView({ behavior: behavior(), block: 'start' });
        }
    });
}

export function goTo(id) {
    if (id === 'top') {
        window.scrollTo({ top: 0, behavior: behavior() });
        history.replaceState(null, '', location.pathname + location.search);
        return;
    }
    const target = document.getElementById(id);
    if (!target) return;
    if (target.matches('details.card')) {
        sections.forEach((section) => { section.open = section === target; });   // close the others first
    }
    // One frame later the layout has settled, so the scroll lands in the right place.
    requestAnimationFrame(() => target.scrollIntoView({ behavior: behavior(), block: 'start' }));
    history.replaceState(null, '', `#${id}`);
}

/* ---- printing: open everything, then put it back ---- */
let printing = false;
let saved = [];

function openEverything() {
    printing = true;
    saved = [...document.querySelectorAll('details')].map((d) => ({ d, open: d.open, name: d.getAttribute('name') }));
    saved.forEach(({ d }) => { d.removeAttribute('name'); d.open = true; });   // "name" would force one-at-a-time
}

function restore() {
    saved.forEach(({ d, open, name }) => { if (name) d.setAttribute('name', name); d.open = open; });
    saved = [];
    printing = false;
}

export function initSections() {
    sections = [...document.querySelectorAll('details.card')];
    keepOneOpen(sections);
    keepOneOpen([...document.querySelectorAll('details.cap')]);

    sections.forEach((item) => item.addEventListener('toggle', () => { if (item.open && !printing) keepInView(item); }));

    document.querySelectorAll('[data-nav]').forEach((link) => {
        link.addEventListener('click', (event) => { event.preventDefault(); goTo(link.dataset.nav); });
    });

    // A link like juliusalfeche.com/#projects opens that section.
    const fromHash = () => {
        const id = decodeURIComponent(location.hash.slice(1));
        if (id && document.getElementById(id)) goTo(id);
    };
    if (location.hash) fromHash();
    window.addEventListener('hashchange', fromHash);

    window.addEventListener('beforeprint', openEverything);
    window.addEventListener('afterprint', restore);
}
