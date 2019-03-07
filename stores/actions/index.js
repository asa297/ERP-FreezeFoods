import { actionTypes } from "../type";
import axios from "axios";

axios.defaults.withCredentials = true;

// export const InsertItemCategory = value => async dispatch => {
//   const { status, data } = await axios.post("/api/itemcate", value);
//   if (status === 200) {
//     return { status: true };
//   }
//   return { status: false };
// };

export const GetItemCategory = () => async dispatch => {
  const res = await axios.get("/api/itemcategory").catch(e => null);
  if (res) {
    const { data } = res;
    dispatch({ type: actionTypes.CATEGORY.FETCH_LIST, payload: data });
  }
};

// export const DeleteItemCategory = id => async dispatch => {
//   const res = await axios.delete(`/api/itemcategory/${id}`).catch(e => null);
//   if (res) {
//     const { data } = res;
//     dispatch({ type: actionTypes.DELETE_ITEMCATEGORY_SUCCESS, payload: data });
//     return { status: true };
//   }
//   return { status: false };
// };

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
