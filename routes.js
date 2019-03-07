const routes = require("next-routes");

module.exports = routes()
  .add("ItemForm", "/item/form")
  .add("ItemList", "/item/list")
  .add("ItemCategoryForm", "/category/form")
  .add("ItemCategoryList", "/category/list")
  .add("ContactForm", "/contact/form")
  .add("ContactList", "/contact/list");
