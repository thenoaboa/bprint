const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    const tokenHeader = req.header('Authorization');
    if (!tokenHeader) {
      throw new Error('Authorization header is missing');
    }
    
    const token = tokenHeader.replace('Bearer ', '');
    //console.log("Token received:", token); // Log the received token
    
    // Verify JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log("Decoded token:", decoded); // Log the decoded JWT token
    //console.log("ID of Decoded", decoded.id)
    // Find user by decoded token's ID
    const user = await User.findOne({ _id: decoded.id });
    //console.log("User found:", user); // Log the found user (be cautious of logging sensitive info)
    
    if (!user) {
      throw new Error('User not found');
    }

    req.user = user; // Attach user to request object
    next(); // Proceed to the next middleware
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = authenticate;