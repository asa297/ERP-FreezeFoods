import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {},
  Fetching_Status: false,
  HasMore: true
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.CATEGORY.FETCH_LIST:
      return Object.assign({}, state, {
        List: [...state.List, ...action.payload.data]
      });

    case actionTypes.CATEGORY.FETCH_LIST_ALL:
      return Object.assign({}, state, {
        List: action.payload
      });
    case actionTypes.CATEGORY.FETCH:
    case actionTypes.CATEGORY.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });

    case actionTypes.CATEGORY.FECTHING_STATUS:
      return Object.assign({}, state, {
        Fetching_Status: action.payload
      });
    case actionTypes.CATEGORY.RESET:
      return { ...initState };

    default:
      return state;
  }
}
