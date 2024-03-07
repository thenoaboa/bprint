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
  let errors = {};

  try {
    let emailExists = await checkIfExists({ email });
    if (emailExists) {
      errors.email = 'Email already exists';
    }

    // Check phone
    let phoneExists = await checkIfExists({ phone });
    if (phoneExists) {
      errors.phone = 'Phone number already exists';
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json(errors);
    }

    // Hash the password using bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare and insert the new user document
    const apiResponse = await fetch(`${process.env.MONGODB_DATA_API_URL}/action/insertOne`, {
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

    const insertData = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(insertData.error || 'Failed to register user');

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: error.message });
  }
});

async function checkIfExists(filter, type=false) {
  const apiResponse = await fetch(`${process.env.MONGODB_DATA_API_URL}/action/findOne`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'api-key': process.env.MONGODB_DATA_API_KEY 
    },
    body: JSON.stringify({
      dataSource: process.env.MONGODB_DATA_SOURCE,
      database: process.env.MONGODB_DATABASE,
      collection: process.env.MONGODB_COLLECTION,
      filter: filter
    }),
  });
  const data = await apiResponse.json();
  if (type === false) { // For use cases like registration
    return !!data.document; // Return true if document exists, false otherwise
  } else { // For use cases like login
    return data.document ? data.document : null; // Return the document if it exists, null otherwise
  }
}

router.post('/login', async (req, res) => {
  console.log("Attempting to Login a user", req.body);
  try {
    // Use checkIfExists to find the user by email
    const user = await checkIfExists({ email: req.body.email }, true);
    if (!user) {
      // Use res.json to send a JSON response
      return res.status(400).json({ message: 'User not found' });
    }

    // Check if the password is correct
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      // Use res.json to send a JSON response
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate a token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send the token in a JSON response
    res.status(200).json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    // Use res.json to send a JSON response even for server errors
    res.status(500).json({ message: 'Error logging in user' });
  }
});


  
module.exports = router;