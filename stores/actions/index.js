import { actionTypes } from "../type";
import axios from "axios";

axios.defaults.withCredentials = true;

export const InsertItemCategory = value => async dispatch => {
  const { status, data } = await axios.post("/api/itemcate", value);
  if (status === 200) {
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
  const { status, data } = await axios.post("/api/unit", value);
  if (status === 200) {
    return { status: true };
  }
};

export const GetItemUnit = () => async dispatch => {
  const res = await axios.get("/api/unit").catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.FETCH_ITEM_UNIT_SUCCESS, payload: data });
  }
};

export const DeleteItemUnit = id => async dispatch => {
  const res = await axios.delete(`/api/unit/${id}`).catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.DELETE_ITEM_UNIT_SUCCESS, payload: data });
    return { status: true };
  }
};

export const InsertContact = value => async dispatch => {
  const { status, data } = await axios.post("/api/contact", value);
  if (status === 200) {
    return { status: true };
  }
};

export const GetContact = () => async dispatch => {
  const res = await axios.get("/api/contact").catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.FETCH_CONTACT_SUCCESS, payload: data });
  }
};

export const DeleteContact = id => async dispatch => {
  const res = await axios.delete(`/api/contact/${id}`).catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.DELETE_CONTACT_SUCCESS, payload: data });
    return { status: true };
  }
};

export const InsertItem = value => async dispatch => {
  const { status, data } = await axios.post("/api/item", value);
  if (status === 200) {
    return { status: true };
  }
};

export const GetItem = () => async dispatch => {
  const res = await axios.get("/api/item").catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.FETCH_ITEM_SUCCESS, payload: data });
  }
};

export const DeleteItem = id => async dispatch => {
  const res = await axios.delete(`/api/item/${id}`).catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.DELETE_ITEM_SUCCESS, payload: data });
    return { status: true };
  }
};

export const GetItemById = id => async dispatch => {
  const res = await axios.get("/api/item/" + id).catch(e => null);

  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.LOAD_ITEM, payload: data.result });
  }
};
