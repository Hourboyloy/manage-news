const mongoose = require("mongoose");
require("dotenv").config();
const url = process.env.URL_DATABSE;
const mymongodb = async () => {
    try {
      await mongoose.connect(url, {
        // useNewUrlParser: true
      });
      console.log("Successfully connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
};






const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.URL_DATABSE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 250000, // 60 seconds timeout
      socketTimeoutMS: 250000, // 90 seconds timeout
    });
    console.log("MongoDB connected successfully.");
    return true;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    return false;
  }
};

module.exports = { mymongodb, connectToMongoDB };
