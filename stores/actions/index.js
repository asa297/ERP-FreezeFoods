import { actionTypes } from "../type";
import axios from "axios";

axios.defaults.withCredentials = true;
//#region Item Action
export const InsertItem = value => async dispatch => {
  const res = await axios.post("/api/item", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetAllItem = () => async dispatch => {
  const res = await axios.get("/api/item/list").catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.ITEM.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const GetItem = page => async dispatch => {
  const res = await axios.get("/api/item/list/" + page).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.ITEM.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteItem = id => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/item/${id}`).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const GetItemById = id => async dispatch => {
  const res = await axios.get("/api/item/form/" + id).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.ITEM.FETCH, payload: data.result });
  return { status: res.status === 200 };
};

export const UpdateItem = (id, value) => async dispatch => {
  const res = await axios.put("/api/item/" + id, value).catch(e => null);
  if (!res) return { status: false };
  dispatch({ type: actionTypes.ITEM.UPDATE, payload: value });
  return { status: res.status === 200 };
};

//#endregion Item Action

//#region Item Category Action
export const InsertItemCategory = value => async dispatch => {
  const res = await axios.post("/api/itemcategory", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetItemCategoryAll = () => async dispatch => {
  const res = await axios.get("/api/itemcategory/list").catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.CATEGORY.FETCH_LIST_ALL, payload: data });
  return { status: res.status === 200 };
};

export const GetItemCategory = page => async dispatch => {
  const res = await axios
    .get("/api/itemcategory/list/" + page)
    .catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.CATEGORY.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteItemCategory = id => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/itemcategory/${id}`).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const GetItemCategoryById = id => async dispatch => {
  const res = await axios.get("/api/itemcategory/form/" + id).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.CATEGORY.FETCH, payload: data.result });
  return { status: res.status === 200 };
};

export const UpdateItemCategory = (id, value) => async dispatch => {
  const res = await axios
    .put("/api/itemcategory/" + id, value)
    .catch(e => null);
  if (!res) return { status: false };
  dispatch({ type: actionTypes.CATEGORY.UPDATE, payload: value });
  return { status: res.status === 200 };
};

//#endregion Item Category Action

//#region Contact Action
export const InsertContact = value => async dispatch => {
  const res = await axios.post("/api/contact", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetContact = page => async dispatch => {
  const res = await axios.get("/api/contact/list/" + page).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.CONTACT.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteContact = id => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/contact/${id}`).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const GetContactById = id => async dispatch => {
  const res = await axios.get("/api/contact/form/" + id).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.CONTACT.FETCH, payload: data.result });
  return { status: res.status === 200 };
};

export const UpdateContact = (id, value) => async dispatch => {
  const res = await axios.put("/api/contact/" + id, value).catch(e => null);
  if (!res) return { status: false };
  dispatch({ type: actionTypes.CONTACT.UPDATE, payload: value });
  return { status: res.status === 200 };
};

//#endregion Contact Action

//#region Item Unit Action
export const InsertItemUnit = value => async dispatch => {
  const res = await axios.post("/api/unit", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetAllItemUnit = page => async dispatch => {
  const res = await axios.get("/api/unit/list").catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.UNIT.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const GetItemUnit = page => async dispatch => {
  const res = await axios.get("/api/unit/list/" + page).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.UNIT.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteItemUnit = id => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/unit/${id}`).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const GetItemUnitById = id => async dispatch => {
  const res = await axios.get("/api/unit/form/" + id).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.UNIT.FETCH, payload: data.result });
  return { status: res.status === 200 };
};

export const UpdateItemUnit = (id, value) => async dispatch => {
  const res = await axios.put("/api/unit/" + id, value).catch(e => null);
  if (!res) return { status: false };
  dispatch({ type: actionTypes.UNIT.UPDATE, payload: value });
  return { status: res.status === 200 };
};

//#endregion Item Unit Action

//#region Request Action
export const InsertRequest = value => async dispatch => {
  const res = await axios.post("/api/request", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetRequest = page => async dispatch => {
  const res = await axios.get("/api/request/list/" + page).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.REQUEST.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteRequest = id => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/request/${id}`).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const GetRequestById = id => async dispatch => {
  const res = await axios.get("/api/request/form/" + id).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.REQUEST.FETCH, payload: data });
  return { status: res.status === 200 };
};

export const UpdateRequest = (id, value) => async dispatch => {
  const res = await axios.put("/api/request/" + id, value).catch(e => null);
  if (!res) return { status: false };
  dispatch({ type: actionTypes.REQUEST.UPDATE, payload: value });
  return { status: res.status === 200 };
};

//#endregion Item Unit Action
