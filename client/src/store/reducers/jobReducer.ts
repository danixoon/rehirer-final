import { IReduxAction, ActionType } from "../types";
import { handleFetchReducer, createState, handleLoadingReducer, handleErrorReducer, IInitialState } from "../store";

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

const initalState = createState({
  jobs: ["fetch", "add", "delete"],
  search: []
});

initalState.entities.search = {
  tags: [],
  // search: "",
  // minPrice: "",
  // maxPrice: "",
  page: 0,
  maxOnPage: 5,
  priceSort: 1,
  labelSort: 1
  // total: 0
};

const jobs = ["JOB_FETCH_SUCCESS", "JOB_FETCH_LOADING", "JOB_FETCH_ERROR"];
// const listJobs = ["USER_ACCOUNT_AUTH_SUCCESS", "USER_ACCOUNT_AUTH_LOADING", "USER_ACCOUNT_AUTH_ERROR"];

export default (s = initalState, action: IReduxAction): IInitialState => {
  // if (jobs.includes(action.type)) return handleFetchReducer(s, action, "jobs");
  switch (action.type) {
    case "JOB_FETCH_LOADING":
      return handleLoadingReducer(s, "jobs", "fetch");
    case "JOB_FETCH_ERROR":
      return handleErrorReducer(s, action.payload, "jobs", "fetch");
    case "JOB_FETCH_SUCCESS":
      return {
        ...s,
        statuses: {
          ...s.statuses,
          jobs: {
            ...s.statuses.jobs,
            fetch: "SUCCESS"
          }
        },
        entities: { ...s.entities, jobs: action.payload }
      };
    case "JOB_FETCH_SEARCH_SET": {
      return {
        ...s,
        entities: { ...s.entities, search: { ...action.payload } }
      };
    }
    case "JOB_ADD_LOADING":
      return handleLoadingReducer(s, "jobs", "add");
    case "JOB_ADD_ERROR":
      return handleErrorReducer(s, action.payload, "jobs", "add");
    case "JOB_ADD_SUCCESS":
      return {
        ...s,
        statuses: {
          ...s.statuses,
          jobs: {
            ...s.statuses.jobs,
            add: "SUCCESS"
          }
        },
        entities: { ...s.entities, jobs: { ...s.entities.jobs, count: s.entities.jobs.count + 1, items: [...s.entities.jobs.items, action.payload] } }
      };

    case "JOB_DELETE_LOADING":
      return handleLoadingReducer(s, "jobs", "delete");
    case "JOB_DELETE_ERROR":
      return handleErrorReducer(s, action.payload, "jobs", "error");
    case "JOB_DELETE_SUCCESS":
      return {
        ...s,
        statuses: {
          ...s.statuses,
          jobs: {
            ...s.statuses.jobs,
            delete: "SUCCESS"
          }
        },
        entities: {
          ...s.entities,
          jobs: { ...s.entities.jobs, count: s.entities.jobs.count - 1, items: [...s.entities.jobs.items.filter((r: any) => r._id !== action.payload.deletedId)] }
        }
      };
  }

  return s;
};
