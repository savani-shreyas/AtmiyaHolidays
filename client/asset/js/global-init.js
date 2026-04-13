/**
 * global-init.js
 * Automatically populates site settings (phone, email, etc.) across all pages.
 */
document.addEventListener('DOMContentLoaded', async () => {
    if (!window.api || !window.api.getSettings) {
        console.warn('API helper not found. Site settings might not be dynamic.');
        return;
    }

    try {
        const settings = await window.api.getSettings();
        applyGlobalSettings(settings);
    } catch (err) {
        console.error('Failed to initialize global settings:', err);
    }
});

function applyGlobalSettings(settings) {
    // 1. Update elements with data-setting attributes
    const elements = document.querySelectorAll('[data-setting]');
    
    elements.forEach(el => {
        const key = el.getAttribute('data-setting');
        const value = settings[key];
        
        if (!value) return;

        // Special handling for different tag types
        if (el.tagName === 'A') {
            if (key === 'contactPhone') {
                el.href = `tel:${value.replace(/\s+/g, '')}`;
                el.innerHTML = `<img src="./asset/images/Icon/call.svg" alt="Phone" style="width:16px;margin-right:8px;vertical-align:middle;"> ${value}`;
            } else if (key === 'contactEmail') {
                el.href = `mailto:${value}`;
                el.innerHTML = `<img src="./asset/images/Icon/mail.svg" alt="Email" style="width:16px;margin-right:8px;vertical-align:middle;"> ${value}`;
            } else {
                el.innerText = value;
            }
        } else if (el.tagName === 'IMG') {
            el.src = value;
        } else {
            el.innerText = value;
        }
    });

    // 2. Specialized handling for the Blog Banner if on the blog page
    const bannerImg = document.querySelector('.common-hero-banner img[data-setting="blogHeroBanner"]');
    if (bannerImg && settings.blogHeroBanner) {
        const SERVER_URL = 'http://localhost:5000';
        bannerImg.src = settings.blogHeroBanner.startsWith('http') ? settings.blogHeroBanner : SERVER_URL + settings.blogHeroBanner;
    }
}
