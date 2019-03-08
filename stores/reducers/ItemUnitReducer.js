import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {}
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.UNIT.FETCH_LIST:
    case actionTypes.UNIT.DELETE:
      return Object.assign({}, state, {
        List: action.payload
      });
    case actionTypes.UNIT.FETCH:
    case actionTypes.UNIT.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });

    case actionTypes.UNIT.RESET:
      return { ...initState };

    default:
      return state;
  }
}
