const express = require('express');
const BlogPost = require('../models/BlogPost');

const router = express.Router();

// GET /api/blog-posts - Get all posts
router.get('/', async (req, res) => {
  try {
    const { category, limit = 20, sort = '-created_date' } = req.query;
    
    let query = {};
    if (category) query.category = category;

    const posts = await BlogPost.find(query)
      .sort(sort)
      .limit(parseInt(limit));

    res.json(posts);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/blog-posts/:id - Get single post
router.get('/:id', async (req, res) => {
  try {
    const post = await BlogPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// POST /api/blog-posts/:id/views - Increment views
router.post('/:id/views', async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
