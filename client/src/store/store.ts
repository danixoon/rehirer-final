import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import createRootReducer from "./reducers";

import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";
import { IReduxAction } from "./types";

const initialState = {};

export const history = createBrowserHistory();

const middleware = [thunk, routerMiddleware(history)];

const store = createStore(createRootReducer(history), initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;

export function handleActionError(dispatch: any, action: string, err: any) {
  const error = err.response ? err.response.data : err;
  dispatch({ type: action, payload: error });

  console.log(`Action Error:`, error);
}

interface IInitialState {
  statuses: {
    [key: string]: "LOADING" | "SUCCESS" | "ERROR" | "IDLE";
  };
  errors: {
    [key: string]: any | null;
  };
  entities: {
    [key: string]: any;
  };
}

export function createState(...entityNames: string[]): IInitialState {
  const initalState = {
    statuses: {} as any,
    errors: {} as any,
    entities: {} as any
  };
  for (let e of entityNames) {
    initalState.statuses[e] = "IDLE";
    initalState.errors[e] = null;
    initalState.entities[e] = {};
  }
  return initalState;
}

function getActionName(actionName: string) {
  const type = /[^_]+$/.exec(actionName);
  // console.log("ACTION", type);
  if (type) return type[0];
}

export function handleFetchReducer(state: any, action: IReduxAction, entityName: string) {
  switch (getActionName(action.type)) {
    case "ERROR":
      return handleErrorReducer(state, action.payload, entityName);
    case "SUCCESS":
      return { ...state, statuses: { ...state.statuses, [entityName]: "SUCCESS" }, entities: { ...state.entities, [entityName]: action.payload } };
    case "LOADING":
      return handleLoadingReducer(state, entityName);
    default:
      return state;
  }
}

export function handleErrorReducer(state: any, error: any, entityName: string) {
  return { ...state, statuses: { ...state.statuses, [entityName]: "ERROR" }, errors: { ...state.errors, [entityName]: error } };
}

export function handleLoadingReducer(state: any, entityName: string) {
  return { ...state, statuses: { ...state.statuses, [entityName]: "LOADING" } };
}
