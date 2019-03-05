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

// export const GetItemCategory = () => async dispatch => {
//   console.log("kuy");
// };

export const GetItemCategory = () => async dispatch => {
  // const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";
  const res = await axios.get("/api/itemcategory").catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.FETCH_ITEMCATEGORY_SCUCESS, payload: data });
  }
};

export const DeleteItemCategory = id => async dispatch => {
  const res = await axios.delete(`/api/itemcategory/${id}`).catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.DELETE_ITEMCATEGORY_SCUCESS, payload: data });
    return { status: true };
  }
};
