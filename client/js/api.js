const API_BASE_URL = 'http://localhost:5000/api';

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
    }
};

window.api = api;
