const express = require("express");
const dotenv = require("dotenv");
const connectDB = require('./config/db');
const cors = require("cors");

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/users", require("./routes/userRoutes.js"));
app.use("/api/stories", require("./routes/storyRoutes.js"));
app.use("/api/login", require("./routes/loginRoutes.js"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));