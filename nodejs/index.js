require("dotenv").config();
// const schedule = require("node-schedule");
const express = require("express");
const cors = require("cors");
const connection = require("./src/database/connection");
const user_route = require("./src/route/user.route");
const news_route = require("./src/route/news.route");
const background_route = require("./src/route/background.route");
const ScrapingDataFromOtherWebsite = require("./src/route/scrapData.route");
const Categories = require("./src/route/categories.route");

// const startScrapeDataFromRFI = require("./src/ScrapedData/scrapeFromRFI");
// const startScrapeDataFromKhmerNoteTechnology = require("./src/ScrapedData/khmernoteTechnology");
// const startScrapeDataFromKhmerNoteInternational = require("./src/ScrapedData/khmernoteInternational");
// const startScrapeDataFromKhmerNoteInternational2 = require("./src/ScrapedData/khmernoteInternational2");
// const startScrapeDataFromKhmerNoteInternational3 = require("./src/ScrapedData/khmernoteInternational3");
// const startScrapeDataFromKhmerNoteInternational4 = require("./src/ScrapedData/khmernoteInternational4");

// const startScrapeDataFromKhmerNoteSport = require("./src/ScrapedData/khmernoteSport1");
// const startScrapeDataFromKhmerNoteSport2 = require("./src/ScrapedData/khmernoteSport2");
// const startScrapeDataFromKhmerNoteSport3 = require("./src/ScrapedData/khmernoteSport3");

// const startScrapeDataFromKhmerNoteNational = require("./src/ScrapedData/khmernotenational1");
// const startScrapeDataFromKhmerNoteNational2 = require("./src/ScrapedData/khmernotenational2");
// const startScrapeDataFromKhmerNoteNational3 = require("./src/ScrapedData/khmernotenational3");
// const startScrapeDataFromSabayTechnology1 = require("./src/ScrapedData/sabbyTechnology");
// const startScrapeDataFromSabaySport = require("./src/ScrapedData/SabbySport");

// const startScrapeDataFromHealthyCambodia = require("./src/ScrapedData/healthy-cambodia");
// const startScrapeDataFromHealthyCambodia2 = require("./src/ScrapedData/healthy-cambodia2");
// const startScrapeDataFromHealthyCambodia3 = require("./src/ScrapedData/healthy-cambodia3");

const app = express();

// Setup CORS policy
app.use(
  cors({
    origin: [
      "https://manage-news-client134.vercel.app",
      "https://news-olive-nine.vercel.app",
    ],
    // origin: "*",
    methods: "GET,POST,DELETE,PUT",
  })
);  

// Basic health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Index file" });
});

// Middleware and routes
app.use(express.json());
// app.use("/assets", express.static("assets"));
// app.use("/bgimg", express.static("bgimg"));

connection.mymongodb();
user_route(app);
news_route(app);
background_route(app);
Categories(app);
ScrapingDataFromOtherWebsite(app);

// Schedule the cron job to scrape data every minute
// const job = schedule.scheduleJob("* 5,17 * * *", () => {
//   Promise.all([
//     startScrapeDataFromRFI(),
//     startScrapeDataFromKhmerNoteTechnology(),
//     startScrapeDataFromKhmerNoteInternational(),
//     startScrapeDataFromKhmerNoteInternational2(),
//     startScrapeDataFromKhmerNoteInternational3(),
//     startScrapeDataFromKhmerNoteInternational4(),
//     startScrapeDataFromKhmerNoteNational(),
//     startScrapeDataFromKhmerNoteNational2(),
//     startScrapeDataFromKhmerNoteNational3(),
//     startScrapeDataFromSabayTechnology1(),
//     startScrapeDataFromSabaySport(),
//     startScrapeDataFromKhmerNoteSport(),
//     startScrapeDataFromKhmerNoteSport2(),
//     startScrapeDataFromKhmerNoteSport3(),
//     startScrapeDataFromHealthyCambodia(),
//     startScrapeDataFromHealthyCambodia2(),
//     startScrapeDataFromHealthyCambodia3(),
//   ])
//     .then(() => {
//       console.log("All CRON jobs executed successfully.");
//     })
//     .catch((error) => {
//       console.error("Error executing one or more cron jobs:", error);
//     });
// });

// Start the server
const PORT = process.env.PORT_LISTEN;
app.listen(PORT, () => {
  console.log(`Listening`);
});
