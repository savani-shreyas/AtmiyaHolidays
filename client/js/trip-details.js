document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const tripId = urlParams.get('id');

    if (!tripId) {
        window.location.href = 'index.html';
        return;
    }

    if (window.api) {
        const trip = await api.getTripById(tripId);
        if (trip) {
            renderTripDetails(trip);
        } else {
            console.error('Trip not found');
            document.getElementById('trip-title').innerText = 'Trip Not Found';
        }
    }
});

function renderTripDetails(t) {
    const SERVER_URL = '';
    
    document.title = `${t.title} - Atmiya Holidays`;
    document.getElementById('trip-title').innerText = t.title;
    document.getElementById('trip-dest').innerHTML = `<i data-lucide="map-pin"></i> ${t.destination}`;
    document.getElementById('trip-duration-hero').innerHTML = `<i data-lucide="clock"></i> ${t.duration}`;
    document.getElementById('trip-duration-side').innerText = t.duration;
    document.getElementById('trip-rating-hero').innerHTML = `<i data-lucide="star" style="fill: #fbbf24; color: #fbbf24;"></i> ${t.rating || 5.0} (${t.reviewsCount || 0})`;
    document.getElementById('trip-rating-side').innerText = `${t.rating || 5.0} / 5.0`;
    document.getElementById('trip-desc').innerText = t.description;

    const heroBg = document.getElementById('hero-bg');
    if (t.images && t.images[0]) {
        const heroImg = t.images[0].startsWith('http') ? t.images[0] : SERVER_URL + t.images[0];
        heroBg.style.backgroundImage = `url('${heroImg}')`;
    }

    const galleryContainer = document.getElementById('trip-gallery');
    if (t.images && t.images.length > 0) {
        galleryContainer.innerHTML = t.images.map(img => {
            const imgSrc = img.startsWith('http') ? img : SERVER_URL + img;
            return `
                <div class="gallery-item" onclick="changeHeroImage('${imgSrc}')">
                    <img src="${imgSrc}" alt="Trip aspect">
                </div>
            `;
        }).join('');
    }

    window.changeHeroImage = (src) => {
        const heroBg = document.getElementById('hero-bg');
        heroBg.style.backgroundImage = `url('${src}')`;
        heroBg.style.transition = 'background-image 0.5s ease-in-out';
    };

    const featuresList = document.getElementById('features-list');
    if (t.features && t.features.length > 0) {
        featuresList.innerHTML = t.features.map(f => `
            <div class="feature-box">
                <i data-lucide="check-circle" style="width:18px;"></i>
                <span>${f}</span>
            </div>
        `).join('');
    } else {
        featuresList.innerHTML = '<p class="text-muted">Contact us for more details on features.</p>';
    }

    const servicesList = document.getElementById('services-list');
    if (t.includedServices && t.includedServices.length > 0) {
        servicesList.innerHTML = t.includedServices.map(s => `
            <div class="feature-box" style="background: #ecfdf5;">
                <i data-lucide="plus" style="width:18px; color: #10b981;"></i>
                <span>${s}</span>
            </div>
        `).join('');
    }

    const bookBtn = document.getElementById('adBookTrip');
    if (bookBtn) {
        bookBtn.onclick = (e) => {
            e.preventDefault();
            if (typeof openInquiryModal === 'function') {
                openInquiryModal(t.title);
            }
        };
    }

    lucide.createIcons();
}
