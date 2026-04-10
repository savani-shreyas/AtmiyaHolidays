const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
    hotelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hotel', required: true },
    name: { type: String, required: true }, // e.g., Deluxe / Luxury / Suite
    images: { type: [String], default: [] },
    totalRooms: { type: Number, required: true },
    amenities: { type: [String], default: [] },
    description: { type: String, required: true },
    termsConditions: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Room', roomSchema);
