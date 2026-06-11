const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const cors = require("cors");

const session = require('express-session');
const MongoStore = require('connect-mongo').default;
const cookieParser = require('cookie-parser');
const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

dotenv.config();

connectDB();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

app.use(express.json());
app.use(
  session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      //mongoUrl: "mongodb+srv://zcao051_db_user:DvE3evnhqP4KIbbk@cluster0.8qwaa93.mongodb.net/?appName=Cluster0",
      mongoUrl: process.env.MONGODB_URI,
    }),
    cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true, secure: false }
  })
)
app.use(cookieParser());

app.use(passport.initialize());

app.use(passport.session());

app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/stories", require("./routes/storyRoutes.js"));
app.use("/api/login", require("./routes/loginRoutes.js"));
app.use("/api/inbox", require("./routes/inboxRoutes.js"));
app.use("/api/feedback", require("./routes/feedbackRoutes.js"));

app.post('/api/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('connect.sid').status(200).send({ message: "Logged out" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));