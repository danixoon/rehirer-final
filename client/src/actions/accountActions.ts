import axios from "axios";

export const accountLogin = (login: string, password: string) => async (dispatch: any) => {
  console.log("login: ", login, "password: ", password);
  dispatch({ type: "ACCOUNT_AUTH" });
  axios
    .get("/api/account/auth", { params: { login, password } })
    .then(response => {
      sessionStorage.setItem("authToken", response.data.token);
      dispatch({ type: "ACCOUNT_AUTH_SUCCESS", payload: response.data });
    })
    .catch(err => {
      dispatch({ type: "ACCOUNT_AUTH_ERROR", payload: err.response.data });
    });
};

export const accountLogout = () => {
  sessionStorage.removeItem("authToken");
  return { type: "ACCOUNT_LOGOUT" };
};

export const accountCheckToken = (token: string) => (dispatch: any) => {
  dispatch({ type: "ACCOUNT_TOKEN_CHECK", payload: token });
  axios
    .get("/api/account/checkToken", { params: { token } })
    .then(data => {
      dispatch({ type: "ACCOUNT_TOKEN_CHECK_SUCCESS", payload: data.data });
    })
    .catch(err => {
      sessionStorage.removeItem("authToken");
      dispatch({ type: "ACCOUNT_TOKEN_CHECK_ERROR", payload: err });
    });
};
