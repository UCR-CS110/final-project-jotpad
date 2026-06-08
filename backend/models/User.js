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

  pfpLink: String,
  bannerLink: String,

  inbox: [ {subject: { type: String, required: true },
  text: { type: String },
  date: { type: String },
  type: { type: String, required: true },
  link: { type: String }, 
  accepted: {type: Boolean },
  story: { type: mongoose.Schema.Types.ObjectId, ref: "Story" },
  beta_request: { type: mongoose.Schema.Types.ObjectId, ref: "BetaRequest" },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" } } ],

  ratings: [ { story: { type: mongoose.Schema.Types.ObjectId, ref: "Story" }, stars: { type: Number } }]

}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);