const express = require('express');
const router = express.Router();
const Room = require('../models/Room');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all rooms (can filter by hotelId via query param)
router.get('/', async (req, res) => {
    try {
        const filter = req.query.hotelId ? { hotelId: req.query.hotelId } : {};
        const rooms = await Room.find(filter).populate('hotelId', 'name');
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a room (Admin only)
router.post('/', protect, upload.array('images', 5), async (req, res) => {
    try {
        const { hotelId, name, totalRooms, amenities, description, termsConditions } = req.body;
        
        const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        const parsedAmenities = amenities ? JSON.parse(amenities) : [];

        const room = new Room({
            hotelId,
            name,
            images,
            totalRooms,
            amenities: parsedAmenities,
            description,
            termsConditions
        });

        const createdRoom = await room.save();
        res.status(201).json(createdRoom);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a room
router.delete('/:id', protect, async (req, res) => {
    try {
        const room = await Room.findById(req.params.id);
        if (room) {
            await room.deleteOne();
            res.json({ message: 'Room removed' });
        } else {
            res.status(404).json({ message: 'Room not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
