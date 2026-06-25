document.addEventListener("DOMContentLoaded", () => {
    const scrollBtn = document.getElementById('scroll-top-btn');
    const heroContainer = document.querySelector('.hero-container');
    
    if (scrollBtn && heroContainer) {
        const heroObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) {
                    scrollBtn.classList.add('visible');
                } else {
                    scrollBtn.classList.remove('visible');
                }
            });
        });
        heroObserver.observe(heroContainer);
    }

    const themeIcon = document.querySelector('#theme-switcher i');
    const prefersDarkScheme = window.matchMedia("(prefers-color-scheme: dark)");

    function initializeTheme() {
        const savedTheme = localStorage.getItem('theme');
        const isDark = savedTheme === 'dark' || (!savedTheme && prefersDarkScheme.matches);
        if (themeIcon) themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }

    initializeTheme();
    initializeSlider('reviews-viewport', 'reviews-track', 0.5);
    initializeSlider('projects-viewport', 'projects-track', 0.5);
});

window.toggleTheme = function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    const themeIcon = document.querySelector('#theme-switcher i');
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    if (themeIcon) themeIcon.className = newTheme === 'dark' ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
};

window.toggleAccordion = function(button) {
    const currentSection = button.parentElement;
    const allSections = document.querySelectorAll('.accordion-section');
    const isCurrentOpen = currentSection.classList.contains('is-open');

    allSections.forEach(section => {
        section.classList.remove('is-open');
        section.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
    });

    if (!isCurrentOpen) {
        currentSection.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
    }
};

window.toggleNestedAccordion = function(button) {
    const event = window.event;
    if (event) event.stopPropagation();

    const currentAccordion = button.closest('.nested-accordion');
    const allNested = currentAccordion.parentElement.querySelectorAll('.nested-accordion');
    const isCurrentOpen = currentAccordion.classList.contains('is-open');

    allNested.forEach(acc => {
        acc.classList.remove('is-open');
        acc.querySelector('.nested-accordion-trigger').setAttribute('aria-expanded', 'false');
    });

    if (!isCurrentOpen) {
        currentAccordion.classList.add('is-open');
        button.setAttribute('aria-expanded', 'true');
    }
};

window.openAndJump = function(sectionId) {
    const e = window.event;
    if (e) e.preventDefault();

    const targetSection = document.getElementById(sectionId);
    if (!targetSection) return;

    const allSections = document.querySelectorAll('.accordion-section');
    let offsetAdjustment = 0;
    let targetPassed = false;

    allSections.forEach(section => {
        if (section === targetSection) {
            targetPassed = true;
        } else if (!targetPassed && section.classList.contains('is-open')) {
            const contentInner = section.querySelector('.content-inner');
            if (contentInner) offsetAdjustment += contentInner.offsetHeight;
        }
    });

    allSections.forEach(section => {
        if (section !== targetSection) {
            section.classList.remove('is-open');
            section.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'false');
        }
    });

    if (!targetSection.classList.contains('is-open')) {
        targetSection.classList.add('is-open');
        targetSection.querySelector('.accordion-trigger').setAttribute('aria-expanded', 'true');
    }

    const navWrapper = document.querySelector('.nav-wrapper');
    const navHeight = navWrapper ? navWrapper.offsetHeight : 0;
    const paddingBuffer = 16; 
    
    const currentAbsoluteY = targetSection.getBoundingClientRect().top + window.scrollY;
    const predictedY = currentAbsoluteY - navHeight - paddingBuffer - offsetAdjustment;

    window.scrollTo({
        top: Math.max(0, predictedY),
        behavior: 'smooth'
    });
};

window.scrollToCoordinates = function(position) {
    if (position === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
};

function initializeSlider(viewportId, trackId, speed = 0.5) {
    const slider = document.getElementById(viewportId);
    const track = document.getElementById(trackId);
    
    if (!slider || !track) return;
    
    const originalCardsCount = track.children.length;
    if (originalCardsCount === 0) return;

    track.innerHTML = track.innerHTML + track.innerHTML + track.innerHTML;
    
    let isDown = false, isHovered = false;
    let startX, scrollLeft = 0, currentX = 0, setWidth = 0;

    function updateWidth() {
        const children = track.children;
        if (children.length >= originalCardsCount * 3) {
            setWidth = children[originalCardsCount].offsetLeft - children[0].offsetLeft;
            if (currentX === 0) currentX = -setWidth;
        }
    }

    setTimeout(updateWidth, 100);
    window.addEventListener('resize', updateWidth);

    function loop() {
        if (!isDown && !isHovered) currentX -= speed;

        if (setWidth > 0) {
            while (currentX <= -(setWidth * 2)) currentX += setWidth;
            while (currentX >= 0) currentX -= setWidth;
        }

        track.style.transform = `translate3d(${currentX}px, 0, 0)`;
        requestAnimationFrame(loop);
    }

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.style.cursor = 'grabbing';
        startX = e.pageX;
        scrollLeft = currentX;
    });

    slider.addEventListener('mouseenter', () => isHovered = true);
    
    slider.addEventListener('mouseleave', () => {
        isDown = false;
        isHovered = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.style.cursor = 'grab';
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const walk = (e.pageX - startX) * 1.5; 
        currentX = scrollLeft + walk;
    });

    slider.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX;
        scrollLeft = currentX;
    });

    slider.addEventListener('touchend', () => isDown = false);

    slider.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const walk = (e.touches[0].pageX - startX) * 1.5;
        currentX = scrollLeft + walk;
    });

    requestAnimationFrame(loop);
}