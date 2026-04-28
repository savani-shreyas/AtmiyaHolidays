document.addEventListener('DOMContentLoaded', async () => {
    handleHeaderScroll();
    handleMobileMenu();
});

function handleHeaderScroll() {
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });
}

function handleMobileMenu() {
    const hamburger = document.querySelector('.hamburger-menu');
    const mobileNav = document.querySelector('.mobile-nav-overlay');
    const body = document.body;
    const header = document.querySelector('header');

    if (hamburger && mobileNav) {
        hamburger.addEventListener('click', () => {
            mobileNav.classList.toggle('active');
            header.classList.toggle('nav-active');
            // Prevent scrolling when menu is open
            body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close button in mobile nav
        const closeBtn = mobileNav.querySelector('.close-menu');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                closeMenu();
            });
        }

        // Dropdown toggle logic
        const dropdownToggles = mobileNav.querySelectorAll('.dropdown-toggle');
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                e.preventDefault();
                const parentLi = toggle.closest('.has-dropdown');
                parentLi.classList.toggle('active');
            });
        });

        function closeMenu() {
            mobileNav.classList.remove('active');
            header.classList.remove('nav-active');
            body.style.overflow = '';
            // Reset dropdowns
            mobileNav.querySelectorAll('.has-dropdown').forEach(li => li.classList.remove('active'));
        }

        // Close menu when a link is clicked (but not dropdown toggles)
        const mobileLinks = mobileNav.querySelectorAll('a:not(.dropdown-toggle)');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });
    }
}