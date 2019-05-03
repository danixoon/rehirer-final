export type ReduxActions = "JOB_UPDATE" | "JOB_PUSH";

export type ActionStatus = "IDLE" | "LOADING" | "ERROR" | "SUCCESS";

export interface IReduxAction<T = any> {
  type: ReduxActions;
  payload?: T;
}
