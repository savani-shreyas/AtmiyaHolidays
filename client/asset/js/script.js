document.addEventListener('DOMContentLoaded', async () => {
    const hasDynamicContent = !!document.getElementById('dynamic-trips-container') || !!document.querySelectorAll('.article-container') || !!document.getElementById('dynamic-destinations-container') || !!document.getElementById('dynamic-reviews-container');
    
    if (hasDynamicContent && window.api) {
        await renderCommonDynamicContent();
    }

    initSwipers();
});

async function renderCommonDynamicContent() {
    const trips = await api.getTrips();
    const places = await api.getPlaces();
    const blogs = await api.getBlogs();
    const reviews = await api.getReviews();

    const tripsContainer = document.getElementById('dynamic-trips-container');
    if (tripsContainer && trips.length > 0) {
        const SERVER_URL = 'http://localhost:5000';
        tripsContainer.innerHTML = trips.slice(0, 8).map(t => `
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
                        <div class="price-box">
                            <h6 class="price-txt">${t.duration}</h6>
                            <h6 class="price-txt">from $${t.price}</h6>
                        </div>
                    </div>
                </div>
            </a>
        `).join('');
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
        const SERVER_URL = 'http://localhost:5000';
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
        const SERVER_URL = 'http://localhost:5000';
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

function initSwipers() {
    if(document.querySelector('.heroSwiper')) {
        new Swiper(".heroSwiper", {
            slidesPerView: 1,
            loop: true,
            autoplay: { delay: 2500, disableOnInteraction: false },
            navigation: { nextEl: ".hero-btn-next", prevEl: ".hero-btn-prev" },
        });
    }

    if(document.querySelector('.reviewSwiper')) {
        new Swiper(".reviewSwiper", {
            slidesPerView: 1,
            loop: true,
            autoplay: { delay: 2500, disableOnInteraction: false }
        });
    }
    
    if(document.querySelector('.toorPartnerSwiper')) {
        new Swiper(".toorPartnerSwiper", {
            slidesPerView: 5,
            loop: true,
            autoplay: { delay: 2500, disableOnInteraction: false },
            spaceBetween: 20
        });
    }
}