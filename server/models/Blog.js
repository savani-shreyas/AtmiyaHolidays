const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    title: { type: String, required: true },
    category: { type: String, required: true },
    content: { type: String, required: true },
    image: { type: String, required: true },
    author: { type: String, default: 'Admin' },
    date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
