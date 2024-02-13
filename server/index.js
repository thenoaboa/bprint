require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const cors = require('cors'); // Import cors
const authRoutes = require('./routes/auth');
const authenticate = require('./middleware/authenticate');
const { MongoClient } = require('mongodb');
const uri = process.env.DB_URI; // Ensure this is correctly loaded from your .env file

const app = express(); // Define the app with express()
app.use(cors()); // Use cors middleware
app.use(express.json()); // Middleware for parsing JSON bodies
app.use('/api/auth', authRoutes); // Use authentication routes

const client = new MongoClient(uri);

// Initialize MongoDB connection
async function initializeDbConnection() {
    try {
        await client.connect();
        console.log("Connected successfully to MongoDB");
        // Make the database connection available globally
        app.locals.db = client.db();
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        process.exit(1); // Exit the process if unable to connect
    }
}

// Example of a protected route
app.get('/api/protected', authenticate, (req, res) => {
    res.send('Access granted to protected content');
});

// Only one app.listen() call is necessary
initializeDbConnection().then(() => {
    const PORT = process.env.PORT || 5000; // Use 5000 if process.env.PORT is not defined
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
