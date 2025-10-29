const mongoose = require('mongoose');

const toolSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  pricing: String,
  rating: Number,
  difficulty: String,
  logo_url: String,
  website_url: String,
  brand_color: String,
  key_features: [String],
  overview: String,
  usage_guide: String,
  use_cases: [mongoose.Schema.Types.Mixed],
  review: String,
  editor_score: Number,
  pros: [String],
  cons: [String],
  users: String,
  is_featured: Boolean,
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Tool', toolSchema);
