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
    status: "IDLE",
    error: null
  },
  searching: {}
};

export default (state = initalState, action: IReduxAction) => {
  switch (action.type) {
    case "JOB_FETCH":
      return { ...state, job: { data: null, status: "LOADING", error: null } };
    case "JOB_FETCH_SUCCESS":
      return { ...state, job: { data: action.payload, status: "SUCCESS", error: null } };
    case "JOB_FETCH_ERROR":
      return { ...state, job: { data: null, status: "ERROR", error: action.payload } };
    // case "JOB_PUSH":
    //   return { ...state, jobs: [...state.jobs, ...action.payload] };
    default:
      return state;
  }
};
