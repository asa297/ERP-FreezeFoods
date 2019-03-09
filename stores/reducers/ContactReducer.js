import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {},
  HasMore: true
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.CONTACT.FETCH_LIST:
      return Object.assign({}, state, {
        List: [...state.List, ...action.payload.data],
        HasMore: action.payload.HasMore
      });
    case actionTypes.CONTACT.FETCH:
    case actionTypes.CONTACT.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });
    case actionTypes.CONTACT.RESET:
      return { ...initState };

    default:
      return state;
  }
}
