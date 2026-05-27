const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  text: { type: String },
  type: { type: String, required: true },
  link: { type: String, required: true }

}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);