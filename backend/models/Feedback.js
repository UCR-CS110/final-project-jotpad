const mongoose = require('mongoose');
const feedbackSchema = new mongoose.Schema({
    story: { type: mongoose.Schema.Types.ObjectId, ref: "Story" },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: String,
    rating: {
        type: Number,
        min: 1,
        max: 5
    },
    helpfulScore: { type: Number, default: 0 }
    ,
    authorRatings: [
        {
            author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
            stars: { type: Number, min: 1, max: 5 },
            createdAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("Feedback", feedbackSchema);