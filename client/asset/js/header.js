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

        // Close menu when a link is clicked
        const mobileLinks = mobileNav.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileNav.classList.remove('active');
                header.classList.remove('nav-active');
                body.style.overflow = '';
            });
        });
    }
}