import axios from "axios";
import { handleActionError } from "../store";

export const userAccountLogin = (login: string, password: string) => async (dispatch: any) => {
  dispatch({ type: "USER_ACCOUNT_AUTH_LOADING" });
  try {
    const res = await axios.get("/api/account/auth", { params: { login, password } });
    sessionStorage.setItem("authToken", res.data.token);
    dispatch({ type: "USER_ACCOUNT_AUTH_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "USER_ACCOUNT_AUTH_ERROR", err);
  }
};

export const userAccountLogout = () => {
  sessionStorage.removeItem("authToken");
  return { type: "USER_ACCOUNT_LOGOUT_SUCCESS" };
};

export const userAccountCheckToken = (token: string) => async (dispatch: any) => {
  dispatch({ type: "USER_ACCOUNT_TOKEN_CHECK_LOADING", payload: token });
  try {
    const res = await axios.get("/api/account/checkToken", { params: { token } });
    sessionStorage.setItem("authToken", token);
    dispatch({ type: "USER_ACCOUNT_TOKEN_CHECK_SUCCESS", payload: res.data });
    dispatch(userAccountDataFetch());
  } catch (err) {
    handleActionError(dispatch, "USER_ACCOUNT_TOKEN_CHECK_ERROR", err);
    sessionStorage.removeItem("authToken");
  }
};

export const userAccountDataFetch = () => async (dispatch: any, getState: any) => {
  dispatch({ type: "USER_ACCOUNT_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/account/data", { headers: { "x-auth-token": token } });
    dispatch({ type: "USER_ACCOUNT_FETCH_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "USER_ACCOUNT_FETCH_ERROR", err);
  }
};

export const userDataFetch = () => async (dispatch: any, getState: any) => {
  dispatch({ type: "USER_DATA_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/user/data", { headers: { "x-auth-token": token } });
    dispatch({ type: "USER_DATA_FETCH_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "USER_DATA_FETCH_ERROR", err);
  }
};

export const userDataModify = (fields: any) => async (dispatch: any, getState: any) => {
  dispatch({ type: "USER_DATA_MODIFY_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/user/edit", { params: { ...fields }, headers: { "x-auth-token": token } });
    dispatch({ type: "USER_DATA_MODIFY_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "USER_DATA_MODIFY_ERROR", err);
  }
};

export const userDataUploadAvatar = (avatar: any) => async (dispatch: any, getState: any) => {
  dispatch({ type: "USER_DATA_UPLOAD_AVATAR_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.post("/api/upload/image", avatar, { headers: { "x-auth-token": token } });
    dispatch({ type: "USER_DATA_UPLOAD_AVATAR_SUCCESS", payload: res.data });
    dispatch(userDataModify({ avatarUrl: res.data.url }));
    // const data = await axios.get("/api/user/edit", { params:  });
  } catch (err) {
    handleActionError(dispatch, "USER_DATA_UPLOAD_AVATAR_ERROR", err);
  }
};
export const userProfileFetch = () => async (dispatch: any, getState: any) => {
  // const state = getState();
  dispatch({ type: "USER_PROFILE_FETCH_LOADING" });
  const token = sessionStorage.getItem("authToken");
  try {
    const res = await axios.get("/api/user/profile", { headers: { "x-auth-token": token } });
    dispatch({ type: "USER_PROFILE_FETCH_SUCCESS", payload: res.data });
  } catch (err) {
    handleActionError(dispatch, "USER_PROFILE_FETCH_ERROR", err);
  }
};
