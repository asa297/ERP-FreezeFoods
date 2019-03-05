import { combineReducers } from "redux";

import ItemCategoryReducer from "./ItemCategoryReducer";
import ItemUnitReducer from "./ItemUnitReducer";
import ContactReducer from "./ContactReducer";
import ItemReducer from "./ItemReducer";

export default combineReducers({
  ItemCategoryReducer,
  ItemUnitReducer,
  ContactReducer,
  ItemReducer
});
