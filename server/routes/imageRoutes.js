const express = require('express');
const router = express.Router();
const cloudinary = require('cloudinary').v2;
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const User = require('../models/User');

router.post('/upload', upload.single('image'), async (req, res) => {
  const userId = req.body.userId;
  const folderName = req.body.folderName || req.query.folderName;

  try {
    // Find the user by ID
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user has an existing profile picture ID, delete the old image
    if (user.profilePicId) {
      await cloudinary.uploader.destroy(user.profilePicId);
    }

    // Use a promise to handle the upload_stream
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({ folder: folderName }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }).end(req.file.buffer);
    });

    // Update the user with new image URL and public ID
    const updatedUser = await User.findByIdAndUpdate(userId, {
      profilePicUrl: result.secure_url,
      profilePicId: result.public_id
    }, { new: true });

    // Return the new image URL in the response
    res.json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error('Error uploading to Cloudinary or updating user:', error);
    res.status(500).send('Server error uploading image');
  }
});

module.exports = router;