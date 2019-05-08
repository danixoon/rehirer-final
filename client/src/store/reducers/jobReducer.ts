import { IReduxAction, ActionType } from "../types";
import { handleFetchReducer, createState, handleLoadingReducer, handleErrorReducer } from "../store";

// const initalState = {
//   data: [] as any,
//   status: "IDLE",
//   error: null,
//   search: {} as any
// };

// export default (state = initalState, action: IReduxAction) => {
//   switch (action.type) {
//     case "JOB_FETCH":
//       return { ...state, status: "LOADING" };
//     case "JOB_FETCH_SUCCESS":
//       return { ...state, status: "SUCCESS", data: action.payload };
//     case "JOB_FETCH_ERROR":
//       return { ...state, status: "ERROR", error: action.payload };
//     default:
//       return state;
//   }
// };

const initalState = createState("jobs");

const jobs = ["JOB_FETCH_SUCCESS", "JOB_FETCH_LOADING", "JOB_FETCH_ERROR"];
// const listJobs = ["USER_ACCOUNT_AUTH_SUCCESS", "USER_ACCOUNT_AUTH_LOADING", "USER_ACCOUNT_AUTH_ERROR"];

export default (state = initalState, action: IReduxAction) => {
  if (jobs.includes(action.type)) return handleFetchReducer(state, action, "jobs");
  switch (action.type) {
    case "JOB_ADD_LOADING":
      return handleLoadingReducer(state, "jobs");
    case "JOB_ADD_ERROR":
      return handleErrorReducer(state, action.payload, "jobs");
    case "JOB_ADD_SUCCESS":
      return {
        ...state,
        statuses: { ...state.statuses, jobs: "SUCCESS" },
        entities: { ...state.entities, jobs: [...state.entities.jobs, action.payload] }
      };

    case "JOB_DELETE_LOADING":
      return handleLoadingReducer(state, "jobs");
    case "JOB_DELETE_ERROR":
      return handleErrorReducer(state, action.payload, "jobs");
    case "JOB_DELETE_SUCCESS":
      return {
        ...state,
        statuses: { ...state.statuses, jobs: "SUCCESS" },
        entities: { ...state.entities, jobs: state.entities.jobs.filter((r: any) => r._id !== action.payload.deletedId) }
      };
  }

  return state;
};
