document.addEventListener('DOMContentLoaded', async () => {
    const hasDynamicContent = !!document.getElementById('dynamic-trips-container') ||
        !!document.getElementById('dynamic-all-trips-container') ||
        !!document.querySelectorAll('.article-container').length ||
        !!document.getElementById('dynamic-destinations-container') ||
        !!document.getElementById('dynamic-reviews-container');

    if (hasDynamicContent && window.api) {
        await renderCommonDynamicContent();
    }

    initSwipers();
    // initInquiryModal(); // Removed as it's now in footer.html component
});

// Event Delegation for Inquiry Buttons (moved out of initInquiryModal)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('InquiryBtn')) {
        e.preventDefault();
        e.stopPropagation();

        const tripCard = e.target.closest('.trip-box');
        let destination = "";
        if (tripCard) {
            destination = tripCard.querySelector('.trip-city')?.textContent || "";
        }
        
        if (typeof openInquiryModal === 'function') {
            openInquiryModal(destination);
        } else {
            // Fallback if global-init.js isn't loaded yet or something
            const modal = document.getElementById('inquiryModal');
            if (modal) {
                document.getElementById('modalTargetName').innerText = 'Inquiry For ' + destination;
                document.getElementById('inquiryDestination').value = destination;
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    }

    if (e.target.id === 'closeModal' || e.target.closest('.close-modal-btn') || e.target.id === 'inquiryModal') {
        const modal = document.getElementById('inquiryModal');
        if (modal && (e.target === modal || e.target.closest('.close-modal-btn'))) {
            modal.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

async function renderCommonDynamicContent() {
    const trips = await api.getTrips();
    const places = await api.getPlaces();
    const blogs = await api.getBlogs();
    const reviews = await api.getReviews();

    const tripsContainer = document.getElementById('dynamic-trips-container');
    const allTripsContainer = document.getElementById('dynamic-all-trips-container');
    const SERVER_URL = 'http://localhost:5000';

    if (tripsContainer && trips.length > 0) {
        const slicedTrips = trips.slice(0, 7);
        const tripsHTML = slicedTrips.map(t => renderTripCard(t, SERVER_URL)).join('');
        const customCardHTML = renderCustomPackageCard();
        tripsContainer.innerHTML = tripsHTML + customCardHTML;
    }

    if (allTripsContainer && trips.length > 0) {
        const tripsHTML = trips.map(t => renderTripCard(t, SERVER_URL)).join('');
        const customCardHTML = renderCustomPackageCard();
        allTripsContainer.innerHTML = tripsHTML + customCardHTML;
    }

    // 2. Render Destinations (if container exists)
    const destContainer = document.getElementById('dynamic-destinations-container');
    if (destContainer && places.length > 0) {
        destContainer.innerHTML = places.map(p => `
            <div class="swiper-slide desti-box">
                <img src="${p.images && p.images[0] ? p.images[0] : './asset/images/Category/category1.png'}" alt="Destination" style="width:100%; height:100%; object-fit:cover;">
                <div class="desti-content">
                    <h5 class="desti-title">${p.name}</h5>
                    <p class="places-count">${p.country}</p>
                </div>
            </div>
        `).join('');
    }

    // 3. Render Articles (Blogs) in ALL containers
    const blogContainers = document.querySelectorAll('.article-container');
    if (blogContainers.length > 0 && blogs.length > 0) {
        const blogHTML = blogs.slice(0, 3).map(b => {
            const date = new Date(b.date);
            const formattedDate = date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });

            return `
            <div class="article-box">
                <a href="blog-details.html?id=${b._id}" style="text-decoration: none; color: inherit;">
                    <div class="article-img-box">
                        <img src="${b.image ? (b.image.startsWith('http') ? b.image : SERVER_URL + b.image) : './asset/images/Article/article1.png'}" alt="Article" />
                        <p class="article-tag">${b.category}</p>
                    </div>
                </a>
                <div class="article-content">
                    <div class="article-date-author">
                        <span class="article-date">${formattedDate}</span>
                        <span class="article-author">By ${b.author || 'Admin'}</span>
                    </div>
                    <a href="blog-details.html?id=${b._id}" style="text-decoration: none; color: inherit;">
                        <h5 class="article-title">${b.title}</h5>
                    </a>
                </div>
            </div>
            `;
        }).join('');

        blogContainers.forEach(container => {
            container.innerHTML = blogHTML;
        });
    }

    // Update 'See All' for blogs
    document.querySelectorAll('.article-section .section-header-link').forEach(link => {
        link.href = 'blog.html';
    });

    // 4. Render Reviews (if container exists)
    const reviewContainer = document.getElementById('dynamic-reviews-container');
    if (reviewContainer && reviews.length > 0) {
        reviewContainer.innerHTML = reviews.map(r => `
            <div class="swiper-slide review-slide">
                <img src="./asset/images/Icon/review-icon.png" alt="review-icon" class="customer-review-img">
                <div class="customer-review-content">
                    <p class="customer-review-text">${r.reviewText}</p>
                </div>
                <div class="customer-review-footer">
                    <div class="customer-image">
                        <img src="${r.image ? (r.image.startsWith('http') ? r.image : SERVER_URL + r.image) : './asset/images/Icon/customer1.png'}" alt="customer-image">
                    </div>
                    <div>
                        <h5 class="customer-review-name">${r.name}</h5>
                        <p class="customer-review-position">${r.position}</p>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // 5. Render Category Trips (International / Domestic)
    const intlTripsContainer = document.getElementById('InternationalTrips');
    if (intlTripsContainer) {
        const intlTrips = await api.getCategoryTrips('international');
        if (intlTrips.length > 0) {
            intlTripsContainer.innerHTML = intlTrips.map(t => `
                <div class="destination-card">
                    <img src="${t.image ? (t.image.startsWith('http') ? t.image : SERVER_URL + t.image) : ''}" alt="${t.name}" class="destination-flag">
                    <h5>${t.name}</h5>
                    <button class="btn-inquiry-sm" onclick="event.stopPropagation(); openInquiryModal('${t.name}')">Inquiry</button>
                </div>
            `).join('');
        }
    }

    const domTripsContainer = document.getElementById('DomesticTrips');
    if (domTripsContainer) {
        const domTrips = await api.getCategoryTrips('domestic');
        if (domTrips.length > 0) {
            domTripsContainer.innerHTML = domTrips.map(t => `
                <div class="destination-card">
                    <img src="${t.image ? (t.image.startsWith('http') ? t.image : SERVER_URL + t.image) : ''}" alt="${t.name}" class="${t.type === 'international' ? 'destination-flag' : 'destination-img'}">
                    <h5>${t.name}</h5>
                    <button class="btn-inquiry-sm" onclick="event.stopPropagation(); openInquiryModal('${t.name}')">Inquiry</button>
                </div>
            `).join('');
        }
    }
}

function renderTripCard(t, SERVER_URL) {
    return `
        <a href="trip-details.html?id=${t._id}" class="trip-link">
            <div class="trip-box">
                <div class="trip-img-box" style="overflow: hidden;">
                    <img src="${t.images && t.images[0] ? (t.images[0].startsWith('http') ? t.images[0] : SERVER_URL + t.images[0]) : './asset/images/Trip/trip1.png'}" alt="Trip" class="w-100 h-100">
                </div>
                <div class="trip-content">
                    <p class="trip-city">${t.destination}</p>
                    <h5 class="trip-title">${t.title}</h5>
                    <div class="rating-star">
                        <div class="rating-star-box">
                            <img src="./asset/images/Icon/Rating-Full-Star.svg" alt="Star">
                            <img src="./asset/images/Icon/Rating-Full-Star.svg" alt="Star">
                            <img src="./asset/images/Icon/Rating-Full-Star.svg" alt="Star">
                            <img src="./asset/images/Icon/Rating-Full-Star.svg" alt="Star">
                            <img src="./asset/images/Icon/Rating-Full-Star.svg" alt="Star">
                        </div>
                        <p class="rating-text">${t.rating || 5.0} (${t.reviewsCount || 0})</p>
                    </div>
                    <div class="inquiry-box">
                        <button class="btn btn--1 InquiryBtn">Inquiry</button>
                    </div>
                </div>
            </div>
        </a>
    `;
}

function renderCustomPackageCard() {
    return `
        <a href="inquiry.html" class="trip-link">
            <div class="trip-box custom-package-card">
                <div class="custom-package-content">
                    <h3 class="custom-package-title">Custom Package</h3>
                    <p class="custom-package-text">Cannot find what you're looking for? Let us design your perfect trip.</p>
                    <button class="btn btn--custom InquiryBtn">Plan Your Trip</button>
                </div>
            </div>
        </a>
    `;
}

function initSwipers() {
    if (document.querySelector('.heroSwiper')) {
        new Swiper(".heroSwiper", {
            slidesPerView: 1,
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            navigation: { nextEl: ".hero-btn-next", prevEl: ".hero-btn-prev" },
        });
    }

    if (document.querySelector('.reviewSwiper')) {
        new Swiper(".reviewSwiper", {
            slidesPerView: 1,
            loop: true,
            autoplay: { delay: 6000, disableOnInteraction: false },
            navigation: { nextEl: ".review-btn-next", prevEl: ".review-btn-prev" },
        });
    }

    if (document.querySelector('.toorPartnerSwiper')) {
        new Swiper(".toorPartnerSwiper", {
            slidesPerView: 5,
            loop: true,
            autoplay: { delay: 2500, disableOnInteraction: false },
            spaceBetween: 20
        });
    }

    if (document.querySelector('.hotelSiper')) {
        new Swiper(".hotelSiper", {
            slidesPerView: 1.5,
            centeredSlides: true,
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            spaceBetween: 50,
            navigation: { nextEl: ".hotel-btn-next", prevEl: ".hotel-btn-prev" },
        });
    }
}