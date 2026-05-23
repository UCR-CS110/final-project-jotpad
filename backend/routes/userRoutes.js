const express = require("express");
const router = express.Router();
const User = require("../models/User");

// hardcoded "logged-in" user for dev
const DEV_USER_ID = "000000000000000000000001";


router.get("/me", async (req, res) => {
  try {
    const user = await User.findById(DEV_USER_ID);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


router.get("/", async (req, res) => {
  const users = await User.find();
  res.json(users);
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
      DEV_USER_ID,
      { $set: req.body },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;