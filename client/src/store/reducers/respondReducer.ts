import { IReduxAction, ActionStatus } from "../types";
import { createState, handleFetchReducer, handleLoadingReducer, handleErrorReducer } from "../store";

// const listJobs = ["USER_ACCOUNT_AUTH_SUCCESS", "USER_ACCOUNT_AUTH_LOADING", "USER_ACCOUNT_AUTH_ERROR"];

// export default (state = initalState, action: IReduxAction) => {
//   if (jobs.includes(action.type)) return handleReducer(state, action, "jobs");

//   return state;
// };

const initalState = createState("responds");

const fetchResponds = ["RESPOND_FETCH_SUCCESS", "RESPOND_FETCH_LOADING", "RESPOND_FETCH_ERROR"];

export default (state = initalState, action: IReduxAction) => {
  if (fetchResponds.includes(action.type)) return handleFetchReducer(state, action, "responds");

  switch (action.type) {
    case "RESPOND_ADD_LOADING":
      return handleLoadingReducer(state, "responds");
    case "RESPOND_ADD_ERROR":
      return handleErrorReducer(state, action.payload, "responds");
    case "RESPOND_ADD_SUCCESS":
      return {
        ...state,
        statuses: { ...state.statuses, responds: "SUCCESS" },
        entities: { ...state.entities, responds: [...state.entities.responds, action.payload] }
      };

    case "RESPOND_DELETE_LOADING":
      return handleLoadingReducer(state, "responds");
    case "RESPOND_DELETE_ERROR":
      return handleErrorReducer(state, action.payload, "responds");
    case "RESPOND_DELETE_SUCCESS":
      return {
        ...state,
        statuses: { ...state.statuses, responds: "SUCCESS" },
        entities: { ...state.entities, responds: state.entities.responds.filter((r: any) => r._id !== action.payload.deletedId) }
      };

    case "RESPOND_MODIFY_LOADING":
      return handleLoadingReducer(state, "responds");
    case "RESPOND_MODIFY_ERROR":
      return handleErrorReducer(state, action.payload, "responds");
    case "RESPOND_MODIFY_SUCCESS":
      return {
        ...state,
        statuses: { ...state.statuses, responds: "SUCCESS" },
        entities: { ...state.entities, responds: [...state.entities.responds.filter((r: any) => r._id !== action.payload._id), action.payload] }
      };

    // case "USER_RESPOND_STATUS_CHANGE":
    //   return { ...state, status: "LOADING" };
    // case "USER_RESPOND_STATUS_CHANGE_SUCCESS": {
    //   const res = state.data.find((r: any) => r._id === action.payload._id);
    //   res.status = action.payload.status;
    //   return { ...state, status: "SUCCESS", data: [...state.data] };
    // }
    // case "USER_RESPOND_STATUS_CHANGE_ERROR":
    //   return { ...state, status: "ERROR", error: action.payload };

    default:
      return state;
  }
};
