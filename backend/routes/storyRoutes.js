
const express = require("express");

const {
    createStory,
    getStory,
    updateStory,
    deleteStory,
    listPublicStories,
    getDrafts,
    postAsRequest,
    getBetaRequests,
    getBetaRequest,
    listByAuthor,
} = require("../controllers/storyController.js");

const router = express.Router();

router.post("/", createStory);
router.get("/public", listPublicStories);
router.get("/drafts", getDrafts);
router.get("/requests", getBetaRequests);
router.get("/author/:id", listByAuthor);
router.get("/:id", getStory);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);
router.get("/requests/:id", getBetaRequest);
router.post("/requests/:id", postAsRequest);

module.exports = router;