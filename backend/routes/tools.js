const express = require('express');
const Tool = require('../models/Tool');

const router = express.Router();

// GET /api/tools - Get all tools with filters
router.get('/', async (req, res) => {
  try {
    const { featured, category, pricing, limit = 20, sort = '-created_date' } = req.query;
    
    let query = {};
    if (featured === 'true') query.is_featured = true;
    if (category) query.category = category;
    if (pricing) query.pricing = pricing;

    const tools = await Tool.find(query)
      .sort(sort)
      .limit(parseInt(limit));

    res.json(tools);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/tools/:id - Get single tool
router.get('/:id', async (req, res) => {
  try {
    const tool = await Tool.findById(req.params.id);
    if (!tool) {
      return res.status(404).json({ success: false, message: 'Tool not found' });
    }
    res.json(tool);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;