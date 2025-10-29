const mongoose = require('mongoose');

const blogPostSchema = new mongoose.Schema({
  title: String,
  content: String,
  excerpt: String,
  author: String,
  category: String,
  tags: [String],
  featured_image: String,
  views: {
    type: Number,
    default: 0
  },
  read_time: Number,
  author_avatar: String,
  author_bio: String,
  created_date: {
    type: Date,
    default: Date.now
  },
  updated_date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('BlogPost', blogPostSchema);