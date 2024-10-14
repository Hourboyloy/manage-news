const axios = require("axios");
const mongoose = require("mongoose");
const cheerio = require("cheerio");
const newsmodel = require("../modeling/news");
const { connectToMongoDB } = require("../database/connection");

// Scraping function for KhmerNote
const scrapeKhmerNoteData = async () => {
  try {
    const { data } = await axios.get(
      "https://khmernote.com.kh/news/category/sports/page/2"
    );

    const $ = cheerio.load(data);
    const scrapedItems = [];

    // Step 1: Fetch existing titles from MongoDB
    const existingNewstitle = await newsmodel.find({}, { title: 1 });
    const existingTitlesSet = new Set(
      existingNewstitle.map((item) => item.title)
    );

    // Step 2: Scrape the necessary elements from the page
    $(".cate-main__lists--iteam").each((index, element) => {
      const title = $(element).find(".hover-tlt__txt").text().trim();
      const articleUrl = $(element).find("a").first().attr("href");
      const fullUrl = articleUrl.startsWith("https://")
        ? articleUrl
        : `https://khmernote.com.kh${articleUrl}`;
      const photo = $(element).find("img").attr("src") || "";
      const category =
        $(element).find(".ld-tag a").text().trim() || "បច្ចេកវិទ្យា"; // Default to technology

      // Step 3: Check for duplicates before pushing to the array
      if (!existingTitlesSet.has(title)) {
        scrapedItems.push({
          title,
          category,
          description: "",
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
const startScrapeDataFromKhmerNoteSport2 = async () => {
  const dbConnected = await connectToMongoDB();
  if (dbConnected) {
    await scrapeKhmerNoteData();
  }
};

module.exports = startScrapeDataFromKhmerNoteSport2;
