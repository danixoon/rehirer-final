import { IReduxAction, ActionStatus } from "../types";
import { handleFetchReducer, createState, IInitialState, handleEntityReducer, handleLoadingReducer, handleErrorReducer } from "../store";

const defaultState = {
  account: ["auth", "fetch", "tokenCheck"],
  data: ["fetch", "modify"],
  profile: ["fetch"]
};

const initalState = createState(defaultState);

const userData = ["USER_DATA_FETCH_LOADING", "USER_DATA_FETCH_SUCCESS", "USER_DATA_FETCH_ERROR"];
const userAccountAuth = ["USER_ACCOUNT_AUTH_SUCCESS", "USER_ACCOUNT_AUTH_LOADING", "USER_ACCOUNT_AUTH_ERROR"];
const userAccountFetch = ["USER_ACCOUNT_FETCH_SUCCESS", "USER_ACCOUNT_FETCH_LOADING", "USER_ACCOUNT_FETCH_ERROR"];
const userProfile = ["USER_PROFILE_FETCH_LOADING", "USER_PROFILE_FETCH_SUCCESS", "USER_PROFILE_FETCH_ERROR"];
const userAccountTokenCheck = ["USER_ACCOUNT_TOKEN_CHECK_LOADING", "USER_ACCOUNT_TOKEN_CHECK_SUCCESS", "USER_ACCOUNT_TOKEN_CHECK_ERROR"];

export default (s = initalState, action: IReduxAction): IInitialState => {
  if (userData.includes(action.type)) return handleFetchReducer(s, action, "data");
  if (userAccountAuth.includes(action.type)) return handleEntityReducer(s, action, "account", "auth");
  if (userAccountFetch.includes(action.type)) return handleFetchReducer(s, action, "account");
  if (userProfile.includes(action.type)) return handleFetchReducer(s, action, "profile");
  if (userAccountTokenCheck.includes(action.type)) return handleEntityReducer(s, action, "account", "auth");

  switch (action.type) {

    case "USER_DATA_FETCH_LOADING":
      return { ...s, statuses: { ...s.statuses, data: { modify: "LOADING" } } };
    case "USER_ACCOUNT_LOGOUT_SUCCESS":
      return createState(defaultState);

    case "USER_DATA_MODIFY_LOADING":
      return handleLoadingReducer(s, "data", "modify");
    case "USER_DATA_MODIFY_ERROR":
      return handleErrorReducer(s, action.payload, "data", "modify");
    case "USER_DATA_MODIFY_SUCCESS":
      return {
        ...s,
        statuses: {
          ...s.statuses,
          data: {
            ...s.statuses.data,
            modify: "SUCCESS"
          }
        },
        entities: { ...s.entities, data: action.payload }
      };
  }

  return s;
};
