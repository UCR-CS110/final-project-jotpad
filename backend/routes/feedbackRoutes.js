const express = require("express");
const {
    createFeedback,
    getFeedbackForStory,
    markHelpful,
} = require("../controllers/feedbackController.js");

const router = express.Router();

router.post("/", createFeedback);
router.get("/story/:storyId", getFeedbackForStory);
router.post("/helpful/:id", markHelpful);

module.exports = router;