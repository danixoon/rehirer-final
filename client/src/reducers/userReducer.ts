import { IReduxAction, ActionStatus } from "../types";

const initalState: { [key: string]: any } = {
  profile: { status: "IDLE" },
  data: { status: "IDLE" },
  job: { status: "IDLE" },
  respond: { status: "IDLE", secretStatus: "IDLE" }
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
      return { ...state, respond: { ...state.respond, error: null, status: "LOADING", data: null } };
    case "USER_RESPOND_FETCH_SUCCESS":
      return { ...state, respond: { ...state.respond, error: null, status: "SUCCESS", data: action.payload } };
    case "USER_RESPOND_FETCH_ERROR":
      return { ...state, respond: { ...state.respond, error: action.payload, status: "ERROR", data: null } };

    case "USER_JOB_DELETE_SUCCESS":
      // let
      const s = { ...state, job: { ...state.job, data: state.job.data.filter((d: any) => d._id !== action.payload.deletedId) } };
      // s.job.data = s.job.data.filter();
      return s;

    case "JOB_RESPOND_STATUS_SUCCESS":
      // const respond = state.job.respond;
      const job = state.job.data;
      job.find((job: any) => {
        const res = job.respond.find((res: any) => {
          return res._id === action.payload._id;
        });
        if (res) res.status = action.payload.status;
        return res;
      });
      // j.status = action.payload.status;
      // const _r = { ...j, ...action.payload };
      // let data = state.job.data;
      return { ...state, job: { ...state.job, data: job } };

    case "JOB_RESPOND_DELETE_SUCCESS":
      const responds = state.respond.data;
      if(!responds) return { ...state };
      const res = responds.find((res: any) => {
        return res._id === action.payload.deletedId;
      });
      // if (res) responds.fil(res);
      return { ...state, respond: { ...state.respond, data: responds.filter((r: any) => r !== res) } };

    case "JOB_GET_SECRET":
      // const respond = state.job.respond;
      return { ...state, respond: { ...state.respond, secretStatus: "LOADING" } };
    case "JOB_GET_SECRET_ERROR":
      // const respond = state.job.respond;
      return { ...state, respond: { ...state.respond, secretStatus: "ERROR" } };

    case "JOB_GET_SECRET_SUCCESS": {
      // const respond = state.job.respond;
      const data = state.respond.data;
      let res = data.find((r: any) => r._id === action.payload.respondId);
      res.secretData = { ...action.payload };
      return { ...state, respond: { ...state.respond, secretStatus: "SUCCESS", data } };
    }

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
