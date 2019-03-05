import { actionTypes } from "../type";

const initState = [];

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.FETCH_CONTACT_SUCCESS:
    case actionTypes.DELETE_CONTACT_SUCCESS:
      return [...action.payload];
    default:
      return state;
  }
}
