require("dotenv").config();
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const newsmodel = require("../modeling/news");

// Function to connect to MongoDB
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.URL_DATABSE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 60000, // 60 seconds timeout
      socketTimeoutMS: 90000, // 90 seconds timeout
    });
    console.log("MongoDB connected successfully.");
    return true;
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    return false;
  }
};



// Scraping function
const scrapeData = async () => {
  try {
    const { data } = await axios.get(
      "https://www.rfi.fr/km/%E1%9E%80%E1%9E%98%E1%9F%92%E1%9E%96%E1%9E%BB%E1%9E%87%E1%9E%B6/"
    );

    const $ = cheerio.load(data);
    const scrapedItems = [];

    $(".m-item-list-article").each((index, element) => {
      const title = $(element).find(".a-tag span").text().trim();
      const description = $(element).find(".article__title h2").text().trim();
      const articleUrl = $(element).find("a").attr("href");
      const fullUrl = `https://www.rfi.fr${articleUrl}`;

      // Extract the photo URL (handle webp or jpg fallback)
      const photo =
        $(element).find("img").attr("src") ||
        $(element).find("source").attr("srcset") ||
        ""; // handle if neither is available

      // Push the scraped data into the array
      scrapedItems.push({ title, description, articleUrl: fullUrl, photo });
    });

    if (scrapedItems.length > 0) {
      // Check if MongoDB is connected before insert
      if (mongoose.connection.readyState === 1) {
        try {
          await newsmodel.insertMany(scrapedItems, { ordered: false });
          console.log("Data scraped and saved to MongoDB.");
        } catch (insertErr) {
          console.error("Error inserting data to MongoDB:", insertErr);
        }
      } else {
        console.log("MongoDB not connected. Aborting insert operation.");
      }
    } else {
      console.log("No data found to scrape.");
    }
  } catch (err) {
    console.error("Error scraping website:", err);
  }
};

// Main function to connect to MongoDB and start scraping
const startScrapeData1 = async () => {
  const dbConnected = await connectToMongoDB(); // Connect to MongoDB first
  if (dbConnected) {
    await scrapeData(); // Start scraping only if connected to MongoDB
  }
};

module.exports = startScrapeData1;

