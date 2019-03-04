import { actionTypes } from "../type";

const initState = [];

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.SAVE_ITEMCATE:
      return [...state, ...[action.payload.result]];
    default:
      return state;
  }
}
