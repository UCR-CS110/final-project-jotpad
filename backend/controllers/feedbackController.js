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
            reviewer,
            content,
            rating
        });

        // send an inbox message to the story author
        const author = await User.findById(story.author);
        if (author) {
            author.inbox.push({
                subject: `New feedback on "${story.title}"`,
                text: `New review for ${req.user.username || 'a reader'}:\n\n"${content}"`,
                date: new Date().toISOString(),
                type: "feedback",
                link: `/story/${story._id}`,
                feedback: feedback._id,
                accepted: false,
                story: story._id,
                sender: reviewer
            });
            await author.save();
        }

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

async function rateFeedback(req, res) {
    try {
        const { id } = req.params;
        const { stars, messageId } = req.body;
        const userId = req.user._id;

        const feedback = await Feedback.findById(id).populate('story');
        if (!feedback) return res.status(404).json({ message: "Feedback not found" });

        // only the story author can rate this feedback
        const story = feedback.story;
        if (!story || String(story.author) !== String(userId)) {
            return res.status(403).json({ message: "Only the story author can rate this feedback" });
        }

        // update or add author rating on the feedback
        const existing = feedback.authorRatings.find(r => String(r.author) === String(userId));
        if (existing) {
            existing.stars = stars;
            existing.createdAt = Date.now();
        } else {
            feedback.authorRatings.push({ author: userId, stars });
        }
        await feedback.save();

        // add/update the rating on the reviewer user's record
        const reviewerUser = await User.findById(feedback.reviewer);
        if (reviewerUser) {
            const existingUserRating = reviewerUser.feedbackRatings.find(r => String(r.feedback) === String(feedback._id) && String(r.reviewer) === String(userId));
            if (existingUserRating) {
                existingUserRating.stars = stars;
                existingUserRating.createdAt = Date.now();
            } else {
                reviewerUser.feedbackRatings.push({ feedback: feedback._id, stars, reviewer: userId });
            }
            await reviewerUser.save();
        }

        // mark the inbox message as accepted (if messageId provided) on the author's inbox
        if (messageId) {
            const authorUser = await User.findById(userId);
            if (authorUser) {
                const msg = authorUser.inbox.id(messageId);
                if (msg) {
                    msg.accepted = true;
                    await authorUser.save();
                }
            }
        }

        res.json({ message: 'Feedback rated', feedbackId: feedback._id, stars });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createFeedback,
    getFeedbackForStory,
    markHelpful,
    rateFeedback
};