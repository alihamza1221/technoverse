const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const connection = {
  dbStatus: 0,
};
function connectToDb() {
  console.log("Connecting to DB...");
  if (connection.dbStatus == 0) {
    mongoose
      .connect(process.env.DB_CONNECT)
      .then((res) => {
        connection.dbStatus = res.connection.readyState;
        console.log("Connected to DB");
      })

      .catch((err) => console.log(err));
  } else {
    console.log("DB already connected state");
  }
}

module.exports = connectToDb;
