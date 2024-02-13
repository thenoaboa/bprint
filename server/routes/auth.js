const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const router = express.Router();

router.post('/register', async (req, res) => {
  console.log("Attempting to register a user", req.body);
  try {
    // Check if the user already exists
    const userExists = await User.findOne({ email: req.body.email });
    if (userExists) {
      return res.status(400).send('Email already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user
    const user = new User({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
    });

    // Save the user in the database
    await user.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(500).send('Error registering new user');
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
      res.status(500).send('Error logging in user');
    }
  });

module.exports = router;