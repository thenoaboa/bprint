const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const fetch = require('node-fetch');
require('dotenv').config();

const router = express.Router();

router.post('/register', async (req, res) => {
  const { fullName, username, email, phone, password } = req.body;

  // Hash the password using bcrypt
  const hashedPassword = await bcrypt.hash(password, 10);

  // Prepare the document to insert
  const userDocument = {
    fullName,
    username,
    email,
    phone,
    password: hashedPassword, // Store the hashed password
  };

  try {
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
        document: userDocument,
      }),
    });

    const data = await apiResponse.json();
    if (!apiResponse.ok) throw new Error(data.error || 'Failed to register user');

    console.log('User registered successfully', data);
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