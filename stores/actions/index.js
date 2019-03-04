import { actionTypes } from "../type";
import axios from "axios";

export const InsertItemCategory = value => async dispatch => {
  const { status, data } = await axios.post("/api/itemcate", value);
  if (status === 200) {
    dispatch({ type: actionTypes.SAVE_ITEMCATE, payload: data });
    return { status: true };
  }
};

export const GetItemCategory = () => async dispatch => {
  console.log("kuy");
};
