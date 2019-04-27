import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import createRootReducer from "./reducers";

import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import { createBrowserHistory } from "history";
import { routerMiddleware } from "connected-react-router";

const initialState = {};

export const history = createBrowserHistory();

const middleware = [thunk, routerMiddleware(history)];

const store = createStore(createRootReducer(history), initialState, composeWithDevTools(applyMiddleware(...middleware)));

export default store;
