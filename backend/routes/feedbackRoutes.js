const express = require("express");
const {
    createFeedback,
    getFeedbackForStory,
    markHelpful, 
    rateFeedback,
} = require("../controllers/feedbackController.js");

const router = express.Router();

router.post("/", createFeedback);
router.get("/story/:storyId", getFeedbackForStory);
router.post("/helpful/:id", markHelpful);
router.post("/rate/:id", rateFeedback);

module.exports = router;