const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const aiRoutes = require("./routes/ai.routes");
const connectToDb = require("./utils/db");
const userRoutes = require("./routes/user.routes");
const issueRoutes = require("./routes/issues.routes");
const app = express();

// var corsOptions = {
//   origin: "*",
//   optionsSuccessStatus: 200,
//   credentials: true,
// };
// app.use(cors(corsOptions));
var corsOptions = {
  origin: "http://localhost:5173", // replace with your frontend URL
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

connectToDb();
app.use("/ai", aiRoutes);
app.use("/users", userRoutes);
app.use("/issues", issueRoutes);
module.exports = app;
