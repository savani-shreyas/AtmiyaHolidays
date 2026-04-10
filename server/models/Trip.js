const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
    title: { type: String, required: true },
    destination: { type: String, required: true },
    description: { type: String, default: "" },
    duration: { type: String, required: true },
    price: { type: Number, required: true },
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    features: { type: [String], default: [] },
    includedServices: { type: [String], default: [] },
    images: { type: [String], default: [] }
}, { timestamps: true });

module.exports = mongoose.model('Trip', tripSchema);
