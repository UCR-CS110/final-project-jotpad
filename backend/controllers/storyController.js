const Story = require("../models/Story.js");
const User = require("../models/User.js");

function getUserIdFromReq(req) {
    return req.user?.id || req.user?._id || req.userId;
}

/*async function createStory(req, res) {
    console.log("USER FROM REQ:", req.user);
    console.log("AUTHOR:", getUserIdFromReq(req));
    try {
        const author = getUserIdFromReq(req);
        if (!author) return res.status(401).json({ message: "Unauthorized" });

        const user = await User.findById(author);
        if (!user) return res.status(404).json({ message: "User not found" });

        if ((user.credits ?? 0) < 1) {
            return res.status(403).json({ message: "Insufficient credits to post story" });
        }

        user.credits -= 1;
        await user.save();

        const story = await Story.create({
            author,
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags || [],
            status: req.body.status || "draft",
            wordCount: req.body.wordCount,
            isPrivate: req.body.isPrivate ?? false,
        });

        res.status(201).json(story);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
*/

async function createStory(req, res) {
    try {
        console.log("Anonymous story submission");

        const story = await Story.create({
            author: null, // no user system
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags || [],
            status: req.body.status || "public",
            wordCount: req.body.wordCount,
            isPrivate: false,
        });

        res.status(201).json(story);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getStory(req, res) {
    try {
        const story = await Story.findById(req.params.id).populate("author", "username");
        if (!story) return res.status(404).json({ message: "Story not found" });

        if (story.isPrivate) {
            const me = getUserIdFromReq(req);
            if (!me || String(me) !== String(story.author._id)) {
                return res.status(403).json({ message: "Private story" });
            }
        }

        res.json(story);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateStory(req, res) {
    try {
        const me = getUserIdFromReq(req);
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ message: "Story not found" });
        if (String(story.author) !== String(me)) return res.status(403).json({ message: "Forbidden" });

        Object.assign(story, req.body);
        await story.save();

        res.json(story);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteStory(req, res) {
    try {
        const me = getUserIdFromReq(req);
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ message: "Story not found" });
        if (String(story.author) !== String(me)) return res.status(403).json({ message: "Forbidden" });

        await story.deleteOne();
        res.json({ message: "Story deleted" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function listPublicStories(req, res) {
    try {
        const { tag, page = 1, limit = 20 } = req.query;
        const query = { status: "public", isPrivate: false };
        if (tag) query.tags = tag;

        const stories = await Story.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("author", "username");

        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getDrafts(req, res) {
    try {
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function listByAuthor(req, res) {
    try {
        const stories = await Story.find({ author: req.params.id }).sort({ createdAt: -1 });
        res.json(stories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    createStory,
    getStory,
    updateStory,
    deleteStory,
    listPublicStories,
    getDrafts,
    listByAuthor,
};