const express = require('express');
const router = express.Router();
const Blog = require('../models/Blog');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Get all blogs
router.get('/', async (req, res) => {
    try {
        const blogs = await Blog.find({}).sort({ date: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single blog
router.get('/:id', async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            res.json(blog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create blog (Admin only)
router.post('/', protect, upload.single('image'), async (req, res) => {
    try {
        const { title, category, content, author, date } = req.body;
        const image = req.file ? `/uploads/${req.file.filename}` : '';

        const blog = new Blog({
            title,
            category,
            content,
            image,
            author,
            date: date || undefined
        });

        const createdBlog = await blog.save();
        res.status(201).json(createdBlog);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update blog (Admin only)
router.put('/:id', protect, upload.single('image'), async (req, res) => {
    try {
        const { title, category, content, author, date } = req.body;
        const blog = await Blog.findById(req.params.id);

        if (blog) {
            blog.title = title || blog.title;
            blog.category = category || blog.category;
            blog.content = content || blog.content;
            blog.author = author || blog.author;
            blog.date = date || blog.date;

            if (req.file) {
                blog.image = `/uploads/${req.file.filename}`;
            }

            const updatedBlog = await blog.save();
            res.json(updatedBlog);
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete blog
router.delete('/:id', protect, async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (blog) {
            await blog.deleteOne();
            res.json({ message: 'Blog removed' });
        } else {
            res.status(404).json({ message: 'Blog not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
