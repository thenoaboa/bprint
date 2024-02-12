require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const mongoose = require('mongoose');

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// Connect to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB:', err));

// Define a simple route for testing
app.get('/', (req, res) => {
  res.send('Hello, world!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
