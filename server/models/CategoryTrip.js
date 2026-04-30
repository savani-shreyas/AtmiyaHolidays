const mongoose = require('mongoose');

const categoryTripSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, enum: ['international', 'domestic'], required: true },
    image: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('CategoryTrip', categoryTripSchema);
