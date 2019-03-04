import { actionTypes } from "../type";
import axios from "axios";
axios.defaults.withCredentials = true;

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

export const test = () => async dispatch => {
  // const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";
  const au = await axios.get("/api/au").catch(e => null);
};
