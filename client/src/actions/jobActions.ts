import axios from "axios";

export const fetchJobs = () => (dispatch: any, getStore: any) => {
  const store = getStore();
  dispatch({ type: "JOB_FETCH" });
  axios
    .get("/api/job/find", { headers: { "x-auth-token": store.account.data.token } })
    .then(res => {
      dispatch({ type: "JOB_FETCH_SUCCESS", payload: res.data });
    })
    .catch(err => dispatch({ type: "JOB_FETCH_ERROR", payload: err.response.data }));
};

// export const pushJob = (job: any) => ({ type: "JOB_PUSH", payload: [job] });
