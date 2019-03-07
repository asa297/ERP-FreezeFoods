import { actionTypes } from "../type";
import axios from "axios";

axios.defaults.withCredentials = true;

// export const InsertItemUnit = value => async dispatch => {
//   const { status, data } = await axios.post("/api/unit", value);
//   if (status === 200) {
//     return { status: true };
//   }
//   return { status: false };
// };

// export const GetItemUnit = () => async dispatch => {
//   const res = await axios.get("/api/unit").catch(e => null);
//   if (res) {
//     const { data } = res;
//     dispatch({ type: actionTypes.FETCH_ITEM_UNIT_SUCCESS, payload: data });
//   }
// };

// export const DeleteItemUnit = id => async dispatch => {
//   const res = await axios.delete(`/api/unit/${id}`).catch(e => null);
//   if (res) {
//     const { data } = res;
//     dispatch({ type: actionTypes.DELETE_ITEM_UNIT_SUCCESS, payload: data });
//     return { status: true };
//   }
//   return { status: false };
// };

// export const InsertContact = value => async dispatch => {
//   const { status, data } = await axios.post("/api/contact", value);
//   if (status === 200) {
//     return { status: true };
//   }
//   return { status: false };
// };

// export const GetContact = () => async dispatch => {
//   const res = await axios.get("/api/contact").catch(e => null);
//   if (res) {
//     const { data } = res;
//     dispatch({ type: actionTypes.FETCH_CONTACT_SUCCESS, payload: data });
//   }
// };

// export const DeleteContact = id => async dispatch => {
//   const res = await axios.delete(`/api/contact/${id}`).catch(e => null);
//   if (res) {
//     const { data } = res;
//     dispatch({ type: actionTypes.DELETE_CONTACT_SUCCESS, payload: data });
//     return { status: true };
//   }
//   return { status: false };
// };

//#region Item Action
export const InsertItem = value => async dispatch => {
  const res = await axios.post("/api/item", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetItem = () => async dispatch => {
  const res = await axios.get("/api/item").catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.ITEM.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteItem = id => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/item/${id}`).catch(e => null);
  if (!res) return { status: false };
  const { ItemReducer } = currentState();
  const newData = ItemReducer.List.filter(value => value.id !== id);
  dispatch({ type: actionTypes.ITEM.DELETE, payload: newData });
  return { status: res.status === 200 };
};

export const GetItemById = id => async dispatch => {
  const res = await axios.get("/api/item/" + id).catch(e => null);
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

export const GetItemCategory = () => async dispatch => {
  const res = await axios.get("/api/itemcategory").catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.CATEGORY.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteItemCategory = id => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/itemcategory/${id}`).catch(e => null);
  if (!res) return { status: false };
  const { ItemCategoryReducer } = currentState();
  const newData = ItemCategoryReducer.List.filter(value => value.id !== id);
  dispatch({ type: actionTypes.CATEGORY.DELETE, payload: newData });
  return { status: res.status === 200 };
};

export const GetItemCategoryById = id => async dispatch => {
  const res = await axios.get("/api/itemcategory/" + id).catch(e => null);
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

//#region Item Category Action
export const InsertContact = value => async dispatch => {
  const res = await axios.post("/api/contact", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetContact = () => async dispatch => {
  const res = await axios.get("/api/contact").catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.CONTACT.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteContact = id => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/contact/${id}`).catch(e => null);
  if (!res) return { status: false };
  const { ContactReducer } = currentState();
  const newData = ContactReducer.List.filter(value => value.id !== id);
  dispatch({ type: actionTypes.CONTACT.DELETE, payload: newData });
  return { status: res.status === 200 };
};

export const GetContactById = id => async dispatch => {
  const res = await axios.get("/api/contact/" + id).catch(e => null);
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

//#endregion Item Category Action
