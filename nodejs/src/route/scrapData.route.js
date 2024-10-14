const protect_route_admin = require("../security/protect_route_admin");

const startScrapeDataFromRFI = require("../ScrapedData/scrapeFromRFI");
const startScrapeDataFromKhmerNoteTechnology = require("../ScrapedData/khmernoteTechnology");
const startScrapeDataFromKhmerNoteInternational = require("../ScrapedData/khmernoteInternational");
const startScrapeDataFromKhmerNoteInternational2 = require("../ScrapedData/khmernoteInternational2");
const startScrapeDataFromKhmerNoteInternational3 = require("../ScrapedData/khmernoteInternational3");
const startScrapeDataFromKhmerNoteInternational4 = require("../ScrapedData/khmernoteInternational4");

const startScrapeDataFromKhmerNoteSport = require("../ScrapedData/khmernoteSport1");
const startScrapeDataFromKhmerNoteSport2 = require("../ScrapedData/khmernoteSport2");
const startScrapeDataFromKhmerNoteSport3 = require("../ScrapedData/khmernoteSport3");

const startScrapeDataFromKhmerNoteNational = require("../ScrapedData/khmernotenational1");
const startScrapeDataFromKhmerNoteNational2 = require("../ScrapedData/khmernotenational2");
const startScrapeDataFromKhmerNoteNational3 = require("../ScrapedData/khmernotenational3");
const startScrapeDataFromSabayTechnology1 = require("../ScrapedData/sabbyTechnology");
const startScrapeDataFromSabaySport = require("../ScrapedData/SabbySport");

const startScrapeDataFromHealthyCambodia = require("../ScrapedData/healthy-cambodia");
const startScrapeDataFromHealthyCambodia2 = require("../ScrapedData/healthy-cambodia2");
const startScrapeDataFromHealthyCambodia3 = require("../ScrapedData/healthy-cambodia3");

const ScrapingDataFromOtherWebsite = (app) => {
  app.get("/scrape-data", (req, res) => {
    Promise.all([
      startScrapeDataFromRFI(),
      startScrapeDataFromKhmerNoteTechnology(),
      startScrapeDataFromKhmerNoteInternational(),
      startScrapeDataFromKhmerNoteInternational2(),
      startScrapeDataFromKhmerNoteInternational3(),
      startScrapeDataFromKhmerNoteInternational4(),
      startScrapeDataFromKhmerNoteNational(),
      startScrapeDataFromKhmerNoteNational2(),
      startScrapeDataFromKhmerNoteNational3(),
      startScrapeDataFromSabayTechnology1(),
      startScrapeDataFromSabaySport(),
      startScrapeDataFromKhmerNoteSport(),
      startScrapeDataFromKhmerNoteSport2(),
      startScrapeDataFromKhmerNoteSport3(),
      startScrapeDataFromHealthyCambodia(),
      startScrapeDataFromHealthyCambodia2(),
      startScrapeDataFromHealthyCambodia3(),
    ])
      .then(() => {
        res.json({ message: "Scrape data process started successfully." });
      })
      .catch((error) => {
        console.error("Error executing one or more cron jobs:", error);
        res.status(500).json({ error: "Error executing cron job." });
      });
  });
};

module.exports = ScrapingDataFromOtherWebsite;
