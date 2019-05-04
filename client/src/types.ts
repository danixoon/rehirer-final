export type ReduxActions =
  | "USER_PROFILE_FETCH_SUCCESS"
  | "USER_PROFILE_FETCH"
  | "USER_PROFILE_FETCH_ERROR"
  | "USER_DATA_FETCH_SUCCESS"
  | "USER_DATA_FETCH"
  | "USER_DATA_FETCH_ERROR"
  | "JOB_UPDATE"
  | "JOB_PUSH"
  | "ACCOUNT_AUTH"
  | "ACCOUNT_AUTH_ERROR"
  | "ACCOUNT_AUTH_SUCCESS"
  | "ACCOUNT_LOGOUT"
  | "ACCOUNT_TOKEN_CHECK"
  | "ACCOUNT_TOKEN_CHECK_SUCCESS"
  | "ACCOUNT_TOKEN_CHECK_ERROR";

export type ActionStatus = "IDLE" | "LOADING" | "ERROR" | "SUCCESS";

export interface IReduxAction<T = any> {
  type: ReduxActions;
  payload?: T;
}
