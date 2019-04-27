export type ReduxActions = "JOB_GET";

export type ActionStatus = "IDLE" | "LOADING" | "ERROR" | "SUCCESS";

export interface IReduxAction<T = any> {
  type: ReduxActions;
  payload?: T;
}
