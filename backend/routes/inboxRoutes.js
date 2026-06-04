const express = require("express");
const router = express.Router();
const User = require("../models/User");

router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.inbox);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/messageAccept/:messageId", async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) return res.status(404).json({ message: "User not found" });

        user.inbox.map((message) => {
            if (message._id == req.params.messageId) {
                message.accepted = true;
            }
        });
        user.save();
        res.json({ message: "Successfully accepted request" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.inbox.push({
        subject: req.body.subject,
        text: req.body.text || "",
        type: req.body.type,
        link: req.body.link || '',
        accepted: false,
        story: req.body.story,
        beta_request: req.body.beta_request,
        sender: req.body.sender
    });
    await user.save();

    res.json(user.inbox);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;