import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {}
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.FETCH_ITEM_SUCCESS:
    case actionTypes.DELETE_ITEM_SUCCESS:
      return Object.assign({}, state, {
        List: action.payload
      });

    case actionTypes.LOAD_ITEM:
      return Object.assign({}, state, {
        Item: action.payload
      });
    default:
      return state;
  }
}
