import { IReduxAction, ActionStatus } from "../types";

const initalState: { status: ActionStatus; [key: string]: any } = {
  status: "IDLE"
};

export default (state = initalState, action: IReduxAction) => {
  switch (action.type) {
    case "ACCOUNT_AUTH":
      return { ...state, data: null, error: null, status: "LOADING" };
    case "ACCOUNT_AUTH_SUCCESS":
      return { ...state, data: { ...action.payload }, status: "SUCCESS" };
    case "ACCOUNT_AUTH_ERROR":
      return { ...state, error: { ...action.payload }, status: "ERROR" };

    default:
      return state;
  }
};
