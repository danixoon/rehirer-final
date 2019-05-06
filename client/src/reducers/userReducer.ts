import { IReduxAction, ActionStatus } from "../types";

const initalState: { [key: string]: any } = {
  profile: { status: "IDLE" },
  data: { status: "IDLE" },
  job: { status: "IDLE" },
  respond: { status: "IDLE" }
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

    case "USER_JOB_FETCH":
      return { ...state, job: { error: null, status: "LOADING", data: null } };
    case "USER_JOB_FETCH_SUCCESS":
      return { ...state, job: { error: null, status: "SUCCESS", data: action.payload } };
    case "USER_JOB_FETCH_ERROR":
      return { ...state, job: { error: action.payload, status: "ERROR", data: null } };

    case "USER_RESPOND_FETCH":
      return { ...state, respond: { error: null, status: "LOADING", data: null } };
    case "USER_RESPOND_FETCH_SUCCESS":
      return { ...state, respond: { error: null, status: "SUCCESS", data: action.payload } };
    case "USER_RESPOND_FETCH_ERROR":
      return { ...state, respond: { error: action.payload, status: "ERROR", data: null } };

    case "USER_JOB_DELETE_SUCCESS":
      // let
      const s = { ...state, job: { ...state.job, data: state.job.data.filter((d: any) => d._id !== action.payload.deletedId) } };
      // s.job.data = s.job.data.filter();
      return s;

    case "ACCOUNT_LOGOUT":
      return {
        ...state,
        job: { error: null, status: "IDLE", data: null },
        profile: { error: null, status: "IDLE", data: null },
        data: { error: null, status: "IDLE", data: null },
        respond: { error: null, status: "IDLE", data: null }
      };

    default:
      return state;
  }
};
