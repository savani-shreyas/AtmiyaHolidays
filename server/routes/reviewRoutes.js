const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Public
router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find({}).sort({ createdAt: -1 });
        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Get single review
// @route   GET /api/reviews/:id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review) {
            res.json(review);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private/Admin
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const { name, position, reviewText } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const review = new Review({
            name,
            position,
            reviewText,
            image
        });

        const createdReview = await review.save();
        res.status(201).json(createdReview);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private/Admin
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    try {
        const { name, position, reviewText } = req.body;
        const review = await Review.findById(req.params.id);

        if (review) {
            review.name = name || review.name;
            review.position = position || review.position;
            review.reviewText = reviewText || review.reviewText;

            if (req.file) {
                review.image = `/uploads/${req.file.filename}`;
            }

            const updatedReview = await review.save();
            res.json(updatedReview);
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private/Admin
router.delete('/:id', protect, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        if (review) {
            await review.deleteOne();
            res.json({ message: 'Review removed' });
        } else {
            res.status(404).json({ message: 'Review not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
