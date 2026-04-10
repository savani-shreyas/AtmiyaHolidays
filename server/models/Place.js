const mongoose = require('mongoose');

const placeSchema = new mongoose.Schema({
    countryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Country', required: true },
    name: { type: String, required: true },
    images: { type: [String], default: [] },
    description: { type: String },
    category: { type: String, enum: ['International', 'National'], required: true }
}, { timestamps: true });

module.exports = mongoose.model('Place', placeSchema);
