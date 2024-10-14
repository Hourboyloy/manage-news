const protect_route_admin = require("../security/protect_route_admin");
const handle = require("../controller/categories.controller");
const Categories = (app) => {
  app.get("/count-categories", protect_route_admin, handle.Count);
  app.get("/get-categories", handle.getCategory);
  app.delete("/remove-category", protect_route_admin, handle.deleteCategory);
  app.put("/edit-category", protect_route_admin, handle.updateCategory);
  app.put("/create-category", protect_route_admin, handle.createCategory);
};

module.exports = Categories;
