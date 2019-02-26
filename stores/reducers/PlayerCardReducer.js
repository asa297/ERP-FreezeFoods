import { actionTypes } from "../type";

const initState = null;

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.TEST_ACTION:
      return { ...action.payload };
    default:
      return state;
  }
}
