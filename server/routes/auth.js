const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch'); // Ensure 'node-fetch' is installed
require('dotenv').config(); // Ensure environment variables are loaded
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  console.log("Attempting to register a user via MongoDB Data API", req.body);
  try {
    // Prepare the request to MongoDB Data API
    const response = await fetch(`${process.env.MONGODB_DATA_API_URL}/action/insertOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGODB_DATA_API_KEY,
      },
      body: JSON.stringify({
        dataSource: process.env.MONGODB_DATA_SOURCE,
        database: process.env.MONGODB_DATABASE,
        collection: 'users',
        document: {
          username: req.body.username,
          email: req.body.email,
          // Consider hashing the password before sending
          password: await bcrypt.hash(req.body.password, 10),
        }
      })
    });

    const data = await response.json();
    if (response.ok) {
      console.log('User registered successfully via MongoDB Data API', data);
      res.status(201).json({ message: 'User created' });
    } else {
      throw new Error(data.error || 'An error occurred during registration with MongoDB Data API.');
    }
  } catch (error) {
    console.error("Error registering new user via MongoDB Data API:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  console.log("Attempting to Login a user", req.body);
    try {
      // Find the user by email
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send('User not found');
      }
  
      // Check if the password is correct
      const isMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isMatch) {
        return res.status(400).send('Invalid credentials');
      }
  
      // Generate a token
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  
      res.status(200).json({ token });
    } catch (error) {
      console.error("Error logging in user:", error);
      res.status(500).send('Error logging in user');
    }
  });

  
module.exports = router;