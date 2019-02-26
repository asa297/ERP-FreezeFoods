import { actionTypes } from "../type";
import axios from "axios";

export const testaction = () => dispatch => {
  const data = { au: "test" };

  dispatch({ type: actionTypes.TEST_ACTION, payload: data });
};
