/* Runs before the page paints, so the right theme shows with no flash.
   Dark is the official look. Light is used only if the visitor picked it with the toggle. */
(function () {
    var root = document.documentElement;
    var theme = 'dark';
    try {
        if (localStorage.getItem('theme') === 'light') theme = 'light';
    } catch (error) { /* storage can be blocked; dark is fine */ }
    root.setAttribute('data-theme', theme);
    root.classList.add('js');
})();
