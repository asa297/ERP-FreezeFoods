import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {},
  Fetching_Status: false,
  HasMore: true
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.REQUEST.FETCH_LIST:
      return Object.assign({}, state, {
        List: [...state.List, ...action.payload.data],
        HasMore: action.payload.HasMore
      });
    case actionTypes.REQUEST.FETCH:
    case actionTypes.REQUEST.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });

    case actionTypes.REQUEST.FECTHING_STATUS:
      return Object.assign({}, state, {
        Fetching_Status: action.payload
      });
    case actionTypes.REQUEST.RESET:
      return { ...initState };

    default:
      return state;
  }
}
