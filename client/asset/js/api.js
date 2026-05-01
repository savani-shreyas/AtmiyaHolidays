let localDataCache = null;

const fetchLocalData = async () => {
    if (localDataCache) return localDataCache;
    try {
        // Fetch from the static json file
        const res = await fetch('/data.json');
        if (!res.ok) {
            // fallback for relative paths if not hosted at root
            const fallbackRes = await fetch('./data.json');
            if (!fallbackRes.ok) throw new Error('Failed to fetch data.json');
            localDataCache = await fallbackRes.json();
        } else {
            localDataCache = await res.json();
        }
        return localDataCache;
    } catch (err) {
        console.error("Error loading static data:", err);
        return { 
            trips: [], 
            categoryTrips: [], 
            blogs: [], 
            hotels: [], 
            places: [], 
            rooms: [], 
            reviews: [], 
            settings: {} 
        };
    }
};

const api = {
    // Hotels
    getHotels: async () => {
        const data = await fetchLocalData();
        return data.hotels || [];
    },
    getHotelById: async (id) => {
        const data = await fetchLocalData();
        return (data.hotels || []).find(h => h._id === id) || null;
    },

    // Trips
    getTrips: async () => {
        const data = await fetchLocalData();
        return data.trips || [];
    },
    getTripById: async (id) => {
        const data = await fetchLocalData();
        return (data.trips || []).find(t => t._id === id) || null;
    },
    
    // Category Trips (International / Domestic)
    getCategoryTrips: async (type) => {
        const data = await fetchLocalData();
        const trips = data.categoryTrips || [];
        if (type) {
            return trips.filter(t => t.type === type);
        }
        return trips;
    },

    // Places
    getPlaces: async () => {
        const data = await fetchLocalData();
        return data.places || [];
    },

    // Rooms
    getRoomsByHotel: async (hotelId) => {
        const data = await fetchLocalData();
        return (data.rooms || []).filter(r => r.hotelId === hotelId || (r.hotelId && r.hotelId._id === hotelId));
    },
    
    // Blogs
    getBlogs: async () => {
        const data = await fetchLocalData();
        return data.blogs || [];
    },
    getReviews: async () => {
        const data = await fetchLocalData();
        return data.reviews || [];
    },
    getBlogById: async (id) => {
        const data = await fetchLocalData();
        return (data.blogs || []).find(b => b._id === id) || null;
    },
    
    // Site Settings
    getSettings: async () => {
        const data = await fetchLocalData();
        if (!data.settings || Object.keys(data.settings).length === 0) {
            return {
                contactPhone: '+91 70482 48542',
                contactEmail: 'atmiyaholidays@gmail.com',
                sidebarTitle: 'Have Any Question?',
                sidebarDesc: 'Contact us for any personalized travel requirements.'
            };
        }
        return data.settings;
    }
};

window.api = api;
