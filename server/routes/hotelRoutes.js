const express = require('express');
const router = express.Router();
const Hotel = require('../models/Hotel');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all hotels
router.get('/', async (req, res) => {
    try {
        // Sort by 'updatedAt' descending so newest/recently edited show up first
        const hotels = await Hotel.find({}).sort({ updatedAt: -1 });
        res.json(hotels);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single hotel
router.get('/:id', async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (hotel) res.json(hotel);
        else res.status(404).json({ message: 'Hotel not found' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a hotel (Admin only)
router.post('/', protect, upload.array('images', 7), async (req, res) => {
    try {
        const { name, description, amenities, facilities, mapUrl } = req.body;
        
        // Construct image URLs from uploaded files
        const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        // Parse JSON strings back to arrays if sent via FormData
        const parsedAmenities = amenities ? JSON.parse(amenities) : [];
        const parsedFacilities = facilities ? JSON.parse(facilities) : [];

        const hotel = new Hotel({
            name,
            description,
            images,
            amenities: parsedAmenities,
            facilities: parsedFacilities,
            mapUrl
        });

        const createdHotel = await hotel.save();
        res.status(201).json(createdHotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a hotel (Admin only)
router.delete('/:id', protect, async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (hotel) {
            await hotel.deleteOne();
            res.json({ message: 'Hotel removed' });
        } else {
            res.status(404).json({ message: 'Hotel not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a hotel (Admin only)
router.put('/:id', protect, upload.array('images', 7), async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        if (!hotel) return res.status(404).json({ message: 'Hotel not found' });

        const { name, description, amenities, facilities, mapUrl } = req.body;
        
        if (name) hotel.name = name;
        if (description) hotel.description = description;
        if (mapUrl) hotel.mapUrl = mapUrl;

        // Parse JSON strings back to arrays if sent via FormData
        if (amenities) hotel.amenities = JSON.parse(amenities);
        if (facilities) hotel.facilities = JSON.parse(facilities);

        // If new images are uploaded, append them
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => `/uploads/${file.filename}`);
            hotel.images = [...hotel.images, ...newImages];
            // You might want a way to replace or delete old images, but for now we append.
        }

        const updatedHotel = await hotel.save();
        res.json(updatedHotel);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
