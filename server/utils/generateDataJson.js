const fs = require('fs');
const path = require('path');
const Trip = require('../models/Trip');
const Blog = require('../models/Blog');
const CategoryTrip = require('../models/CategoryTrip');
const Review = require('../models/Review');
const SiteSettings = require('../models/SiteSettings');
const Hotel = require('../models/Hotel');
const Place = require('../models/Place');
const Room = require('../models/Room');

const generateDataJson = async () => {
    try {
        console.log('[Static Generator] Generating data.json for frontend...');
        const data = {
            trips: await Trip.find({}),
            blogs: await Blog.find({}),
            categoryTrips: await CategoryTrip.find({}),
            reviews: await Review.find({}),
            settings: await SiteSettings.findOne({}) || {},
            hotels: await Hotel.find({}),
            places: await Place.find({}),
            rooms: await Room.find({})
        };

        const clientDataPath = path.join(__dirname, '../../client/data.json');
        fs.writeFileSync(clientDataPath, JSON.stringify(data, null, 2));

        // Sync uploads folder to client so images work statically
        const serverUploads = path.join(__dirname, '../uploads');
        const clientUploads = path.join(__dirname, '../../client/uploads');
        
        if (!fs.existsSync(clientUploads)) {
            fs.mkdirSync(clientUploads, { recursive: true });
        }
        
        if (fs.existsSync(serverUploads)) {
            const files = fs.readdirSync(serverUploads);
            for (const file of files) {
                const srcFile = path.join(serverUploads, file);
                const destFile = path.join(clientUploads, file);
                // only copy if it's a file
                if (fs.statSync(srcFile).isFile()) {
                    fs.copyFileSync(srcFile, destFile);
                }
            }
        }
        
        console.log('[Static Generator] Successfully updated data.json and synced uploads!');
    } catch (err) {
        console.error('[Static Generator] Error generating data:', err);
    }
};

module.exports = generateDataJson;
