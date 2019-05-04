import { IReduxAction, ActionStatus } from "../types";

const initalState: { [key: string]: any } = {
  profile: { status: "IDLE" },
  data: { status: "IDLE" }
};

export default (state = initalState, action: IReduxAction) => {
  switch (action.type) {
    case "USER_PROFILE_FETCH":
      return { ...state, profile: { error: null, status: "LOADING", data: null } };
    case "USER_PROFILE_FETCH_SUCCESS":
      return { ...state, profile: { error: null, status: "SUCCESS", data: action.payload } };
    case "USER_PROFILE_FETCH_ERROR":
      return { ...state, profile: { error: action.payload, status: "ERROR", data: null } };

    case "USER_DATA_FETCH":
      return { ...state, data: { error: null, status: "LOADING", data: null } };
    case "USER_DATA_FETCH_SUCCESS":
      return { ...state, data: { error: null, status: "SUCCESS", data: action.payload } };
    case "USER_DATA_FETCH_ERROR":
      return { ...state, data: { error: action.payload, status: "ERROR", data: null } };

    case "ACCOUNT_LOGOUT":
      return { ...state, profile: { error: null, status: "IDLE", data: null }, data: { error: null, status: "IDLE", data: null } };

    default:
      return state;
  }
};
