import { IReduxAction } from "../types";

const initalState = {
  data: [] as any,
  status: "IDLE",
  error: null,
  search: {} as any
};

export default (state = initalState, action: IReduxAction) => {
  switch (action.type) {
    case "JOB_LIST_FETCH":
      return { ...state, status: "LOADING" };
    case "JOB_LIST_FETCH_SUCCESS":
      return { ...state, status: "SUCCESS", data: action.payload };
    case "JOB_LIST_FETCH_ERROR":
      return { ...state, status: "ERROR", error: action.payload };
    default:
      return state;
  }
};
