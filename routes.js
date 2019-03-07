const routes = require("next-routes");

module.exports = routes()
  .add("ItemForm", "/item/form")
  .add("ItemList", "/item/list");
