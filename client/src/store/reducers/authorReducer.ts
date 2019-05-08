import { IReduxAction, ActionStatus } from "../types";
import { handleFetchReducer, createState } from "../store";

const initalState = createState("authors");

const authorActions = ["AUTHOR_FETCH_LOADING", "AUTHOR_FETCH_SUCCESS", "AUTHOR_FETCH_ERROR"];

export default (state = initalState, action: IReduxAction) => {
  if (authorActions.includes(action.type)) return handleFetchReducer(state, action, "authors");

  // if (userProfile.includes(action.type)) return handleFetchReducer(state, action, "users");

  return state;
};
