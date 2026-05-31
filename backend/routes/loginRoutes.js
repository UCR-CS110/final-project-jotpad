const express = require("express");
const { register, me } = require("../controllers/authController.js");
const { auth } = require("../models/Login.js");
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require("../models/User.js");

const router = express.Router();

passport.use(
  new LocalStrategy(
    async function(username, password, done) {
      const user = await User.findOne({
        email: username,
        password: password
      });

      if (!user) {
        return done(null, false);
      }
      return done(null, user);
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(
  async function(id, done) {
    const user = await User.findById(id);
    done(null, user);
  }
);

router.post("/register", register);

router.post("/login", passport.authenticate('local', {keepSessionInfo: true}), function(req, res) {
    res.json({user: req.user});
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

//router.get("/me", auth, me);

module.exports = router;