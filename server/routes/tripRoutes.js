const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all trips
router.get('/', async (req, res) => {
    try {
        const trips = await Trip.find({});
        res.json(trips);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a trip (Admin only)
router.post('/', protect, upload.array('images', 5), async (req, res) => {
    try {
        const { title, destination, description, duration, price, rating, reviewsCount, features, includedServices } = req.body;
        
        const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
        
        // Safer parsing for Features and Services
        const parseField = (field) => {
            if (!field) return [];
            if (Array.isArray(field)) return field;
            try {
                return typeof field === 'string' ? JSON.parse(field) : field;
            } catch (e) {
                return field.split(',').map(s => s.trim());
            }
        };

        const parsedFeatures = parseField(features);
        const parsedIncludedServices = parseField(includedServices);

        const trip = new Trip({
            title,
            destination,
            description,
            duration,
            price,
            rating,
            reviewsCount,
            features: parsedFeatures,
            includedServices: parsedIncludedServices,
            images
        });

        const createdTrip = await trip.save();
        res.status(201).json(createdTrip);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get a single trip
router.get('/:id', async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
        if (trip) {
            res.json(trip);
        } else {
            res.status(404).json({ message: 'Trip not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update a trip (Admin only)
router.put('/:id', protect, upload.array('images', 5), async (req, res) => {
    try {
        const { title, destination, description, duration, price, rating, reviewsCount, features, includedServices } = req.body;
        const trip = await Trip.findById(req.params.id);

        if (trip) {
            trip.title = title || trip.title;
            trip.destination = destination || trip.destination;
            trip.description = description || trip.description;
            trip.duration = duration || trip.duration;
            trip.price = price || trip.price;
            trip.rating = rating || trip.rating;
            trip.reviewsCount = reviewsCount || trip.reviewsCount;
            
            const parseField = (field) => {
                if (!field) return [];
                if (Array.isArray(field)) return field;
                try {
                    return typeof field === 'string' ? JSON.parse(field) : field;
                } catch (e) {
                    return field.split(',').map(s => s.trim());
                }
            };

            if (features) trip.features = parseField(features);
            if (includedServices) trip.includedServices = parseField(includedServices);

            if (req.files && req.files.length > 0) {
                const newImages = req.files.map(file => `/uploads/${file.filename}`);
                trip.images = [...trip.images, ...newImages];
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

// Delete a trip
router.delete('/:id', protect, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);
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
