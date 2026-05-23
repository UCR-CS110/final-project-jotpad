const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  password: { type: String }, // only if not using Google auth
  googleId: { type: String },

  bio: String,

  credits: { type: Number, default: 0 },

  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },

  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);