require("dotenv").config();
const cron = require("node-cron");
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./src/database/connection");
const user_route = require("./src/route/user.route");
const news_route = require("./src/route/news.route");
const background_route = require("./src/route/background.route");
const startScrapeData1 = require("./src/ScrapedData/scrape1");
// ====================================================================>

app.use(
  cors({
    origin: [
      "https://manage-news-client134.vercel.app",
      "https://news-olive-nine.vercel.app",
    ],
    methods: "GET,POST,DELETE,PUT",
  })
);

// app.use(cors());

app.get("/", (req, res) => {
  res.json({ message: "index file" });
});

app.use(express.json());
app.use("/assets", express.static("assets"));
app.use("/bgimg", express.static("bgimg"));
connection.mymongodb();
user_route(app);
news_route(app);
background_route(app);

// cron schedule is runing at 5am and 5 pm
cron.schedule("15 22,17 * * *", () => {
  startScrapeData1();
  console.log("CRON job scheduled. Application is running.");
});

// ====================================================================>

app.listen(process.env.PORT_LESTION, () => {
  console.log("Lestioning");
});
