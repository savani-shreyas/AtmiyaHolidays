const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/hotels', require('./routes/hotelRoutes'));
app.use('/api/rooms', require('./routes/roomRoutes'));
app.use('/api/places', require('./routes/placeRoutes'));
app.use('/api/trips', require('./routes/tripRoutes'));
app.use('/api/blogs', require('./routes/blogRoutes'));
app.use('/api/settings', require('./routes/settingsRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/category-trips', require('./routes/categoryTripRoutes'));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../client')));

// Fallback to serving the index.html for unknown frontend routes
app.use((req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
