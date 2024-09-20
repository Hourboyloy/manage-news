require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const connection = require("./src/database/connection");
const user_route = require("./src/route/user.route");
const news_route = require("./src/route/news.route");
const background_route = require("./src/route/background.route");
// ====================================================================>

app.use(
  cors({
    origin: "https://client-delta-indol.vercel.app",
    methods: "GET,POST,DELETE,PUT",
  })
);

// app.use(cors());

app.use(express.json());
app.use("/assets", express.static("assets"));
app.use("/bgimg", express.static("bgimg"));
connection.mymongodb();
user_route(app);
news_route(app);
background_route(app);

// ====================================================================>

app.listen(process.env.PORT_LESTION, () => {
  console.log("Lestioning");
});
