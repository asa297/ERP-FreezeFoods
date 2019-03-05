import { combineReducers } from "redux";

import ItemCategoryReducer from "./ItemCategoryReducer";
import ItemUnitReducer from "./ItemUnitReducer";

export default combineReducers({
  ItemCategoryReducer,
  ItemUnitReducer
});
