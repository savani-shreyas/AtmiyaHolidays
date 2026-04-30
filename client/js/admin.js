const API_URL = '/api';

document.addEventListener('DOMContentLoaded', () => {
    
    // Check if token exists
    const token = localStorage.getItem('token');
    if (token) {
        showDashboard();
    }

    // Login Form logic
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMsg = document.getElementById('error-msg');

        try {
            const res = await fetch(`${API_URL}/admin/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            if (!res.ok) throw new Error('Invalid credentials');
            
            const data = await res.json();
            localStorage.setItem('token', data.token);
            showDashboard();
        } catch (err) {
            errorMsg.style.display = 'block';
        }
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
        localStorage.removeItem('token');
        location.reload();
    });

    // Tab Switching
    const navLinks = document.querySelectorAll('.nav-link[data-target]');
    const sections = document.querySelectorAll('.main-content');

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            const target = link.getAttribute('data-target');
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            sections.forEach(s => {
                s.style.display = s.id === target ? 'block' : 'none';
            });

            if (target === 'trips-section') loadTrips();
            if (target === 'blogs-section') loadBlogs();
            if (target === 'settings-section') loadSiteSettings();
            if (target === 'reviews-section') loadReviews();
            if (target === 'internationalTrip-section') loadIntlTrips();
            if (target === 'domesticTrip-section') loadDomTrips();
        });
    });

    // Modal Logic (Trips)
    const tripModal = document.getElementById('trip-modal');
    document.getElementById('add-trip-btn').addEventListener('click', () => {
        tripModal.classList.add('active');
    });
    
    document.getElementById('close-trip-modal').addEventListener('click', () => {
        tripModal.classList.remove('active');
    });

    const editTripModal = document.getElementById('edit-trip-modal');
    document.getElementById('close-edit-trip-modal').addEventListener('click', () => {
        editTripModal.classList.remove('active');
    });

    // Modal Logic (Blogs)
    const blogModal = document.getElementById('blog-modal');
    document.getElementById('add-blog-btn').addEventListener('click', () => {
        blogModal.classList.add('active');
    });

    document.getElementById('close-blog-modal').addEventListener('click', () => {
        blogModal.classList.remove('active');
    });

    const editBlogModal = document.getElementById('edit-blog-modal');
    document.getElementById('close-edit-blog-modal').addEventListener('click', () => {
        editBlogModal.classList.remove('active');
    });

    // Modal Logic (Reviews)
    const reviewModal = document.getElementById('review-modal');
    document.getElementById('add-review-btn')?.addEventListener('click', () => {
        document.getElementById('review-modal-title').innerText = 'Add New Review';
        document.getElementById('review-submit-btn').innerText = 'Publish Review';
        document.getElementById('review-id').value = '';
        document.getElementById('review-form').reset();
        document.getElementById('review-image-preview').innerHTML = '';
        reviewModal.classList.add('active');
    });

    document.getElementById('close-review-modal')?.addEventListener('click', () => {
        reviewModal.classList.remove('active');
    });

    // Add Trip Form Logic
    document.getElementById('add-trip-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('trip-title').value;
        const destination = document.getElementById('trip-dest').value;
        const duration = document.getElementById('trip-duration').value;
        const description = document.getElementById('trip-desc').value;
        const rating = document.getElementById('trip-rating').value;
        const reviewsCount = document.getElementById('trip-reviews').value;
        const features = document.getElementById('trip-features').value.split(',').map(f => f.trim()).filter(f => f !== '');
        const services = document.getElementById('trip-services').value.split(',').map(s => s.trim()).filter(s => s !== '');
        const price = document.getElementById('trip-price').value;
        const files = document.getElementById('trip-images').files;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('destination', destination);
        formData.append('duration', duration);
        formData.append('description', description);
        formData.append('rating', rating);
        formData.append('reviewsCount', reviewsCount);
        formData.append('features', JSON.stringify(features));
        formData.append('includedServices', JSON.stringify(services));
        formData.append('price', price);
        for(let i=0; i<files.length; i++){
            formData.append('images', files[i]);
        }

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/trips`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if(res.ok) {
                alert('Trip created successfully!');
                tripModal.classList.remove('active');
                document.getElementById('add-trip-form').reset();
                document.getElementById('trip-image-preview-container').innerHTML = '';
                loadTrips();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch(err) {
            console.error(err);
            alert(`Network Error: ${err.message}. Please check if the server is running.`);
        }
    });

    // Edit Trip Form Logic
    document.getElementById('edit-trip-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-trip-id').value;
        const title = document.getElementById('edit-trip-title').value;
        const destination = document.getElementById('edit-trip-dest').value;
        const duration = document.getElementById('edit-trip-duration').value;
        const description = document.getElementById('edit-trip-desc').value;
        const rating = document.getElementById('edit-trip-rating').value;
        const reviewsCount = document.getElementById('edit-trip-reviews').value;
        const features = document.getElementById('edit-trip-features').value.split(',').map(f => f.trim()).filter(f => f !== '');
        const services = document.getElementById('edit-trip-services').value.split(',').map(s => s.trim()).filter(s => s !== '');
        const price = document.getElementById('edit-trip-price').value;
        const files = document.getElementById('edit-trip-images').files;

        const formData = new FormData();
        formData.append('title', title);
        formData.append('destination', destination);
        formData.append('duration', duration);
        formData.append('description', description);
        formData.append('rating', rating);
        formData.append('reviewsCount', reviewsCount);
        formData.append('features', JSON.stringify(features));
        formData.append('includedServices', JSON.stringify(services));
        formData.append('price', price);
        for(let i=0; i<files.length; i++){
            formData.append('images', files[i]);
        }

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/trips/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if(res.ok) {
                alert('Trip updated successfully!');
                editTripModal.classList.remove('active');
                loadTrips();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch(err) {
            console.error(err);
            alert(`Update Error: ${err.message}`);
        }
    });

    // Add Blog Form Logic
    document.getElementById('add-blog-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('blog-title').value;
        const category = document.getElementById('blog-category').value;
        const content = document.getElementById('blog-content').value;
        const author = document.getElementById('blog-author').value;
        const file = document.getElementById('blog-image').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('content', content);
        formData.append('author', author);
        if (file) formData.append('image', file);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/blogs`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if(res.ok) {
                alert('Blog published successfully!');
                blogModal.classList.remove('active');
                document.getElementById('add-blog-form').reset();
                document.getElementById('blog-image-preview-container').innerHTML = '';
                loadBlogs();
            } else {
                const data = await res.json();
                alert(`Error publishing blog: ${data.message || 'Unknown error'}`);
            }
        } catch(err) {
            console.error(err);
            alert('Failed to publish blog. Please check console for details.');
        }
    });

    // Edit Blog Form Logic
    document.getElementById('edit-blog-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('edit-blog-id').value;
        const title = document.getElementById('edit-blog-title').value;
        const category = document.getElementById('edit-blog-category').value;
        const content = document.getElementById('edit-blog-content').value;
        const author = document.getElementById('edit-blog-author').value;
        const file = document.getElementById('edit-blog-image').files[0];

        const formData = new FormData();
        formData.append('title', title);
        formData.append('category', category);
        formData.append('content', content);
        formData.append('author', author);
        if (file) formData.append('image', file);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/blogs/${id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if(res.ok) {
                alert('Blog updated successfully!');
                document.getElementById('edit-blog-modal').classList.remove('active');
                loadBlogs();
            } else {
                const data = await res.json();
                alert(`Error updating blog: ${data.message || 'Unknown error'}`);
            }
        } catch(err) {
            console.error(err);
            alert('Failed to update blog.');
        }
    });

    // Settings Form Logic
    document.getElementById('settings-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const phone = document.getElementById('setting-phone').value;
        const email = document.getElementById('setting-email').value;
        const title = document.getElementById('setting-sidebar-title').value;
        const desc = document.getElementById('setting-sidebar-desc').value;
        const banner = document.getElementById('setting-banner').files[0];

        const formData = new FormData();
        formData.append('contactPhone', phone);
        formData.append('contactEmail', email);
        formData.append('sidebarTitle', title);
        formData.append('sidebarDesc', desc);
        if (banner) formData.append('blogHeroBanner', banner);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/settings`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert('Site settings updated successfully!');
                loadSiteSettings();
            } else {
                const data = await res.json();
                alert(`Error updating settings: ${data.message || 'Unknown error'}`);
            }
        } catch (err) {
            console.error(err);
            alert('Failed to update settings.');
        }
    });

    // Review Form Logic
    document.getElementById('review-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const id = document.getElementById('review-id').value;
        const name = document.getElementById('review-name').value;
        const position = document.getElementById('review-position').value;
        const reviewText = document.getElementById('review-text').value;
        const image = document.getElementById('review-image').files[0];

        const formData = new FormData();
        formData.append('name', name);
        formData.append('position', position);
        formData.append('reviewText', reviewText);
        if (image) formData.append('image', image);

        const token = localStorage.getItem('token');
        const url = id ? `${API_URL}/reviews/${id}` : `${API_URL}/reviews`;
        const method = id ? 'PUT' : 'POST';

        try {
            const res = await fetch(url, {
                method: method,
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert(`Review ${id ? 'updated' : 'published'} successfully!`);
                reviewModal.classList.remove('active');
                loadReviews();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
            alert(`Review Save Error: ${err.message}`);
        }
    });

    // International Trip Form
    document.getElementById('international-trip-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('intl-trip-name').value;
        const type = document.getElementById('intl-trip-type').value;
        const image = document.getElementById('intl-trip-image').files[0];

        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        if (image) formData.append('image', image);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/category-trips`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert('International Trip added successfully!');
                document.getElementById('international-trip-form').reset();
                document.getElementById('intl-trip-image-preview').innerHTML = '';
                loadIntlTrips();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
        }
    });

    // Domestic Trip Form
    document.getElementById('domestic-trip-form')?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('dom-trip-name').value;
        const type = document.getElementById('dom-trip-type').value;
        const image = document.getElementById('dom-trip-image').files[0];

        const formData = new FormData();
        formData.append('name', name);
        formData.append('type', type);
        if (image) formData.append('image', image);

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`${API_URL}/category-trips`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` },
                body: formData
            });

            if (res.ok) {
                alert('Domestic Trip added successfully!');
                document.getElementById('domestic-trip-form').reset();
                document.getElementById('dom-trip-image-preview').innerHTML = '';
                loadDomTrips();
            } else {
                const data = await res.json();
                alert(`Error: ${data.message}`);
            }
        } catch (err) {
            console.error(err);
        }
    });

});

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    loadTrips();
    loadBlogs();
    loadReviews();
}

async function loadTrips() {
    try {
        const res = await fetch(`${API_URL}/trips`);
        const trips = await res.json();
        
        const tbody = document.getElementById('trips-table-body');
        tbody.innerHTML = trips.map(t => `
            <tr>
                <td>${t.title}</td>
                <td>${t.destination}</td>
                <td>${t.duration}</td>
                <td class="action-btns">
                    <button class="btn-icon" onclick="openEditTrip('${t._id}')"><i data-lucide="edit"></i></button>
                    <button class="btn-icon delete" onclick="deleteTrip('${t._id}')"><i data-lucide="trash-2"></i></button>
                </td>
            </tr>
        `).join('');
        
        lucide.createIcons();
    } catch (err) {
        console.error(err);
    }
}

async function openEditTrip(id) {
    try {
        const res = await fetch(`${API_URL}/trips/${id}`);
        if(res.ok) {
            const trip = await res.json();
            document.getElementById('edit-trip-id').value = trip._id;
            document.getElementById('edit-trip-title').value = trip.title;
            document.getElementById('edit-trip-dest').value = trip.destination;
            document.getElementById('edit-trip-duration').value = trip.duration;
            document.getElementById('edit-trip-desc').value = trip.description || '';
            document.getElementById('edit-trip-rating').value = trip.rating || 5;
            document.getElementById('edit-trip-reviews').value = trip.reviewsCount || 0;
            document.getElementById('edit-trip-features').value = trip.features ? trip.features.join(', ') : '';
            document.getElementById('edit-trip-services').value = trip.includedServices ? trip.includedServices.join(', ') : '';
            document.getElementById('edit-trip-price').value = trip.price;
            
            document.getElementById('edit-trip-images').value = '';
            document.getElementById('edit-trip-image-preview-container').innerHTML = '';
            
            document.getElementById('edit-trip-modal').classList.add('active');
        }
    } catch(err) {
        console.error(err);
    }
}

async function deleteTrip(id) {
    if(!confirm('Are you sure you want to delete this trip?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/trips/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) loadTrips();
    } catch(err) {
        console.error(err);
    }
}

function previewTripImages(input) {
    const container = document.getElementById('trip-image-preview-container');
    container.innerHTML = '';
    if(input.files) {
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'img-preview';
                container.appendChild(img);
            }
            reader.readAsDataURL(file);
        });
    }
}

function previewEditTripImages(input) {
    const container = document.getElementById('edit-trip-image-preview-container');
    container.innerHTML = '';
    if(input.files) {
        Array.from(input.files).forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'img-preview';
                container.appendChild(img);
            }
            reader.readAsDataURL(file);
        });
    }
}

// Blog Management Functions
async function loadBlogs() {
    try {
        const res = await fetch(`${API_URL}/blogs`);
        const blogs = await res.json();
        
        const tbody = document.getElementById('blogs-table-body');
        tbody.innerHTML = blogs.map(b => `
            <tr>
                <td>${b.title}</td>
                <td>${b.category}</td>
                <td>${new Date(b.date).toLocaleDateString()}</td>
                <td class="action-btns">
                    <button class="btn-icon" onclick="openEditBlog('${b._id}')"><i data-lucide="edit"></i></button>
                    <button class="btn-icon delete" onclick="deleteBlog('${b._id}')"><i data-lucide="trash-2"></i></button>
                </td>
            </tr>
        `).join('');
        
        lucide.createIcons();
    } catch (err) {
        console.error(err);
    }
}

async function openEditBlog(id) {
    try {
        const res = await fetch(`${API_URL}/blogs/${id}`);
        if(res.ok) {
            const blog = await res.json();
            document.getElementById('edit-blog-id').value = blog._id;
            document.getElementById('edit-blog-title').value = blog.title;
            document.getElementById('edit-blog-category').value = blog.category;
            document.getElementById('edit-blog-content').value = blog.content;
            document.getElementById('edit-blog-author').value = blog.author;
            
            document.getElementById('edit-blog-image').value = '';
            document.getElementById('edit-blog-image-preview-container').innerHTML = '';
            
            document.getElementById('edit-blog-modal').classList.add('active');
        }
    } catch(err) {
        console.error(err);
    }
}

async function deleteBlog(id) {
    if(!confirm('Are you sure you want to delete this blog?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/blogs/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) loadBlogs();
    } catch(err) {
        console.error(err);
    }
}

function previewBlogImage(input) {
    const container = document.getElementById('blog-image-preview-container');
    container.innerHTML = '';
    if(input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'img-preview';
            container.appendChild(img);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

function previewEditBlogImage(input) {
    const container = document.getElementById('edit-blog-image-preview-container');
    container.innerHTML = '';
    if(input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'img-preview';
            container.appendChild(img);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

async function loadSiteSettings() {
    try {
        const res = await fetch(`${API_URL}/settings`);
        const s = await res.json();
        
        document.getElementById('setting-phone').value = s.contactPhone || '';
        document.getElementById('setting-email').value = s.contactEmail || '';
        document.getElementById('setting-sidebar-title').value = s.sidebarTitle || '';
        document.getElementById('setting-sidebar-desc').value = s.sidebarDesc || '';
        
        if (s.blogHeroBanner) {
            const SERVER_URL = 'http://localhost:5000';
            const container = document.getElementById('setting-banner-preview');
            container.innerHTML = `<img src="${s.blogHeroBanner.startsWith('http') ? s.blogHeroBanner : SERVER_URL + s.blogHeroBanner}" class="img-preview" style="width: 200px; height: 100px;">`;
        }
    } catch (err) {
        console.error('Error loading settings:', err);
    }
}

function previewSettingBanner(input) {
    const container = document.getElementById('setting-banner-preview');
    container.innerHTML = '';
    if(input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'img-preview';
            img.style.width = '200px';
            img.style.height = '100px';
            container.appendChild(img);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Review Management Functions
async function loadReviews() {
    try {
        const res = await fetch(`${API_URL}/reviews`);
        const reviews = await res.json();
        
        const tbody = document.getElementById('reviews-table-body');
        if (!tbody) return;

        tbody.innerHTML = reviews.map(r => `
            <tr>
                <td>${r.name}</td>
                <td>${r.position}</td>
                <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${r.reviewText}</td>
                <td class="action-btns">
                    <button class="btn-icon" onclick="openEditReview('${r._id}')"><i data-lucide="edit"></i></button>
                    <button class="btn-icon delete" onclick="deleteReview('${r._id}')"><i data-lucide="trash-2"></i></button>
                </td>
            </tr>
        `).join('');
        
        lucide.createIcons();
    } catch (err) {
        console.error('Error loading reviews:', err);
    }
}

async function openEditReview(id) {
    try {
        const res = await fetch(`${API_URL}/reviews/${id}`);
        if(res.ok) {
            const r = await res.json();
            document.getElementById('review-id').value = r._id;
            document.getElementById('review-name').value = r.name;
            document.getElementById('review-position').value = r.position;
            document.getElementById('review-text').value = r.reviewText;
            
            document.getElementById('review-modal-title').innerText = 'Edit Review';
            document.getElementById('review-submit-btn').innerText = 'Save Changes';
            
            const preview = document.getElementById('review-image-preview');
            if (r.image) {
                const SERVER_URL = 'http://localhost:5000';
                preview.innerHTML = `<img src="${r.image.startsWith('http') ? r.image : SERVER_URL + r.image}" class="img-preview">`;
            } else {
                preview.innerHTML = '';
            }
            
            document.getElementById('review-modal').classList.add('active');
        }
    } catch(err) {
        console.error(err);
    }
}

async function deleteReview(id) {
    if(!confirm('Are you sure you want to delete this review?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/reviews/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) loadReviews();
    } catch(err) {
        console.error(err);
    }
}

function previewReviewImage(input) {
    const container = document.getElementById('review-image-preview');
    container.innerHTML = '';
    if(input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'img-preview';
            container.appendChild(img);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Generic image preview used by CategoryTrips
function previewImage(input, previewId) {
    const container = document.getElementById(previewId);
    container.innerHTML = '';
    if(input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'img-preview';
            container.appendChild(img);
        }
        reader.readAsDataURL(input.files[0]);
    }
}

// Category Trips Data Loading
async function loadIntlTrips() {
    try {
        const res = await fetch(`${API_URL}/category-trips?type=international`);
        const trips = await res.json();
        const tbody = document.getElementById('intl-trips-table-body');
        if (!tbody) return;
        const SERVER_URL = 'http://localhost:5000';
        tbody.innerHTML = trips.map(t => `
            <tr>
                <td>${t.image ? `<img src="${t.image.startsWith('http') ? t.image : SERVER_URL + t.image}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;">` : 'No Image'}</td>
                <td>${t.name}</td>
                <td style="text-transform: capitalize;">${t.type}</td>
                <td class="action-btns">
                    <button class="btn-icon delete" onclick="deleteCategoryTrip('${t._id}', 'international')"><i data-lucide="trash-2"></i></button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    } catch (err) {
        console.error(err);
    }
}

async function loadDomTrips() {
    try {
        const res = await fetch(`${API_URL}/category-trips?type=domestic`);
        const trips = await res.json();
        const tbody = document.getElementById('dom-trips-table-body');
        if (!tbody) return;
        const SERVER_URL = 'http://localhost:5000';
        tbody.innerHTML = trips.map(t => `
            <tr>
                <td>${t.image ? `<img src="${t.image.startsWith('http') ? t.image : SERVER_URL + t.image}" style="width:50px;height:50px;object-fit:cover;border-radius:4px;">` : 'No Image'}</td>
                <td>${t.name}</td>
                <td style="text-transform: capitalize;">${t.type}</td>
                <td class="action-btns">
                    <button class="btn-icon delete" onclick="deleteCategoryTrip('${t._id}', 'domestic')"><i data-lucide="trash-2"></i></button>
                </td>
            </tr>
        `).join('');
        lucide.createIcons();
    } catch (err) {
        console.error(err);
    }
}

async function deleteCategoryTrip(id, type) {
    if(!confirm('Are you sure you want to delete this trip?')) return;
    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${API_URL}/category-trips/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if(res.ok) {
            if(type === 'international') loadIntlTrips();
            else loadDomTrips();
        }
    } catch(err) {
        console.error(err);
    }
}
