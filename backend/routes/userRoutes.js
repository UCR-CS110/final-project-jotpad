const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Feedback = require("../models/Feedback");

// hardcoded "logged-in" user for dev
const DEV_USER_ID = "000000000000000000000001";

router.get("/:id/reviews", async (req, res) => {
  try {

    const feedback = await Feedback.find({
      reviewer: req.params.id
    })
      .populate("story", "title")
      .sort({ createdAt: -1 });

    res.json(feedback);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/me", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);

    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Only for Admins" });
    }

    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (currentUser.role !== "admin") {
      return res.status(403).json({ message: "Access denied: Only for Admins" });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User banned/deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/byUsername/:username", async (req, res) => {
  try {
    const user = await User.find({ username: req.params.username });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.put("/me", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { $set: req.body },
      { returnDocument: 'after' }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/follow",async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
        return res.status(401).json({ message: "Unauthorized: No user logged in" });
    }

    const userToFollow = await User.findById(req.params.id);
    const currentUser = await User.findById(req.user._id);

    if (!userToFollow) return res.status(404).json({ message: "User not found" });
    if (!currentUser) return res.status(404).json({ message: "Current user not found" });

    const isFollowing = userToFollow.followers.some(
        followerId => followerId.toString() === currentUser._id.toString()
    );

    if (isFollowing) {
      userToFollow.followers.pull(currentUser._id);
      currentUser.following.pull(userToFollow._id);
    } else {
      userToFollow.followers.push(currentUser._id);
      currentUser.following.push(userToFollow._id);
    }

    await userToFollow.save();
    await currentUser.save();
    res.json({ message: isFollowing ? "Unfollowed" : "Followed" });
    
  } catch (err) {
    console.error("Error in the follow system:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/:id/rate", async (req, res) => {
  try {
    const { rating } = req.body;
    const userToRate = await User.findById(req.params.id);

    if (!userToRate) return res.status(404).json({ message: "User not found" });

    userToRate.ratings.push({ stars: rating });
    await userToRate.save();

    res.json({ message: "Rating saved successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;