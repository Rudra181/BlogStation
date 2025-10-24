const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// helper: create JWT including id and role
const createToken = (userId, role) => {
	// include role in token so client and middleware can read it if needed
	return jwt.sign({ id: userId, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// register new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email and password' });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await User.create({ username, email, password: hashed });

    const token = createToken(user._id, user.role);

    res.status(201).json({
      token,
      user: { id: user._id, username: user.username, email: user.email, role: user.role }
    });
  } catch (err) {
    next(err);
  }
};

// updated login: preserve existing checks, then set admin role for specific email
exports.login = async (req, res, next) => {
	try {
		const { email, password } = req.body;
		if (!email || !password) return res.status(400).json({ message: 'Please provide email and password' });

		const user = await User.findOne({ email });
		if (!user) return res.status(401).json({ message: 'Invalid credentials' });

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

		// If this specific email logs in, ensure their role is admin and persist if needed
		const adminEmail = 'longaonkarrudra@gmail.com';
		if (user.email === adminEmail && user.role !== 'admin') {
			user.role = 'admin';
			try {
				await user.save(); // persist the role change
			} catch (saveErr) {
				// if save fails, continue but log error; do not block login
				console.error('Failed to persist admin role for user:', saveErr.message);
			}
		}

		// create token including role
		const token = createToken(user._id, user.role);

		res.json({
			token,
			user: { id: user._id, username: user.username, email: user.email, role: user.role }
		});
	} catch (err) {
		next(err);
	}
};
