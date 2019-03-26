import { actionTypes } from "../type";

export default function(state = [], action) {
  switch (action.type) {
    case actionTypes.GET_NOTIFICATION:
      return [...action.payload];
    default:
      return state;
  }
}
