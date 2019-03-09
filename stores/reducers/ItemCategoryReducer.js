import { actionTypes } from "../type";

const initState = {
  List: [],
  Item: {},
  HasMore: true
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.CATEGORY.FETCH_LIST:
      return Object.assign({}, state, {
        List: [...state.List, ...action.payload.data],
        HasMore: action.payload.HasMore
      });
    // case actionTypes.CATEGORY.DELETE:
    //   return Object.assign({}, state, {
    //     List: action.payload
    //   });
    case actionTypes.CATEGORY.FETCH:
    case actionTypes.CATEGORY.UPDATE:
      return Object.assign({}, state, {
        Item: action.payload
      });
    case actionTypes.CATEGORY.RESET:
      return { ...initState };

    default:
      return state;
  }
}
