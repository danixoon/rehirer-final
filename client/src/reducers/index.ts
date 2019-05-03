import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import jobReducer from "./jobReducer";

export default (history: any) =>
  combineReducers({
    router: connectRouter(history),
    job: jobReducer
  });
