import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {}
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.ITEM.FETCH_LIST:
    case actionTypes.ITEM.DELETE:
      return Object.assign({}, state, {
        List: action.payload
      });
    case actionTypes.ITEM.FETCH:
    case actionTypes.ITEM.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });
    default:
      return state;
  }
}
