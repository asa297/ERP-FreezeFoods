import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {}
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.CONTACT.FETCH_LIST:
    case actionTypes.CONTACT.DELETE:
      return Object.assign({}, state, {
        List: action.payload
      });
    case actionTypes.CONTACT.FETCH:
    case actionTypes.CONTACT.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });
    default:
      return state;
  }
}
