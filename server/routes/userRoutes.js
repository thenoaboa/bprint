const router = require('express').Router();
const User = require('../models/User'); // Adjust path as needed
const authenticate = require('../middleware/authenticate'); // Middleware to verify JWT

router.get('/:userId', authenticate, async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        // Optionally exclude sensitive data like password when sending user data back
        const { password, ...userData } = user.toObject();
        res.json(userData);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});

router.patch('/update/:userId', authenticate, async (req, res) => {
    const { userId } = req.params;
    const { profilePicUrl } = req.body; // For this example, we're only updating the profile picture URL

    try {
        const user = await User.findByIdAndUpdate(userId, { $set: { profilePicUrl } }, { new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Error updating user profile' });
    }
});

module.exports = router;
