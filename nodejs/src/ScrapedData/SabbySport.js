const axios = require("axios");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const newsmodel = require("../modeling/news");
const { connectToMongoDB } = require("../database/connection");

// Scraping function for Sabay
const scrapeSabayData = async () => {
  try {
    const { data } = await axios.get("https://news.sabay.com.kh/topics/sport");

    const $ = cheerio.load(data);
    const scrapedItems = [];

    // Step 1: Fetch existing titles from MongoDB
    const existingNewstitle = await newsmodel.find({}, { title: 1 });
    const existingTitlesSet = new Set(
      existingNewstitle.map((item) => item.title)
    );

    // Step 2: Scrape the necessary elements from the page
    $(".row.list-item.item").each((index, element) => {
      const title = $(element).find(".title .web").text().trim();
      const articleUrl = $(element).find("a").attr("href");
      const fullUrl = articleUrl.startsWith("https://")
        ? articleUrl
        : `https://news.sabay.com.kh${articleUrl}`;
      const photo = $(element).find(".ele").attr("data-background-image") || "";
      const description = $(element).find(".detail").text().trim();

      // Step 3: Check for duplicates before pushing to the array
      if (!existingTitlesSet.has(title)) {
        scrapedItems.push({
          title,
          category: "កីឡា", // Default category is technology
          description,
          articleUrl: fullUrl,
          photo,
        });
      } else {
        console.log(`Duplicate found. Skipping: ${title}`);
      }
    });

    // Step 4: Insert new items into MongoDB if any
    if (scrapedItems.length > 0) {
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
      console.log("No new data found to scrape.");
    }
  } catch (err) {
    console.error("Error scraping website:", err);
  }
};

// Main function to connect to MongoDB and start scraping
const startScrapeDataFromSabaySport = async () => {
  const dbConnected = await connectToMongoDB();
  if (dbConnected) {
    await scrapeSabayData();
  }
};

module.exports = startScrapeDataFromSabaySport;
