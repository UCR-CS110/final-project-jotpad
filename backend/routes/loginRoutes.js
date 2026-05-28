const express = require("express");
const { register, login, me } = require("../controllers/authController.js");
const { auth } = require("../models/Login.js");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
//router.get("/me", auth, me);

module.exports = router;