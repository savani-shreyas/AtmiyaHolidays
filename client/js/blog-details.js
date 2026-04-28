document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const blogId = urlParams.get('id');

    if (!blogId) {
        window.location.href = 'blog.html';
        return;
    }

    if (window.api) {
        // Fetch both blog and site settings
        const [blog, settings] = await Promise.all([
            api.getBlogById(blogId),
            api.getSettings ? api.getSettings() : fetch('http://localhost:5000/api/settings').then(res => res.json())
        ]);

        if (blog) {
            renderBlogDetailsRoot(blog, settings);
        } else {
            console.error('Blog not found');
            document.getElementById('blog-details-root').innerHTML = '<h1 class="heading--1 text-center">Blog Not Found</h1>';
        }
    }
});

function renderBlogDetailsRoot(b, settings) {
    const SERVER_URL = 'http://localhost:5000';
    const root = document.getElementById('blog-details-root');
    if (!root) return;

    // Use specific blog image or fallback
    const bannerUrl = b.image ? (b.image.startsWith('http') ? b.image : SERVER_URL + b.image) : './asset/images/Banner/blog.jpg';

    const html = `
        <div class="blog-details-root-wrapper">
            <!-- Immersive Hero Header -->
            <div class="blog-hero-header">
                <img src="${bannerUrl}" alt="${b.title}" class="blog-hero-image">
                <div class="blog-hero-overlay">
                    <span class="section-tag">${b.category}</span>
                    <h1>${b.title}</h1>
                    <div class="blog-hero-meta">
                        <span><img src="../asset/images/Icon/calendar.svg" class="contact-info-box-img" /> ${new Date(b.date).toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                        <span><img src="../asset/images/Icon/aboutCounterIcon2.svg" class="contact-info-box-img-white" /> ${b.author || 'Admin'}</span>
                    </div>
                </div>
            </div>
            <div class="container py-40-80">
                <div class="blog-details-grid">
                    <!-- Main Content -->
                    <div class="blog-main-article">
                        <div class="blog-content-text">
                            ${b.content.split('\n').filter(p => p.trim() !== '').map(p => `<p>${p}</p>`).join('')}
                        </div>
                        
                        <div style="margin-top: 30px; padding-top: 30px; border-top: 1px solid #eee;">
                            <a href="blog.html" class="blog-btn" style="display:inline-block; border-radius: 30px; padding: 12px 30px;">
                                <i data-lucide="arrow-left" style="width:18px;vertical-align:middle;margin-right:8px;"></i> Back to Blogs
                            </a>
                        </div>
                    </div>

                    <!-- Sticky Sidebar -->
                    <aside class="blog-sidebar">
                        <div class="blog-sidebar-sticky">

                            <!-- Recent Posts Widget -->
                            <div class="sidebar-glass-card">
                                <h3 style="font-size: 1.25rem; margin-bottom: 20px; border-bottom: 2px solid #5ad109; padding-bottom: 10px;">Recent Posts</h3>
                                <div id="recent-posts-sidebar" class="recent-blog-list">
                                    <!-- Filled by JS -->
                                </div>
                            </div>

                            <!-- Categories Widget -->
                            <div class="sidebar-glass-card">
                                <h3 style="font-size: 1.25rem; margin-bottom: 20px; border-bottom: 2px solid #5ad109; padding-bottom: 10px;">Categories</h3>
                                <ul id="dynamic-categories" class="blog-details-page-top" style="padding:0; margin:0; list-style:none;">
                                    <!-- Filled by JS -->
                                </ul>
                            </div>

                            <!-- Contact Widget -->
                            <div class="sidebar-glass-card" style="background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: white;">
                                <h3 style="color: white; font-size: 1.25rem; margin-bottom: 15px;">${settings.sidebarTitle || 'Need Help?'}</h3>
                                <p style="font-size: 0.9rem; margin-bottom: 25px; opacity: 0.8;">${settings.sidebarDesc || 'Contact our experts for a personalized holiday plan.'}</p>
                                <div style="display: flex; flex-direction: column; gap: 15px;">
                                    <a href="tel:${settings.contactPhone}" class="contact-info-box" style="color: white; border-color: rgba(255,255,255,0.2);">
                                        <img src="../asset/images/Icon/call.svg" alt="Phone" class="contact-info-box-img" /> ${settings.contactPhone || '+91 70482 48542'}
                                    </a>
                                    <a href="mailto:${settings.contactEmail}" class="contact-info-box" style="color: white; border-color: rgba(255,255,255,0.2);">
                                        <img src="../asset/images/Icon/mail.svg" alt="Mail" class="contact-info-box-img" /> ${settings.contactEmail || 'atmiyaholidays@gmail.com'}
                                    </a>
                                </div>
                            </div>

                        </div>
                    </aside>
                </div>
            </div>
        </div>
    `;

    root.innerHTML = html;
    document.title = `${b.title} - Atmiya Holidays`;

    // Re-initialize Lucide icons for the new HTML
    if (window.lucide) {
        lucide.createIcons();
    }

    renderSidebarData(b._id);
}

async function renderSidebarData(currentId) {
    const categoryList = document.getElementById('dynamic-categories');
    const recentPostsContainer = document.getElementById('recent-posts-sidebar');
    if (!window.api) return;

    try {
        const blogs = await api.getBlogs();
        const SERVER_URL = 'http://localhost:5000';

        // 1. Render Categories
        if (categoryList) {
            const categories = [...new Set(blogs.map(b => b.category))];
            categoryList.innerHTML = categories.map(cat => `
                <li style="margin-bottom: 10px;"><a href="blog.html?category=${cat}" style="color: #475569;">
                    ${cat}
                </a></li>
            `).join('');
        }

        // 2. Render Recent Posts
        if (recentPostsContainer) {
            const recent = blogs
                .filter(b => b._id !== currentId)
                .slice(0, 3);

            recentPostsContainer.innerHTML = recent.map(r => `
                <a href="blog-details.html?id=${r._id}" class="recent-post-item">
                    <img src="${r.image ? (r.image.startsWith('http') ? r.image : SERVER_URL + r.image) : './asset/images/Banner/BannerAboutGrid1.png'}" class="recent-post-thumb">
                    <div class="recent-post-info">
                        <h4 class="recent-post-title">${r.title}</h4>
                        <span class="recent-post-date">${new Date(r.date).toLocaleDateString()}</span>
                    </div>
                </a>
            `).join('');
        }

        if (window.lucide) lucide.createIcons();
    } catch (err) {
        console.error('Error rendering sidebar data:', err);
    }
}
