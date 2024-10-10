require("dotenv").config();
const schedule = require("node-schedule");
const express = require("express");
const cors = require("cors");
const connection = require("./src/database/connection");
const user_route = require("./src/route/user.route");
const news_route = require("./src/route/news.route");
const background_route = require("./src/route/background.route");
const startScrapeData1 = require("./src/ScrapedData/scrape1");

const app = express();

// Setup CORS policy
app.use(
  cors({
    origin: [
      "https://manage-news-client134.vercel.app",
      "https://news-olive-nine.vercel.app",
    ],
    methods: "GET,POST,DELETE,PUT",
  })
);

// Basic health check endpoint
app.get("/", (req, res) => {
  res.json({ message: "Index file" });
});

// API endpoint to manually trigger data scraping
app.get("/scrape-data", (req, res) => {
  startScrapeData1()
    .then(() => {
      console.log("CRON job executed successfully");
    })
    .catch((error) => {
      console.error("Error executing cron job:", error);
    });
  res.json({ message: "Scrape data process started." });
});

// Middleware and routes
app.use(express.json());
app.use("/assets", express.static("assets"));
app.use("/bgimg", express.static("bgimg"));
connection.mymongodb();
user_route(app);
news_route(app);
background_route(app);

// Schedule the cron job to scrape data at specific times
const job = schedule.scheduleJob("* * * * * *", () => {
  startScrapeData1()
    .then(() => {
      console.log("CRON job executed successfully");
    })
    .catch((error) => {
      console.error("Error executing cron job:", error);
    });
});

// Start the server
app.listen(process.env.PORT_LESTION, () => {
  console.log(`Listening on port ${process.env.PORT_LESTION}`);
});
