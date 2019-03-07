import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {}
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.CATEGORY.FETCH_LIST:
    case actionTypes.CATEGORY.DELETE:
      return Object.assign({}, state, {
        List: action.payload
      });
    case actionTypes.CATEGORY.FETCH:
    case actionTypes.CATEGORY.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });
    default:
      return state;
  }
}
