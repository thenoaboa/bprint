require('dotenv').config(); // Load environment variables from .env file
const cloudinary = require('cloudinary').v2;
const express = require('express');
const cors = require('cors'); // Import cors
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/userRoutes');
const imageRoutes = require('./routes/imageRoutes');
const authenticate = require('./middleware/authenticate');

const app = express(); // Define the app with express()

// Simplified CORS configuration for development
// This allows requests from any origin
app.use(cors());

app.use(express.json()); // Middleware for parsing JSON bodies
app.use('/api/auth', authRoutes); // Use authentication routes
app.use('/api/user', userRoutes);
app.use('/api/image', imageRoutes);

// Initialize MongoDB connection using Mongoose
mongoose.connect(process.env.DB_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true, 
    dbName: process.env.MONGODB_DATABASE
}).then(() => {
    console.log('MongoDB connected successfully to blueprint_db');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Example of a protected route
app.get('/api/protected', authenticate, (req, res) => {
    res.send('Access granted to protected content');
});

app.get('/', (req, res) => {
    res.send('Welcome to the API');
});

// Start the server
const PORT = process.env.PORT || 5000; // Use 5000 if process.env.PORT is not defined
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));