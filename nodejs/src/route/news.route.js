const handle = require("../controller/news.controller");
const multer_cloudinary = require("../middleware/multer_cloudinary");
const protect_route_admin = require("../security/protect_route_admin");

const news_route = (app) => {
  app.post(
    "/upload-news",
    protect_route_admin,
    multer_cloudinary.fields([{ name: "photo" }]), // Updated to use multer_cloudinary
    handle.create
  );

  app.put(
    "/edit-news/:id",
    protect_route_admin,
    multer_cloudinary.fields([{ name: "photo" }]), // Updated to use multer_cloudinary
    handle.updateNews
  );
  app.put("/isvisible/:id", protect_route_admin, handle.updateIsVisible);
  app.delete("/remove-news/:id", protect_route_admin, handle.deleteNews);
  app.get("/get-all", handle.getAll);
  app.get("/user-get-all", handle.usergetAll);
  app.get("/getone/:id", handle.getOne);
  app.get("/fillter-category/:categoryname", handle.fillterCategory);
};

module.exports = news_route;
