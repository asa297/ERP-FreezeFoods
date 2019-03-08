// const routes = require("next-routes");

// module.exports = routes()
//   .add("ItemForm", "/item/form")
//   .add("ItemList", "/item/list")
//   .add("ItemCategoryForm", "/category/form")
//   .add("ItemCategoryList", "/category/list")
//   .add("ContactForm", "/contact/form")
//   .add("ContactList", "/contact/list")
//   .add("ItemUnitForm", "/unit/form")
//   .add("ItemUnitList", "/unit/list");

const nextRoutes = require("next-routes");
const routes = (module.exports = nextRoutes());

routes.add("ItemForm", "/item/form");
routes.add("ItemList", "/item/list");
routes.add("ItemCategoryForm", "/category/form");
routes.add("ItemCategoryList", "/category/list");
routes.add("ContactForm", "/contact/form");
routes.add("ContactList", "/contact/list");
routes.add("ItemUnitForm", "/unit/form");
routes.add("ItemUnitList", "/unit/list");
