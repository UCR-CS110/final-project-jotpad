const Story = require("../models/Story.js");
const User = require("../models/User.js");
const BetaRequest = require("../models/BetaRequest.js");

function getUserIdFromReq(req) {
    return req.user?.id || req.user?._id || req.userId;
}

async function createStory(req, res) {
    try {
        console.log("Anonymous story submission");

        const story = await Story.create({
            author: req.body.author,
            title: req.body.title,
            content: req.body.content,
            tags: req.body.tags || [],
            status: req.body.status || "public",
            wordCount: req.body.wordCount,
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

        if (story.status === "draft") {
            const me = getUserIdFromReq(req);
            if (!me || String(me) !== String(story.author._id)) {
                return res.status(403).json({ message: "Draft story" });
            }
        }

        res.json(story);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateStory(req, res) {
    try {
        //const me = getUserIdFromReq(req);
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ message: "Story not found" });
        //if (String(story.author) !== String(me)) return res.status(403).json({ message: "Forbidden" });

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
        const query = { status: "public", avgRating: { $gt: 0 } };
        const unratedQuery = { status: "public", avgRating: { $exists: false } };
        if (tag) {
            query.tags = tag;
            unratedQuery.tags = tag;
        }

        const ratedStories = await Story.find(query)
            .sort({ avgRating: -1, createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("author", "username");

        const unratedStories = await Story.find(unratedQuery)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("author", "username");

        res.json({rated: ratedStories, unrated: unratedStories});
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getDrafts(req, res) {
    try {
        //const user = await fetch("http://localhost:5000/api/users/me");
        //const userData = await user.json();
        const userData = await User.findById(req.user._id);
        const query = { status: {$in: ["draft", "in_review"]}, author: userData };
        const drafts = await Story.find(query);
        res.json(drafts);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function postAsRequest(req, res) {
    try {
        const duplicate = await BetaRequest.findById(req.params.id);
        if (duplicate) return res.status(400).json({ message: "Duplicate request" });
        const request = await BetaRequest.create({
            title: req.body.title || "(work in progress)",
            genre: req.body.genre || "(none)",
            id: req.body.id,
            tags: req.body.tags || [],
            words: req.body.words,
            summary: req.body.summary,
            author: req.body.author,
            story: req.body.story,
            vetting: req.body.vetting
        });

        await Story.findByIdAndUpdate(req.body.id, {status: "in_review"});

        res.status(201).json(request);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function listInReviewStories(req, res) {
    try {
        const { tag, page = 1, limit = 20 } = req.query;
        const query = { status: "in_review" };
        if (tag) query.tags = tag;

        const stories = await Story.find(query)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .populate("author", "username");

        res.json(stories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
}

async function getBetaRequests(req, res) {
    try {
        const betaRequests = await BetaRequest.find();
        res.json(betaRequests);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function postRating(req, res) {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ message: "Story not found" });

        if (story.numRatings == 0) {
            story.numRatings = 1;
            story.avgRating = req.body.rating;
        } else {
            story.avgRating = ((story.avgRating*story.numRatings) + req.body.rating)/(story.numRatings+1);
            story.numRatings++;
        }
        await story.save();
        const user = await User.findById(req.user._id);
        user.ratings.push({story: story._id, stars: req.body.rating});
        await user.save();
        res.json({ message: "Successfully posted rating" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function putRating(req, res) {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ message: "Story not found" });
        const user = await User.findById(req.user._id);
        let prevRating;
        user.ratings.forEach((rating) => {
            if (rating.story.toString() == story._id) {
                prevRating = rating.stars;
                rating.stars = req.body.rating;
            }
        });
        await user.save();
        story.avgRating = ((story.avgRating*story.numRatings) - prevRating + req.body.rating)/(story.numRatings);
        await story.save();
        res.json({ message: "Successfully changed rating" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserRating(req, res) {
    try {
        const story = await Story.findById(req.params.id);
        if (!story) return res.status(404).json({ message: "Story not found" });
        const user = await User.findById(req.user._id);
        let curRating;
        user.ratings.forEach((rating) => {
            if (rating.story.toString() == story._id) {
                curRating = rating.stars;
            }
        });
        if (!curRating) {
            res.json({'stars': 'none'});
        } else {
            res.json({'stars': curRating});
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getBetaRequest(req, res) {
    try {
        const betaRequest = await BetaRequest.findById(req.params.id);
        res.json(betaRequest);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function listByAuthor(req, res) {
    try {
        const stories = await Story.find({ author: req.params.id, status: "public" }).sort({ createdAt: -1 });
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
    listInReviewStories,
    getDrafts,
    postAsRequest,
    postRating,
    putRating,
    getUserRating,
    getBetaRequests,
    getBetaRequest,
    listByAuthor,
};