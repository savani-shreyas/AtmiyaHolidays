/**
 * component-loader.js
 * Loads header and footer components dynamically.
 */

async function loadComponents() {
    const headerElement = document.querySelector('header');
    const footerElement = document.querySelector('footer');

    if (headerElement) {
        try {
            const response = await fetch('./components/header.html');
            const html = await response.text();
            headerElement.innerHTML = html;
        } catch (err) {
            console.error('Failed to load header:', err);
        }
    }

    if (footerElement) {
        try {
            const response = await fetch('./components/footer.html');
            const html = await response.text();
            footerElement.innerHTML = html;
        } catch (err) {
            console.error('Failed to load footer:', err);
        }
    }

    // Initialize Header Logic (defined in header.js)
    if (typeof handleHeaderScroll === 'function') handleHeaderScroll();
    if (typeof handleMobileMenu === 'function') handleMobileMenu();

    // Re-run Lucide icons if available
    if (window.lucide) {
        lucide.createIcons();
    }

    // Re-run global settings to ensure data-setting attributes in components are populated
    if (typeof applyGlobalSettings === 'function' && window.api) {
        try {
            const settings = await window.api.getSettings();
            applyGlobalSettings(settings);
        } catch (e) {}
    }
}

// Modal Functions (Moved from index.html to be global)
function openInquiryModal(dest) {
    const modal = document.getElementById('inquiryModal');
    if (!modal) return;
    
    const targetNameEl = document.getElementById('modalTargetName');
    const destInput = document.getElementById('inquiryDestination');
    
    if (targetNameEl) targetNameEl.innerText = 'Inquiry For ' + (dest || 'Trip');
    if (destInput) destInput.value = dest || '';
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset state
    const form = document.getElementById('popupInquiryForm');
    const success = document.getElementById('popupSuccess');
    if (form) form.style.display = 'grid';
    if (success) success.style.display = 'none';
}

function closeInquiryModal() {
    const modal = document.getElementById('inquiryModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
}

function selectType(el) {
    document.querySelectorAll('.type-pill').forEach(p => {
        p.style.background = '#f8fafc';
        p.style.borderColor = '#e2e8f0';
        p.style.color = '#64748b';
    });
    
    el.style.background = 'var(--primary)';
    el.style.borderColor = 'var(--primary)';
    el.style.color = '#000';
    const travelTypeInput = document.getElementById('popupTravelType');
    if (travelTypeInput) travelTypeInput.value = el.innerText;
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    loadComponents();
    
    // Event delegation for the inquiry form (since it's dynamically loaded)
    document.addEventListener('submit', (e) => {
        if (e.target && e.target.id === 'popupInquiryForm') {
            e.preventDefault();
            // Simulate submission
            const form = document.getElementById('popupInquiryForm');
            const success = document.getElementById('popupSuccess');
            if (form) form.style.display = 'none';
            if (success) success.style.display = 'block';
        }
    });
});
