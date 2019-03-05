import { combineReducers } from "redux";

import ItemCategoryReducer from "./ItemCategoryReducer";
import ItemUnitReducer from "./ItemUnitReducer";
import ContactReducer from "./ContactReducer";

export default combineReducers({
  ItemCategoryReducer,
  ItemUnitReducer,
  ContactReducer
});
