const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
require('dotenv').config();

const router = express.Router();

router.get('/check-username', async (req, res) => {
  const { username } = req.query;
  try {
    const apiResponse = await fetch(`${process.env.MONGODB_DATA_API_URL}/action/findOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGODB_DATA_API_KEY,
      },
      body: JSON.stringify({
        dataSource: process.env.MONGODB_DATA_SOURCE,
        database: process.env.MONGODB_DATABASE,
        collection: process.env.MONGODB_COLLECTION,
        filter: { username: username }
      }),
    });

    const data = await apiResponse.json();
    if (data.document) {
      res.json({ available: false });
    } else {
      res.json({ available: true });
    }
  } catch (error) {
    console.error('Error checking username availability:', error);
    res.status(500).json({ error: 'Error checking username availability' });
  }
});

router.post('/register', async (req, res) => {
  const { fullName, username, email, phone, password } = req.body;

  try {
    // Check for existing email
    let apiResponse = await fetch(`${process.env.MONGODB_DATA_API_URL}/action/findOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGODB_DATA_API_KEY,
      },
      body: JSON.stringify({
        dataSource: process.env.MONGODB_DATA_SOURCE,
        database: process.env.MONGODB_DATABASE,
        collection: process.env.MONGODB_COLLECTION,
        filter: { email: email }
      }),
    });

    let data = await apiResponse.json();
    if (data.document) {
      return res.status(400).json({ error: 'email_exists', message: 'Email already exists' });
    }

    // Check for existing phone
    apiResponse = await fetch(`${process.env.MONGODB_DATA_API_URL}/action/findOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGODB_DATA_API_KEY,
      },
      body: JSON.stringify({
        dataSource: process.env.MONGODB_DATA_SOURCE,
        database: process.env.MONGODB_DATABASE,
        collection: process.env.MONGODB_COLLECTION,
        filter: { phone: phone }
      }),
    });
    
    data = await apiResponse.json();
    // Assuming a response with a document indicates existence
    if (data.document) {
      return res.status(400).json({ error: 'phone_exists', message: 'Phone number already exists' });
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare and insert the new user document
    apiResponse = await fetch(`${process.env.MONGODB_DATA_API_URL}/action/insertOne`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': process.env.MONGODB_DATA_API_KEY,
      },
      body: JSON.stringify({
        dataSource: process.env.MONGODB_DATA_SOURCE,
        database: process.env.MONGODB_DATABASE,
        collection: process.env.MONGODB_COLLECTION,
        document: {
          fullName,
          username,
          email,
          phone,
          password: hashedPassword,
        },
      }),
    });

    data = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(data.error || 'Failed to register user');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
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