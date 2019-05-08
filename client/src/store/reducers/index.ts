import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import userReducer from "./userReducer";
import respondReducer from "./respondReducer";
import jobReducer from "./jobReducer";
import authorReducer from "./authorReducer";

export default (history: any) =>
  combineReducers({
    router: connectRouter(history) as any,
    user: userReducer as any,
    respond: respondReducer,
    job: jobReducer,
    author: authorReducer
  });
