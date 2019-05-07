import axios from "axios";

// export const fetchJobs = () => (dispatch: any, getStore: any) => {
//   const store = getStore();
//   dispatch({ type: "JOB_FETCH" });
//   axios
//     .get("/api/job/find", { headers: { "x-auth-token": store.account.data.token } })
//     .then(res => {
//       dispatch({ type: "JOB_FETCH_SUCCESS", payload: { job: res.data, respond: } });
//     })
//     .catch(err => dispatch({ type: "JOB_FETCH_ERROR", payload: err.response.data }));
// };

export const fetchJobs = () => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "JOB_FETCH" });
  try {
    const info = await Promise.all([
      axios.get("/api/job/find", { headers: { "x-auth-token": state.account.data.token } }),
      axios.get("/api/user/myResponds", { headers: { "x-auth-token": state.account.data.token } })
    ]);
    dispatch({ type: "JOB_FETCH_SUCCESS", payload: { job: info[0].data, respond: info[1].data } });
  } catch (err) {
    dispatch({ type: "JOB_FETCH_ERROR", payload: !err.response ? err : err.response.data });
  }
};

export const addRespond = (jobId: string, message: string) => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "JOB_RESPOND_ADD" });
  try {
    const { data } = await axios.get("/api/job/respond", { params: { jobId, message }, headers: { "x-auth-token": state.account.data.token } });
    // const result = await populateRespond([data]);
    dispatch({ type: "JOB_RESPOND_ADD_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "JOB_RESPOND_ADD_ERROR", payload: !err.response ? err : err.response.data });
  }
};

export const deleteRespond = (respondId: string) => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "JOB_RESPOND_DELETE" });
  try {
    const { data } = await axios.get("/api/user/deleteRespond", { params: { respondId }, headers: { "x-auth-token": state.account.data.token } });
    // const result = await populateRespond([data]);
    dispatch({ type: "JOB_RESPOND_DELETE_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "JOB_RESPOND_DELETE_ERROR", payload: !err.response ? err : err.response.data });
  }
};

export const changeRespondStatus = (respondId: string, status: "DECLINE" | "APPROVED") => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "JOB_RESPOND_STATUS" });
  try {
    const { data } = await axios.get("/api/job/changeRespondStatus", { params: { respondId, status }, headers: { "x-auth-token": state.account.data.token } });
    dispatch({ type: "JOB_RESPOND_STATUS_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "JOB_RESPOND_STATUS_ERROR", payload: !err.response ? err : err.response.data });
  }
};

export const getJobSecret = (jobId: string) => async (dispatch: any, getState: any) => {
  const state = getState();
  dispatch({ type: "JOB_GET_SECRET" });
  try {
    const { data } = await axios.get("/api/job/jobSecret", { params: { jobId }, headers: { "x-auth-token": state.account.data.token } });
    dispatch({ type: "JOB_GET_SECRET_SUCCESS", payload: data });
  } catch (err) {
    dispatch({ type: "JOB_GET_SECRET_ERROR", payload: !err.response ? err : err.response.data });
  }
};

// export const pushJob = (job: any) => ({ type: "JOB_PUSH", payload: [job] });
