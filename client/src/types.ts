export type ReduxActions =
  | "USER_PROFILE_FETCH_SUCCESS"
  | "USER_PROFILE_FETCH"
  | "USER_PROFILE_FETCH_ERROR"
  | "JOB_UPDATE"
  | "JOB_PUSH"
  | "ACCOUNT_AUTH"
  | "ACCOUNT_AUTH_ERROR"
  | "ACCOUNT_AUTH_SUCCESS";

export type ActionStatus = "IDLE" | "LOADING" | "ERROR" | "SUCCESS";

export interface IReduxAction<T = any> {
  type: ReduxActions;
  payload?: T;
}
