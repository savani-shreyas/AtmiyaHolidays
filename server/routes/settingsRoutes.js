const express = require('express');
const router = express.Router();
const SiteSettings = require('../models/SiteSettings');
const { protect } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Multer for banner upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// @route   GET /api/settings
// @desc    Get site settings
router.get('/', async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = await SiteSettings.create({}); // Create default if not found
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/settings
// @desc    Update site settings
router.put('/', protect, upload.single('blogHeroBanner'), async (req, res) => {
    try {
        let settings = await SiteSettings.findOne();
        if (!settings) {
            settings = new SiteSettings();
        }

        const { contactPhone, contactEmail, sidebarTitle, sidebarDesc } = req.body;
        
        if (contactPhone) settings.contactPhone = contactPhone;
        if (contactEmail) settings.contactEmail = contactEmail;
        if (sidebarTitle) settings.sidebarTitle = sidebarTitle;
        if (sidebarDesc) settings.sidebarDesc = sidebarDesc;
        if (req.file) settings.blogHeroBanner = `/uploads/${req.file.filename}`;

        await settings.save();
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
