import { actionTypes } from "../type";
import axios from "axios";
axios.defaults.withCredentials = true;

export const InsertItemCategory = value => async dispatch => {
  const { status, data } = await axios.post("/api/itemcate", value);
  if (status === 200) {
    dispatch({ type: actionTypes.SAVE_ITEMCATE_SUCCESS, payload: data });
    return { status: true };
  }
};

export const GetItemCategory = () => async dispatch => {
  const res = await axios.get("/api/itemcategory").catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.FETCH_ITEMCATEGORY_SUCCESS, payload: data });
  }
};

export const DeleteItemCategory = id => async dispatch => {
  const res = await axios.delete(`/api/itemcategory/${id}`).catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.DELETE_ITEMCATEGORY_SUCCESS, payload: data });
    return { status: true };
  }
};

export const InsertItemUnit = value => async dispatch => {
  const { status, data } = await axios.post("/api/item", value);
  if (status === 200) {
    dispatch({ type: actionTypes.SAVE_ITEMUNIT_SUCCESS, payload: data });
    return { status: true };
  }
};

export const GetItemUnit = () => async dispatch => {
  const res = await axios.get("/api/item").catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.FETCH_ITEM_UNIT_SUCCESS, payload: data });
  }
};

export const DeleteItemUnit = id => async dispatch => {
  const res = await axios.delete(`/api/item/${id}`).catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.DELETE_ITEM_UNIT_SUCCESS, payload: data });
    return { status: true };
  }
};
