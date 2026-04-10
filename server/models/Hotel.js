const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    images: { type: [String], default: [] },
    amenities: [{
        name: String,
        image: String
    }],
    facilities: [{
        icon: String,
        title: String,
        description: String
    }],
    mapUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Hotel', hotelSchema);
