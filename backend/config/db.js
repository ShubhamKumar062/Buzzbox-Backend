require("dotenv").config();
const mongoose = require("mongoose");

const connectedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB is Connected");
  } catch (err) {
    console.error("MongoDB Connection Failed:", err.message);
    throw err;
  }
};

module.exports = connectedDB;
