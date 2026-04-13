const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');

const connectDB = require('./config/db');

const Admin = require('./models/Admin');
const Hotel = require('./models/Hotel');
const Room = require('./models/Room');
const Trip = require('./models/Trip');
const Review = require('./models/Review');

dotenv.config();

const seedData = async () => {
    await connectDB();

    try {
        await Admin.deleteMany();
        await Hotel.deleteMany();
        await Room.deleteMany();
        await Trip.deleteMany();
        await Review.deleteMany();

        // Create Admin
        const admin = new Admin({
            username: 'admin',
            password: 'password123'
        });
        await admin.save();
        console.log('Admin user created (admin / password123)');

        // Create 2 Mock Hotels
        const h1 = new Hotel({
            name: "Taj Mahal Palace",
            description: "Luxury heritage hotel in Mumbai",
            images: ["/uploads/default-hotel1.jpg"],
            amenities: [{ name: "WiFi", image: "wifi-icon-url" }],
            facilities: [{ icon: "pool", title: "Swimming Pool", description: "Outdoor pool" }],
            mapUrl: "https://maps.google.com/?q=taj+mahal+palace"
        });

        const h2 = new Hotel({
            name: "The Leela Palace",
            description: "Modern luxury hotel in Bangalore",
            images: ["/uploads/default-hotel2.jpg"],
            amenities: [{ name: "WiFi", image: "wifi-icon-url" }],
            facilities: [{ icon: "spa", title: "Spa", description: "Full-service spa" }],
            mapUrl: "https://maps.google.com/?q=the+leela+palace"
        });

        await h1.save();
        await h2.save();
        console.log('Hotels seeded');

        // Create 2 Mock Reviews
        const r1 = new Review({
            name: "Ali Tufan",
            position: "Product Manager, Apple Inc.",
            reviewText: "The tours in this website are great. I had been really enjoyed with my family! The team is very professional and taking care of the customers.",
            image: "/asset/images/Icon/customer1.png"
        });

        const r2 = new Review({
            name: "Sarah Jenkins",
            position: "Travel Blogger",
            reviewText: "Incredible experience with Atmiya Holidays. The Kashmir trip was perfectly organized and exceed all my expectations!",
            image: ""
        });

        await r1.save();
        await r2.save();
        console.log('Reviews seeded');

        console.log('Data seeded successfully');
        process.exit();
    } catch (error) {
        console.error(`Error: ${error}`);
        process.exit(1);
    }
};

seedData();
