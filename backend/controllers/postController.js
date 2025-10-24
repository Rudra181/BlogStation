const Post = require('../models/postModel');

// create post (authenticated)
exports.createPost = async (req, res, next) => {
	try {
		const { title, description, content, image } = req.body;

		if (!title || !content) {
			return res.status(400).json({ message: 'Title and content are required' });
		}

		// support both req.user._id and req.user.id just in case
		const userId = (req.user && (req.user._id || req.user.id));
		if (!userId) {
			return res.status(401).json({ message: 'Unauthorized' });
		}

		const post = new Post({
			title,
			description,
			content,
			image,
			author: userId
		});

		await post.save();

		// populate author's username before returning
		await post.populate('author', 'username');

		res.status(201).json(post);
	} catch (err) {
		next(err);
	}
};

// get all posts
exports.getPosts = async (req, res, next) => {
	try {
		const posts = await Post.find().populate('author', 'username').sort({ createdAt: -1 });
		res.json(posts);
	} catch (err) {
		next(err);
	}
};

// get single post by id
exports.getPostById = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id).populate('author', 'username');
		if (!post) return res.status(404).json({ message: 'Post not found' });
		res.json(post);
	} catch (err) {
		next(err);
	}
};

// update post (only owner or admin)
exports.updatePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ message: 'Post not found' });

		// support both req.user._id and req.user.id
		const userId = (req.user && (req.user._id || req.user.id));
		const userRole = req.user && req.user.role;

		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		const isAuthor = post.author && post.author.toString() === userId.toString();
		const isAdmin = userRole === 'admin';

		// allow update only if author or admin
		if (!isAuthor && !isAdmin) {
			return res.status(403).json({ message: 'Not authorized to update this post' });
		}

		const { title, description, content, image } = req.body;

		if (title !== undefined) post.title = title;
		if (description !== undefined) post.description = description;
		if (content !== undefined) post.content = content;
		if (image !== undefined) post.image = image;

		const updated = await post.save();
		await updated.populate('author', 'username');

		res.json(updated);
	} catch (err) {
		next(err);
	}
};

// delete post (only owner or admin)
exports.deletePost = async (req, res, next) => {
	try {
		const post = await Post.findById(req.params.id);
		if (!post) return res.status(404).json({ message: 'Post not found' });

		const userId = (req.user && (req.user._id || req.user.id));
		const userRole = req.user && req.user.role;

		if (!userId) return res.status(401).json({ message: 'Unauthorized' });

		// allow if requester is author OR has admin role
		const isAuthor = post.author && post.author.toString() === userId.toString();
		const isAdmin = userRole === 'admin';

		if (!isAuthor && !isAdmin) {
			return res.status(403).json({ message: 'Not authorized to delete this post' });
		}

		await post.deleteOne();
		res.json({ message: 'Post deleted' });
	} catch (err) {
		next(err);
	}
};

// get posts by specific user (public)
exports.getPostsByUser = async (req, res, next) => {
	try {
		const userId = req.params.userId;
		// fetch posts authored by userId, populate author's username, newest first
		const posts = await Post.find({ author: userId }).populate('author', 'username').sort({ createdAt: -1 });
		res.json(posts);
	} catch (err) {
		next(err);
	}
};
