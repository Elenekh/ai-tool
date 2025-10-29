const express = require('express');
const Tool = require('../models/Tool');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Apply auth middleware to all routes
router.use(authMiddleware);

// POST /api/admin/tools - Create tool
router.post('/', async (req, res) => {
  try {
    const tool = new Tool(req.body);
    await tool.save();
    res.status(201).json({ success: true, data: tool });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// PUT /api/admin/tools/:id - Update tool
router.put('/:id', async (req, res) => {
  try {
    const tool = await Tool.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updated_date: new Date() },
      { new: true }
    );
    res.json({ success: true, data: tool });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// DELETE /api/admin/tools/:id - Delete tool
router.delete('/:id', async (req, res) => {
  try {
    await Tool.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tool deleted' });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

module.exports = router;