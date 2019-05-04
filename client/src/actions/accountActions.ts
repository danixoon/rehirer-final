import axios from "axios";

export const accountLogin = (login: string, password: string) => async (dispatch: any) => {
  console.log("login: ", login, "password: ", password);
  dispatch({ type: "ACCOUNT_AUTH" });
  axios
    .get("/api/account/auth", { params: { login, password } })
    .then(response => {
      dispatch({ type: "ACCOUNT_AUTH_SUCCESS", payload: response.data });
    })
    .catch(err => {
      dispatch({ type: "ACCOUNT_AUTH_ERROR", payload: err.response.data });
    });
};
