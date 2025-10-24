const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
	// ...existing code...
	// replace previous userId field with `author` so frontend can use .populate('author', 'username')
	title: { type: String, required: true },
	description: { type: String },
	content: { type: String, required: true },
	image: { type: String },
	author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
