const API_URL = 'http://localhost:5000/api';

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

});

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('dashboard').style.display = 'flex';
    loadTrips();
    loadBlogs();
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
