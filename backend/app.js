const express = require("express");
const cors = require("cors");
const aiRoutes = require("./routes/ai.routes");
const connectToDb = require("./utils/db");
const userRoutes = require("./routes/user.routes");
const app = express();

var corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

connectToDb();
app.use("/ai", aiRoutes);
app.use("/users", userRoutes);

module.exports = app;
