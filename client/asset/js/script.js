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
    initInquiryModal();
});

function initInquiryModal() {
    if (!document.getElementById('inquiryModal')) {
        const modalHTML = `
            <div class="inquiry-modal-overlay" id="inquiryModal">
                <div class="inquiry-modal-content">
                    <button class="close-modal-btn" id="closeModal">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                    <div class="modal-header">
                        <h2>Plan Your Dream Trip</h2>
                        <p>Tell us your preferences and we'll craft the perfect journey for you.</p>
                    </div>
                    <form id="popupInquiryForm" class="modal-form-grid">
                        <div class="modal-form-group">
                            <label class="modal-label">Full Name</label>
                            <input type="text" class="modal-input" placeholder="Enter your name" required>
                        </div>
                        <div class="modal-form-group">
                            <label class="modal-label">Email Address</label>
                            <input type="email" class="modal-input" placeholder="example@mail.com" required>
                        </div>
                        <div class="modal-form-group">
                            <label class="modal-label">Phone Number</label>
                            <div class="phone-input-container">
                                <input type="text" class="modal-input country-code" placeholder="+91" value="+91" style="width: 80px;">
                                <input type="tel" class="modal-input" placeholder="00000 00000" style="flex: 1;" required>
                            </div>
                        </div>
                        <div class="modal-form-group">
                            <label class="modal-label">No. of Travelers</label>
                            <input type="number" class="modal-input" min="1" placeholder="e.g. 4" required>
                        </div>
                        <div class="modal-form-group">
                            <label class="modal-label">Package Duration</label>
                            <input type="text" class="modal-input" placeholder="e.g. 5 Days / 4 Nights" required>
                        </div>
                        <div class="modal-form-group">
                            <label class="modal-label">Destination</label>
                            <input type="text" class="modal-input" id="modalDestination" placeholder="Kashmir, Kerala, etc." required>
                        </div>
                        <div class="modal-form-group full-width">
                            <label class="modal-label">Travel Type</label>
                            <div class="travel-type-container">
                                <input type="radio" name="travelType" value="couple" id="typeCouple" checked hidden>
                                <label for="typeCouple" class="type-pill">Couple</label>
                                
                                <input type="radio" name="travelType" value="family" id="typeFamily" hidden>
                                <label for="typeFamily" class="type-pill">Family</label>
                                
                                <input type="radio" name="travelType" value="friends" id="typeFriends" hidden>
                                <label for="typeFriends" class="type-pill">Friends</label>
                            </div>
                        </div>
                        <div class="modal-form-group full-width">
                            <label class="modal-label">Additional Message</label>
                            <textarea class="modal-textarea" rows="3" placeholder="Any specific requirements?"></textarea>
                        </div>
                        <div class="modal-form-group full-width">
                            <button type="submit" class="modal-btn-submit">Submit Inquiry</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // Event Delegation for Inquiry Buttons
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('InquiryBtn')) {
            e.preventDefault();
            e.stopPropagation();

            const tripCard = e.target.closest('.trip-box');
            if (tripCard) {
                const destination = tripCard.querySelector('.trip-city').textContent;
                document.getElementById('modalDestination').value = destination;
            }

            document.getElementById('inquiryModal').classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        if (e.target.id === 'closeModal' || e.target.closest('#closeModal') || e.target.id === 'inquiryModal') {
            document.getElementById('inquiryModal').classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });

    // Handle form submission
    const popupForm = document.getElementById('popupInquiryForm');
    if (popupForm) {
        popupForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for your inquiry! Our team will contact you soon.');
            document.getElementById('inquiryModal').classList.remove('active');
            document.body.style.overflow = 'auto';
            popupForm.reset();
        });
    }
}

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
            slidesPerView: 1,
            loop: true,
            autoplay: { delay: 5000, disableOnInteraction: false },
            spaceBetween: 20
        });
    }
}