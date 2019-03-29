import { actionTypes } from "../type";

const initState = {
  List: [],
  Object: {}
};

export default function(state = initState, action) {
  switch (action.type) {
    case actionTypes.REPORT.EXPIRE_ITEM:
    case actionTypes.REPORT.DAILY_FLOW_ITEM:
      return Object.assign({}, state, {
        List: [...action.payload]
      });
    default:
      return state;
  }
}
