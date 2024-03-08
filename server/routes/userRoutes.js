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

module.exports = router;
