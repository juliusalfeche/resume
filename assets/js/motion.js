// True when the visitor's device asks for less motion.
export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
