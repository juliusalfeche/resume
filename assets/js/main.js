// Julius Alfeche | portfolio. Starts the small pieces.

import { initThemeToggle } from './theme-toggle.js';
import { initSections } from './sections.js';
import { initCarousel } from './carousel.js';
import { initEffects } from './effects.js';

initThemeToggle();
initSections();
initCarousel(document.getElementById('endorse-carousel'));
initEffects();
