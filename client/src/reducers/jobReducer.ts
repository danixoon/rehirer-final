import { IReduxAction } from "../types";

const initalState = {
  job: {
    data: [
      {
        label: "Выгул собаки",
        description: "Выгуляй мою Жужу...",
        distance: 500,
        price: 200,
        author: "Лупа Пупа",
        tags: ["Выгул", "Псина"],
        time: 6 * 60 * 60 * 1000
      }
    ],
    respond: [],
    status: "IDLE",
    error: null
  },
  searching: {}
};

export default (state = initalState, action: IReduxAction) => {
  switch (action.type) {
    case "JOB_FETCH":
      return { ...state, job: { data: null, status: "LOADING", error: null, respond: [] } };
    case "JOB_FETCH_SUCCESS":
      return { ...state, job: { data: action.payload.job, status: "SUCCESS", error: null, respond: action.payload.respond } };
    case "JOB_FETCH_ERROR":
      return { ...state, job: { data: null, status: "ERROR", error: action.payload, respond: [] } };

    case "JOB_RESPOND_ADD_SUCCESS":
      return { ...state, job: { ...state.job, respond: [...state.job.respond, action.payload] } };

    case "JOB_RESPOND_DELETE_SUCCESS":
      return { ...state, job: { ...state.job, respond: state.job.respond.filter((r: any) => r._id !== action.payload.deletedId) } };
    default:
      return state;
  }
};
