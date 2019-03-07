import { actionTypes } from "../type";

const initState = [];

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.CATEGORY.FETCH_LIST:
    case actionTypes.ITEM.DELETE:
      return [...action.payload];
    default:
      return state;
  }
}
