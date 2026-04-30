const API_BASE_URL = '/api';

const api = {
    // Hotels
    getHotels: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/hotels`);
            if (!res.ok) throw new Error('Failed to fetch hotels');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    },
    getHotelById: async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/hotels/${id}`);
            if (!res.ok) throw new Error('Failed to fetch hotel');
            return await res.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    },

    // Trips
    getTrips: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/trips`);
            if (!res.ok) throw new Error('Failed to fetch trips');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    },
    getTripById: async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/trips/${id}`);
            if (!res.ok) throw new Error('Failed to fetch trip details');
            return await res.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    
    // Category Trips (International / Domestic)
    getCategoryTrips: async (type) => {
        try {
            const url = type ? `${API_BASE_URL}/category-trips?type=${type}` : `${API_BASE_URL}/category-trips`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch category trips');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    // Places
    getPlaces: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/places`);
            if (!res.ok) throw new Error('Failed to fetch places');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    },

    // Rooms
    getRoomsByHotel: async (hotelId) => {
        try {
            const res = await fetch(`${API_BASE_URL}/rooms?hotelId=${hotelId}`);
            if (!res.ok) throw new Error('Failed to fetch rooms');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    },
    
    // Blogs
    getBlogs: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/blogs`);
            if (!res.ok) throw new Error('Failed to fetch blogs');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    },
    getReviews: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/reviews`);
            if (!res.ok) throw new Error('Failed to fetch reviews');
            return await res.json();
        } catch (err) {
            console.error(err);
            return [];
        }
    },
    getBlogById: async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/blogs/${id}`);
            if (!res.ok) throw new Error('Failed to fetch blog details');
            return await res.json();
        } catch (err) {
            console.error(err);
            return null;
        }
    },
    
    // Site Settings
    getSettings: async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/settings`);
            // If server returns HTML (fallback), parse it as error
            const contentType = res.headers.get("content-type");
            if (!res.ok || (contentType && contentType.indexOf("text/html") !== -1)) {
                return {
                    contactPhone: '+91 70482 48542',
                    contactEmail: 'atmiyaholidays@gmail.com',
                    sidebarTitle: 'Have Any Question?',
                    sidebarDesc: 'Contact us for any personalized travel requirements.'
                };
            }
            return await res.json();
        } catch (err) {
            console.error('Settings fetch error:', err);
            return {
                contactPhone: '+91 70482 48542',
                contactEmail: 'atmiyaholidays@gmail.com',
                sidebarTitle: 'Have Any Question?',
                sidebarDesc: 'Contact us for any personalized travel requirements.'
            };
        }
    }
};

window.api = api;
