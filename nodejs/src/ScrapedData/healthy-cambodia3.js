const axios = require("axios");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const newsmodel = require("../modeling/news");
const { connectToMongoDB } = require("../database/connection");

// Scraping function for Healthy Cambodia
const scrapeHealthyCambodiaData = async () => {
  try {
    const { data } = await axios.get(
      "https://healthy-cambodia.com/categories/exercise"
    );

    const $ = cheerio.load(data);
    const scrapedItems = [];

    // Step 1: Fetch existing titles from MongoDB
    const existingNewstitle = await newsmodel.find({}, { title: 1 });
    const existingTitlesSet = new Set(
      existingNewstitle.map((item) => item.title)
    );

    // Step 2: Scrape the necessary elements from the page
    $("a.mx-6.sm\\:mx-0").each((index, element) => {
      const title = $(element).find(".font-bold.text-base").text().trim();
      const articleUrl = $(element).attr("href");
      const fullUrl = `https://healthy-cambodia.com${articleUrl}`;
      const photo = $(element).find("img").first().attr("src") || "";
      const author = $(element)
        .find(".font-semibold.text-gray-700")
        .text()
        .trim();
      const datePublished = $(element)
        .find(".font-light.text-xs")
        .text()
        .trim();
      const views = $(element).find(".text-xs").last().text().trim();

      // Step 3: Check for duplicates before pushing to the array
      if (!existingTitlesSet.has(title)) {
        scrapedItems.push({
          title,
          category: "សុខភាព", // Default category is diseases
          articleUrl: fullUrl,
          photo,
          author,
          datePublished,
          views,
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
const startScrapeDataFromHealthyCambodia3 = async () => {
  const dbConnected = await connectToMongoDB();
  if (dbConnected) {
    await scrapeHealthyCambodiaData();
  }
};

module.exports = startScrapeDataFromHealthyCambodia3;
