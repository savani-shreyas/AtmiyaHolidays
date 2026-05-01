const express = require('express');
const router = express.Router();
const CategoryTrip = require('../models/CategoryTrip');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all category trips
router.get('/', async (req, res) => {
    try {
        const type = req.query.type;
        const query = type ? { type } : {};
        const trips = await CategoryTrip.find(query);
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a category trip
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const { name, type } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';
        
        const trip = new CategoryTrip({
            name,
            type,
            image
        });

        const createdTrip = await trip.save();
        res.status(201).json(createdTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update a category trip
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    try {
        const { name, type } = req.body;
        const trip = await CategoryTrip.findById(req.params.id);

        if (trip) {
            trip.name = name || trip.name;
            trip.type = type || trip.type;
            if (req.file) {
                trip.image = `/uploads/${req.file.filename}`;
            }
            const updatedTrip = await trip.save();
            res.json(updatedTrip);
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete a category trip
router.delete('/:id', protect, async (req, res) => {
    try {
        const trip = await CategoryTrip.findById(req.params.id);
        if (trip) {
            await trip.deleteOne();
            res.json({ message: 'Trip removed' });
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
