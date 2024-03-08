const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true }, 
  profilePicUrl: { type: String, required: false }, // Optional, contains the URL to the user's profile picture
  // Add any other fields as needed
});

module.exports = mongoose.model('User', userSchema);
