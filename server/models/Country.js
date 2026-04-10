const mongoose = require('mongoose');

const countrySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true } // India, Africa, etc.
}, { timestamps: true });

module.exports = mongoose.model('Country', countrySchema);
