const express = require("express");
const { register, me } = require("../controllers/authController.js");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User.js");
const bcrypt = require("bcrypt");

const router = express.Router();

passport.use(
  new LocalStrategy({ usernameField: "email" },
    async function(email, password, done) {
      try {
        const user = await User.findOne({ email });
        if (!user) return done(null, false, { message: "Invalid credentials" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return done(null, false, { message: "Invalid credentials" });

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(async function(id, done) {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

router.post("/register", register);

router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: info?.message || "Login failed" });

    req.logIn(user, (err) => {
      if (err) return next(err);
      res.json({ user });
    });
  })(req, res, next);
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

module.exports = router;