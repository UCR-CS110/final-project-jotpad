
const express = require("express");

const {
    createStory,
    getStory,
    updateStory,
    deleteStory,
    listPublicStories,
    listInReviewStories,
    getDrafts,
    postAsRequest,
    getBetaRequests,
    getBetaRequest,
    listByAuthor,
} = require("../controllers/storyController.js");

const router = express.Router();

router.post("/", createStory);
router.get("/public", listPublicStories);
router.get("/in_review", listInReviewStories);
router.get("/drafts", getDrafts);
router.get("/requests", getBetaRequests);
router.get("/author/:id", listByAuthor);
router.get("/requests/:id", getBetaRequest);
router.get("/:id", getStory);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);
router.post("/requests/:id", postAsRequest);

module.exports = router;