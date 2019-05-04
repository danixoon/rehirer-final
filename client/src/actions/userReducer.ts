import axios from "axios";

export const fetchUserProfile = () => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "USER_PROFILE_FETCH" });
  axios
    .get("/api/user/profile", { headers: { "x-auth-token": state.account.data.token } })
    .then(response => {
      dispatch({ type: "USER_PROFILE_FETCH_SUCCESS", payload: response.data });
    })
    .catch(err => {
      dispatch({ type: "USER_PROFILE_FETCH_ERROR", payload: err.response.data });
    });
};
