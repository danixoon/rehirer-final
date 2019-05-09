import { IReduxAction, AuthorAction } from "../types";
import { handleFetchReducer, createState } from "../store";

const initalState = createState("authors");

const authorActions: AuthorAction[] = ["AUTHOR_FETCH_LOADING", "AUTHOR_FETCH_SUCCESS", "AUTHOR_FETCH_ERROR"];

export default (state = initalState, action: IReduxAction<AuthorAction>) => {
  if (authorActions.includes(action.type)) return handleFetchReducer(state, action, "authors");
  return state;
};
