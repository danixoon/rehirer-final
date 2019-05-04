import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import jobReducer from "./jobReducer";
import accountReducer from "./accountReducer";
import userReducer from "./userReducer";

export default (history: any) =>
  combineReducers({
    router: connectRouter(history) as any,
    job: jobReducer,
    account: accountReducer as any,
    user: userReducer
  });
