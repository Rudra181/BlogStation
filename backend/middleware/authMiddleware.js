const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// verify JWT in Authorization header and attach user id + role to req.user
exports.verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // fetch user to get role and ensure the user still exists
    const user = await User.findById(decoded.id).select('role'); // minimal fields
    if (!user) return res.status(401).json({ message: 'Unauthorized: user not found' });

    // attach _id and role for controllers (some code expects req.user._id)
    req.user = { _id: user._id, role: user.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
