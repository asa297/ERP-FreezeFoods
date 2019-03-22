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
  dispatch({ type: actionTypes.ITEM.FETCH_LIST_ALL, payload: data });
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
  // dispatch({ type: actionTypes.ITEM.UPDATE, payload: value });
  return { status: res.status === 200 };
};

export const ClearItem = () => async dispatch => {
  dispatch({ type: actionTypes.ITEM.RESET });
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
  // dispatch({ type: actionTypes.CATEGORY.UPDATE, payload: value });
  return { status: res.status === 200 };
};

export const CleaerItemCategory = () => async dispatch => {
  dispatch({ type: actionTypes.CATEGORY.RESET });
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

export const GetAllContact = () => async dispatch => {
  const res = await axios.get("/api/contact/list").catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.CONTACT.FETCH_LIST_ALL, payload: data });
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
  // dispatch({ type: actionTypes.CONTACT.UPDATE, payload: value });
  return { status: res.status === 200 };
};

export const ClearContact = () => async dispatch => {
  dispatch({ type: actionTypes.CONTACT.RESET });
};

//#endregion Contact Action

//#region Item Unit Action
export const InsertItemUnit = value => async dispatch => {
  const res = await axios.post("/api/unit", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetAllItemUnit = () => async dispatch => {
  const res = await axios.get("/api/unit/list").catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.UNIT.FETCH_LIST_ALL, payload: data });
  return { status: res.status === 200 };
};

export const GetItemUnit = page => async dispatch => {
  const res = await axios.get("/api/unit/list/" + page).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  // dispatch({ type: actionTypes.UNIT.FETCH_LIST, payload: data });
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

export const ClearItemUnit = (id, value) => async dispatch => {
  dispatch({ type: actionTypes.UNIT.RESET });
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

export const GetRequestById = (id, { req }) => async dispatch => {
  // const res = await axios.get("/api/request/form/" + id).catch(e => null);
  const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";

  const res = await axios
    .get(baseUrl + "/api/request/form/" + id)
    .catch(e => null);

  if (!res) return { status: false };
  const { data } = res;

  // dispatch({ type: actionTypes.REQUEST.FETCH, payload: data });
  // console.log("dispatch" , );
  return data;
};

export const UpdateRequest = (id, value) => async dispatch => {
  const res = await axios.put("/api/request/" + id, value).catch(e => null);
  if (!res) return { status: false };
  // dispatch({ type: actionTypes.REQUEST.UPDATE, payload: value });
  return { status: res.status === 200 };
};

export const ClearRequest = (id, value) => async dispatch => {
  dispatch({ type: actionTypes.REQUEST.RESET });
};

export const GetRequestForPO = code => async dispatch => {
  const res = await axios.get("/api/request/rfq/" + code).catch(e => null);

  const { data } = res;
  if (!data) return { status: false };

  dispatch({ type: actionTypes.REQUEST.FETCH, payload: data });
  return { status: true };
};
//#endregion Request Action

//#region PO Action
export const InsertPO = value => async dispatch => {
  const res = await axios.post("/api/po", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetPO = page => async dispatch => {
  const res = await axios.get("/api/po/list/" + page).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.PO.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeletePO = (id, value) => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/po/${id}`, value).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const GetPOById = (id, { req }) => async dispatch => {
  // const res = await axios.get("/api/request/form/" + id).catch(e => null);
  const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";

  const res = await axios.get(baseUrl + "/api/po/form/" + id).catch(e => null);

  if (!res) return { status: false };
  const { data } = res;

  return data;
};

export const UpdatePO = (id, value) => async dispatch => {
  const res = await axios.put("/api/po/" + id, value).catch(e => null);
  if (!res) return { status: false };
  // dispatch({ type: actionTypes.REQUEST.UPDATE, payload: value });
  return { status: res.status === 200 };
};

export const ClearPO = () => async dispatch => {
  dispatch({ type: actionTypes.PO.RESET });
};

export const GetPOForRS = code => async dispatch => {
  const res = await axios.get("/api/po/findpobycode/" + code).catch(e => null);

  const { data } = res;
  if (!data) return { status: false };

  dispatch({ type: actionTypes.PO.FETCH, payload: data });
  return { status: true };
};

//#endregion PO Action

//#region RS Action
export const InsertRS = value => async dispatch => {
  const res = await axios.post("/api/rs", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetRS = page => async dispatch => {
  const res = await axios.get("/api/rs/list/" + page).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.RS.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteRS = (id, value) => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/rs/${id}`, value).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const GetRSById = (id, { req }) => async dispatch => {
  // const res = await axios.get("/api/request/form/" + id).catch(e => null);
  const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";

  const res = await axios.get(baseUrl + "/api/rs/form/" + id).catch(e => null);

  if (!res) return { status: false };
  const { data } = res;

  return data;
};

export const UpdateRS = (id, value) => async dispatch => {
  const res = await axios.put("/api/rs/" + id, value).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const ClearRS = () => async dispatch => {
  dispatch({ type: actionTypes.RS.RESET });
};

export const GetItemDN = date => async dispatch => {
  const res = await axios.post("/api/rs/itemdn", { date }).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.RS.FETCH_LIST_ALL, payload: data });
  return { status: res.status === 200 };
};

//#endregion RS Action

//#region DN Action
export const InsertDN = value => async dispatch => {
  const res = await axios.post("/api/dn", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetDN = page => async dispatch => {
  const res = await axios.get("/api/dn/list/" + page).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.DN.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteDN = (id, value) => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/dn/${id}`, value).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const GetDNById = (id, { req }) => async dispatch => {
  // const res = await axios.get("/api/request/form/" + id).catch(e => null);
  const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";

  const res = await axios.get(baseUrl + "/api/dn/form/" + id).catch(e => null);

  if (!res) return { status: false };
  const { data } = res;

  return data;
};

export const UpdateDN = (id, value) => async dispatch => {
  const res = await axios.put("/api/dn/" + id, value).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const ClearDN = () => async dispatch => {
  dispatch({ type: actionTypes.DN.RESET });
};

export const GetDNForRN = code => async dispatch => {
  const res = await axios.get("/api/dn/getDNtoRN/" + code).catch(e => null);

  const { data } = res;
  if (!data) return { status: false };

  dispatch({ type: actionTypes.DN.FETCH, payload: data });
  return { status: true };
};

//#endregion DN Action

//#region RN Action
export const InsertRN = value => async dispatch => {
  const res = await axios.post("/api/rn", value);
  if (!res) return { status: false };
  return { status: res.status === 200, id: res.data.id };
};

export const GetRN = page => async dispatch => {
  const res = await axios.get("/api/rn/list/" + page).catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.RN.FETCH_LIST, payload: data });
  return { status: res.status === 200 };
};

export const DeleteRN = (id, value) => async (dispatch, currentState) => {
  const res = await axios.delete(`/api/rn/${id}`, value).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const GetRNById = (id, { req }) => async dispatch => {
  // const res = await axios.get("/api/request/form/" + id).catch(e => null);
  const baseUrl = req ? `${req.protocol}://${req.get("Host")}` : "";

  const res = await axios.get(baseUrl + "/api/rn/form/" + id).catch(e => null);

  if (!res) return { status: false };
  const { data } = res;

  return data;
};

export const UpdateRN = (id, value) => async dispatch => {
  const res = await axios.put("/api/rn/" + id, value).catch(e => null);
  if (!res) return { status: false };
  return { status: res.status === 200 };
};

export const ClearRN = () => async dispatch => {
  dispatch({ type: actionTypes.RN.RESET });
};

//#endregion RN Action

//#region Report Action

export const GetExpireItem = values => async dispatch => {
  const res = await axios
    .post("/api/report/ExpireItem", values)
    .catch(e => null);
  if (!res) return { status: false };
  const { data } = res;
  dispatch({ type: actionTypes.REPORT.EXPIRE_ITEM, payload: data });
  return { status: res.status === 200 };
};

export const ClearReport = () => async dispatch => {
  dispatch({ type: actionTypes.REPORT.RESET });
};

//#endregion Report Action
