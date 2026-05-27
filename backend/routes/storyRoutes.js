
const express = require("express");

const {
    createStory,
    getStory,
    updateStory,
    deleteStory,
    listPublicStories,
    getDrafts,
    listByAuthor,
} = require("../controllers/storyController.js");

const router = express.Router();

router.post("/", createStory);
router.get("/public", listPublicStories);
router.get("/drafts", getDrafts);
router.get("/author/:id", listByAuthor);
router.get("/:id", getStory);
router.put("/:id", updateStory);
router.delete("/:id", deleteStory);

module.exports = router;