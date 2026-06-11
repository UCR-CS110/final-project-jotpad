const Feedback = require("../models/Feedback.js");
const Story = require("../models/Story.js");
const User = require("../models/User.js");

async function createFeedback(req, res) {
    try {
        const { storyId, content, rating } = req.body;
        const reviewer = req.user._id;

        const story = await Story.findById(storyId);
        if (!story) return res.status(404).json({ message: "Story not found" });

        const feedback = await Feedback.create({
            story: storyId,
            reviewer: reviewer,
            content: content,
            rating: rating
        });

        await feedback.populate("reviewer", "username");
        res.status(201).json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getFeedbackForStory(req, res) {
    try {
        const { storyId } = req.params;

        const feedback = await Feedback.find({ story: storyId })
            .populate("reviewer", "username")
            .sort({ createdAt: -1 });

        res.json(feedback);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function markHelpful(req, res) {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findById(id);
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        feedback.helpfulScore += 1;
        await feedback.save();

        res.json({ message: "Feedback marked as helpful", helpfulScore: feedback.helpfulScore });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createFeedback,
    getFeedbackForStory,
    markHelpful
};