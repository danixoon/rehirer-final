import { IReduxAction, ActionStatus } from "../types";
import { handleFetchReducer, createState } from "../store";

const initalState = createState("account", "data", "profile");

const userData = ["USER_DATA_FETCH_LOADING", "USER_DATA_FETCH_SUCCESS", "USER_DATA_FETCH_ERROR"];
const userAccount = ["USER_ACCOUNT_AUTH_SUCCESS", "USER_ACCOUNT_AUTH_LOADING", "USER_ACCOUNT_AUTH_ERROR"];
const userProfile = ["USER_PROFILE_FETCH_LOADING", "USER_PROFILE_FETCH_SUCCESS", "USER_PROFILE_FETCH_ERROR"];

export default (state = initalState, action: IReduxAction) => {
  if (userData.includes(action.type)) return handleFetchReducer(state, action, "data");
  if (userAccount.includes(action.type)) return handleFetchReducer(state, action, "account");
  if (userProfile.includes(action.type)) return handleFetchReducer(state, action, "profile");

  switch (action.type) {
    case "USER_ACCOUNT_LOGOUT_SUCCESS":
      return createState("account", "data", "profile");
  }
  // if (userProfile.includes(action.type)) return handleFetchReducer(state, action, "users");

  return state;
};
