const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema({
    contactPhone: { type: String, default: '+91 70482 48542' },
    contactEmail: { type: String, default: 'atmiyaholidays@gmail.com' },
    sidebarTitle: { type: String, default: 'Have Any Question?' },
    sidebarDesc: { type: String, default: 'Contact us for any personalized travel requirements.' },
    blogHeroBanner: { type: String, default: '/asset/images/Banner/BannerAbout.png' }
}, { timestamps: true });

module.exports = mongoose.model('SiteSettings', siteSettingsSchema);
