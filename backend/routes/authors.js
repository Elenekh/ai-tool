const express = require('express');
const BlogPost = require('../models/BlogPost');

const router = express.Router();

// GET /api/authors/:slug - Get author (from blog posts)
router.get('/:slug', async (req, res) => {
  try {
    // Get posts by this author to extract author info
    const posts = await BlogPost.find({ author: new RegExp(req.params.slug, 'i') });
    
    if (posts.length === 0) {
      return res.status(404).json({ success: false, message: 'Author not found' });
    }

    // Create author object from first post
    const post = posts[0];
    const author = {
      id: post.author,
      author_name: post.author,
      bio: post.author_bio,
      profile_image: post.author_avatar,
      is_verified: false
    };

    res.json(author);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/authors/:authorId/posts - Get posts by author
router.get('/:authorId/posts', async (req, res) => {
  try {
    const { sort = '-created_date' } = req.query;
    const posts = await BlogPost.find({ author: req.params.authorId })
      .sort(sort);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;