const express = require('express');
const router = express.Router();
const Place = require('../models/Place');
const Country = require('../models/Country');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all countries
router.get('/countries', async (req, res) => {
    try {
        const countries = await Country.find({});
        res.json(countries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create country (Admin)
router.post('/countries', protect, async (req, res) => {
    try {
        const country = new Country({ name: req.body.name });
        const createdCountry = await country.save();
        res.status(201).json(createdCountry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all places (can filter by countryId or category)
router.get('/', async (req, res) => {
    try {
        let filter = {};
        if (req.query.countryId) filter.countryId = req.query.countryId;
        if (req.query.category) filter.category = req.query.category;
        
        const places = await Place.find(filter).populate('countryId', 'name');
        res.json(places);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a place (Admin only)
router.post('/', protect, upload.array('images', 5), async (req, res) => {
    try {
        const { countryId, name, description, category } = req.body;
        const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];

        const place = new Place({ countryId, name, description, category, images });
        const createdPlace = await place.save();
        res.status(201).json(createdPlace);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;
