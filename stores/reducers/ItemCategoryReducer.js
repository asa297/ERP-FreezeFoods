import { actionTypes } from "../type";

const initState = [];

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.SAVE_ITEMCATE:
      return [...state, ...[action.payload.result]];
    case actionTypes.FETCH_ITEMCATEGORY_SCUCESS:
      return [...state, ...action.payload];
    case actionTypes.DELETE_ITEMCATEGORY_SCUCESS:
      return [...action.payload];
    default:
      return state;
  }
}
