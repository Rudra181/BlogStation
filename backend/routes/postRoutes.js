const express = require('express');
const router = express.Router();
const {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  getPostsByUser
} = require('../controllers/postController');
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/posts
router.get('/', getPosts);

// GET /api/posts/user/:userId  <-- new public route to fetch posts by a specific user
router.get('/user/:userId', getPostsByUser);

// GET /api/posts/:id
router.get('/:id', getPostById);

// POST /api/posts (protected)
router.post('/', verifyToken, createPost);

// PUT /api/posts/:id (protected) - update a post if author or admin
router.put('/:id', verifyToken, updatePost);

// DELETE /api/posts/:id (protected)
router.delete('/:id', verifyToken, deletePost);

module.exports = router;
