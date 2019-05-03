import { IReduxAction } from "../types";

const initalState = {
  jobs: [
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
  searching: {}
};

export default (state = initalState, action: IReduxAction) => {
  switch (action.type) {
    case "JOB_UPDATE":
      return { ...state, jobs: [...action.payload] };
    case "JOB_PUSH":
      return { ...state, jobs: [...state.jobs, ...action.payload] };
    default:
      return state;
  }
};
