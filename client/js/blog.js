document.addEventListener('DOMContentLoaded', async () => {
    if (window.api) {
        // Fetch both blog and site settings with robustness
        const [blogs, settings] = await Promise.all([
            api.getBlogs(),
            api.getSettings()
        ]);
        
        // Render Banner/Header dynamically
        renderBlogHeader(settings);
        
        // Render category filters first (Show here)
        renderCategoryFilters(blogs);
        // Then render all blogs (Show here)
        renderBlogs(blogs);
    }
});

function renderBlogHeader(settings) {
    const bannerSection = document.querySelector('.common-hero-banner');
    if (!bannerSection) return;

    const SERVER_URL = 'http://localhost:5000';
    const bannerImg = bannerSection.querySelector('img');
    if (settings.blogHeroBanner && bannerImg) {
        bannerImg.src = settings.blogHeroBanner.startsWith('http') ? settings.blogHeroBanner : SERVER_URL + settings.blogHeroBanner;
    }
}

function renderCategoryFilters(blogs) {
    const headerContainer = document.querySelector('.blog-header');
    if (!headerContainer) return;

    // Get unique categories
    const categories = ['All', ...new Set(blogs.map(b => b.category))];

    headerContainer.innerHTML = categories.map((cat, index) => `
        <button class="blog-btn ${index === 0 ? 'active' : ''}" onclick="filterBlogs('${cat}', this, ${JSON.stringify(blogs).replace(/"/g, '&quot;')})">
            ${cat}
        </button>
    `).join('');
}

function renderBlogs(blogs) {
    const blogContainer = document.querySelector('.blog-main');
    if (!blogContainer) return;

    const SERVER_URL = 'http://localhost:5000';
    
    if (blogs.length === 0) {
        blogContainer.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px; color: #666;">No blogs found for this category.</p>';
        return;
    }

    blogContainer.innerHTML = blogs.map(b => `
        <div class="blog-card">
            <a href="blog-details.html?id=${b._id}">
                <img src="${b.image ? (b.image.startsWith('http') ? b.image : SERVER_URL + b.image) : './asset/images/Banner/BannerAboutGrid1.png'}" alt="Blog Image" class="w-100">
                <div class="blog-content">
                    <h3 class="blog-title">${b.title}</h3>
                    <div class="blog-date-box">
                        <img src="./asset/images/Icon/calendar.svg" alt="calendar" class="blog-date-icon">
                        <p class="blog-date">${new Date(b.date).toLocaleDateString()}</p>
                    </div>
                </div>
            </a>
        </div>
    `).join('');
}

// Global filter function to make it easier to call from dynamic buttons
window.filterBlogs = (category, btn, allBlogs) => {
    // Update active button state
    document.querySelectorAll('.blog-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (category === 'All') {
        renderBlogs(allBlogs);
    } else {
        const filtered = allBlogs.filter(b => b.category === category);
        renderBlogs(filtered);
    }
};
