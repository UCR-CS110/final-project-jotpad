const mongoose = require('mongoose');

const betaRequestSchema = new mongoose.Schema({
  title: { type: String },
  genre: { type: String },
  id: { type: String, required: true, unique: true },
  tags: [ String ],
  words: Number,

  Summary: String,

  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  story : { type: mongoose.Schema.Types.ObjectId, ref: "Story" },
  

}, { timestamps: true });

module.exports = mongoose.model("BetaRequest", betaRequestSchema);