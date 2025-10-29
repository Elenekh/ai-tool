const express = require('express');
const News = require('../models/News');

const router = express.Router();

// GET /api/news - Get all news
router.get('/', async (req, res) => {
  try {
    const { category, limit = 20, sort = '-created_date' } = req.query;
    
    let query = {};
    if (category) query.category = category;

    const news = await News.find(query)
      .sort(sort)
      .limit(parseInt(limit));

    res.json(news);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/news/:id - Get single news
router.get('/:id', async (req, res) => {
  try {
    const newsItem = await News.findById(req.params.id);
    if (!newsItem) {
      return res.status(404).json({ success: false, message: 'News not found' });
    }
    res.json(newsItem);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;