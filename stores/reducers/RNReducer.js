import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {},
  HasMore: true
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.RN.FETCH_LIST:
      return Object.assign({}, state, {
        List: [...state.List, ...action.payload.data],
        HasMore: action.payload.HasMore
      });
    case actionTypes.RN.FETCH:
    case actionTypes.RN.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });
    case actionTypes.RN.RESET:
      return { ...initState };

    default:
      return state;
  }
}
