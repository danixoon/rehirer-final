import axios from "axios";

export const fetchUserProfile = () => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "USER_PROFILE_FETCH" });
  console.log("LAAAADAD");
  axios
    .get("/api/user/profile", { headers: { "x-auth-token": state.account.data.token } })
    .then(response => {
      dispatch({ type: "USER_PROFILE_FETCH_SUCCESS", payload: response.data });
    })
    .catch(err => {
      console.log("FCCC");
      dispatch({ type: "USER_PROFILE_FETCH_ERROR", payload: err.response.data });
    });
};

export const fetchUserData = () => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "USER_DATA_FETCH" });
  axios
    .get("/api/user/data", { headers: { "x-auth-token": state.account.data.token } })
    .then(response => {
      dispatch({ type: "USER_DATA_FETCH_SUCCESS", payload: response.data });
    })
    .catch(err => {
      dispatch({ type: "USER_DATA_FETCH_ERROR", payload: err.response.data });
    });
};
