import { IReduxAction, ActionType } from "../types";
import { handleFetchReducer, createState, handleLoadingReducer, handleErrorReducer, IInitialState } from "../store";

const initalState = createState({
  jobs: ["fetch", "add", "delete"],
  search: []
});

initalState.entities.search = {
  tags: [],
  page: 0,
  maxOnPage: 5,
  priceSort: 1,
  labelSort: 1
};

const jobs = ["JOB_FETCH_SUCCESS", "JOB_FETCH_LOADING", "JOB_FETCH_ERROR"];

export default (s = initalState, action: IReduxAction): IInitialState => {
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
