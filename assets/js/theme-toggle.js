// The light/dark button in the corner.

export function initThemeToggle() {
    const root = document.documentElement;
    const button = document.getElementById('theme-toggle');
    if (!button) return;

    const updateLabel = () => {
        button.setAttribute('aria-label', root.dataset.theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
    };
    updateLabel();

    button.addEventListener('click', () => {
        const next = root.dataset.theme === 'dark' ? 'light' : 'dark';
        root.dataset.theme = next;
        try { localStorage.setItem('theme', next); } catch { /* storage can be blocked */ }
        updateLabel();
    });
}
