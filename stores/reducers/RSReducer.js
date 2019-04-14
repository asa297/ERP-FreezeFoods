import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {},
  Fetching_Status: false,
  HasMore: true
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.RS.FETCH_LIST_ALL:
      return Object.assign({}, state, {
        List: [...action.payload],
        HasMore: action.payload.HasMore
      });
    case actionTypes.RS.FETCH_LIST:
      return Object.assign({}, state, {
        List: [...state.List, ...action.payload.data],
        HasMore: action.payload.HasMore
      });
    case actionTypes.RS.FETCH:
    case actionTypes.RS.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });

    case actionTypes.RS.FECTHING_STATUS:
      return Object.assign({}, state, {
        Fetching_Status: action.payload
      });
    case actionTypes.RS.RESET:
      return { ...initState };

    default:
      return state;
  }
}
