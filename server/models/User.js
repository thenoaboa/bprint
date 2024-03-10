const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String, required: true }, 
  profilePicUrl: { type: String, required: false }, // Optional, contains the URL to the user's profile picture
  profilePicId: { type: String, required: false }, // Public ID of the profile picture in Cloudinary
});

module.exports = mongoose.model('User', userSchema);
