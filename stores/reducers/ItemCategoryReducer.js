import { actionTypes } from "../type";

const initState = [];

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.FETCH_ITEMCATEGORY_SUCCESS:
    case actionTypes.DELETE_ITEMCATEGORY_SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
}
