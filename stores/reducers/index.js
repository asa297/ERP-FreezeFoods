import { combineReducers } from "redux";

import ItemCategoryReducer from "./ItemCategoryReducer";
import ItemUnitReducer from "./ItemUnitReducer";
import ContactReducer from "./ContactReducer";
import ItemReducer from "./ItemReducer";
import RequestReducer from "./RequestReducer";
import POReducer from "./POReducer";

export default combineReducers({
  ItemCategoryReducer,
  ItemUnitReducer,
  ContactReducer,
  ItemReducer,
  RequestReducer,
  POReducer
});
