import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {},
  Fetching_Status: false,
  HasMore: true
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.UNIT.FETCH_LIST:
      return Object.assign({}, state, {
        List: [...state.List, ...action.payload.data],
        HasMore: action.payload.HasMore
      });

    case actionTypes.UNIT.FETCH_LIST_ALL:
      return Object.assign({}, state, {
        List: [...action.payload.data],
        HasMore: action.payload.HasMore
      });
    case actionTypes.UNIT.FETCH:
    case actionTypes.UNIT.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });
    case actionTypes.UNIT.FECTHING_STATUS:
      return Object.assign({}, state, {
        Fetching_Status: action.payload
      });
    case actionTypes.UNIT.RESET:
      return { ...initState };

    default:
      return state;
  }
}
