const mongoose = require("mongoose");
require("dotenv").config();
const uri = process.env.URL_DATABSE || "your_mongodb_uri";
const mymongodb = async () => {
    try {
      await mongoose.connect(uri, {
        // useNewUrlParser: true
      });
      console.log("Successfully connected to MongoDB");
    } catch (error) {
      console.error("Error connecting to MongoDB:", error);
      process.exit(1);
    }
};
module.exports = { mymongodb };
