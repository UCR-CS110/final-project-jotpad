const mongoose = require('mongoose');
const storySchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  title: String,
  content: String,

  status: {
    type: String,
    enum: ["draft", "in_review", "public"],
    default: "draft"
  },

  tags: [String],

  wordCount: Number,

  avgRating: Number,
  numRatings: {type: Number, default: 0 }

}, { timestamps: true });

module.exports = mongoose.model("Story", storySchema);